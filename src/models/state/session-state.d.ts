import { SessionModel } from '@/models/data/session'

export default interface SessionState {
  currentSession: SessionModel | null
  guestName: string | null
}

export { SessionState }
