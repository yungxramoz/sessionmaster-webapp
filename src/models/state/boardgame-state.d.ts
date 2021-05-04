import { BoardGameModel } from '@/models/data/boardgame'

export default interface BoardGameState {
  usersCollection: BoardGameModel[] | null
  boardGames: BoardGameModel[] | null
}

export { BoardGameState }
