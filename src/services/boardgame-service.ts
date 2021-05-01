import axios, { AxiosResponse } from 'axios'

import { BoardGameModel } from '@/models/data/boardgame'

import authHeader from './auth-header'

const API_URL_BOARDGAME = process.env.VUE_APP_BASE_API_URL + 'boardgames/'
const API_URL_COLLECTION = process.env.VUE_APP_BASE_API_URL + 'users/'

class BoardGameService {
  getBoardGames(name?: string): Promise<BoardGameModel[]> {
    const params = {
      name: name,
    }
    return axios
      .get(API_URL_BOARDGAME, { params })
      .then((response: AxiosResponse<BoardGameModel[]>) => {
        return response.data
      })
  }

  getBoardGame(id: string): Promise<BoardGameModel> {
    return axios
      .get(`${API_URL_BOARDGAME}${id}`)
      .then((response: AxiosResponse<BoardGameModel>) => {
        return response.data
      })
  }

  getCollection(userId: string): Promise<BoardGameModel[]> {
    return axios
      .get(`${API_URL_COLLECTION}${userId}/boardgames`, { headers: authHeader() })
      .then((response: AxiosResponse<BoardGameModel[]>) => {
        return response.data
      })
  }

  addToCollection(userId: string, boardGameId: string) {
    return axios.put(
      `${API_URL_COLLECTION}${userId}/boardgames`,
      { boardGameId },
      { headers: authHeader() }
    )
  }

  removeFromCollection(userId: string, boardGameId: string) {
    return axios.delete(`${API_URL_COLLECTION}${userId}/boardgames/${boardGameId}`, {
      headers: authHeader(),
    })
  }
}

export default new BoardGameService()
