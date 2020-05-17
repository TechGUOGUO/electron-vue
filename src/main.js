import Vue from 'vue'
import Main from './Main.vue'

import router from './router'

new Vue({
  router,
  render: h => h(Main),
}).$mount('#app_root')
