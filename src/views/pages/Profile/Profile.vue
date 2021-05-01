<template>
  <yr-form :message="message" :messageType="messageType">
    <template #form>
      <div class="text-center py-6">
        <v-avatar size="150" color="grey lighten-2">
          <v-icon size="150">
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
import { Component, Ref, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import { InputValidationRule } from 'vuetify'

import AuthModule from '@/store/modules/auth-module'
import AccountModule from '@/store/modules/account-module'

import { maxCharRule, minCharRule, passwordRule, requiredRule } from '@/helpers/form-rules'
import { cloneSource } from '@/helpers/clone'

import { VForm } from '@/models/types'
import { UpdateUserModel, UserModel } from '@/models/data/user'
import FormDefinition from '@/models/form-definition'

import EditProfileForm from './EditProfileForm.vue'
import EditPasswordForm from './EditPasswordForm.vue'

interface Form extends FormDefinition {
  valid: false
  fields: UpdateUserModel
  rules?: {
    firstname: InputValidationRule[]
    lastname: InputValidationRule[]
    username: InputValidationRule[]
    password: InputValidationRule[]
  }
}

@Component({
  components: {
    EditProfileForm,
    EditPasswordForm,
  },
})
export default class Profile extends Vue {
  @Ref() readonly profileForm!: VForm

  private form: Form = {
    valid: false,
    fields: {
      firstname: '',
      lastname: '',
      username: '',
      password: '',
    },
  }
  private updateLoading: boolean = false
  private deleteLoading: boolean = false
  private deleteDialog: boolean = false
  private message?: string = ''
  private messageType?: string = 'info'

  private auth: AuthModule = getModule(AuthModule, this.$store)
  private account: AccountModule = getModule(AccountModule, this.$store)

  created() {
    this.form.rules = {
      firstname: [requiredRule(), maxCharRule(50)],
      lastname: [requiredRule(), maxCharRule(50)],
      username: [requiredRule(), maxCharRule(20)],
      password: [requiredRule(), minCharRule(8), passwordRule()],
    }

    this.updateLoading = true

    this.account
      .fetch(this.auth.userId)
      .then(
        (response: UserModel) => {
          this.form.fields = cloneSource(response)
        },
        error => {
          this.message = error
          this.messageType = 'error'
        }
      )
      .finally(() => {
        this.updateLoading = false
      })
  }

  get updateEnabled(): boolean {
    return (
      (this.form.fields.username != this.account.currentUser.username ||
        this.form.fields.firstname != this.account.currentUser.firstname ||
        this.form.fields.lastname != this.account.currentUser.lastname) &&
      this.form.valid &&
      !this.updateLoading
    )
  }

  async update() {
    if (this.profileForm.validate()) {
      this.updateLoading = true
      this.message = ''

      const updateData = {
        id: this.auth.userId,
        data: this.form.fields,
      }

      this.account
        .update(updateData)
        .then(
          (response: UpdateUserModel) => {
            this.form.fields = cloneSource(response)
          },
          (error: string) => {
            this.message = error
            this.messageType = 'error'
          }
        )
        .finally(() => {
          this.updateLoading = false
        })
    }
  }

  async deleteAct() {
    this.deleteLoading = true
    this.message = ''

    this.account
      .delete(this.auth.userId)
      .then(
        () => {
          this.auth.logout()
          this.$router.push('/')
        },
        error => {
          this.message = error
          this.messageType = 'error'
        }
      )
      .finally(() => {
        this.deleteLoading = false
      })
  }
}
</script>
