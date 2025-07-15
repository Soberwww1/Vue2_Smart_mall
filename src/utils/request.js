/*
    为何将axios请求模块方法 封装到 request模块
    使用 axios 来请求后端接口，一般会对 axios 进行一些配置（比如：配置基础地址，请求相应拦截器等）
    所以在项目开发中，都会对 axios 进行 二次封装（说白了，就是基于axios新建一个实例，然后对于该 axios实例 更改配置要求），单独封装到一个 request 模块中，便于维护使用

    为何要进行  二次封装？？？
    因为在实际开发中，请求的基地址、关于axios的配置（如设置请求超过时间、拦截与响应的操作等）可能并不一样，
    这是我们就可以基于 axios 官方提供的代码，创建一个axios实例，之后想要调整 axios 配置，只需要调整该 axios实例 的配置就好，不必更改真正的 axios（防止axios被污染）。
    之后要是需要请求另一个服务器（或者其他别的axios要求），再创建一个axios实例进行更改调用即可。
    const instance = axios.create({
        baseURL: 'https://some-domain.com/api/',
        timeout: 1000,
        headers: {'X-Custom-Header': 'foobar'}
    });
*/
import axios from 'axios'
import { Toast } from 'vant'
import store from '@/store'

// 创建axios实例
const instance = axios.create({
  baseURL: 'http://smart-shop.itheima.net/index.php?s=/api',
  timeout: 5000,
  headers: { platform: 'H5' }
})

// 配置axios实例的拦截器
// 请求拦截器
// 添加请求拦截器
instance.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么

  // 判断是否登录 --- 如果登录了，就配置请求参数 --- Access-Token
  if (store.getters['user/token']) {
    config.headers['Access-Token'] = store.getters['user/token']
  }

  // 在每次进行数据请求的过程中设置缓冲动画
  Toast.loading({
    message: '加载中...',
    forbidClick: true,
    loadingType: 'spinner'
  })
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  // 2xx 范围内的状态码都会触发该函数。
  // 对响应数据做点什么
  const res = response.data
  if (res.status !== 200) {
    Toast(res.message)// 一般都是这样提醒错误，后端会定义好，不然每个错误都要自定义，难以维护并且繁琐
    // 返回Promise.reject的关键就是 await只能接受Promise.resolve，现在响应状态码只要不是200，就直接返回Promise.reject，相当于提前拦截了
    return Promise.reject(res.message)
  }
  Toast.clear()
  return res
}, function (error) {
  // 超出 2xx 范围的状态码都会触发该函数。
  // 对响应错误做点什么
  return Promise.reject(error)
})

export default instance
