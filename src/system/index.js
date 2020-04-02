export default [{
    path: '/system',
    name: '系统',
    meta: {
        icon: '&#xe63b;'
    },
    component: (resolve) => require(['./views/index.vue'], resolve),
    redirect: '/system/systemSettings',
    children:[
        {
            path: 'systemSettings',
            name: '系统设置',
            component: (resolve) => require(['./views/system_settings.vue'], resolve),
            redirect: '/system/systemsettings/site/sitesettings',
            children:[
                {
                    path: 'siteSettings',
                    name: '网站设置',
                    component: (resolve) => require(['./views/site/site_settings.vue'], resolve)
                },
                {
                    path: 'configManage',
                    name: '配置管理',
                    component: (resolve) => require(['./views/site/config_manage.vue'], resolve)
                },
                {
                    path: 'datadict',
                    name: '数据字典',
                    component: (resolve) => require(['./views/datadict.vue'], resolve)
                },
                {
                    path: 'version',
                    name: '版本号管理',
                    component: (resolve) => require(['./views/version.vue'], resolve)
                }
            ]
        },
    ]
}]