import {instance} from '@/api';

// 工作行为分类
export const cat = {
  p: ['get,/SubForm/FormCategory/index/'],
  r: params => {
    return instance.get(`/SubForm/FormCategory/index/`, {params})
  }
}
// 工作行为列表
export const list = {
  p: ['get,/SubForm/FormNearest/index/'],
  r: params => {
    return instance.get(`/SubForm/FormNearest/index/`, {params})
  }
}
// 工作行为-可选组件
export const catComponents = {
  p: ['get,/SubForm/FormCategory/component/'],
  r: params => {
    return instance.get(`/SubForm/FormCategory/component/`, {params})
  }
}
// 工作行为-已选组件
export const formComponents = {
  p: ['get,/SubForm/FormNearest/component/'],
  r: params => {
    return instance.get(`/SubForm/FormNearest/component/`, {params})
  }
}

// 工作行为创建
export const add = {
  p: ['post,/SubForm/FormNearest/create/'],
  r: params => {
    return instance.post(`/SubForm/FormNearest/create/`, params)
  }
}

// 工作行为编辑
export const edit = {
  p: ['post,/SubForm/FormNearest/update/'],
  r: params => {
    return instance.post(`/SubForm/FormNearest/update/`, params)
  }
}

// 工作行为删除
export const remove = {
  p: ['get,/SubForm/FormNearest/delete/'],
  r: params => {
    return instance.get(`/SubForm/FormNearest/delete/`, {params})
  }
}

// 工作指引
export const guide = {
  p: ['get,/SubForm/FormGuide/index/'],
  r: params => {
    return instance.get(`/SubForm/FormGuide/index/`, {params})
  }
}
// 工作指引更新
export const guideUpdate = {
  p: ['post,/SubForm/FormGuide/update/'],
  r: params => {
    return instance.post(`/SubForm/FormGuide/update/`, params)
  }
}
