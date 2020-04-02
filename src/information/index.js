export default [{
  path: '/info',
  name: '信息通讯管理',
  meta: {
      icon: '&#xe618;'
  },
  component: (resolve) => require(['./views/index.vue'], resolve),
  redirect: '/info/group',
  children: [{
      path: 'group',
      name: '群组配置',
      component: (resolve) => require(['./views/group.vue'], resolve)
  }, {
      path: 'notice',
      name: '通知公告管理',
      component: (resolve) => require(['./views/notice.vue'], resolve)
  }, {
      path: 'fileRecv',
      name: '文件接收管理',
      component: (resolve) => require(['./views/fileRecv.vue'], resolve)
  }, {
      path: 'friendster',
      name: '朋友圈管理',
      component: (resolve) => require(['./views/friendster.vue'], resolve)
  }, {
      path: 'record',
      name: '党员消息记录',
      component: (resolve) => require(['./views/record.vue'], resolve)
  }]
}]