export default [{
    path: '/work',
    name: '工作平台',
    meta: {
        icon: '&#xe762;'
    },
    component: (resolve) => require(['./views/index.vue'], resolve),
    children: [{
        path: 'manage',
        name: '工作管理',
        component: (resolve) => require(['./views/manage.vue'], resolve),
        children: [{
            path: 'process',
            name: '流程管理',
            component: (resolve) => require(['./views/manage/process.vue'], resolve)
        },{
            path: 'form',
            name: '工作行为管理',
            component: (resolve) => require(['./views/manage/form.vue'], resolve)
        },{
            path: 'permission',
            name: '工作权限',
            component: (resolve) => require(['./views/manage/permission.vue'], resolve)
        },{
            path: 'permission-mobile',
            name: '移动端权限',
            component: (resolve) => require(['./views/manage/permission-mobile.vue'], resolve)
        },{
            path: 'permission-datacenter',
            name: '数据中心权限',
            component: (resolve) => require(['./views/manage/permission-datacenter.vue'], resolve)
        }]
    },{
        path: 'exponent',
        name: '指数管理',
        component: (resolve) => require(['./views/exponent.vue'], resolve),
        children: [{
            path: 'list',
            name: '指数列表',
            meta: {
                title: '指数管理'
            },
            component: (resolve) => require(['./views/exponent/list.vue'], resolve)
        },{
            path: 'item',
            name: '指数项管理',
            meta: {
                belong: '指数列表',
                hidden: true
            },
            component: (resolve) => require(['./views/exponent/item.vue'], resolve)
        },{
            path: 'module',
            name: '计算模型管理',
            component: (resolve) => require(['./views/exponent/module.vue'], resolve)
        },{
            path: 'avgCorrect',
            name: '指数平均值修正',
            component: (resolve) => require(['./views/exponent/avgCorrect.vue'], resolve)
        }]
    }]
}]