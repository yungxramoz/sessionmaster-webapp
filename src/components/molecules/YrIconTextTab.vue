<template>
  <v-tab :href="href" :data-cy="dataCy">
    <v-icon left>
      {{ icon }}
    </v-icon>
    {{ title }}
  </v-tab>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class YrIconTextTab extends Vue {
  @Prop() title?: string
  @Prop() icon?: string
  @Prop() href?: string
  @Prop() dataCy?: string
}
</script>
