import {instance} from '@/api';

// 群组配置列表
export const list = {
  p: ['get,/SubIm/ImGroup/index/'],
  r: params => {
    return instance.get(`/SubIm/ImGroup/index/`, {params})
  }
}
// 成员管理列表
export const memberlist = {
  p: ['get,/SubIm/ImMember/index/'],
  r: params => {
    return instance.get(`/SubIm/ImMember/index/`, {params})
  }
}
// 添加成员
export const create = {
  p: ['post,/SubIm/ImMember/create/'],
  r: params => {
    return instance.post(`/SubIm/ImMember/create/`, params)
  }
}
// 删除成员 
export const remove = {
  p: ['get,/SubIm/ImMember/delete/'],
  r: params => {
    return instance.get(`/SubIm/ImMember/delete/`, {params})
  }
}
