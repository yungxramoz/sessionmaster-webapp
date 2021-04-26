import axios, { AxiosResponse } from 'axios'

import { AuthenticationModel, RegistrationModel, UserModel } from '@/models/data/user'

const API_URL = process.env.VUE_APP_BASE_API_URL + 'User/'

class AuthService {
  login(authData: AuthenticationModel): Promise<UserModel> {
    return axios
      .post(API_URL + 'authenticate', authData)
      .then((response: AxiosResponse<UserModel>) => {
        if (response.data.token) {
          localStorage.setItem('id', JSON.stringify(response.data.id))
          localStorage.setItem('accessToken', JSON.stringify(response.data.token))
        }

        return response.data
      })
  }

  logout(): void {
    localStorage.removeItem('id')
    localStorage.removeItem('accessToken')
  }

  register(registerData: RegistrationModel) {
    return axios.post(API_URL + 'register', registerData)
  }
}

export default new AuthService()
