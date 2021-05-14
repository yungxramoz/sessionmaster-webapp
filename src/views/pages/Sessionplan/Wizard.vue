<template>
  <v-container>
    <v-stepper v-model="currentStep" class="elevation-0">
      <v-stepper-header class="elevation-0">
        <v-stepper-step step="1" :complete="stepComplete(1)" color="accent">
          Choose a name
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="2" :complete="stepComplete(2)" color="accent">
          Select the game dates
        </v-stepper-step>

        <v-divider />

        <v-stepper-step step="3" :complete="stepComplete(3)" color="accent">
          Overview
        </v-stepper-step>
      </v-stepper-header>
      <v-stepper-items>
        <v-stepper-content step="1" class="pt-1">
          <v-col>
            <v-row>
              <v-alert dense text type="info" width="100%">
                Provide a sessionplan name
              </v-alert>
            </v-row>
            <v-row>
              <v-form v-model="valid" style="width: 100%;" @submit.stop.prevent="nextStep">
                <yr-text-field
                  v-model="addSessionplan.name"
                  label="Sessionplan Name"
                  counter="20"
                  required
                  :rules="nameRules"
                  data-cy="name-input"
                ></yr-text-field>
              </v-form>
            </v-row>
            <v-row class="pt-4">
              <v-spacer />
              <yr-btn text @click="nextStep" :disabled="!valid" data-cy="next-to-2-btn">
                Next
              </yr-btn>
            </v-row>
          </v-col>
        </v-stepper-content>

        <v-stepper-content step="2" class="pt-1">
          <v-col>
            <v-row>
              <v-alert dense text type="info" width="100%">
                Select game session dates
              </v-alert>
            </v-row>
            <v-row>
              <v-card outlined elevation="2">
                <v-date-picker
                  flat
                  full-width
                  multiple
                  :min="currentDate"
                  v-model="dates"
                  color="secondary darken-1"
                  header-color="primary"
                  data-cy="wizard-datepicker"
                ></v-date-picker>
              </v-card>
            </v-row>
            <v-row class="pt-4">
              <v-spacer />
              <yr-btn text @click="backStep" data-cy="back-to-1-btn">
                Back
              </yr-btn>
              <yr-btn
                text
                @click="prepareSessions"
                :disabled="dates.length == 0"
                data-cy="next-to-3-btn"
              >
                Next
              </yr-btn>
            </v-row>
          </v-col>
        </v-stepper-content>

        <v-stepper-content step="3" class="pt-1">
          <v-col>
            <v-row>
              <v-alert dense text type="info" width="100%">
                Check the sessionplan details
              </v-alert>
            </v-row>

            <v-row>
              <v-subheader class="font-weight-bold text-subtitle-1" data-cy="overview-name-text">
                Name: {{ addSessionplan.name }}
              </v-subheader>
              <v-list
                :key="sessionKey"
                width="100%"
                class="overflow-y-auto list-height"
                data-cy="date-list"
              >
                <v-list-item v-for="session in addSessionplan.sessions" :key="session.date">
                  <v-list-item-content>
                    <v-list-item-subtitle>
                      {{ sessionDisplayDate(session.date) }}
                    </v-list-item-subtitle>
                  </v-list-item-content>
                  <v-list-item-action>
                    <yr-icon-btn
                      color="error"
                      @click="remove(session)"
                      :disabled="dates.length == 1"
                    >
                      mdi-close
                    </yr-icon-btn>
                  </v-list-item-action>
                </v-list-item>
              </v-list>
            </v-row>
            <v-row class="pt-4">
              <v-spacer />
              <yr-btn text @click="backStep" :disabled="loading" data-cy="back-to-2-btn">
                Back
              </yr-btn>
              <yr-btn
                @click="createAct"
                :disabled="loading"
                :loading="loading"
                data-cy="create-btn"
              >
                Create
              </yr-btn>
            </v-row>
          </v-col>
        </v-stepper-content>
      </v-stepper-items>
    </v-stepper>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import { InputValidationRule } from 'vuetify'

import AlertModule from '@/store/modules/alert-module'
import SessionplanModule from '@/store/modules/sessionplan-module'

import { AddSessionplanModel, SessionplanDetailModel } from '@/models/data/sessionplan'
import { maxCharRule, requiredRule } from '@/helpers/form-rules'
import { SessionModel } from '@/models/data/session'

import { vuetifyDate, displayDate } from '@/helpers/date-format-helper'

@Component
export default class Wizard extends Vue {
  private loading: boolean = false
  private sessionKey = 0
  private currentStep = 1

  private addSessionplan: AddSessionplanModel = {
    name: '',
  }

  private valid = false
  private nameRules: InputValidationRule[] = [requiredRule(), maxCharRule(20)]
  private dates: string[] = []
  private currentDate: string = vuetifyDate(new Date().toISOString())

  private alert: AlertModule = getModule(AlertModule, this.$store)
  private sessionplan: SessionplanModule = getModule(SessionplanModule, this.$store)

  createAct() {
    this.loading = true
    this.alert.resetAlert()

    this.sessionplan
      .create(this.addSessionplan)
      .then(
        (response: SessionplanDetailModel) => {
          this.$router.push('details/' + response.id)
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

  prepareSessions() {
    this.addSessionplan.sessions = []
    for (const dateString of this.dates) {
      const session = {
        date: new Date(dateString).toISOString(),
      } as SessionModel

      this.addSessionplan.sessions.push(session)
    }

    //order by date prop
    this.addSessionplan.sessions.sort((a, b) => (a.date > b.date ? 1 : b.date > a.date ? -1 : 0))

    this.currentStep = 3
  }

  remove(session: SessionModel) {
    const sessionIndex = this.addSessionplan.sessions?.indexOf(session)
    if (sessionIndex != undefined && sessionIndex > -1) {
      this.addSessionplan.sessions?.splice(sessionIndex, 1)
    }

    const dateIndex = this.dates.indexOf(vuetifyDate(session.date))
    if (dateIndex != undefined && dateIndex > -1) {
      this.dates.splice(dateIndex, 1)
    }

    this.sessionKey++
  }

  sessionDisplayDate(date: string): string {
    return displayDate(date)
  }

  nextStep() {
    this.currentStep++
  }

  backStep() {
    this.currentStep--
  }

  stepComplete(step: number): boolean {
    return this.currentStep > step
  }
}
</script>

<style lang="scss" scoped>
.list-height {
  max-height: calc(100vh - 410px);
}
</style>
