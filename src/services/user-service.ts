import axios from 'axios'

import { UserModel, UpdateUserModel } from '@/models/data/user'

import authHeader from './auth-header'

const API_URL = process.env.VUE_APP_BASE_API_URL + 'users/'

class UserService {
  async getUsers(): Promise<UserModel[]> {
    const response = await axios.get(API_URL, { headers: authHeader() })
    return response.data
  }

  async getUser(id: string): Promise<UserModel> {
    const response = await axios.get(`${API_URL}${id}`, { headers: authHeader() })
    return response.data
  }

  updateUser(id: string, data: UpdateUserModel) {
    return axios.put(`${API_URL}${id}`, data, { headers: authHeader() })
  }

  deleteUser(id: string) {
    return axios.delete(`${API_URL}${id}`, { headers: authHeader() })
  }
}

export default new UserService()
