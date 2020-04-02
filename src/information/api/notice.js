import {instance} from '@/api';

// 通知公告列表
export const list = {
  p: ['get,/SubNotice/Notice/index/'],
  r: params => {
    return instance.get(`/SubNotice/Notice/index/`, {params})
  }
}
// 通知公告删除
export const remove = {
  p: ['get,/SubNotice/Notice/delete/'],
  r: params => {
    return instance.get(`/SubNotice/Notice/delete/`, {params})
  }
}
// 通知公告详情
export const detail = {
  p: ['get,/SubNotice/Notice/view/'],
  r: params => {
    return instance.get(`/SubNotice/Notice/view/`, {params})
  }
}
// 回执列表
export const receivelist = {
  p: ['get,/SubNotice/NoticeReceiver/index/'],
  r: params => {
    return instance.get(`/SubNotice/NoticeReceiver/index/`, {params})
  }
}
