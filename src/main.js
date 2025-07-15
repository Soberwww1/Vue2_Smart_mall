import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入公共CSS样式
import '@/styles/common.less'

// 导入 vant 组件库（按需导入，具体导入了什么在utils文件夹查看）
import '@/utils/vant'
// 导入 vue-marquee组件库
import '@/utils/vue_marquee'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
