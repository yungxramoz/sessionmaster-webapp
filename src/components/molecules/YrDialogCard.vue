<template>
  <v-card>
    <v-card-title class="headline grey lighten-2">
      <slot name="title"></slot>
    </v-card-title>

    <v-card-text class="mt-5">
      <slot name="content"></slot>
    </v-card-text>

    <v-divider></v-divider>

    <v-card-actions>
      <slot name="actions"></slot>
    </v-card-actions>
  </v-card>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component } from 'vue-property-decorator'

@Component
export default class YrDialogCard extends Vue {}
</script>
