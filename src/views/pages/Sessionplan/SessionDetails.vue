<template>
  <v-container fluid class="pt-0 px-1">
    <v-divider v-show="!loading && !loadingParticipate" class="my-4" />
    <yr-progress-linear
      v-show="loading || loadingParticipate"
      class="mt-4 mb-3"
      data-cy="session-progress-loading"
    />

    <template v-if="!loading">
      <template v-if="hasDetails">
        <v-col>
          <v-row>
            <h4 data-cy="session-title">
              {{ sessionDetailTitle(sessionDetails.date) }}
            </h4>
            <v-spacer />
            <v-checkbox
              hide-details
              label="Participate"
              class="mt-0 pt-0"
              :input-value="participateCurrent"
              :disabled="participateCheckboxDisabled"
              :key="participateKey"
              @change="toggleParticipationState"
              data-cy="participate-checkbox"
            >
            </v-checkbox>
          </v-row>
          <v-row v-show="sessionDetails.users.length > 0">
            <v-subheader data-cy="participants-subheader">
              {{ sessionDetails.users.length }} Participants:
            </v-subheader>
          </v-row>
          <v-row v-show="sessionDetails.users.length == 0">
            <v-alert
              dense
              text
              type="info"
              width="100%"
              class="mt-3"
              data-cy="no-participants-alert"
            >
              No participants on this session
            </v-alert>
          </v-row>
          <v-row>
            <v-chip
              v-for="user in sessionDetails.users"
              :key="user.name"
              :outlined="!isCurrentUser(user)"
              color="success darken-1"
              class="ml-2 mb-2"
              :data-cy="'participant-' + user.name + '-chip'"
            >
              <v-icon left>
                mdi-account
              </v-icon>
              {{ user.name }}
            </v-chip>
          </v-row>
          <yr-progress-linear
            v-show="loadingInCollectionSuggestion || loadingParticipate"
            class="mt-4 mb-3"
            data-cy="session-progress-loading"
          />
          <template
            v-if="
              !loadingInCollectionSuggestion &&
                !loadingParticipate &&
                sessionDetails.users.length != 0
            "
          >
            <v-row v-show="suggestions.length > 0" no-gutters>
              <v-col cols="12" class="mt-3">
                <v-divider class="mt-3" />
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
                      <v-progress-circular
                        indeterminate
                        color="grey lighten-5"
                      ></v-progress-circular>
                    </v-row>
                  </template>
                </v-img>
                <v-icon dense class="pr-1">
                  mdi-account-group
                </v-icon>
                <span class="text-caption"
                  >{{ suggestion.minPlayers }}-{{ suggestion.maxPlayers }}</span
                >
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
          </template>
        </v-col>
      </template>
      <template v-else>
        <v-alert dense text type="info" width="100%" data-cy="select-session-alert">
          Select a session
        </v-alert>
      </template>
    </template>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import { Debounce } from 'vue-debounce-decorator'

import AlertModule from '@/store/modules/alert-module'
import AuthModule from '@/store/modules/auth-module'
import SessionModule from '@/store/modules/session-module'
import SuggestionModule from '@/store/modules/suggestion-module'

import { SessionModel, SessionUserModel } from '@/models/data/session'
import { BoardGameModel } from '@/models/data/boardgame'

import { displayDate } from '@/helpers/date-format-helper'

@Component
export default class Session extends Vue {
  private loading: boolean = false
  private loadingParticipate: boolean = false
  private loadingInCollectionSuggestion: boolean = false

  private participateKey: number = 0

  private alert: AlertModule = getModule(AlertModule, this.$store)
  private auth: AuthModule = getModule(AuthModule, this.$store)
  private session: SessionModule = getModule(SessionModule, this.$store)
  private suggestion: SuggestionModule = getModule(SuggestionModule, this.$store)

  @Prop() sessionId?: string
  @Watch('sessionId')
  openSessionDetails(): void {
    if (this.sessionId) {
      this.loading = true
      this.alert.reset()

      this.session
        .fetch(this.sessionId)
        .then(
          (response: SessionModel) => {
            if (response.id && response.users.length > 0) {
              this.loadingInCollectionSuggestion = true
              this.fetchSuggestionInCollection(response.id)
            }
          },
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

  get authUserId(): string | null {
    return this.auth.authState.userId
  }

  get sessionDetails(): SessionModel {
    return this.session.currentOpen
  }

  get hasDetails(): boolean {
    return Object.keys(this.sessionDetails).length !== 0
  }

  get suggestions(): BoardGameModel[] {
    return this.suggestion.allInCollection
  }

  get guestName(): string {
    return this.session.sessionState.guestName ?? ''
  }

  get participateCheckboxDisabled() {
    return this.loadingParticipate || (!this.auth.authState.loggedIn && this.guestName == '')
  }

  get participateCurrent() {
    if (this.auth.authState.loggedIn) {
      return this.session.currentOpen.users.some(u => u.id == this.authUserId)
    }
    return this.session.currentOpen.users.some(u => u.name == this.guestName)
  }

  isCurrentUser(user: SessionUserModel): boolean {
    if (user.id) {
      return user.id == this.authUserId
    }
    return user.name == this.guestName
  }

  toggleParticipationState(checked: boolean) {
    if (checked) {
      this.participateSession()
    } else {
      this.cancelSession()
    }
  }

  participateSession(): void {
    this.loadingParticipate = true
    this.alert.reset()

    this.session
      .register()
      .then(
        (_response: SessionModel) => {
          const date = displayDate(this.session.currentOpen.date)
          this.alert.setMessage('Participate the game on ' + date)
          this.alert.setType('success')
        },
        error => {
          this.alert.setMessage(error)
          this.alert.setType('error')
          this.participateKey++
        }
      )
      .finally(() => {
        this.loadingParticipate = false
      })
  }

  cancelSession(): void {
    this.loadingParticipate = true
    this.alert.reset()

    this.session
      .cancel()
      .then(
        (_response: SessionModel) => {
          const date = displayDate(this.session.currentOpen.date)
          this.alert.setMessage('Left the game for ' + date)
          this.alert.setType('success')
        },
        error => {
          this.alert.setMessage(error)
          this.alert.setType('error')
          this.participateKey++
        }
      )
      .finally(() => {
        this.loadingParticipate = false
      })
  }

  sessionDetailTitle(date: string): string {
    return displayDate(date)
  }

  @Debounce(700)
  fetchSuggestionInCollection(sessionId: string) {
    this.loadingInCollectionSuggestion = true
    this.alert.reset()
    this.suggestion
      .fetchBySession(sessionId)
      .then(
        _ => {},
        error => {
          this.alert.setMessage(error)
          this.alert.setType('error')
        }
      )
      .finally(() => {
        this.loadingInCollectionSuggestion = false
      })
  }
}
</script>
