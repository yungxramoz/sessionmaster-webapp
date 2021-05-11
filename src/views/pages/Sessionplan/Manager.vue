<template>
  <v-container>
    <h1>Manager</h1>
    <span v-if="loading">loading</span>
    <ul v-else>
      <li v-for="plan in ownedSessionplans" :key="plan.Id">
        {{ plan.name }}
      </li>
    </ul>
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
