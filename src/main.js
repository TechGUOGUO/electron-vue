import Vue from 'vue'
import Main from './Main.vue'

import ViewUI from 'view-design';
Vue.config.productionTip = false
import router from './router'

Vue.use(ViewUI);
new Vue({
  router,
  render: h => h(Main),
}).$mount('#app_root')
