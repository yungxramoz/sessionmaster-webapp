import axios from 'axios'

import { AddToCollectionModel, BoardGameModel } from '@/models/data/boardgame'

import authHeader from './auth-header'

const API_URL_BOARDGAME = process.env.VUE_APP_BASE_API_URL + 'boardgames/'
const API_URL_COLLECTION = process.env.VUE_APP_BASE_API_URL + 'users/'

class BoardGameService {
  async getBoardGames(name?: string): Promise<BoardGameModel[]> {
    const params = {
      name: name,
    }
    const response = await axios.get(API_URL_BOARDGAME, { params })
    return response.data
  }

  async getBoardGame(id: string): Promise<BoardGameModel> {
    const response = await axios.get(`${API_URL_BOARDGAME}${id}`)
    return response.data
  }

  async getCollection(userId: string): Promise<BoardGameModel[]> {
    const response = await axios.get(`${API_URL_COLLECTION}${userId}/boardgames`, {
      headers: authHeader(),
    })
    return response.data
  }

  async addToCollection(userId: string, boardGame: AddToCollectionModel) {
    const response = await axios.post(`${API_URL_COLLECTION}${userId}/boardgames`, boardGame, {
      headers: authHeader(),
    })
    return response.data
  }

  async removeFromCollection(userId: string, boardGameId: string) {
    const response = await axios.delete(
      `${API_URL_COLLECTION}${userId}/boardgames/${boardGameId}`,
      {
        headers: authHeader(),
      }
    )
    return response.data
  }
}

export default new BoardGameService()
