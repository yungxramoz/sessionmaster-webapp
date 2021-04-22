<template>
  <yr-text-field
    v-bind="{ ...$props, ...$attrs }"
    v-on="$listeners"
    :prepend-icon="this.noPrependIcon ? '' : 'mdi-lock'"
    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
    :type="showPassword ? 'text' : 'password'"
    @click:append="showPassword = !showPassword"
  ></yr-text-field>
</template>

<script lang="ts">
import YrTextField from '../atoms/YrTextField.vue'

import { Component, Prop } from 'vue-property-decorator'

@Component
export default class YrPasswordField extends YrTextField {
  @Prop({ default: false }) private noPrependIcon!: boolean | string

  private showPassword: boolean = false
}
</script>
