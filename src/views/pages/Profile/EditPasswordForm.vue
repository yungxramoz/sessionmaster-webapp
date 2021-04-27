<template>
  <yr-form :message="message" :messageType="messageType">
    <template #form>
      <v-form
        class="pt-6"
        ref="passwordForm"
        v-model="form.valid"
        lazy-validation
        :disabled="updateLoading"
      >
        <yr-password-field
          v-model="form.fields.password"
          label="New Password"
          no-prepend-icon="true"
          :rules="form.rules.password"
          data-cy="password-input"
        ></yr-password-field>
        <yr-password-field
          v-model="form.fields.confirmPassword"
          label="Confirm New Password"
          no-prepend-icon="true"
          :rules="form.rules.confirmPassword"
          @enter="update"
          data-cy="confirmpassword-input"
        ></yr-password-field>
        <v-row>
          <v-col class="text-right">
            <yr-btn
              :disabled="!updateEnabled"
              :loading="updateLoading"
              @click="update"
              data-cy="update-password-btn"
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
import AccountModule from '@/store/modules/account-module'

import { minCharRule, passwordRule, requiredRule } from '@/helpers/form-rules'

import { VForm } from '@/models/types'
import { UpdateUserModel, UserModel } from '@/models/data/user'
import FormDefinition from '@/models/form-definition'

interface Form extends FormDefinition {
  valid: false
  fields: UpdateUserModel & {
    confirmPassword?: string
  }
  rules?: {
    password: InputValidationRule[]
    confirmPassword: InputValidationRule[]
  }
}

@Component
export default class EditPasswordForm extends Vue {
  @Ref() readonly passwordForm!: VForm

  private form: Form = {
    valid: false,
    fields: {
      password: '',
      confirmPassword: '',
    },
  }
  private updateLoading: boolean = false
  private message?: string = ''
  private messageType?: string = 'info'

  private auth: AuthModule = getModule(AuthModule, this.$store)
  private account: AccountModule = getModule(AccountModule, this.$store)

  created() {
    this.form.rules = {
      password: [requiredRule(), minCharRule(8), passwordRule()],
      confirmPassword: [this.passwordConfirmCustRule],
    }
  }

  // confirm password rule has to be a computed prop
  get passwordConfirmCustRule() {
    return () =>
      this.form.fields.password === this.form.fields.confirmPassword || 'Password must match'
  }

  get updateEnabled(): boolean {
    return (
      this.form.fields.password != '' &&
      this.form.fields.confirmPassword != '' &&
      this.form.valid &&
      !this.updateLoading
    )
  }

  async update() {
    if (this.passwordForm.validate()) {
      this.updateLoading = true
      this.message = ''

      const updateData = {
        id: this.auth.userId,
        data: this.form.fields,
      }

      this.account
        .update(updateData)
        .then(
          (_response: UpdateUserModel) => {
            this.message = 'Successfully updated password'
            this.messageType = 'success'

            // this.passwordForm.reset() throws console errors on rules
            this.form.fields.password = ''
            this.form.fields.confirmPassword = ''
            this.passwordForm.resetValidation()
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
}
</script>
