// 导入vue.js
import Vue from 'vue'
// 导入组件APP
import App from './App.vue'

// 导入路由插件vue-router
import router from './router'



//引入momentjs
import moment from 'moment' //导入文件
Vue.prototype.$moment = moment; //赋值使用


import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

  
import 'animate.css'
import './assets/font/iconfont.css'
import './assets/font2/iconfont.css'
import './assets/css/pc.css'
import './assets/css/style.css'

// 组件title
import VueWechatTitle from 'vue-wechat-title'
Vue.use(VueWechatTitle)


// 全局数据仓库
import store from './store/index'



import axios from 'axios'
Vue.prototype.$axios = axios


Vue.config.productionTip = false
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
