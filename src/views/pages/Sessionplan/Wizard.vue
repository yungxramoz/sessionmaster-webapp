<template>
  <v-container>
    <v-stepper vertical v-model="currentStep" class="elevation-0">
      <v-stepper-step step="1" :complete="currentStep > 1" color="accent">
        Choose a name
      </v-stepper-step>
      <v-stepper-content step="1">
        <v-col>
          <v-row>
            <v-form v-model="valid" style="width: 100%;">
              <yr-text-field
                v-model="addSessionplan.name"
                label="Sessionplan Name"
                counter="20"
                required
                :rules="nameRules"
                data-cy="username-input"
              ></yr-text-field>
            </v-form>
          </v-row>
          <v-row>
            <v-spacer />
            <yr-btn text @click="currentStep = 2" :disabled="!valid">
              Next
            </yr-btn>
          </v-row>
        </v-col>
      </v-stepper-content>

      <v-stepper-step step="2" :complete="currentStep > 2" color="accent">
        Select the game dates
      </v-stepper-step>
      <v-stepper-content step="2">
        <v-col>
          <v-row>
            <v-card outlined elevation="2">
              <v-date-picker
                v-model="dates"
                color="secondary darken-1"
                header-color="primary"
                flat
                full-width
                multiple
              ></v-date-picker>
            </v-card>
          </v-row>
          <v-row>
            <v-spacer />
            <yr-btn text @click="currentStep = 1">
              Back
            </yr-btn>
            <yr-btn text @click="currentStep = 3">
              Next
            </yr-btn>
          </v-row>
        </v-col>
      </v-stepper-content>

      <v-stepper-step step="3" :complete="currentStep > 3" color="accent">
        Adjust the play time
      </v-stepper-step>
      <v-stepper-content step="3">
        <v-col>
          <v-row>
            <ul>
              <li v-for="date in dates" :key="date">
                {{ date }}
              </li>
            </ul>
          </v-row>
          <v-row>
            <v-spacer />
            <yr-btn text @click="currentStep = 2" :disabled="loading">
              Back
            </yr-btn>
            <yr-btn @click="createAct" :disabled="loading" :loading="loading">
              Create
            </yr-btn>
          </v-row>
        </v-col>
      </v-stepper-content>
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

@Component
export default class Wizard extends Vue {
  private loading: boolean = false

  private currentStep = 1
  private steps = 3

  private addSessionplan: AddSessionplanModel = {
    name: '',
  }

  private valid = false
  private nameRules: InputValidationRule[] = [requiredRule(), maxCharRule(20)]
  private dates: string[] = []

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
}
</script>
