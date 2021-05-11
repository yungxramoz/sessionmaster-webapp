import { BoardGameModel } from '@/models/data/boardgame'
import { SessionplanDetailModel, SessionplanOverviewModel } from '@/models/data/sessionplan'

export default interface SessionplanState {
  sessionplans: SessionplanOverviewModel[] | null
  openSessionplan: SessionplanDetailModel | null
}

export { SessionplanState }
