import axios from 'axios'

import authHeader from './auth-header'
import { SessionModel, UserResponseSessionModel } from '@/models/data/session'

const API_URL = process.env.VUE_APP_BASE_API_URL + 'sessions/'

class SessionService {
  async getSession(id: string): Promise<SessionModel> {
    const response = await axios.get(`${API_URL}${id}`, { headers: authHeader() })
    return response.data
  }

  async registerToSession(
    id: string,
    userResponse: UserResponseSessionModel
  ): Promise<SessionModel> {
    const response = await axios.post(`${API_URL}${id}/register`, userResponse, {
      headers: authHeader(),
    })
    return response.data
  }

  async cancelFromSession(
    id: string,
    userResponse: UserResponseSessionModel
  ): Promise<SessionModel> {
    const response = await axios.post(`${API_URL}${id}/cancel`, userResponse, {
      headers: authHeader(),
    })
    return response.data
  }
}

export default new SessionService()
