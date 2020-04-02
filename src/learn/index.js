export default [{
  path: '/learn',
  name: '学习资源管理',
  meta: {
    icon: "&#xe600;"
  },
  component: (resolve) => require(['./views/index.vue'], resolve),
  redirect: '/learn/courseManage/courseCategory',
  children:[
    {
      path: 'examManage',
      name: '考试管理-分类',
      meta:{
        title:'考试管理'
      },
      component: (resolve) => require(['./views/exam.vue'], resolve),
      redirect: '/learn/examManage/questionBank',
      children: [
        {
          path: 'questionBank',
          name: '题库管理',
          component: (resolve) => require(['./views/exam/questionBank.vue'], resolve),
        },
        {
          path: 'questionList',
          name: '试题管理',
          meta:{
            belong:'题库管理',
            hidden:true
          },
          component: (resolve) => require(['./views/exam/questionList.vue'], resolve)
        },
        {
          path: 'examList',
          name: '考试管理',
          component: (resolve) => require(['./views/exam/examList.vue'], resolve)
        },
        {
          path: 'statistics',
          name: '考试结果分析',
          meta:{
            belong:'考试管理',
            hidden:true
          },
          component: (resolve) => require(['./views/exam/statistics.vue'], resolve)
        },
        {
          path: 'examCreat',
          name: '创建考试',
          meta:{
            title:'loading',
            belong:'考试管理',
            hidden:true
          },
          component: (resolve) => require(['./views/exam/examCreat.vue'], resolve)
        },
        {
          path: 'examPreview',
          name: '考试预览',
          meta:{
            belong:'考试管理',
            hidden:true
          },
          component: (resolve) => require(['./views/exam/examPreview.vue'], resolve)
        },
        {
          path: 'paperDetail',
          name: '查看试卷',
          meta:{
            belong:'考试管理',
            hidden:true
          },
          component: (resolve) => require(['./views/exam/paperDetail.vue'], resolve)
        }
      ]
    },
    {
      path: 'courseManage',
      name: '课程管理',
      component: (resolve) => require(['./views/course.vue'], resolve),
      redirect: '/learn/courseManage/category',
      children: [
        {
          path: 'category',
          name: '课程分类',
          component: (resolve) => require(['./views/course/category.vue'], resolve)
        },
        {
          path: 'list',
          name: '课程列表',
          component: (resolve) => require(['./views/course/list.vue'], resolve)
        }
      ]
    },
    {
      path: 'bookManage',
      name: '党建读物管理',
      component: (resolve) => require(['./views/book.vue'], resolve),
      redirect: '/learn/bookManage/category',
      children: [
        {
          path: 'category',
          name: '书籍分类',
          component: (resolve) => require(['./views/book/category.vue'], resolve)
        },
        {
          path: 'list',
          name: '书籍列表',
          component: (resolve) => require(['./views/book/list.vue'], resolve)
        }
      ]
    },
    {
      path: 'requiredCourseManage',
      name: '必修课管理',
      component: (resolve) => require(['./views/required_course.vue'], resolve),
      redirect: '/learn/requiredCourseManage/list',
      children: [
        {
          path: 'list',
          name: '必修课列表',
          component: (resolve) => require(['./views/required_course/list.vue'], resolve)
        }
      ]
    }
  ]
}]