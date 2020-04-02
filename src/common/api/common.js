import {instance} from '@/api';

// 党组织树
export const orgtree = {
  p: ['get,/SubOrganization/Organization/tree/'],
  r: () => {
    return instance.get(`/SubOrganization/Organization/tree/`)
  }
}
// 籍贯树
export const areatree = {
  p: ['get,/SubMember/Area/index/'],
  r: () => {
    return instance.get(`/SubMember/Area/index/`)
  }
}
// 数据字典
export const dict_tree = {
  p: ['get,/SubDictionary/DictionaryData/tree/'],
  r: params => {
    return instance.get(`/SubDictionary/DictionaryData/tree/`, {params})
  }
}

// 文件列表
export const filelist = {
  p: ['get,/SubFile/Index/index/'],
  r: params => {
    return instance.get(`/SubFile/Index/index/`, {params})
  }
}
// 文件保存
export const filesave = {
  p: ['post,/SubFile/Index/save/'],
  r: params => {
    return instance.post(`/SubFile/Index/save/`, params)
  }
}
// 文件删除
export const fileremove = {
  p: ['get,/SubFile/Index/del/'],
  r: params => {
    return instance.get(`/SubFile/Index/del/`, {params})
  }
}