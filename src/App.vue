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
import { getModule } from 'vuex-module-decorators'

import AuthModule from '@/store/modules/auth-module'

import LayoutDefault from '@/views/layouts/LayoutDefault.vue'
import LayoutAuthorized from '@/views/layouts/LayoutAuthorized.vue'

@Component({
  components: {
    LayoutDefault,
    LayoutAuthorized,
  },
})
export default class App extends Vue {
  private auth: AuthModule

  constructor() {
    super()
    this.auth = getModule(AuthModule, this.$store)
  }

  get layout() {
    return this.auth.isLoggedIn ? 'LayoutAuthorized' : 'LayoutDefault'
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
