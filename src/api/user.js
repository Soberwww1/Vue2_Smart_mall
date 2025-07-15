import request from '@/utils/request'

// 获取用户信息
export const getInfo = () => {
  return request.get('/user/info')
}

// 获取我的 --- 余额 --- 积分 --- 优惠劵信息
export const getAsserts = () => {
  return request.get('/user/assets')
}
