import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

import UserService from '@/services/user-service'

import { UserModel } from '@/models/data/user'

import { promiseErrorHandler } from '@/helpers/promise-error-handler'

@Module({ namespaced: true, name: 'user' })
class UserModule extends VuexModule {
  public users: UserModel[] | null = null

  @Mutation
  public fetchUsersSuccess(users: UserModel[]): void {
    this.users = users
  }

  @Mutation
  public fetchUsersFailure(): void {
    this.users = null
  }

  @Action({ rawError: true })
  public fetchUsers(): Promise<any> {
    return UserService.getUsers().then(
      (users: UserModel[]) => {
        this.fetchUsersSuccess(users)
        return Promise.resolve(users)
      },
      error => {
        return promiseErrorHandler(error, this.fetchUsersFailure)
      }
    )
  }

  get all(): UserModel[] {
    if (this.users) {
      return this.users
    }
    return []
  }
}

export default UserModule
