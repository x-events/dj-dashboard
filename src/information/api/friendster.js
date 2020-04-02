import {instance} from '@/api';

// 列表
export const list = {
  p: ['get,/SubFriends/FriendsInfo/index/'],
  r: params => {
    return instance.get(`/SubFriends/FriendsInfo/index/`, {params})
  }
}
// 删除
export const remove = {
  p: ['get,/SubFriends/FriendsInfo/delete/'],
  r: params => {
    return instance.get(`/SubFriends/FriendsInfo/delete/`, {params})
  }
}
