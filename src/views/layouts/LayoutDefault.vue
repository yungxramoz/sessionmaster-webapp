<template>
  <div class="LayoutDefault">
    <yr-app-bar>
      <router-link to="/">
        <v-img
          contain
          max-height="50"
          max-width="55"
          src="@/assets/sessionmaster-header.png"
          lazy-src="@/assets/sessionmaster-header.png"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" align="center" justify="center">
              <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </router-link>
      <v-spacer></v-spacer>
      <v-tooltip left>
        <template v-slot:activator="{ on, attrs }">
          <yr-btn v-bind="attrs" v-on="on" to="/login" data-cy="to-login-btn" text>
            Login
            <v-icon class="ml-2" dense>mdi-login</v-icon>
          </yr-btn>
        </template>
        <span>Login</span>
      </v-tooltip>
    </yr-app-bar>

    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>

    <v-footer app class="pa-1" elevation="5">
      <v-spacer></v-spacer>
      <v-subheader> &copy; {{ new Date().getFullYear() }} Session Master </v-subheader>
    </v-footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { YrAppBar, YrIconBtn } from '@/components'

@Component({
  components: {
    YrAppBar,
    YrIconBtn,
  },
})
export default class LayoutDefault extends Vue {}
</script>
