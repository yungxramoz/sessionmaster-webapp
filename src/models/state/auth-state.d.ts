export default interface AuthState {
  loggedIn: boolean
  userId: string | null
  accessToken: string | null
}

export { AuthState }
