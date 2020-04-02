import {instance} from '@/api';

// 街乡列表
export const list = {
  p: ['get,/SubRegion/Street/lists/'],
  r: params => {
    return instance.get(`/SubRegion/Street/lists/`, {params})
  }
}
// 新增/编辑 保存
export const save = {
  p: ['post,/SubRegion/Street/save/'],
  r: params => {
    return instance.post(`/SubRegion/Street/save/`, params)
  }
}
// 街乡详情
export const detail = {
  p: ['get,/SubRegion/Street/detail/'],
  r: params => {
    return instance.get(`/SubRegion/Street/detail/`, {params})
  }
}
// 街乡删除
export const remove = {
  p: ['get,/SubRegion/Street/del/'],
  r: params => {
    return instance.get(`/SubRegion/Street/del/`, {params})
  }
}
