import {instance} from '@/api';

// 党组织列表
export const list = {
  p: ['get,/SubOrganization/Organization/lists/'],
  r: params => {
    return instance.get(`/SubOrganization/Organization/lists/`, {params})
  }
}
// 新增/编辑 保存
export const save = {
  p: ['post,/SubOrganization/Organization/save/'],
  r: params => {
    return instance.post(`/SubOrganization/Organization/save/`, params)
  }
}
// 党组织详情
export const detail = {
  p: ['get,/SubOrganization/Organization/detail/'],
  r: params => {
    return instance.get(`/SubOrganization/Organization/detail/`, {params})
  }
}
// 党组织删除
export const remove = {
  p: ['get,/SubOrganization/Organization/del/'],
  r: params => {
    return instance.get(`/SubOrganization/Organization/del/`, {params})
  }
}
