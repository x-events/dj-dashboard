import {instance} from '@/api';

// 列表
export const list = {
  p: ['get,/SubVersion/Version/index/'],
  r: params => {
    return instance.get(`/SubVersion/Version/index/`, {params})
  }
}
// 删除
export const remove = {
  p: ['get,/SubVersion/Version/delete/'],
  r: params => {
    return instance.get(`/SubVersion/Version/delete/`, {params})
  }
}
// 添加
export const add = {
  p: ['post,/SubVersion/Version/create/'],
  r: params => {
    return instance.post(`/SubVersion/Version/create/`, params)
  }
}
