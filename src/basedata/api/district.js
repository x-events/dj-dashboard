import {instance} from '@/api';

// 行政区列表
export const list = {
  p: ['get,/SubRegion/District/lists/'],
  r: params => {
    return instance.get(`/SubRegion/District/lists/`, {params})
  }
}
// 新增/编辑 保存
export const save = {
  p: ['post,/SubRegion/District/save/'],
  r: params => {
    return instance.post(`/SubRegion/District/save/`, params)
  }
}
// 行政区详情
export const detail = {
  p: ['get,/SubRegion/District/detail/'],
  r: params => {
    return instance.get(`/SubRegion/District/detail/`, {params})
  }
}
// 行政区删除
export const remove = {
  p: ['get,/SubRegion/District/del/'],
  r: params => {
    return instance.get(`/SubRegion/District/del/`, {params})
  }
}