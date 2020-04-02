import {instance} from '@/api';

// 党员消息记录
export const listindex = {
  p: ['get,/SubIm/ImGroup/memberMessage/'],
  r: params => {
    return instance.get(`/SubIm/ImGroup/memberMessage/`, {params})
  }
}
// 党员消息记录
export const list = {
  p: ['get,/SubIm/ImGroup/memberList/'],
  r: params => {
    return instance.get(`/SubIm/ImGroup/memberList/`, {params})
  }
}
// 党员聊天记录
export const chatlist = {
  p: ['get,/SubIm/ImGroup/history/'],
  r: params => {
    return instance.get(`/SubIm/ImGroup/history/`, {params})
  }
}
