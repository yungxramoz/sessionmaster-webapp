import { BoardGameModel } from '@/models/data/boardgame'

export default interface BoardGameState {
  usersCollection: BoardGameModel[] | null
}

export { BoardGameState }
