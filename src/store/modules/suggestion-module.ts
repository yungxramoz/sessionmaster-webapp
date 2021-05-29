import { VuexModule, Module, Mutation, Action } from 'vuex-module-decorators'

import BoardGameService from '@/services/boardgame-service'

import { BoardGameModel, AddToCollectionModel } from '@/models/data/boardgame'
import SuggestionState from '@/models/state/suggestion-state'

import { promiseErrorHandler } from '@/helpers/promise-error-handler'

@Module({ namespaced: true, name: 'suggestion' })
class SuggestionModule extends VuexModule {
  public suggestionState: SuggestionState = {
    inCollection: null,
    others: null,
  }

  @Mutation
  public fetchInCollectionSuccess(suggestion: BoardGameModel[]): void {
    this.suggestionState.inCollection = suggestion
  }

  @Mutation
  public fetchInCollectionFailure(): void {
    this.suggestionState.inCollection = null
  }

  @Mutation
  public fetchBoardGamesSuccess(suggestion: BoardGameModel[]): void {
    this.suggestionState.others = suggestion
  }

  @Mutation
  public fetchBoardGamesFailure(): void {
    this.suggestionState.others = null
  }

  @Mutation
  public removeFromCollectionFailure(): void {}

  @Action({ rawError: true })
  public fetchBySession(sessionId: string): Promise<any> {
    return BoardGameService.getSuggestion(sessionId).then(
      (suggestion: BoardGameModel[]) => {
        this.fetchInCollectionSuccess(suggestion)
        return Promise.resolve(suggestion)
      },
      error => {
        return promiseErrorHandler(error, this.fetchInCollectionFailure)
      }
    )
  }

  @Action({ rawError: true })
  public fetchAllSuggestions(playerCount?: number): Promise<any> {
    return BoardGameService.getBoardGames(undefined, playerCount).then(
      (boardGames: BoardGameModel[]) => {
        this.fetchBoardGamesSuccess(boardGames)
        return Promise.resolve(boardGames)
      },
      error => {
        return promiseErrorHandler(error, this.fetchBoardGamesFailure)
      }
    )
  }

  get allInCollection(): BoardGameModel[] {
    if (this.suggestionState.inCollection) {
      return this.suggestionState.inCollection
    }
    return []
  }

  get allOthers(): BoardGameModel[] {
    if (this.suggestionState.others) {
      return this.suggestionState.others.filter(game => !this.allInCollection.includes(game))
    }
    return []
  }
}

export default SuggestionModule
