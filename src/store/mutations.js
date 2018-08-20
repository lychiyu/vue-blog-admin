import * as types from './mutation-types'
import Vue from 'vue'
import Axios from 'axios'
Vue.prototype.$http = Axios

export default {
  [types.SET_INFO] (state) {
    let user = JSON.parse(sessionStorage.getItem('user'))
    state.userInfo = {
      name: user.username,
      token: user.token
    }
    console.log(state.userInfo)
  },
  [types.LOGOUT] (state) {
    sessionStorage.removeItem('user')
    state.userInfo = {name: '', token: ''}
  }
}
