import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

import BoardGameService from '@/services/boardgame-service'

import { BoardGameModel, AddToCollectionModel } from '@/models/data/boardgame'
import BoardGameState from '@/models/state/boardgame-state'

import { promiseErrorHandler } from '@/helpers/promise-error-handler'

@Module({ namespaced: true, name: 'boardgame' })
class BoardGameModule extends VuexModule {
  public boardGameState: BoardGameState = {
    usersCollection: null,
    boardGames: null,
  }

  @Mutation
  public fetchCollectionSuccess(collection: BoardGameModel[]): void {
    this.boardGameState.usersCollection = collection
  }

  @Mutation
  public fetchCollectionFailure(): void {
    this.boardGameState.usersCollection = null
  }

  @Mutation
  public fetchBoardGamesSuccess(collection: BoardGameModel[]): void {
    this.boardGameState.boardGames = collection
  }

  @Mutation
  public fetchBoardGamesFailure(): void {
    this.boardGameState.boardGames = null
  }

  @Mutation
  public addToCollectionSuccess(collection: BoardGameModel[]): void {
    this.boardGameState.usersCollection = collection
  }

  @Mutation
  public addToCollectionFailure(): void {}

  @Mutation
  public removeFromCollectionSuccess(collection: BoardGameModel[]): void {
    this.boardGameState.usersCollection = collection
  }

  @Mutation
  public removeFromCollectionFailure(): void {}

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

  @Action({ rawError: true })
  public fetchBoardGames(name?: string): Promise<any> {
    return BoardGameService.getBoardGames(name).then(
      (boardGames: BoardGameModel[]) => {
        this.fetchBoardGamesSuccess(boardGames)
        return Promise.resolve(boardGames)
      },
      error => {
        return promiseErrorHandler(error, this.fetchBoardGamesFailure)
      }
    )
  }

  @Action({ rawError: true })
  public addToCollection(addModel: { userId: string; boardGameId: string }): Promise<any> {
    const boardGame: AddToCollectionModel = {
      boardGameId: addModel.boardGameId,
    }
    return BoardGameService.addToCollection(addModel.userId, boardGame).then(
      (boardGames: BoardGameModel[]) => {
        this.addToCollectionSuccess(boardGames)
        return Promise.resolve(boardGames)
      },
      error => {
        return promiseErrorHandler(error, this.addToCollectionFailure)
      }
    )
  }

  @Action({ rawError: true })
  public removeFromCollection(removeModel: { userId: string; boardGameId: string }): Promise<any> {
    return BoardGameService.removeFromCollection(removeModel.userId, removeModel.boardGameId).then(
      (boardGames: BoardGameModel[]) => {
        this.removeFromCollectionSuccess(boardGames)
        return Promise.resolve(boardGames)
      },
      error => {
        return promiseErrorHandler(error, this.removeFromCollectionFailure)
      }
    )
  }

  get collection(): BoardGameModel[] {
    if (this.boardGameState.usersCollection) {
      return this.boardGameState.usersCollection
    }
    return []
  }

  get allSearched(): BoardGameModel[] {
    if (this.boardGameState.boardGames) {
      return this.boardGameState.boardGames
    }
    return []
  }
}

export default BoardGameModule
