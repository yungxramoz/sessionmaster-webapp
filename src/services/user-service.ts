import axios, { AxiosResponse } from 'axios'

import { UserModel, UpdateUserModel } from '@/models/data/user'

import authHeader from './auth-header'

const API_URL = process.env.VUE_APP_BASE_API_URL + 'users/'

class UserService {
  getUsers(): Promise<UserModel[]> {
    return axios
      .get(API_URL, { headers: authHeader() })
      .then((response: AxiosResponse<UserModel[]>) => {
        return response.data
      })
  }

  getUser(id: string): Promise<UserModel> {
    return axios
      .get(`${API_URL}${id}`, { headers: authHeader() })
      .then((response: AxiosResponse<UserModel>) => {
        return response.data
      })
  }

  updateUser(id: string, data: UpdateUserModel) {
    return axios.put(`${API_URL}${id}`, data, { headers: authHeader() })
  }

  deleteUser(id: string) {
    return axios.delete(`${API_URL}${id}`, { headers: authHeader() })
  }
}

export default new UserService()
