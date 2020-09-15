import Vue from 'vue'
import App from './App'
import util from 'common/util/util.js'
import api from 'api/api.js'
import store from './store'

Vue.config.productionTip = false

App.mpType = 'app'
Vue.prototype.$Lau = util
Vue.prototype.$api = api
Vue.prototype.$store = store

const app = new Vue({
    ...App,
	store
})


app.$mount()
