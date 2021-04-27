<template>
  <yr-form title="Login" :message="message" :messageType="messageType">
    <template #form>
      <v-form ref="loginForm" v-model="form.valid" :disabled="loading">
        <yr-text-field
          v-model="form.fields.username"
          label="Username"
          prepend-icon="mdi-account"
          required
          :rules="form.rules.username"
          data-cy="username-input"
        ></yr-text-field>
        <yr-password-field
          v-model="form.fields.password"
          label="Password"
          required
          :rules="form.rules.password"
          @keyup.enter="login"
          data-cy="password-input"
        ></yr-password-field>
        <div class="text-center">
          <yr-btn
            width="180px"
            @click="login"
            :loading="loading"
            :disabled="loading"
            data-cy="login-btn"
          >
            Login
          </yr-btn>
        </div>
      </v-form>
    </template>

    <template #footer>
      <v-spacer></v-spacer>
      <span class="caption">
        Don't have an account yet?
        <router-link to="/signup" data-cy="to-signup-link">Sign up here</router-link>.
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

import { requiredRule } from '@/helpers/form-rules'

import { VForm } from '@/models/types'
import FormDefinition from '@/models/form-definition'
import { AuthenticationModel } from '@/models/data/user'

import { YrForm } from '@/components'

interface Form extends FormDefinition {
  valid: false
  fields: AuthenticationModel
  rules?: {
    username: InputValidationRule[]
    password: InputValidationRule[]
  }
}

@Component({
  components: {
    YrForm,
  },
})
export default class Login extends Vue {
  @Ref() readonly loginForm!: VForm

  private form: Form = {
    valid: false,
    fields: {
      username: '',
      password: '',
    } as AuthenticationModel,
    rules: {
      username: [requiredRule()],
      password: [requiredRule()],
    },
  }
  private loading: boolean = false
  private message?: string = ''
  private messageType?: string = 'info'
  private auth: AuthModule = getModule(AuthModule, this.$store)

  async login() {
    if (this.loginForm.validate()) {
      this.loading = true
      this.message = ''
      await this.auth
        .login(this.form.fields)
        .then(
          () => {
            this.$router.push('/users')
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
