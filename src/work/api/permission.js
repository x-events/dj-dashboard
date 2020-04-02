import {instance} from '@/api';

// pc权限列表
export const webList = {
  p: ['get,/SubWork/WorkAuth/lists/'],
  r: params => {
    return instance.get(`/SubWork/WorkAuth/lists/`, {params})
  }
}
// pc权限保存
export const webSave = {
  p: ['post,/SubWork/WorkAuth/save/'],
  r: params => {
    return instance.post(`/SubWork/WorkAuth/save/`, params)
  }
}
// mobile权限列表
export const mobileList = {
  p: ['get,/SubWork/WorkAuth/mobile/'],
  r: params => {
    return instance.get(`/SubWork/WorkAuth/mobile/`, {params})
  }
}
// mobile权限保存
export const mobileSave = {
  p: ['post,/SubWork/WorkAuth/write/'],
  r: params => {
    return instance.post(`/SubWork/WorkAuth/write/`, params)
  }
}
// 数据中心权限列表
export const dcList = {
  p: ['get,/SubCenter/CenterAuth/lists/'],
  r: params => {
    return instance.get(`/SubCenter/CenterAuth/lists/`, {params})
  }
}
// 数据中心权限保存
export const dcSave = {
  p: ['post,/SubCenter/CenterAuth/save/'],
  r: params => {
    return instance.post(`/SubCenter/CenterAuth/save/`, params)
  }
}
