<template>
  <v-container fluid class="pa-0 ma-0">
    <yr-progress-linear v-show="loading" class="mt-4 mb-3" data-cy="suggestions-progress-loading" />
    <v-row v-show="suggestions.length > 0 && !loading" no-gutters>
      <v-col cols="12" class="mt-3">
        <v-divider />
        <v-row no-gutters>
          <v-subheader>In participants collection:</v-subheader>
        </v-row>
      </v-col>
      <v-col
        cols="4"
        md="3"
        lg="2"
        xl="1"
        class="pa-1 my-2 text-center"
        v-for="suggestion in suggestions"
        :key="suggestion.id"
      >
        <v-img contain :aspect-ratio="1" :src="suggestion.imageUrl" :lazy-src="suggestion.thumbUrl">
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
            </v-row>
          </template>
        </v-img>
        <v-icon dense class="pr-1">
          mdi-account-group
        </v-icon>
        <span class="text-caption">{{ suggestion.minPlayers }}-{{ suggestion.maxPlayers }}</span>
      </v-col>
    </v-row>
    <v-row no-gutters>
      <yr-btn
        block
        :loading="loadingOthers"
        :disabled="loadingOthers || loading"
        @click="loadSuggestions"
      >
        More suggestions
        <v-icon class="ml-2">
          mdi-arrow-right
        </v-icon>
      </yr-btn>
    </v-row>

    <v-dialog
      v-model="otherSuggestionsDialog"
      scrollable
      fullscreen
      hide-overlay
      transition="slide-x-reverse-transition"
      data-cy="suggestion-dialog"
    >
      <yr-dialog-card header-color="primary" data-cy="add-content">
        <template #title>
          <yr-icon-btn
            color="white"
            @click="otherSuggestionsDialog = false"
            data-cy="back-to-sessionplan-btn"
          >
            mdi-arrow-left
          </yr-icon-btn>
          <span class="white--text ml-4"></span>
        </template>

        <template #content>
          <v-container>
            <v-list two-line data-cy="suggestion-list">
              <v-list-item v-for="suggestion in otherSuggestions" :key="'other-' + suggestion.id">
                <v-list-item-avatar tile>
                  <v-img
                    contain
                    :aspect-ratio="1"
                    :src="suggestion.thumbUrl"
                    :lazy-src="suggestion.thumbUrl"
                  >
                    <template v-slot:placeholder>
                      <v-row class="fill-height ma-0" align="center" justify="center">
                        <v-progress-circular
                          indeterminate
                          color="grey lighten-5"
                        ></v-progress-circular>
                      </v-row>
                    </template>
                  </v-img>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    {{ suggestion.name }}
                  </v-list-item-title>
                  <v-list-item-subtitle>
                    <v-icon>mdi-account-group</v-icon>
                    {{ suggestion.minPlayers }}-{{ suggestion.maxPlayers }} Players
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-container>
        </template>
      </yr-dialog-card>
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'

import AlertModule from '@/store/modules/alert-module'
import SuggestionModule from '@/store/modules/suggestion-module'
import SessionModule from '@/store/modules/session-module'

import { BoardGameModel } from '@/models/data/boardgame'

@Component
export default class Suggestions extends Vue {
  private loading: boolean = false
  private loadingOthers: boolean = false

  private otherSuggestionsDialog: boolean = false

  private alert: AlertModule = getModule(AlertModule, this.$store)
  private suggestion: SuggestionModule = getModule(SuggestionModule, this.$store)
  private session: SessionModule = getModule(SessionModule, this.$store)

  get suggestions(): BoardGameModel[] {
    return this.suggestion.allInCollection
  }

  created() {
    this.loadSuggestions()
  }

  get otherSuggestions(): BoardGameModel[] {
    return this.suggestion.allOthers
  }

  loadSuggestions() {
    this.loading = true

    this.suggestion
      .fetchBySession(this.session.currentOpen.id)
      .then(
        _ => {},
        error => {
          //only reset the message on error, because else, the parents message get's reset
          this.alert.reset()

          this.alert.setMessage(error)
          this.alert.setType('error')
        }
      )
      .finally(() => {
        this.loading = false
      })
  }
}
</script>
