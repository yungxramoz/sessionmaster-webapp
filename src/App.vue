<template>
  <v-app>
    <component :is="layout">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </component>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import LayoutDefault from '@/views/layouts/LayoutDefault.vue'

@Component({
  components: {
    LayoutDefault,
  },
})
export default class App extends Vue {
  get layout() {
    return 'LayoutDefault'
  }
}
</script>

<style lang="scss">
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-active,
.fade-leave-active {
  transition: all 0.4s ease-in-out;
}
</style>
