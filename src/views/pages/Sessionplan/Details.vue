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
          </yr-icon-btn></v-col
        >
        <v-col class="text-center">
          <h1 class="mb-5 text-h6" data-cy="details-title">{{ details.name }}</h1>
        </v-col>
        <v-col cols="auto">
          <yr-icon-btn data-cy="share-btn" @click="shareDialog = true">
            mdi-share
          </yr-icon-btn>
        </v-col>
      </v-row>

      <v-row v-if="!isAuthenticated">
        <yr-text-field label="Your Name" data-cy="name-input"></yr-text-field>
      </v-row>

      <yr-date-picker
        :events="sessionDates"
        v-model="selectedDate"
        data-cy="details-datepicker"
      ></yr-date-picker>

      <v-divider class="my-3" />

      <template v-if="selectedSession">
        <v-subheader>
          {{ sessionDetailTitle(selectedSession.date) }}
        </v-subheader>
      </template>
      <template v-else>
        <v-subheader>No session planned on this date</v-subheader>
      </template>
    </v-col>

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
              >
                <template v-if="copied" #append-outer>
                  <v-icon color="success">
                    mdi-check-circle
                  </v-icon>
                </template>
              </yr-text-field>

              <yr-icon-btn
                v-if="!copied"
                color="secondary darken-1"
                class="ml-2 mt-1"
                @click="copyLink"
              >
                mdi-content-copy
              </yr-icon-btn>
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
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'

import AlertModule from '@/store/modules/alert-module'
import AuthModule from '@/store/modules/auth-module'
import SessionplanModule from '@/store/modules/sessionplan-module'

import { SessionplanDetailModel } from '@/models/data/sessionplan'
import { SessionModel } from '@/models/data/session'

import { vuetifyDate, displayDate } from '@/helpers/date-format-helper'

@Component
export default class Details extends Vue {
  private loading: boolean = false

  private shareDialog: boolean = false
  private copied: boolean = false
  private copiedMessage: string = ''

  private selectedDate: string = vuetifyDate(new Date().toISOString())

  private alert: AlertModule = getModule(AlertModule, this.$store)
  private auth: AuthModule = getModule(AuthModule, this.$store)
  private sessionplan: SessionplanModule = getModule(SessionplanModule, this.$store)

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

  get selectedSession(): SessionModel | undefined {
    return this.details.sessions.find(s => vuetifyDate(s.date) == this.selectedDate)
  }

  get sessionDates(): string[] {
    return this.details.sessions.map(s => vuetifyDate(s.date))
  }

  get isAuthenticated(): boolean {
    return this.auth.authState.loggedIn
  }

  get sharedLink(): string {
    return window.location.href
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
