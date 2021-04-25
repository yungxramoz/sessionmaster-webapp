import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

import UserService from '@/services/user-service'

import { UserModel, UpdateUserModel } from '@/models/data/user'
import { AccountState } from '@/models/state/account-state'

import { promiseErrorHandler } from '@/helpers/promise-error-handler'

@Module({ namespaced: true, name: 'account' })
class AccountModule extends VuexModule {
  public accountState: AccountState = {
    accountData: null,
  }

  @Mutation
  public fetchSuccess(user: UserModel): void {
    this.accountState.accountData = user
  }

  @Mutation
  public fetchFailure(): void {
    this.accountState.accountData = null
  }

  @Mutation
  public updateSuccess(user: UpdateUserModel): void {
    if (this.accountState.accountData) {
      this.accountState.accountData = Object.assign({}, this.accountState.accountData, user)
    }
  }

  @Mutation
  public updateFailure(): void {}

  @Mutation
  public deleteSuccess(): void {
    this.accountState.accountData = null
  }

  @Mutation
  public deleteFailure(): void {}

  @Action({ rawError: true })
  public fetch(id: string): Promise<any> {
    return UserService.getUser(id).then(
      (user: UserModel) => {
        this.fetchSuccess(user)
        return Promise.resolve(user)
      },
      error => {
        return promiseErrorHandler(error, this.fetchFailure)
      }
    )
  }

  @Action({ rawError: true })
  public update(updateData: { id: string; data: UpdateUserModel }): Promise<any> {
    return UserService.updateUser(updateData.id, updateData.data).then(
      () => {
        this.updateSuccess(updateData.data)
        return Promise.resolve(updateData.data)
      },
      error => {
        return promiseErrorHandler(error, this.updateFailure)
      }
    )
  }

  @Action({ rawError: true })
  public delete(id: string): Promise<any> {
    return UserService.deleteUser(id).then(
      response => {
        this.deleteSuccess()
        return Promise.resolve(response.data)
      },
      error => {
        return promiseErrorHandler(error, this.deleteFailure)
      }
    )
  }

  get currentUser(): UserModel {
    const user = this.accountState.accountData
    return user ? user : ({} as UserModel)
  }
}

export default AccountModule
