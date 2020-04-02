import {instance} from '@/api';

// 用户组织列表
export const list = {
  p: ['get,/SubMember/MemberOrganizationRelation/index/'],
  r: params => {
    return instance.get(`/SubMember/MemberOrganizationRelation/index/`, {params})
  }
}
// 新增 保存
export const add = {
  p: ['post,/SubMember/MemberOrganizationRelation/create/'],
  r: params => {
    return instance.post(`/SubMember/MemberOrganizationRelation/create/`, params)
  }
}
// 用户组织删除
export const remove = {
  p: ['get,/SubMember/MemberOrganizationRelation/delete/'],
  r: params => {
    return instance.get(`/SubMember/MemberOrganizationRelation/delete/`, {params})
  }
}
