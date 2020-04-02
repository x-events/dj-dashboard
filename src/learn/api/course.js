import {instance} from '@/api';
//课程管理

//课程分类列表
export const courseCategoryList = {
  p: ['get,/SubCourse/CourseCategory/lists/'],
  r: params => {
    return instance.get(`/SubCourse/CourseCategory/lists/`, {params})
  }
}

//课程分类详情
export const courseCategoryDetail = {
  p: ['get,/SubCourse/CourseCategory/detail/'],
  r: params => {
    return instance.get(`/SubCourse/CourseCategory/detail/`, {params})
  }
}

//课程分类保存
export const courseCategorySave = {
  p: ['post,/SubCourse/CourseCategory/save/'],
  r: params => {
    return instance.post(`/SubCourse/CourseCategory/save/`, params)
  }
}

//课程分类删除
export const courseCategoryDel = {
  p: ['get,/SubCourse/CourseCategory/del/'],
  r: params => {
    return instance.get(`/SubCourse/CourseCategory/del/`, {params})
  }
}

//课程列表中的课程分类
export const courseCategoryTree = {
  p: ['get,/SubCourse/CourseCategory/tree/'],
  r: params => {
    return instance.get(`/SubCourse/CourseCategory/tree/`, {params})
  }
}

//课程列表
export const courseLists = {
  p: ['get,/SubCourse/Course/lists/'],
  r: params => {
    return instance.get(`/SubCourse/Course/lists/`, {params})
  }
}

//课程详情
export const courseDetail = {
  p: ['get,/SubCourse/Course/detail/'],
  r: params => {
    return instance.get(`/SubCourse/Course/detail/`, {params})
  }
}

//课程保存
export const courseSave = {
  p: ['post,/SubCourse/Course/save/'],
  r: params => {
    return instance.post(`/SubCourse/Course/save/`, params)
  }
}

//课程删除或上下架
export const courseDel = {
  p: ['get,/SubCourse/Course/del/'],
  r: params => {
    return instance.get(`/SubCourse/Course/del/`, {params})
  }
}

//必修课程选择列表
export const courseTree = {
  p: ['get,/SubCourse/Course/tree/'],
  r: params => {
    return instance.get(`/SubCourse/Course/tree/`, {params})
  }
}

//必修课列表
export const govCourseLists = {
  p: ['get,/SubCourse/GovCourse/lists/'],
  r: params => {
    return instance.get(`/SubCourse/GovCourse/lists/`, {params})
  }
}

//必修课列表顶部统计
export const govCourseCount = {
  p: ['get,/SubCourse/GovCourse/count/'],
  r: params => {
    return instance.get(`/SubCourse/GovCourse/count/`, {params})
  }
}

//添加必修课
export const govCourseSave = {
  p: ['post,/SubCourse/GovCourse/save/'],
  r: params => {
    return instance.post(`/SubCourse/GovCourse/save/`, params)
  }
}

//取消必修课
export const govCourseDel = {
  p: ['get,/SubCourse/GovCourse/del/'],
  r: params => {
    return instance.get(`/SubCourse/GovCourse/del/`, {params})
  }
}