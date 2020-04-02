import {instance} from '@/api';

// 列表
export const list = {
  p: ['get,/SubExponent/ExponentModule/index/'],
  r: params => {
    return instance.get(`/SubExponent/ExponentModule/index/`, {params})
  }
}

// 详情
export const detail = {
  p: ['get,/SubExponent/ExponentModule/view/'],
  r: params => {
    return instance.get(`/SubExponent/ExponentModule/view/`, {params})
  }
}

// 新增
export const add = {
  p: ['post,/SubExponent/ExponentModule/create/'],
  r: params => {
    return instance.post(`/SubExponent/ExponentModule/create/`, params)
  }
}

// 编辑
export const edit = {
  p: ['post,/SubExponent/ExponentModule/update/'],
  r: params => {
    return instance.post(`/SubExponent/ExponentModule/update/`, params)
  }
}
// 删除
export const remove = {
  p: ['get,/SubExponent/ExponentModule/delete/'],
  r: params => {
    return instance.get(`/SubExponent/ExponentModule/delete/`, {params})
  }
}


