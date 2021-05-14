<template>
  <yr-form>
    <template #form>
      <div class="text-center py-6">
        <v-avatar size="130" color="grey lighten-2">
          <v-icon size="130">
            mdi-account-circle
          </v-icon>
        </v-avatar>
      </div>
      <yr-tabs>
        <yr-icon-text-tab
          title="Profile"
          icon="mdi-account-details"
          href="#editProfile"
          data-cy="edit-profile-tab"
        />
        <yr-icon-text-tab
          title="Password"
          icon="mdi-lock"
          href="#editPassword"
          data-cy="edit-password-tab"
        />

        <v-tab-item value="editProfile">
          <edit-profile-form />
        </v-tab-item>

        <v-tab-item value="editPassword">
          <edit-password-form />
        </v-tab-item>
      </yr-tabs>
    </template>
  </yr-form>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import EditProfileForm from './EditProfileForm.vue'
import EditPasswordForm from './EditPasswordForm.vue'

@Component({
  components: {
    EditProfileForm,
    EditPasswordForm,
  },
})
export default class Profile extends Vue {}
</script>
