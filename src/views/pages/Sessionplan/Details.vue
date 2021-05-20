<template>
  <v-container>
    <template v-if="loading">
      <yr-centered-progress-linear text="Opening sessionplan..." />
    </template>
    <v-col v-else cols="12">
      <v-row>
        <v-col v-if="isAuthenticated" cols="auto">
          <yr-icon-btn to="/sessionplan/manager" data-cy="to-manager-btn">
            mdi-arrow-left
          </yr-icon-btn>
        </v-col>
        <v-col class="text-center">
          <h1 class="mb-5 text-h6" data-cy="details-title">{{ details.name }}</h1>
        </v-col>
        <v-col cols="auto">
          <yr-icon-btn data-cy="share-btn" @click="shareDialog = true">
            mdi-share
          </yr-icon-btn>
        </v-col>
      </v-row>

      <v-dialog v-model="shareDialog" max-width="500px" @click:outside="closeShareDialog">
        <yr-dialog-card>
          <template #title>
            Share Sessionplan
          </template>

          <template #content>
            <v-col>
              <v-row>
                <yr-text-field
                  readonly
                  dense
                  :value="sharedLink"
                  :success-messages="copiedMessage"
                  :success="copied"
                  :hide-details="!copied"
                  data-cy="shared-link-input"
                >
                  <template #append-outer>
                    <yr-icon-btn
                      v-if="!copied"
                      color="secondary darken-1"
                      @click="copyLink"
                      small
                      data-cy="copy-link-btn"
                    >
                      mdi-content-copy
                    </yr-icon-btn>
                    <v-icon v-else class="ml-1 my-1" color="success">
                      mdi-check-circle
                    </v-icon>
                  </template>
                </yr-text-field>
              </v-row>
            </v-col>
          </template>

          <template #actions>
            <v-spacer></v-spacer>
            <yr-btn text @click="closeShareDialog" data-cy="close-share-btn">
              Close
            </yr-btn>
          </template>
        </yr-dialog-card>
      </v-dialog>

      <v-row v-if="!isAuthenticated">
        <yr-text-field label="Your Name" data-cy="name-input"></yr-text-field>
      </v-row>

      <yr-date-picker
        :events="sessionDates"
        :disabled="loadingSession || loadingParticipate"
        v-model="selectedDate"
        @click:date="openSessionDetails"
        data-cy="details-datepicker"
      ></yr-date-picker>

      <v-divider v-if="!loadingSession && !loadingParticipate" class="my-4" />
      <yr-progress-linear v-else class="mt-4 my-3" />

      <template v-if="!loadingSession">
        <template v-if="selectedSessionDate">
          <v-col>
            <v-row>
              <h4>
                {{ sessionDetailTitle(sessionDetails.date) }}
              </h4>
              <v-spacer />
              <v-checkbox
                hide-details
                :input-value="participateCurrent"
                label="Participate"
                class="mt-0 pt-0"
                :disabled="loadingParticipate"
                @change="toggleParticipationState"
              >
              </v-checkbox>
            </v-row>
          </v-col>
          <v-subheader v-show="sessionDetails.users.length > 0">
            {{ sessionDetails.users.length }} Participants:
          </v-subheader>
          <v-chip
            v-for="user in sessionDetails.users"
            :key="user.name"
            color="success darken-1"
            class="ml-2"
            :outlined="user.id != authUserId"
          >
            <v-icon left>
              mdi-account
            </v-icon>
            {{ user.name }}
          </v-chip>
        </template>
        <template v-else>
          <h4>No session planned on this date</h4>
        </template>
      </template>
    </v-col>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'

import AlertModule from '@/store/modules/alert-module'
import AuthModule from '@/store/modules/auth-module'
import SessionplanModule from '@/store/modules/sessionplan-module'
import SessionModule from '@/store/modules/session-module'

import { SessionplanDetailModel } from '@/models/data/sessionplan'
import { SessionModel } from '@/models/data/session'

import { vuetifyDate, displayDate } from '@/helpers/date-format-helper'

@Component
export default class Details extends Vue {
  private loading: boolean = false
  private loadingSession: boolean = false
  private loadingParticipate: boolean = false

  private shareDialog: boolean = false
  private copied: boolean = false
  private copiedMessage: string = ''

  private selectedDate: string = ''

  private participateCurrent: boolean = false

  private alert: AlertModule = getModule(AlertModule, this.$store)
  private auth: AuthModule = getModule(AuthModule, this.$store)
  private sessionplan: SessionplanModule = getModule(SessionplanModule, this.$store)
  private session: SessionModule = getModule(SessionModule, this.$store)

  created() {
    this.loading = true

    this.sessionplan
      .openDetails(this.$route.params.id)
      .then(
        (_response: SessionplanDetailModel) => {},
        error => {
          this.alert.setMessage(error)
          this.alert.setType('error')
        }
      )
      .finally(() => {
        this.loading = false
      })
  }

  get details(): SessionplanDetailModel {
    return this.sessionplan.currentOpen
  }

  get selectedSessionDate(): SessionModel | undefined {
    return this.details.sessions.find(s => vuetifyDate(s.date) == this.selectedDate)
  }

  get sessionDates(): string[] {
    return this.details.sessions.map(s => vuetifyDate(s.date))
  }

  get isAuthenticated(): boolean {
    return this.auth.authState.loggedIn
  }

  get authUserId(): string | null {
    return this.auth.authState.userId
  }

  get sharedLink(): string {
    return window.location.href
  }

  get sessionDetails(): SessionModel {
    return this.session.currentOpen
  }

  openSessionDetails(): void {
    if (this.selectedSessionDate) {
      this.loadingSession = true
      this.alert.reset()

      this.session
        .fetch(this.selectedSessionDate.id)
        .then(
          (response: SessionModel) => {
            this.participateCurrent = response.users.some(u => u.id == this.authUserId)
          },
          error => {
            this.alert.setMessage(error)
            this.alert.setType('error')
          }
        )
        .finally(() => {
          this.loadingSession = false
        })
    }
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
          this.alert.setMessage('You will participate the game on ' + date)
          this.alert.setType('success')
        },
        error => {
          this.alert.setMessage(error)
          this.alert.setType('error')
          this.participateCurrent = !this.participateCurrent
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
          this.alert.setMessage('You left the game on ' + date)
          this.alert.setType('success')
        },
        error => {
          this.alert.setMessage(error)
          this.alert.setType('error')
          this.participateCurrent = !this.participateCurrent
        }
      )
      .finally(() => {
        this.loadingParticipate = false
      })
  }

  sessionDetailTitle(date: string): string {
    return displayDate(date)
  }

  copyLink() {
    navigator.clipboard.writeText(this.sharedLink)
    this.copied = true
    this.copiedMessage = 'Copied link to this sessionplan!'
  }

  closeShareDialog() {
    this.copiedMessage = ''
    this.copied = false
    this.shareDialog = false
  }
}
</script>
