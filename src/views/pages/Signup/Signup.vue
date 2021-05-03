<template>
  <yr-form title="Create new Account" :message="message" :messageType="messageType">
    <template #form>
      <v-form ref="signupForm" v-model="form.valid" lazy-validation :disabled="loading">
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
        <yr-password-field
          v-model="form.fields.password"
          label="Password"
          no-prepend-icon="true"
          :rules="form.rules.password"
          data-cy="password-input"
        ></yr-password-field>
        <yr-password-field
          v-model="form.fields.confirmPassword"
          label="Confirm Password"
          no-prepend-icon="true"
          :rules="form.rules.confirmPassword"
          @keyup.enter="register"
          data-cy="confirmpassword-input"
        ></yr-password-field>
        <div class="text-center">
          <yr-btn
            width="180px"
            :disabled="!form.valid || loading"
            :loading="loading"
            @keyup.enter="register"
            @click="register"
            data-cy="signup-btn"
          >
            Sign up
          </yr-btn>
        </div>
      </v-form>
    </template>

    <template #footer>
      <v-spacer></v-spacer>
      <span class="caption"
        >Already have an account? <router-link to="/login">Login here</router-link>.
      </span>
      <v-spacer></v-spacer>
    </template>
  </yr-form>
</template>

<script lang="ts">
import { Component, Ref, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'
import { InputValidationRule } from 'vuetify'

import AuthModule from '@/store/modules/auth-module'

import { maxCharRule, minCharRule, passwordRule, requiredRule } from '@/helpers/form-rules'

import { VForm } from '@/models/types'
import { RegistrationModel } from '@/models/data/user'
import FormDefinition from '@/models/form-definition'

interface Form extends FormDefinition {
  valid: false
  fields: RegistrationModel & {
    confirmPassword: string
  }
  rules?: {
    firstname: InputValidationRule[]
    lastname: InputValidationRule[]
    username: InputValidationRule[]
    password: InputValidationRule[]
    confirmPassword: InputValidationRule[]
  }
}

@Component
export default class Signup extends Vue {
  @Ref() readonly signupForm!: VForm

  private form: Form = {
    valid: false,
    fields: {
      firstname: '',
      lastname: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  }
  private loading: boolean = false
  private message?: string = ''
  private messageType?: string = 'info'
  private auth: AuthModule = getModule(AuthModule, this.$store)

  beforeMount() {
    this.form.rules = {
      firstname: [requiredRule(), maxCharRule(50)],
      lastname: [requiredRule(), maxCharRule(50)],
      username: [requiredRule(), maxCharRule(20)],
      password: [requiredRule(), minCharRule(8), passwordRule()],
      confirmPassword: [this.passwordConfirmCustRule],
    }
  }

  // confirm password rule has to be a computed prop
  get passwordConfirmCustRule() {
    return () =>
      this.form.fields.password === this.form.fields.confirmPassword || 'Password must match'
  }

  async register() {
    if (this.signupForm.validate()) {
      this.loading = true
      this.message = ''
      await this.auth
        .register(this.form.fields)
        .then(
          () => {
            this.$router.push('/collection')
          },
          error => {
            this.message = error
            this.messageType = 'error'
          }
        )
        .finally(() => {
          this.loading = false
        })
    }
  }
}
</script>
