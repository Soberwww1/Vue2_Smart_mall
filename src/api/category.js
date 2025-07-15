import request from '@/utils/request'

export const getCategoryItem = () => {
  return request.get('/category/list')
}
