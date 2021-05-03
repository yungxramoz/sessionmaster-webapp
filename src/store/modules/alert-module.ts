import { VuexModule, Module, Action, Mutation } from 'vuex-module-decorators'

import AlertState from '@/models/state/alert-state'

@Module({ namespaced: true, name: 'alert' })
class AlertModule extends VuexModule {
  public alertState: AlertState = {
    message: '',
    type: '',
  }

  @Mutation
  public mutateType(type: string): void {
    this.alertState.type = type
  }

  @Mutation
  public mutateMessage(message: string): void {
    this.alertState.message = message
  }

  @Mutation
  public resetAlert(): void {
    this.alertState.type = ''
    this.alertState.message = ''
  }

  @Action
  async setType(type: string) {
    this.mutateType(type)
  }

  @Action
  async setMessage(message: string) {
    this.mutateMessage(message)
  }

  @Action
  async reset() {
    this.resetAlert()
  }
}

export default AlertModule
