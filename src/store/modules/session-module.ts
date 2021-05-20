import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

import SessionService from '@/services/session-service'

import SessionState from '@/models/state/session-state'
import { SessionModel, UserResponseSessionModel } from '@/models/data/session'

import { promiseErrorHandler } from '@/helpers/promise-error-handler'

@Module({ namespaced: true, name: 'session' })
class SessionModule extends VuexModule {
  public sessionState: SessionState = {
    currentSession: null,
    guestName: null,
  }

  @Mutation
  public fetchSessionSuccess(session: SessionModel): void {
    this.sessionState.currentSession = session
  }

  @Mutation
  public fetchSessionFailure(): void {
    this.sessionState.currentSession = null
  }

  @Mutation
  public registerSuccess(session: SessionModel): void {
    this.sessionState.currentSession = session
  }

  @Mutation
  public registerFailure(): void {}

  @Mutation
  public cancelSuccess(session: SessionModel): void {
    this.sessionState.currentSession = session
  }

  @Mutation
  public cancelFailure(): void {}

  @Mutation
  public updateGuestNameSuccess(name: string): void {
    this.sessionState.guestName = name
  }

  @Action({ rawError: true })
  public fetch(id: string): Promise<any> {
    return SessionService.getSession(id).then(
      (session: SessionModel) => {
        this.fetchSessionSuccess(session)
        return Promise.resolve(session)
      },
      error => {
        return promiseErrorHandler(error, this.fetchSessionFailure)
      }
    )
  }

  @Action({ rawError: true })
  public register(): Promise<any> {
    const model = {
      name: this.sessionState.guestName,
    } as UserResponseSessionModel

    return SessionService.registerToSession(this.currentOpen.id, model).then(
      (session: SessionModel) => {
        this.registerSuccess(session)
        return Promise.resolve(session)
      },
      error => {
        return promiseErrorHandler(error, this.registerFailure)
      }
    )
  }

  @Action({ rawError: true })
  public cancel(): Promise<any> {
    const model = {
      name: this.sessionState.guestName,
    } as UserResponseSessionModel

    return SessionService.cancelFromSession(this.currentOpen.id, model).then(
      (session: SessionModel) => {
        this.cancelSuccess(session)
        return Promise.resolve(session)
      },
      error => {
        return promiseErrorHandler(error, this.cancelFailure)
      }
    )
  }

  @Action({ rawError: true })
  public updateGuestName(name: string): void {
    this.updateGuestNameSuccess(name)
  }

  get currentOpen(): SessionModel {
    if (this.sessionState.currentSession) {
      return this.sessionState.currentSession
    }
    return {} as SessionModel
  }
}

export default SessionModule
