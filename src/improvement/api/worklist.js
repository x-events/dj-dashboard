import {instance} from '@/api';

// 工作动态列表
export const list = {
  p: ['get,/SubArticle/Article/lists/'],
  r: params => {
    return instance.get(`/SubArticle/Article/lists/`, {params})
  }
}
// 工作动态详情
export const detail = {
  p: ['get,/SubArticle/Article/detail/'],
  r: params => {
    return instance.get(`/SubArticle/Article/detail/`, {params})
  }
}
// 工作动态保存
export const save = {
  p: ['post,/SubArticle/Article/save/'],
  r: params => {
    return instance.post(`/SubArticle/Article/save/`, params)
  }
}
// 工作动态删除
export const remove = {
  p: ['get,/SubArticle/Article/del/'],
  r: params => {
    return instance.get(`/SubArticle/Article/del/`, {params})
  }
}
// 工作动态上下架
export const status = {
  p: ['get,/SubArticle/Article/status/'],
  r: params => {
    return instance.get(`/SubArticle/Article/status/`, {params})
  }
}
