import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

import BoardGameService from '@/services/boardgame-service'

import { BoardGameModel } from '@/models/data/boardgame'
import BoardGameState from '@/models/state/boardgame-state'

import { promiseErrorHandler } from '@/helpers/promise-error-handler'

@Module({ namespaced: true, name: 'boardgame' })
class BoardGameModule extends VuexModule {
  public boardGameState: BoardGameState = {
    usersCollection: null,
  }

  @Mutation
  public fetchCollectionSuccess(collection: BoardGameModel[]): void {
    this.boardGameState.usersCollection = collection
  }

  @Mutation
  public fetchCollectionFailure(): void {
    this.boardGameState.usersCollection = null
  }

  @Action({ rawError: true })
  public fetchCollection(userId: string): Promise<any> {
    return BoardGameService.getCollection(userId).then(
      (collection: BoardGameModel[]) => {
        this.fetchCollectionSuccess(collection)
        return Promise.resolve(collection)
      },
      error => {
        return promiseErrorHandler(error, this.fetchCollectionFailure)
      }
    )
  }

  get collection(): BoardGameModel[] {
    if (this.boardGameState.usersCollection) {
      return this.boardGameState.usersCollection
    }
    return []
  }
}

export default BoardGameModule
