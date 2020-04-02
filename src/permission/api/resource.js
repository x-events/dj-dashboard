import {instance} from '@/api';

//
export const list = {
  p: ['get,/SubMenu/Menu/index/'],
  r: params => {
    return instance.get(`/SubMenu/Menu/index/`, {params})
  }
}

export const add = {
  p: ['post,/SubMenu/Menu/create/'],
  r: params => {
    return instance.post(`/SubMenu/Menu/create/`, params)
  }
}

export const edit = {
  p: ['post,/SubMenu/Menu/update/'],
  r: params => {
    return instance.post(`/SubMenu/Menu/update/`, params)
  }
}

export const remove = {
  p: ['get,/SubMenu/Menu/delete/'],
  r: params => {
    return instance.get(`/SubMenu/Menu/delete/`, {params})
  }
}

