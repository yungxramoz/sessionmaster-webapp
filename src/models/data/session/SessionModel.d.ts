import SessionUserModel from './SessionUserModel'

export default interface SessionModel {
  id: string
  date: string
  startTime?: Date
  endTime?: Date
  users: SessionUserModel[]
}
