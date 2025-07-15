import Vue from 'vue'
import VueRouter from 'vue-router'

import store from '@/store'
import { Toast } from 'vant'
// 导入各个路由页面
import layout from '@/views/layout/index.vue'

import cart from '@/views/layout/cart.vue'
import category from '@/views/layout/category.vue'
import home from '@/views/layout/home.vue'
import user from '@/views/layout/user.vue'

/*
 这里本来是进行导入各个组件的，但是需要实现优化打包后页面性能（因为这是一个单页面组件，如果一般的进行打包，
 那么设备加载该页面时会一次性将所有资源在开始的时候全部加载，当项目巨大时，会明显感觉首屏加载缓慢），进行配置路由懒加载（说白了就是“按需要加载”，你需要什么页面，我给你加载什么页面），实现打包优化。
 具体实现步骤如下：本来是直接import导入各个组件，但是这里使用箭头函数return各个组件，将其分为不同代码块，当该路由被访问时才加载对应组件。
 上述行为也被称为 --- “异步组件改造” 其核心原理来源于 import动态导入（按需导入）。与之前所了解的声明式导入不同，动态导入语法为：import(moduleName)  moduleName就是要导入的模块对象，不一样的是，这个模块要满足条件时才能被解析。这个动态导入是返回一个promise对象
 静态导入声明语法（import something from "somewhere"）是静态的，导入的模块会在加载完成后就立即进行求值
*/
const login = () => import('@/views/login/index.vue')
const myorder = () => import('@/views/myorder/index.vue')
const pay = () => import('@/views/pay/index.vue')
const productdetail = () => import('@/views/productdetail/index.vue')

const search = () => import('@/views/search/index.vue')
const searchlist = () => import('@/views/searchlist/index.vue')

const address = () => import('@/views/address/index.vue')
const purse = () => import('@/views/purse/index.vue')
const coupon = () => import('@/views/coupon/coupon.vue')
const mycoupon = () => import('@/views/coupon/mycoupon.vue')
const points = () => import('@/views/points/index.vue')
const help = () => import('@/views/AfterSaleService/help.vue')
const saleservice = () => import('@/views/AfterSaleService/SaleService.vue')

// 对路由进行初始化
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/',
      component: layout,
      redirect: '/home',
      children: [
        { path: '/cart', component: cart }, // 购物车页
        // 给category路由设置动态路由
        { name: 'itemkeys', path: '/category/:key?', component: category }, // 商品分类页
        { path: '/home', component: home }, // 主页
        { path: '/user', component: user } // 用户页

      ]
    },
    { path: '/login', component: login }, // 登录页
    { path: '/myorder/:instruct?', component: myorder }, // 订单页
    { path: '/pay', component: pay }, // 支付页
    { path: '/prodetail', component: productdetail }, // 商品详情页
    { path: '/search', component: search }, // 商品搜索页
    { path: '/searchlist', component: searchlist }, // 商品列表页
    { path: '/address', component: address }, // 收货地址页
    { path: '/purse', component: purse }, // 钱包页
    { path: '/coupon', component: coupon }, // 领劵中心
    { path: '/mycoupon', component: mycoupon }, // 我的优惠劵页
    { path: '/points', component: points }, // 用户积分页
    { path: '/help', component: help }, // 帮助页面
    { path: '/saleservice', component: saleservice } // 售后页面

  ]
})

/*
//router.beforeEach((to, from, next) => {
  1、to  往哪去，到哪去的路由信息对象
  2、from 从哪来，从哪来的路由信息对象
  3、next() 是否放行
      如果next()调用，就是放行
      next(路径)  拦截到某个路径页面
//   console.log(to, from, next)
//   return false
// })
*/
const nextlist = ['/myorder', '/pay', '/purse']
router.beforeEach((to, from, next) => {
  if (!nextlist.includes(to.path)) {
    next()
    return
  }
  if (store.getters['user/token']) {
    next()
    return
  }
  next('/login')
  Toast('请登录后查看')
})

export default router
