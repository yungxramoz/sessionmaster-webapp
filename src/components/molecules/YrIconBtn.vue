<template>
  <yr-btn icon v-bind="{ ...$props, ...$attrs }" v-on="$listeners">
    <v-icon :x-large="largeIcon">
      <slot />
    </v-icon>
  </yr-btn>
</template>

<script lang="ts">
import { YrBtn } from '@/components'

import { Component, Prop } from 'vue-property-decorator'

@Component
export default class YrIconBtn extends YrBtn {
  @Prop({ default: false }) largeIcon!: string | boolean
}
</script>
