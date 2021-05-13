<template>
  <v-container>
    <v-row align="center" justify="center" style="height:70vh;">
      <v-row>
        <v-col cols="12">
          <v-img
            contain
            lazy-src="@/assets/sessionmaster-header.png"
            src="@/assets/sessionmaster.png"
            max-height="250"
            max-width="250"
            class="mx-auto"
          >
            <template v-slot:placeholder>
              <v-row class="fill-height ma-0" align="center" justify="center">
                <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
              </v-row>
            </template>
          </v-img>
        </v-col>
        <v-col cols="12" class="mt-6">
          <p class="text-body-1 text-uppercase font-weight-light text-center text-no-wrap">
            Collect - Plan - Organize - Play
          </p>
        </v-col>
        <v-col cols="12" class="text-center">
          <yr-btn rounded outlined to="sessionplan/wizard">
            Plan your game sessions
            <v-icon class="ml-2">
              mdi-arrow-right
            </v-icon>
          </yr-btn>
        </v-col>
      </v-row>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Home extends Vue {}
</script>
