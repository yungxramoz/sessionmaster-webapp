<template>
  <v-container>
    <template v-if="loading">
      <yr-centered-progress-linear text="Getting your spellbook ready..." />
    </template>
    <v-col v-else cols="12">
      <v-row v-for="plan in ownedSessionplans" :key="plan.Id" class="pb-2">
        <v-card outlined elevation="2" class="mx-auto" min-width="100%">
          <v-card-title class="text-h5">
            {{ plan.name }}
          </v-card-title>

          <v-card-subtitle>Next Session: </v-card-subtitle>

          <v-card-actions>
            <v-spacer />
            <yr-btn text color="error">
              <v-icon class="mr-1">
                mdi-delete
              </v-icon>
              Delete
            </yr-btn>
            <yr-btn text :to="'/sessionplan/details/' + plan.id">
              <v-icon class="mr-1">
                mdi-open-in-new
              </v-icon>
              Open
            </yr-btn>
          </v-card-actions>
        </v-card>
      </v-row>
      <v-row>
        <yr-icon-btn height="130px" fab tile block :large-icon="true" data-cy="add-sessionplan-btn">
          mdi-plus
        </yr-icon-btn>
      </v-row>
    </v-col>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'

import AlertModule from '@/store/modules/alert-module'
import SessionplanModule from '@/store/modules/sessionplan-module'

import { SessionplanOverviewModel } from '@/models/data/sessionplan'

@Component
export default class Manager extends Vue {
  private loading: boolean = false

  private alert: AlertModule = getModule(AlertModule, this.$store)
  private sessionplan: SessionplanModule = getModule(SessionplanModule, this.$store)

  created() {
    this.loading = true
    this.alert.resetAlert()

    this.sessionplan
      .fetchOwned()
      .then(
        (_response: SessionplanOverviewModel[]) => {},
        error => {
          this.alert.setMessage(error)
          this.alert.setType('error')
        }
      )
      .finally(() => {
        this.loading = false
      })
  }

  get ownedSessionplans(): SessionplanOverviewModel[] {
    return this.sessionplan.owned
  }
}
</script>
