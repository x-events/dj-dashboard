import {instance} from '@/api';

// 列表
export const list = {
  p: ['get,/SubExponent/Exponent/index/'],
  r: params => {
    return instance.get(`/SubExponent/Exponent/index/`, {params})
  }
}

// 详情
export const detail = {
  p: ['get,/SubExponent/Exponent/view/'],
  r: params => {
    return instance.get(`/SubExponent/Exponent/view/`, {params})
  }
}

// 新增
export const add = {
  p: ['post,/SubExponent/Exponent/create/'],
  r: params => {
    return instance.post(`/SubExponent/Exponent/create/`, params)
  }
}

// 编辑
export const edit = {
  p: ['post,/SubExponent/Exponent/update/'],
  r: params => {
    return instance.post(`/SubExponent/Exponent/update/`, params)
  }
}
// 删除
export const remove = {
  p: ['get,/SubExponent/Exponent/delete/'],
  r: params => {
    return instance.get(`/SubExponent/Exponent/delete/`, {params})
  }
}

// 复制
export const copy = {
  p: ['get,/SubExponent/Exponent/copy/'],
  r: params => {
    return instance.get(`/SubExponent/Exponent/copy/`, {params})
  }
}
