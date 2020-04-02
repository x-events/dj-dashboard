import {instance} from '@/api';

// 社区列表
export const list = {
  p: ['get,/SubRegion/Community/lists/'],
  r: params => {
    return instance.get(`/SubRegion/Community/lists/`, {params})
  }
}
// 新增/编辑 保存
export const save = {
  p: ['post,/SubRegion/Community/save/'],
  r: params => {
    return instance.post(`/SubRegion/Community/save/`, params)
  }
}
// 社区详情
export const detail = {
  p: ['get,/SubRegion/Community/detail/'],
  r: params => {
    return instance.get(`/SubRegion/Community/detail/`, {params})
  }
}
// 社区删除
export const remove = {
  p: ['get,/SubRegion/Community/del/'],
  r: params => {
    return instance.get(`/SubRegion/Community/del/`, {params})
  }
}
// 指定街乡下的社区（不分页）  -> 所属社区
export const community = {
  p: ['get,/SubRegion/Community/tree/'],
  r: params => {
    return instance.get(`/SubRegion/Community/tree/`, {params})
  }
}
