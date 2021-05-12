<template>
  <v-container>
    <template v-if="loading">
      <yr-centered-progress-linear text="Getting your spellbook ready..." />
    </template>
    <v-col v-else cols="12">
      <div class="text-center">
        <h1 class="mb-5">{{ details.name }}</h1>
      </div>

      <v-card outlined elevation="2">
        <v-date-picker
          v-model="selectedDate"
          color="secondary darken-1"
          header-color="primary"
          event-color="accent"
          :events="sessionDates"
          flat
          full-width
        ></v-date-picker>
      </v-card>

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
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'

import AlertModule from '@/store/modules/alert-module'
import SessionplanModule from '@/store/modules/sessionplan-module'

import { SessionplanDetailModel } from '@/models/data/sessionplan'
import { SessionModel } from '@/models/data/session'

import { vuetifyDate, displayDate } from '@/helpers/date-format-helper'

@Component
export default class Details extends Vue {
  private loading: boolean = false
  private selectedDate: string = vuetifyDate(new Date().toISOString())

  private alert: AlertModule = getModule(AlertModule, this.$store)
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

  sessionDetailTitle(date: string): string {
    return displayDate(date)
  }
}
</script>
