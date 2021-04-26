import { UserModel } from '@/models/data/user'

export default interface AccountState {
  accountData: UserModel | null
}

export { AccountState }
