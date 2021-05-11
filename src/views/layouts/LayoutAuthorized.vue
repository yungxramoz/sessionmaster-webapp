<template>
  <div class="LayoutAuthorized">
    <yr-app-bar>
      <router-link to="/" class="mr-2">
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

      <v-dialog v-model="logoutDialog" max-width="500px" :persistent="logoutLoading" retain-focus>
        <template v-slot:activator="{ on: dialogOn, attrs: dialogAttrs }">
          <v-tooltip left>
            <template v-slot:activator="{ on: tooltipOn, attrs: tooltipAttrs }">
              <yr-icon-btn
                v-bind="{ ...dialogAttrs, ...tooltipAttrs }"
                v-on="{ ...dialogOn, ...tooltipOn }"
                data-cy="logout-btn"
              >
                mdi-logout
              </yr-icon-btn>
            </template>
            <span>Logout</span>
          </v-tooltip>
        </template>

        <yr-dialog-card>
          <template #title>
            Logout
          </template>

          <template #content>
            Are you sure you want to log out?
          </template>

          <template #actions>
            <v-spacer></v-spacer>
            <yr-btn
              data-cy="cancel-logout-btn"
              text
              :disabled="logoutLoading"
              @click="logoutDialog = false"
            >
              Cancel
            </yr-btn>
            <yr-btn
              data-cy="to-logout-btn"
              text
              :disabled="logoutLoading"
              :loading="logoutLoading"
              @click="logout"
            >
              Logout
            </yr-btn>
          </template>
        </yr-dialog-card>
      </v-dialog>
    </yr-app-bar>

    <v-main>
      <v-container>
        <slot />
      </v-container>
    </v-main>

    <v-footer app class="pa-0">
      <v-bottom-navigation shift color="secondary darken-1">
        <v-btn to="/sessionplan/manager" data-cy="to-sessionplan-btn">
          <span>Sessionplan</span>
          <v-icon>mdi-wizard-hat</v-icon>
        </v-btn>
        <v-btn to="/collection" data-cy="to-collection-btn">
          <span>Collection</span>
          <v-icon>mdi-treasure-chest</v-icon>
        </v-btn>
        <v-btn to="/profile" data-cy="to-profile-btn">
          <span>Profile</span>
          <v-icon>mdi-account</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </v-footer>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'

import AuthModule from '@/store/modules/auth-module'

import { YrAppBar } from '@/components'

@Component({
  components: {
    YrAppBar,
  },
})
export default class LayoutDefault extends Vue {
  private auth: AuthModule
  private logoutLoading = false
  private logoutDialog = false

  constructor() {
    super()
    this.auth = getModule(AuthModule, this.$store)
  }

  logout() {
    this.logoutLoading = true

    //fake loading
    setTimeout(() => {
      this.auth.logout()
      this.$router.push('/')
      this.logoutLoading = false
    }, 1500)
  }
}
</script>
