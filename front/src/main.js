import Vue from 'vue'
import App from './App.vue'
import AuthPlugin from './plugins/auth'
import router from './router'

Vue.use(AuthPlugin)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
