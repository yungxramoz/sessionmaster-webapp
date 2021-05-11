import SessionModel from '@/models/data/session/SessionModel'

export default interface AddSessionplanModel {
  name: string
  sessions?: SessionModel[]
}
