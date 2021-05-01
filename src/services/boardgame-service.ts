import axios, { AxiosResponse } from 'axios'

import { BoardGameModel } from '@/models/data/boardgame'

const API_URL = process.env.VUE_APP_BASE_API_URL + 'boardgames/'

class BoardGameService {
  getBoardGames(name?: string): Promise<BoardGameModel[]> {
    const params = {
      name: name,
    }
    return axios.get(API_URL, { params }).then((response: AxiosResponse<BoardGameModel[]>) => {
      return response.data
    })
  }

  getBoardGame(id: string): Promise<BoardGameModel> {
    return axios.get(`${API_URL}${id}`).then((response: AxiosResponse<BoardGameModel>) => {
      return response.data
    })
  }
}

export default new BoardGameService()
