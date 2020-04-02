import {instance} from '@/api';
//题库管理

//题库管理-列表
export const questionGroupIndex = {
  p: ['get,/SubExam/QuestionGroup/index/'],
  r: params => {
    return instance.get(`/SubExam/QuestionGroup/index/`, {params})
  }
}

//题库管理-新增
export const questionGroupCreate = {
  p: ['post,/SubExam/QuestionGroup/create/'],
  r: params => {
    return instance.post(`/SubExam/QuestionGroup/create/`, params)
  }
}

//题库管理-编辑
export const questionGroupUpdate = {
  p: ['post,/SubExam/QuestionGroup/update/'],
  r: params => {
    return instance.post(`/SubExam/QuestionGroup/update/`, params)
  }
}

//题库管理-删除
export const questionGroupDelete = {
  p: ['get,/SubExam/QuestionGroup/delete/'],
  r: params => {
    return instance.get(`/SubExam/QuestionGroup/delete/`, {params})
  }
}

//试题管理-试题组统计信息
export const questionGroupView = {
  p: ['get,/SubExam/QuestionGroup/view/'],
  r: params => {
    return instance.get(`/SubExam/QuestionGroup/view/`, {params})
  }
}

//试题管理-列表
export const questionIndex = {
  p: ['get,/SubExam/Question/index/'],
  r: params => {
    return instance.get(`/SubExam/Question/index/`, {params})
  }
}

//试题管理-删除
export const questionDelete = {
  p: ['get,/SubExam/Question/delete/'],
  r: params => {
    return instance.get(`/SubExam/Question/delete/`, {params})
  }
}

//试题管理-详情
export const questionView = {
  p: ['get,/SubExam/Question/view/'],
  r: params => {
    return instance.get(`/SubExam/Question/view/`, {params})
  }
}

//试题管理-新增/编辑
export const questionUpdate = {
  p: ['post,/SubExam/Question/update/'],
  r: params => {
    return instance.post(`/SubExam/Question/update/`, params)
  }
}



//考试管理-列表
export const examPapersIndex = {
  p: ['get,/SubExam/ExamPapers/index/'],
  r: params => {
    return instance.get(`/SubExam/ExamPapers/index/`, {params})
  }
}

//考试管理-新建
export const examPapersCreate = {
  p: ['post,/SubExam/ExamPapers/create/'],
  r: params => {
    return instance.post(`/SubExam/ExamPapers/create/`, params)
  }
}

//考试管理-编辑/上下架
export const examPapersUpdate = {
  p: ['post,/SubExam/ExamPapers/update/'],
  r: params => {
    return instance.post(`/SubExam/ExamPapers/update/`, params)
  }
}

//考试管理-详情
export const examPapersView = {
  p: ['get,/SubExam/ExamPapers/view/'],
  r: params => {
    return instance.get(`/SubExam/ExamPapers/view/`, {params})
  }
}

//考试管理-删除
export const examPapersDelete = {
  p: ['get,/SubExam/ExamPapers/delete/'],
  r: params => {
    return instance.get(`/SubExam/ExamPapers/delete/`, {params})
  }
}

//考试管理-添加考试人员
export const examStudentCreat = {
  p: ['post,/SubExam/ExamStudent/create/'],
  r: params => {
    return instance.post(`/SubExam/ExamStudent/create/`, params)
  }
}

//考试管理-删除考试人员
export const examStudentDelete = {
  p: ['get,/SubExam/ExamStudent/delete/'],
  r: params => {
    return instance.get(`/SubExam/ExamStudent/delete/`, {params})
  }
}

//考试管理-考试人员列表
export const examStudentIndex = {
  p: ['get,/SubExam/ExamStudent/index/'],
  r: params => {
    return instance.get(`/SubExam/ExamStudent/index/`, {params})
  }
}

//考试管理-选择习题组-已选
export const examPaperQuestionGroupIndex = {
  p: ['get,/SubExam/ExamPaperQuestionGroup/index/'],
  r: params => {
    return instance.get(`/SubExam/ExamPaperQuestionGroup/index/`, {params})
  }
}

