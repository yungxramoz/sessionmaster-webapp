<template>
  <v-container>
    <h1>Wizard</h1>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'

import AlertModule from '@/store/modules/alert-module'
import SessionplanModule from '@/store/modules/sessionplan-module'

import { AddSessionplanModel } from '@/models/data/sessionplan'

@Component
export default class Wizard extends Vue {
  private loading: boolean = false
  private addSessionplan: AddSessionplanModel = {
    name: '',
  }

  private alert: AlertModule = getModule(AlertModule, this.$store)
  private sessionplan: SessionplanModule = getModule(SessionplanModule, this.$store)

  createAct() {
    this.loading = true
    this.alert.resetAlert()

    // this.sessionplan.add(addSessionplan)
  }
}
</script>
