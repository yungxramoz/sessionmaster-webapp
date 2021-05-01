import axios, { AxiosResponse } from 'axios'

import { BoardGameModel } from '@/models/data/boardgame'

import authHeader from './auth-header'

const API_URL = process.env.VUE_APP_BASE_API_URL + 'users/'

class CollectionService {
  getCollection(userId: string): Promise<BoardGameModel[]> {
    return axios
      .get(`${API_URL}${userId}/boardgames`, { headers: authHeader() })
      .then((response: AxiosResponse<BoardGameModel[]>) => {
        return response.data
      })
  }

  addToCollection(userId: string, boardGameId: string) {
    return axios.put(`${API_URL}${userId}/boardgames`, { boardGameId }, { headers: authHeader() })
  }

  removeFromCollection(userId: string, boardGameId: string) {
    return axios.delete(`${API_URL}${userId}/boardgames/${boardGameId}`, { headers: authHeader() })
  }
}

export default new CollectionService()