//考试管理-选择习题组-全部
export const examPaperQuestionGroupAll = {
  p: ['get,/SubExam/ExamPaperQuestionGroup/all/'],
  r: params => {
    return instance.get(`/SubExam/ExamPaperQuestionGroup/all/`, {params})
  }
}

//增加习题组
export const addGroupForPaper = {
  p: ['post,/SubExam/ExamPaperQuestionGroup/addGroupForPaper/'],
  r: params => {
    return instance.post(`/SubExam/ExamPaperQuestionGroup/addGroupForPaper/`, params)
  }
}

//删除习题组
export const deleteGroupForPaper = {
  p: ['get,/SubExam/ExamPaperQuestionGroup/deleteGroupForPaper/'],
  r: params => {
    return instance.get(`/SubExam/ExamPaperQuestionGroup/deleteGroupForPaper/`, {params})
  }
}

//考试管理-开始组卷
export const examPaperQuestionGroupCreate = {
  p: ['post,/SubExam/ExamPaperQuestionGroup/create/'],
  r: params => {
    return instance.post(`/SubExam/ExamPaperQuestionGroup/create/`, params)
  }
}


//考试管理-统计
export const statistics = {
  p: ['get,/SubExam/ExamPapers/statistics/'],
  r: params => {
    return instance.get(`/SubExam/ExamPapers/statistics/`, {params})
  }
}

// 考试管理-结果分析-查看试卷 
export const statisticsDetail = {
  p: ['get,/SubExam/ExamPapers/statisticsDetail/'],
  r: params => {
    return instance.get(`/SubExam/ExamPapers/statisticsDetail/`, {params})
  }
}

//考试管理-自动组卷
export const examOnline = {
  p: ['get,/SubExam/ExamPapers/online/'],
  r: params => {
    return instance.get(`/SubExam/ExamPapers/online/`, {params})
  }
}

//考试管理-手动组卷
export const examManual = {
  p: ['get,/SubExam/ExamPapers/manual/'],
  r: params => {
    return instance.get(`/SubExam/ExamPapers/manual/`, {params})
  }
}

//考试管理-手动组卷-添加题型标记
export const addTxbjnr = {
  p: ['post,/SubExam/ExamPapers/addTxbjnr/'],
  r: params => {
    return instance.post(`/SubExam/ExamPapers/addTxbjnr/`, params)
  }
}

//考试管理-手动组卷-编辑题型标记
export const editTxbjnr = {
  p: ['post,/SubExam/ExamPapers/editTxbjnr/'],
  r: params => {
    return instance.post(`/SubExam/ExamPapers/editTxbjnr/`, params)
  }
}

//考试管理-手动组卷-删除题型标记 
export const delTxbjnr = {
  p: ['get,/SubExam/ExamPapers/delTxbjnr/'],
  r: params => {
    return instance.get(`/SubExam/ExamPapers/delTxbjnr/`, {params})
  }
}

//考试管理-手动组卷-选择习题
export const manualQuestions = {
  p: ['get,/SubExam/ExamPapers/listSt/'],
  r: params => {
    return instance.get(`/SubExam/ExamPapers/listSt/`, {params})
  }
}

//考试管理-手动组卷-添加试题
export const manualAddQue = {
  p: ['post,/SubExam/ExamPapers/addSt/'],
  r: params => {
    return instance.post(`/SubExam/ExamPapers/addSt/`, params)
  }
}

//考试管理-手动组卷-修改试题分数
export const manualEditQue = {
  p: ['post,/SubExam/ExamPaperQuestion/update/'],
  r: params => {
    return instance.post(`/SubExam/ExamPaperQuestion/update/`, params)
  }
}

//考试管理-手动组卷-删除试题 
export const manualDelQue = {
  p: ['get,/SubExam/ExamPapers/delSt/'],
  r: params => {
    return instance.get(`/SubExam/ExamPapers/delSt/`, {params})
  }
}

