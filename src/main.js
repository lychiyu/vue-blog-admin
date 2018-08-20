// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'styles/reset.css'
import 'styles/iconfont.css'
import 'element-ui/lib/theme-chalk/index.css'
import store from './store/store'
import './axios/'
import Axios from 'axios'

Vue.prototype.$http = Axios
Vue.config.productionTip = false
Vue.use(ElementUI)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
