import {instance, baseURL} from '@/api';

// 文件接收列表
export const list = {
  p: ['get,/SubPapers/Papers/index/'],
  r: params => {
    return instance.get(`/SubPapers/Papers/index/`, {params})
  }
}
// 文件接收删除
export const remove = {
  p: ['get,/SubPapers/Papers/delete/'],
  r: params => {
    return instance.get(`/SubPapers/Papers/delete/`, {params})
  }
}
// 文件接收下载
export const download = {
  p: ['get,/SubPapers/Papers/download/'],
  r: `${baseURL}/SubPapers/Papers/download/`
}
