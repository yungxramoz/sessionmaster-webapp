<template>
  <v-card>
    <v-card-title v-if="hasTitleSlot" :class="headlineClass">
      <slot name="title"></slot>
    </v-card-title>

    <v-card-text class="mt-5">
      <slot name="content"></slot>
    </v-card-text>

    <template v-if="hasActionsSlot">
      <v-divider />

      <v-card-actions>
        <slot name="actions"></slot>
      </v-card-actions>
    </template>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class YrDialogCard extends Vue {
  @Prop({ default: 'grey' }) headerColor!: string

  get headlineClass() {
    return `text-h6 ${this.headerColor} lighten-2`
  }

  get hasActionsSlot() {
    return !!this.$slots.actions
  }

  get hasTitleSlot() {
    return !!this.$slots.title
  }
}
</script>
