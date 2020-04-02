import {instance} from '@/api';
import CryptoJS from "crypto-js";
//登录
export const login = params => {
  return instance.post(`/SubMember/Public/login/`, {
    username: params.username,
    password: CryptoJS.MD5(params.password).toString()
  })
}

//用户权限
export const permission = {
  p: ['get,/SubMenu/Menu/roleIndex/'],
  r: params => {
    return instance.get(`/SubMenu/Menu/roleIndex`)
  }
}

//用户信息
export const info = {
  p: ['get,/SubMember/Member/mine/'],
  r: params => {
    return instance.get(`/SubMember/Member/mine/`)
  }
}
//修改密码
export const editPassword = {
  p: ['post,/SubMember/Member/changePassword/'],
  r: params => {
    return instance.post(`/SubMember/Member/changePassword/`, {
      password: CryptoJS.MD5(params.password).toString(),
      old_password: CryptoJS.MD5(params.old_password).toString()
    })
  }
}