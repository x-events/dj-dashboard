import {instance} from '@/api';

//
export const list = {
  p: ['get,/SubMember/Member/index/'],
  r: params => {
    return instance.get(`/SubMember/Member/index/`, {params})
  }
}

export const save = {
  p: ['post,/SubMember/Member/save/'],
  r: params => {
    // return instance.post(`/party/member_edit/`, params)
    return instance.post(`/SubMember/Member/save/`, params)
  }
}

export const remove = {
  p: ['post,/SubMember/Member/del/'],
  r: params => {
    return instance.post(`/SubMember/Member/del/`, params)
  }
}
// 详情
export const detail = {
  p: ['get,/SubMember/Member/view/'],
  r: params => {
    return instance.get(`/SubMember/Member/view/`, {params})
  }
}

