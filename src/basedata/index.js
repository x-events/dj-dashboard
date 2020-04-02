export default [{
    path: '/basedata',
    name: '基础数据管理',
    meta: {
        icon: '&#xe729;'
    },
    component: (resolve) => require(['./views/index.vue'], resolve),
    redirect: '/basedata/district',
    children: [{
        path: 'district',
        name: '行政区管理',
        component: (resolve) => require(['./views/district.vue'], resolve)
    }, {
        path: 'street',
        name: '街乡管理',
        component: (resolve) => require(['./views/street.vue'], resolve)
    }, {
        path: 'community',
        name: '社区管理',
        component: (resolve) => require(['./views/community.vue'], resolve)
    }]
}]