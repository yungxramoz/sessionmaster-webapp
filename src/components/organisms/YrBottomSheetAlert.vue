<template>
  <v-bottom-sheet :value="hasMessage" hide-overlay>
    <v-alert class="ma-0 pa-6" border="top" :type="type" prominent data-cy="message-alert">
      {{ message }}
    </v-alert>
  </v-bottom-sheet>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'

import AlertModule from '@/store/modules/alert-module'

@Component
export default class YrBottomSheetAlert extends Vue {
  private alert: AlertModule = getModule(AlertModule, this.$store)

  get type(): string {
    return this.alert.alertState.type
  }

  get message(): string {
    return this.alert.alertState.message
  }

  get hasMessage() {
    return this.message ? true : false
  }
}
</script>
