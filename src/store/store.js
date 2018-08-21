import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import * as actions from './actions'
import * as getters from './getters'

Vue.use(Vuex)
let userInfo = {name: '', token: ''}
let user = JSON.parse(sessionStorage.getItem('user'))
if (user) {
  userInfo = {name: user.username, token: user.token}
}

const state = {
  userInfo
}
export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
