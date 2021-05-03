<template>
  <yr-form>
    <template #form>
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
                  v-bind="attrs"
                  v-on="on"
                  :disabled="updateLoading"
                  data-cy="delete-btn"
                >
                  Delete
                </yr-btn>
              </template>

              <yr-dialog-card>
                <template #title>
                  Delete Profile
                </template>

                <template #content>
                  Are you sure you want to delete your Session Master profile?
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
              class="ml-3"
              :disabled="!updateEnabled"
              :loading="updateLoading"
              @click="update"
              data-cy="update-profile-btn"
            >
              Update
            </yr-btn>
          </v-col>
        </v-row>
      </v-form>
    </template>
  </yr-form>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import { InputValidationRule } from 'vuetify'

import AuthModule from '@/store/modules/auth-module'
import AlertModule from '@/store/modules/alert-module'
import AccountModule from '@/store/modules/account-module'

import { maxCharRule, requiredRule } from '@/helpers/form-rules'
import { cloneSource } from '@/helpers/clone'

import { VForm } from '@/models/types'
import { UpdateUserModel, UserModel } from '@/models/data/user'
import FormDefinition from '@/models/form-definition'

interface Form extends FormDefinition {
  valid: false
  fields: UpdateUserModel
  rules?: {
    firstname: InputValidationRule[]
    lastname: InputValidationRule[]
    username: InputValidationRule[]
  }
}

@Component
export default class EditProfileForm extends Vue {
  @Ref() readonly profileForm!: VForm

  private form: Form = {
    valid: false,
    fields: {
      firstname: '',
      lastname: '',
      username: '',
    },
  }
  private updateLoading: boolean = false
  private deleteLoading: boolean = false
  private deleteDialog: boolean = false

  private auth: AuthModule = getModule(AuthModule, this.$store)
  private alert: AlertModule = getModule(AlertModule, this.$store)
  private account: AccountModule = getModule(AccountModule, this.$store)

  created() {
    this.form.rules = {
      firstname: [requiredRule(), maxCharRule(50)],
      lastname: [requiredRule(), maxCharRule(50)],
      username: [requiredRule(), maxCharRule(20)],
    }

    this.updateLoading = true

    this.account
      .fetch(this.auth.userId)
      .then(
        (response: UserModel) => {
          this.form.fields = cloneSource(response)
        },
        error => {
          this.alert.setMessage(error)
          this.alert.setType('error')
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
      this.alert.reset()

      const updateData = {
        id: this.auth.userId,
        data: this.form.fields,
      }

      this.account
        .update(updateData)
        .then(
          (response: UpdateUserModel) => {
            this.alert.setMessage('Successfully updated profile')
            this.alert.setType('success')
            this.form.fields = cloneSource(response)
          },
          (error: string) => {
            this.alert.setMessage(error)
            this.alert.setType('error')
          }
        )
        .finally(() => {
          this.updateLoading = false
        })
    }
  }

  async deleteAct() {
    this.deleteLoading = true
    this.alert.reset()

    this.account
      .delete(this.auth.userId)
      .then(
        () => {
          this.auth.logout()
          this.$router.push('/')
        },
        error => {
          this.alert.setMessage(error)
          this.alert.setType('error')
        }
      )
      .finally(() => {
        this.deleteLoading = false
      })
  }
}
</script>
