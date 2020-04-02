import {instance} from '@/api';

// 配置管理列表
export const list = {
  p: ['get,/SubConfig/Config/index/'],
  r: params => {
    return instance.get(`/SubConfig/Config/index/`, {params})
  }
}
// 配置管理编辑保存
export const save = {
  p: ['post,/SubConfig/Config/update/'],
  r: params => {
    return instance.post(`/SubConfig/Config/update/`, params)
  }
}
// 配置管理新建
export const create = {
  p: ['post,/SubConfig/Config/create/'],
  r: params => {
    return instance.post(`/SubConfig/Config/create/`, params)
  }
}
// 配置管理删除
export const remove = {
  p: ['get,/SubConfig/Config/delete/'],
  r: params => {
    return instance.get(`/SubConfig/Config/delete/`, {params})
  }
}
// 配置管理-根据名称获取配置
export const select = {
  p: ['get,/SubConfig/Config/getConfigByName/'],
  r: params => {
    return instance.get(`/SubConfig/Config/getConfigByName/`, {params})
  }
}
// 网站设置-按分组展示
export const show = {
  p: ['get,/SubConfig/Config/group/'],
  r: params => {
    return instance.get(`/SubConfig/Config/group/`, {params})
  }
}
// 网站设置-按分组更新
export const update = {
  p: ['post,/SubConfig/Config/updateGroup/'],
  r: params => {
    return instance.post(`/SubConfig/Config/updateGroup/`, params)
  }
}
