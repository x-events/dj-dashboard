import {instance} from '@/api';
//党建读物管理

//书籍分类列表
export const bookCategoryList = {
  p: ['get,/SubBook/BookCategory/lists/'],
  r: params => {
    return instance.get(`/SubBook/BookCategory/lists/`, {params})
  }
}

//书籍分类详情
export const bookCategoryDetail = {
  p: ['get,/SubBook/BookCategory/detail/'],
  r: params => {
    return instance.get(`/SubBook/BookCategory/detail/`, {params})
  }
}

//书籍分类保存
export const bookCategorySave = {
  p: ['post,/SubBook/BookCategory/save/'],
  r: params => {
    return instance.post(`/SubBook/BookCategory/save/`, params)
  }
}

//书籍分类删除
export const bookCategoryDel = {
  p: ['get,/SubBook/BookCategory/del/'],
  r: params => {
    return instance.get(`/SubBook/BookCategory/del/`, {params})
  }
}

//书籍列表中的书籍分类
export const bookCategoryTree = {
  p: ['get,/SubBook/BookCategory/tree/'],
  r: params => {
    return instance.get(`/SubBook/BookCategory/tree/`, {params})
  }
}

//书籍列表
export const bookLists = {
  p: ['get,/SubBook/Book/lists/'],
  r: params => {
    return instance.get(`/SubBook/Book/lists/`, {params})
  }
}

//书籍详情
export const bookDetail = {
  p: ['get,/SubBook/Book/detail/'],
  r: params => {
    return instance.get(`/SubBook/Book/detail/`, {params})
  }
}

//书籍保存
export const bookSave = {
  p: ['post,/SubBook/Book/save/'],
  r: params => {
    return instance.post(`/SubBook/Book/save/`, params)
  }
}

//书籍删除或上下架
export const bookDel = {
  p: ['get,/SubBook/Book/del/'],
  r: params => {
    return instance.get(`/SubBook/Book/del/`, {params})
  }
}