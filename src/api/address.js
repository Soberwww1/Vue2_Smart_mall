import request from '@/utils/request'

// 获取默认地址ID
export const getDefaultAddressID = () => {
  return request.get('/address/defaultId')
}
// 获取地址列表
export const getAddress = () => {
  return request.get('/address/list')
}
// 设置默认地址 --- addressId指的是地址ID ???
export const setDefault = (addressId) => {
  return request.post('/address/setDefault', {
    addressId
  })
}
// 添加地址 ???
export const addAddress = (formobj) => {
  const { name, phone, region } = formobj
  return request.post('/address/add', {
    name,
    phone,
    region
  })
}
// 更新地址
// 删除地址
