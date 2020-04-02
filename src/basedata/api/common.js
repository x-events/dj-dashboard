import {instance} from '@/api';

// 行政区树
export const district_tree = {
  p: ['get,/SubRegion/District/tree/'],
  r: params => {
    return instance.get(`/SubRegion/District/tree/`, {params})
  }
}
// 行政区树-点击区获取街乡
export const distroct_getstreet = {
  p: ['get,/SubRegion/Street/tree/'],
  r: params => {
    return instance.get(`/SubRegion/Street/tree/`, {params})
  }
}
