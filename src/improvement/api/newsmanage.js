import {instance} from '@/api';

// 新闻列表
export const list = {
  p: ['get,/SubNews/News/lists/'],
  r: params => {
    return instance.get(`/SubNews/News/lists/`, {params})
  }
}
// 新闻详情
export const detail = {
  p: ['get,/SubNews/News/detail/'],
  r: params => {
    return instance.get(`/SubNews/News/detail/`, {params})
  }
}
// 新闻保存
export const save = {
  p: ['post,/SubNews/News/save/'],
  r: params => {
    return instance.post(`/SubNews/News/save/`, params)
  }
}
// 新闻删除
export const remove = {
  p: ['get,/SubNews/News/del/'],
  r: params => {
    return instance.get(`/SubNews/News/del/`, {params})
  }
}
