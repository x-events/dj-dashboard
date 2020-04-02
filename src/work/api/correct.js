import {instance} from '@/api';

// 列表
export const list = {
  p: ['get,/SubExponent/AvgCorrect/lists/'],
  r: params => {
    return instance.get(`/SubExponent/AvgCorrect/lists/`, {params})
  }
}

// 组织参数列表
export const exponent = {
  p: ['get,/SubExponent/AvgCorrect/exponent/'],
  r: params => {
    return instance.get(`/SubExponent/AvgCorrect/exponent/`, {params})
  }
}

// 编辑
export const edit = {
  p: ['post,/SubExponent/AvgCorrect/save/'],
  r: params => {
    return instance.post(`/SubExponent/AvgCorrect/save/`, params)
  }
}
// 清除修正
export const reset = {
  p: ['get,/SubExponent/AvgCorrect/del/'],
  r: params => {
    return instance.get(`/SubExponent/AvgCorrect/del/`, {params})
  }
}


