// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import routerConfig from './routerconfig.js'
import axios from 'axios'
import './common/stylus/index.styl'
import App from './App'

Vue.prototype.$axios = axios;
Vue.use(VueRouter);

const router = new VueRouter(routerConfig);

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
