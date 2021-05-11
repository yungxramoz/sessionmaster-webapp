import { SessionModel } from '@/models/data/session'
import SessionplanOverviewModel from './SessionplanOverviewModel'

export default interface SessionplanDetailModel extends SessionplanOverviewModel {
  sessions: SessionModel[]
}
