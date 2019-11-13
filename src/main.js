import Vue from 'vue'
import Main from './Main.vue'
Vue.config.productionTip = false
import router from './router'
new Vue({
  router,
  render: h => h(Main),
}).$mount('#app_root')
