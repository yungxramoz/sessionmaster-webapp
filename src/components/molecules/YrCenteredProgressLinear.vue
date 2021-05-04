<template>
  <v-row class="fill-height" style="height:70vh;" align-content="center" justify="center">
    <v-col class="subtitle-1 text-center" cols="12">
      <template>
        {{ text }}
      </template>
    </v-col>
    <v-col cols="10">
      <yr-progress-linear data-cy="progress-loading"></yr-progress-linear>
    </v-col>
  </v-row>
</template>
<script lang="ts">
import Vue from 'vue'
import { Component, Prop } from 'vue-property-decorator'

@Component
export default class YrDialogCard extends Vue {
  @Prop() text?: string
}
</script>
