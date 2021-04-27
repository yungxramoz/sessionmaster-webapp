<template>
  <yr-form title="Profile" :message="message" :messageType="messageType">
    <template #form>
      <div class="text-center pb-6">
        <v-avatar size="110" color="grey lighten-2">
          <v-icon size="100">
            mdi-account-circle
          </v-icon>
        </v-avatar>
      </div>
      <yr-tabs>
        <yr-icon-text-tab title="Profile" icon="mdi-account-details" />
        <v-tab-item key="profile">
          <v-form
            class="pt-6"
            ref="profileForm"
            v-model="form.valid"
            lazy-validation
            :disabled="updateLoading || deleteLoading"
          >
            <yr-text-field
              v-model="form.fields.firstname"
              label="Firstname"
              counter="50"
              hint="*required"
              required
              :rules="form.rules.lastname"
              data-cy="firstname-input"
            ></yr-text-field>
            <yr-text-field
              v-model="form.fields.lastname"
              label="Lastname"
              counter="50"
              hint="*required"
              required
              :rules="form.rules.lastname"
              data-cy="lastname-input"
            ></yr-text-field>
            <yr-text-field
              v-model="form.fields.username"
              label="Username"
              counter="20"
              hint="*required"
              required
              :rules="form.rules.username"
              data-cy="username-input"
            ></yr-text-field>
            <v-row>
              <v-col class="text-right">
                <v-dialog
                  v-model="deleteDialog"
                  max-width="500px"
                  :persistent="deleteLoading"
                  retain-focus
                >
                  <template v-slot:activator="{ on, attrs }">
                    <yr-btn
                      color="error"
                      class="mr-4"
                      v-bind="attrs"
                      v-on="on"
                      :disabled="updateLoading"
                      data-cy="delete-btn"
                    >
                      Delete Profile
                    </yr-btn>
                  </template>

                  <yr-dialog-card>
                    <template #title>
                      Delete Action
                    </template>

                    <template #content>
                      Are you sure you want to delete Your Profile?
                    </template>

                    <template #actions>
                      <v-spacer></v-spacer>
                      <yr-btn
                        text
                        :disabled="deleteLoading"
                        @click="deleteDialog = false"
                        data-cy="cancel-delete-btn"
                      >
                        Cancel
                      </yr-btn>
                      <yr-btn
                        color="error"
                        :disabled="deleteLoading"
                        :loading="deleteLoading"
                        text
                        @click="deleteAct"
                        data-cy="confirm-delete-btn"
                      >
                        Delete
                      </yr-btn>
                    </template>
                  </yr-dialog-card>
                </v-dialog>

                <yr-btn
                  :disabled="!updateEnabled"
                  :loading="updateLoading"
                  @click="update"
                  data-cy="update-btn"
                >
                  Update
                </yr-btn>
              </v-col>
            </v-row>
          </v-form>
        </v-tab-item>

        <yr-icon-text-tab title="Password" icon="mdi-lock" />
        <v-tab-item key="rare">
          <v-form
            class="pt-6"
            ref="profileForm"
            v-model="form.valid"
            lazy-validation
            :disabled="updateLoading || deleteLoading"
          >
            <yr-password-field
              label="Password"
              no-prepend-icon="true"
              data-cy="password-input"
            ></yr-password-field>
            <yr-password-field
              label="New Password"
              no-prepend-icon="true"
              data-cy="new-password-input"
            ></yr-password-field>
            <yr-password-field
              label="Confirm New Password"
              no-prepend-icon="true"
              data-cy="confirmpassword-input"
            ></yr-password-field>
            <v-row>
              <v-col class="text-right">
                <yr-btn>
                  Update
                </yr-btn>
              </v-col>
            </v-row>
          </v-form>
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

import { YrForm } from '@/components'

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
    YrForm,
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
