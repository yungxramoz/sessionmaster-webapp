import { BoardGameModel } from '@/models/data/boardgame'

export default interface SuggestionState {
  inCollection: BoardGameModel[] | null
  others: BoardGameModel[] | null
}

export { SuggestionState }
