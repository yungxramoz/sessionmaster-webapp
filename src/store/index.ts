import Vue from 'vue'
import Vuex from 'vuex'

import AuthModule from './modules/auth-module'
import UserModule from './modules/user-module'
import AccountModule from './modules/account-module'
import BoardGameModule from './modules/boardgame-module'
import AlertModule from './modules/alert-module'
import SessionplanModule from './modules/sessionplan-module'
import SessionModule from './modules/session-module'
import SuggestionModule from './modules/suggestion-module'

Vue.use(Vuex)

const store = new Vuex.Store({
  strict: true,
  modules: {
    auth: AuthModule,
    user: UserModule,
    account: AccountModule,
    boardgame: BoardGameModule,
    sessionplan: SessionplanModule,
    session: SessionModule,
    suggestion: SuggestionModule,

    alert: AlertModule,
  },
})

export default store
