<template>
  <v-container>
    <v-row align="center" justify="center" style="height:70vh;">
      <v-row>
        <v-col cols="12">
          <h1 class="text-center text-no-wrap">
            404
          </h1>
        </v-col>

        <v-col cols="12">
          <p class="caption text-center text-no-wrap">
            Not even a funny 404 image was found :(
          </p>
        </v-col>
      </v-row>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class NotFound extends Vue {}
</script>
