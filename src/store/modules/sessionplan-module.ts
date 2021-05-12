import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

import SessionplanService from '@/services/sessionplan-service'

import SessionplanState from '@/models/state/sessionplan-state'
import {
  SessionplanOverviewModel,
  SessionplanDetailModel,
  AddSessionplanModel,
} from '@/models/data/sessionplan'

import { promiseErrorHandler } from '@/helpers/promise-error-handler'

@Module({ namespaced: true, name: 'sessionplan' })
class SessionplanModule extends VuexModule {
  public sessionplanState: SessionplanState = {
    sessionplans: null,
    openSessionplan: null,
  }

  @Mutation
  public fetchSessionplansSuccess(sessionplans: SessionplanOverviewModel[]): void {
    this.sessionplanState.sessionplans = sessionplans
  }

  @Mutation
  public fetchSessionplansFailure(): void {
    this.sessionplanState.sessionplans = null
  }

  @Mutation
  public openDetailsSuccess(details: SessionplanDetailModel): void {
    this.sessionplanState.openSessionplan = details
  }

  @Mutation
  public openDetailsFailure(): void {
    this.sessionplanState.openSessionplan = null
  }

  @Mutation
  public deleteSuccess(sessionplanId: string): void {
    const deleteIndex = this.sessionplanState.sessionplans?.findIndex(
      plan => plan.id == sessionplanId
    )
    if (deleteIndex) {
      this.sessionplanState.sessionplans?.splice(deleteIndex, 1)
    }
  }

  @Mutation
  public deleteFailure(): void {}

  @Mutation
  public createSuccess(sessionplan: SessionplanDetailModel): void {
    this.sessionplanState.openSessionplan = sessionplan
  }

  @Mutation
  public createFailure(): void {}

  @Action({ rawError: true })
  public fetchOwned(): Promise<any> {
    return SessionplanService.getOwnedSessionplans().then(
      (sessionplans: SessionplanOverviewModel[]) => {
        this.fetchSessionplansSuccess(sessionplans)
        return Promise.resolve(sessionplans)
      },
      error => {
        return promiseErrorHandler(error, this.fetchSessionplansFailure)
      }
    )
  }

  @Action({ rawError: true })
  public openDetails(sessionplanId: string): Promise<any> {
    return SessionplanService.getSessionplan(sessionplanId).then(
      (sessionplan: SessionplanDetailModel) => {
        this.openDetailsSuccess(sessionplan)
        return Promise.resolve(sessionplan)
      },
      error => {
        return promiseErrorHandler(error, this.openDetailsFailure)
      }
    )
  }

  @Action({ rawError: true })
  public create(sessioplan: AddSessionplanModel): Promise<any> {
    return SessionplanService.addSessionplan(sessioplan).then(
      (response: SessionplanDetailModel) => {
        this.createSuccess(response)
        return Promise.resolve(response)
      },
      error => {
        return promiseErrorHandler(error, this.createFailure)
      }
    )
  }

  @Action({ rawError: true })
  public delete(sessionplanId: string): Promise<any> {
    return SessionplanService.deleteSessionplan(sessionplanId).then(
      response => {
        this.deleteSuccess(sessionplanId)
        return Promise.resolve(response.data)
      },
      error => {
        return promiseErrorHandler(error, this.deleteFailure)
      }
    )
  }

  get owned(): SessionplanOverviewModel[] {
    if (this.sessionplanState.sessionplans) {
      return this.sessionplanState.sessionplans
    }
    return []
  }

  get currentOpen(): SessionplanDetailModel {
    if (this.sessionplanState.openSessionplan) {
      return this.sessionplanState.openSessionplan
    }
    return {} as SessionplanDetailModel
  }
}

export default SessionplanModule
