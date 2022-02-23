import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'amfe-flexible'

// 导入 dayjs
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import zh from 'dayjs/locale/zh-cn'

// 导入 Vant 和 组件的样式表
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.less'

// 注册全局插件
Vue.use(Vant)

Vue.config.productionTip = false

// 全局格式化时间的过滤器
dayjs.extend(relativeTime)
dayjs.locale(zh)
Vue.filter('dateFormat', dt => {
  return dayjs().to(dt)
})

Vue.use(Lazyload)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
