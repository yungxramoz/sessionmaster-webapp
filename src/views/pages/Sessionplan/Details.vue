<template>
  <v-container>
    <h1>Details</h1>
    <p>{{ $route.params.id }}</p>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'

import AlertModule from '@/store/modules/alert-module'
import SessionplanModule from '@/store/modules/sessionplan-module'

import { SessionplanDetailModel } from '@/models/data/sessionplan'

@Component
export default class Details extends Vue {
  private loading: boolean = false

  private alert: AlertModule = getModule(AlertModule, this.$store)
  private sessionplan: SessionplanModule = getModule(SessionplanModule, this.$store)

  get sessionplanDetails(): SessionplanDetailModel {
    return this.sessionplan.currentOpen
  }
}
</script>
