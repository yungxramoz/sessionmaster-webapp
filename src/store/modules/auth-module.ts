import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

import AuthService from '@/services/auth-service'

import { AuthenticationModel, UserModel, RegistrationModel } from '@/models/data/user'
import { AuthState } from '@/models/state/auth-state'

import { promiseErrorHandler } from '@/helpers/promise-error-handler'

const userId = localStorage.getItem('id')
const accessToken = localStorage.getItem('accessToken')

@Module({ namespaced: true, name: 'auth' })
class AuthModule extends VuexModule {
  public authState: AuthState = {
    loggedIn: accessToken && userId ? true : false,
    userId: userId ? JSON.parse(userId) : null,
    accessToken: accessToken ? JSON.parse(accessToken) : null,
  }

  @Mutation
  public loginSuccess(user: UserModel): void {
    this.authState.loggedIn = true
    this.authState.userId = user.id
  }

  @Mutation
  public loginFailure(): void {
    this.authState.loggedIn = false
    this.authState.userId = null
  }

  @Mutation
  public logoutSuccess(): void {
    this.authState.loggedIn = false
    this.authState.userId = null
  }

  @Mutation
  public registerSuccess(): void {
    this.authState.loggedIn = false
  }

  @Mutation
  public registerFailure(): void {
    this.authState.loggedIn = false
  }

  @Action({ rawError: true })
  public login(data: AuthenticationModel): Promise<any> {
    return AuthService.login(data).then(
      (user: UserModel) => {
        this.loginSuccess(user)
        return Promise.resolve(user)
      },
      error => {
        return promiseErrorHandler(error, this.loginFailure)
      }
    )
  }

  @Action
  public logout(): void {
    AuthService.logout()
    this.logoutSuccess()
  }

  @Action({ rawError: true })
  public async register(data: RegistrationModel): Promise<any> {
    return AuthService.register(data).then(
      () => {
        this.registerSuccess()
        const username = data.username
        const password = data.password
        return this.login({ username, password }).then(
          response => {
            return Promise.resolve(response.data)
          },
          error => {
            return promiseErrorHandler(error, this.loginFailure)
          }
        )
      },
      error => {
        return promiseErrorHandler(error, this.registerFailure)
      }
    )
  }

  get isLoggedIn(): boolean {
    const loggedIn = this.authState.loggedIn
    return loggedIn ? loggedIn : false
  }

  get userId(): string {
    const id = this.authState.userId
    return id ? id : ''
  }
}
export default AuthModule
