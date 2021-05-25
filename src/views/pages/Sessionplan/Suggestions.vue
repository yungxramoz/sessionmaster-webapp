<template>
  <v-container fluid class="pa-0">
    <v-col>
      <yr-progress-linear
        v-show="loading"
        class="mt-4 mb-3"
        data-cy="suggestions-progress-loading"
      />
      <v-row v-show="suggestions.length > 0 && !loading" no-gutters>
        <v-col cols="12" class="mt-3">
          <v-divider />
          <v-subheader>In participants collection:</v-subheader>
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
          <v-img
            contain
            :aspect-ratio="1"
            :src="suggestion.imageUrl"
            :lazy-src="suggestion.thumbUrl"
          >
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
      <v-row>
        <yr-btn block>
          More suggestions
          <v-icon class="ml-2">
            mdi-arrow-right
          </v-icon>
        </yr-btn>
      </v-row>
    </v-col>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import { Debounce } from 'vue-debounce-decorator'

import AlertModule from '@/store/modules/alert-module'
import SuggestionModule from '@/store/modules/suggestion-module'
import SessionModule from '@/store/modules/session-module'

import { BoardGameModel } from '@/models/data/boardgame'

@Component
export default class Suggestions extends Vue {
  private loading: boolean = false

  private alert: AlertModule = getModule(AlertModule, this.$store)
  private suggestion: SuggestionModule = getModule(SuggestionModule, this.$store)
  private session: SessionModule = getModule(SessionModule, this.$store)

  get suggestions(): BoardGameModel[] {
    return this.suggestion.allInCollection
  }

  // @Prop() sessionId!: string

  // @Debounce(700)
  created() {
    this.loading = true
    this.alert.reset()
    this.suggestion
      .fetchBySession(this.session.currentOpen.id)
      .then(
        _ => {},
        error => {
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
