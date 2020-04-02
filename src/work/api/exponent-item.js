import {instance} from '@/api';

// 项目列表
export const itemList = {
  p: ['get,/SubExponent/ExponentItem/index/'],
  r: params => {
    return instance.get(`/SubExponent/ExponentItem/index/`, {params})
  }
}

// 项目详情
export const itemDetail = {
  p: ['get,/SubExponent/ExponentItem/view/'],
  r: params => {
    return instance.get(`/SubExponent/ExponentItem/view/`, {params})
  }
}

// 项目新增
export const itemAdd = {
  p: ['post,/SubExponent/ExponentItem/create/'],
  r: params => {
    return instance.post(`/SubExponent/ExponentItem/create/`, params)
  }
}

// 项目编辑
export const itemEdit = {
  p: ['post,/SubExponent/ExponentItem/saveData/'],
  r: params => {
    return instance.post(`/SubExponent/ExponentItem/saveData/`, params)
  }
}

// 项目删除
export const itemRemove = {
  p: ['get,/SubExponent/ExponentItem/delete/'],
  r: params => {
    return instance.get(`/SubExponent/ExponentItem/delete/`, {params})
  }
}

// 指数模型列表
export const moudels = {
  p: ['get,/SubExponent/ExponentModule/models/'],
  r: params => {
    return instance.get(`/SubExponent/ExponentModule/models/`, {params})
  }
}

// 结果集 l1
export const resultL1 = {
  p: ['get,/SubExponent/ExponentItem/getResult/'],
  r: params => {
    return instance.get(`/SubExponent/ExponentItem/getResult/`, {params})
  }
}

// 结果集 l2
export const resultL2 = {
  p: ['get,/SubExponent/ExponentItem/getSecond/'],
  r: params => {
    return instance.get(`/SubExponent/ExponentItem/getSecond/`, {params})
  }
}

// 结果集 l3
export const resultL3 = {
  p: ['get,/SubExponent/ExponentItem/getThird/'],
  r: params => {
    return instance.get(`/SubExponent/ExponentItem/getThird/`, {params})
  }
}