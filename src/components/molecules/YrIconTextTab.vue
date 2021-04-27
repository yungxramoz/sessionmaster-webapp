<template>
  <v-tab>
    <v-icon left>
      {{ icon }}
    </v-icon>
    {{ title }}
  </v-tab>
</template>

<script lang="ts">
import { VTab } from 'vuetify/lib'

import { Component, Prop } from 'vue-property-decorator'

@Component
export default class YrIconTextTab extends VTab {
  @Prop() title?: string
  @Prop() icon?: string
}
</script>
