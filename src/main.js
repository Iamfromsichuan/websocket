import Vue from 'vue'
import VueRouter from 'vue-router';
import App from './App.vue'
import routes from './routers';
import ElementUI from 'element-ui';
import './assets/global.css';
import 'element-ui/lib/theme-chalk/index.css';


const router = new VueRouter({
  routes
})

Vue.config.productionTip = false

Vue.use(VueRouter);
Vue.use(ElementUI);

new Vue({
  router,
  render(h) {
    return h(App)
  }
}).$mount('#app')