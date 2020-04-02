import {instance} from '@/api';

// 流程分类
export const cat = {
  p: ['get,/SubProcess/ProcessCategory/index/'],
  r: params => {
    return instance.get(`/SubProcess/ProcessCategory/index/`, {params})
  }
}
// 流程列表
export const list = {
  p: ['get,/SubProcess/ProcessNearest/index/'],
  r: params => {
    return instance.get(`/SubProcess/ProcessNearest/index/`, {params})
  }
}

// 流程创建
export const add = {
  p: ['post,/SubProcess/ProcessNearest/create/'],
  r: params => {
    return instance.post(`/SubProcess/ProcessNearest/create/`, params)
  }
}

// 流程编辑
export const edit = {
  p: ['post,/SubProcess/ProcessNearest/update/'],
  r: params => {
    return instance.post(`/SubProcess/ProcessNearest/update/`, params)
  }
}

// 流程删除
export const remove = {
  p: ['get,/SubProcess/ProcessNearest/delete/'],
  r: params => {
    return instance.get(`/SubProcess/ProcessNearest/delete/`, {params})
  }
}

// 流程上架/下架
export const changeStatus = {
  p: ['post,/SubProcess/ProcessNearest/changeStatus/'],
  r: params => {
    return instance.post(`/SubProcess/ProcessNearest/changeStatus/`, params)
  }
}

// 步骤列表
export const stepList = {
  p: ['get,/SubProcess/ProcessNearestStep/index/'],
  r: params => {
    return instance.get(`/SubProcess/ProcessNearestStep/index/`, {params})
  }
}

// 创建步骤
export const addStep = {
  p: ['post,/SubProcess/ProcessNearestStep/create/'],
  r: params => {
    return instance.post(`/SubProcess/ProcessNearestStep/create/`, params)
  }
}

// 编辑步骤
export const editStep = {
  p: ['post,/SubProcess/ProcessNearestStep/update/'],
  r: params => {
    return instance.post(`/SubProcess/ProcessNearestStep/update/`, params)
  }
}

// 删除步骤
export const removeStep = {
  p: ['get,/SubProcess/ProcessNearestStep/delete/'],
  r: params => {
    return instance.get(`/SubProcess/ProcessNearestStep/delete/`, {params})
  }
}

// 工作行为列表
export const formList = {
  p: ['get,/SubProcess/ProcessNearestStepFormRelation/index/'],
  r: params => {
    return instance.get(`/SubProcess/ProcessNearestStepFormRelation/index/`, {params})
  }
}

// 新增工作行为
export const addForm = {
  p: ['post,/SubProcess/ProcessNearestStepFormRelation/update/'],
  r: params => {
    return instance.post(`/SubProcess/ProcessNearestStepFormRelation/update/`, params)
  }
}

// 编辑工作行为
export const editForm = {
  p: ['post,/SubProcess/ProcessNearestStepFormRelation/update/'],
  r: params => {
    return instance.post(`/SubProcess/ProcessNearestStepFormRelation/update/`, params)
  }
}

// 删除工作行为
export const removeForm = {
  p: ['get,/SubProcess/ProcessNearestStepFormRelation/delete/'],
  r: params => {
    return instance.get(`/SubProcess/ProcessNearestStepFormRelation/delete/`, {params})
  }
}
