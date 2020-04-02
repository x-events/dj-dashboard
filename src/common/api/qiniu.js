import {instance} from '@/api';

//七牛TOKEN
export const qiniuToken = {
  p: ['get,/SubFile/File/qiniuToken/'],
  r: params => {
    return instance.get(`/SubFile/File/qiniuToken/`, {params})
  }
}

//新增文件
export const fileCreate = {
  p: ['post,/SubFile/File/create/'],
  r: params => {
    return instance.post(`/SubFile/File/create/`, params)
  }
}