import {instance} from '@/api';

// 列表
export const list = {
  p: ['get,/SubDictionary/Dictionary/lists/'],
  r: params => {
    return instance.get(`/SubDictionary/Dictionary/lists/`, {params})
  }
}
// 详情
export const detail = {
  p: ['get,/SubDictionary/Dictionary/detail/'],
  r: params => {
    return instance.get(`/SubDictionary/Dictionary/detail/`, {params})
  }
}
// 添加/编辑
export const save = {
  p: ['post,/SubDictionary/Dictionary/save/'],
  r: params => {
    return instance.post(`/SubDictionary/Dictionary/save/`, params)
  }
}
// 删除
export const remove = {
  p: ['get,/SubDictionary/Dictionary/del/'],
  r: params => {
    return instance.get(`/SubDictionary/Dictionary/del/`, {params})
  }
}

// 数据字典数据项懒加载 
export const list_item = {
  p: ['get,/SubDictionary/DictionaryData/data/'],
  r: params => {
    return instance.get(`/SubDictionary/DictionaryData/data/`, {params})
  }
}
// 详情
export const list_detail = {
  p: ['get,/SubDictionary/DictionaryData/detail/'],
  r: params => {
    return instance.get(`/SubDictionary/DictionaryData/detail/`, {params})
  }
}
// 添加/编辑
export const list_save = {
  p: ['post,/SubDictionary/DictionaryData/save/'],
  r: params => {
    return instance.post(`/SubDictionary/DictionaryData/save/`, params)
  }
}
// 删除
export const list_remove = {
  p: ['get,/SubDictionary/DictionaryData/del/'],
  r: params => {
    return instance.get(`/SubDictionary/DictionaryData/del/`, {params})
  }
}