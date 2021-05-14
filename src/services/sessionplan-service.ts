import axios from 'axios'

import {
  AddSessionplanModel,
  SessionplanDetailModel,
  SessionplanOverviewModel,
  UpdateSessionplanModel,
} from '@/models/data/sessionplan'

import authHeader from './auth-header'

const API_URL = process.env.VUE_APP_BASE_API_URL + 'sessionplans/'

class SessionplanService {
  async getOwnedSessionplans(): Promise<SessionplanOverviewModel[]> {
    const response = await axios.get(API_URL, { headers: authHeader() })
    return response.data
  }

  async getSessionplan(id: string): Promise<SessionplanDetailModel> {
    const response = await axios.get(`${API_URL}${id}`)
    return response.data
  }

  async addSessionplan(sessionplan: AddSessionplanModel): Promise<SessionplanDetailModel> {
    const response = await axios.post(API_URL, sessionplan, { headers: authHeader() })
    return response.data
  }

  async updateSessionplan(
    id: string,
    sessionplan: UpdateSessionplanModel
  ): Promise<SessionplanDetailModel> {
    const response = await axios.put(`${API_URL}${id}`, sessionplan, { headers: authHeader() })
    return response.data
  }

  deleteSessionplan(id: string) {
    return axios.delete(`${API_URL}${id}`, { headers: authHeader() })
  }
}

export default new SessionplanService()
