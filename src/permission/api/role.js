import {instance} from '@/api';

//
export const list = {
  p: ['get,/SubMenu/AuthGroup/index/'],
  r: params => {
    return instance.get(`/SubMenu/AuthGroup/index/`, {params})
  }
}

export const add = {
  p: ['post,/SubMenu/AuthGroup/create/'],
  r: params => {
    return instance.post(`/SubMenu/AuthGroup/create/`, params)
  }
}

export const edit = {
  p: ['post,/SubMenu/AuthGroup/update/'],
  r: params => {
    return instance.post(`/SubMenu/AuthGroup/update/`, params)
  }
}
// 详情
export const detail = {
  p: ['get,/SubMenu/AuthGroup/view/'],
  r: params => {
    return instance.get(`/SubMenu/AuthGroup/view/`, {params})
  }
}
// 删除/批量删除(数组)
export const remove = {
  p: ['get,/SubMenu/AuthGroup/delete/'],
  r: params => {
    return instance.get(`/SubMenu/AuthGroup/delete/`, {params})
  }
}
// 授权用户
export const create = {
  p: ['post,/SubMenu/AuthGroupAccess/create/'],
  r: params => {
    return instance.post(`/SubMenu/AuthGroupAccess/create/`, params)
  }
}
// 解除授权 
export const delAuth = {
  p: ['get,/SubMenu/AuthGroupAccess/delete/'],
  r: params => {
    return instance.get(`/SubMenu/AuthGroupAccess/delete/`, {params})
  }
}
// 按角色查询用户 
export const userbyRole = {
  p: ['get,/SubMenu/AuthGroupAccess/index/'],
  r: params => {
    return instance.get(`/SubMenu/AuthGroupAccess/index/`, {params})
  }
}
// 禁用/批量禁用 
export const forbid = {
  p: ['get,/SubMenu/AuthGroup/forbid/'],
  r: params => {
    return instance.get(`/SubMenu/AuthGroup/forbid/`, {params})
  }
}
// 启用/批量启用 
export const on = {
  p: ['get,/SubMenu/AuthGroup/on/'],
  r: params => {
    return instance.get(`/SubMenu/AuthGroup/on/`, {params})
  }
}