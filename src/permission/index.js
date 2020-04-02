export default [{
    path: '/permission',
    name: '权限设置',
    meta: {
        icon: "&#xe606;"
    },
    component: (resolve) => require(['./views/index.vue'], resolve),
    redirect: '/permission/account',
    children: [{
        path: 'account',
        name: '用户管理',
        component: (resolve) => require(['./views/account.vue'], resolve)
    }, {
        path: 'role',
        name: '角色管理',
        component: (resolve) => require(['./views/role.vue'], resolve)
    }, {
        path: 'resource',
        name: '权限管理',
        component: (resolve) => require(['./views/resource.vue'], resolve)
    }, {
        path: 'password',
        name: '修改密码',
        component: (resolve) => require(['./views/password.vue'], resolve)
    }, {
        path: 'orgmanager',
        name: '党组织管理',
        component: (resolve) => require(['./views/orgmanager.vue'], resolve)
    }, {
        path: 'userorg',
        name: '用户组织',
        component: (resolve) => require(['./views/userorg.vue'], resolve)
    }]
}]