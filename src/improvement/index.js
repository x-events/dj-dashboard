export default [{
    path: '/improvement',
    name: '工作动态管理',
    meta: {
        icon: '&#xe61b;'
    },
    component: (resolve) => require(['./views/index.vue'], resolve),
    redirect: '/improvement/worklist',
    children:[
        {
            path: 'worklist',
            name: '工作动态列表',
            component: (resolve) => require(['./views/work_list.vue'], resolve)
        },
        {
            path: 'newsmanage',
            name: '新闻管理',
            component: (resolve) => require(['./views/news_manage.vue'], resolve)
        },
    ]
}]