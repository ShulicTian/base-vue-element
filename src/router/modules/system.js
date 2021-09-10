export default [
    {
        path: 'userManage',
        component: () => import('components/page/sys/user/UserManage.vue'),
        meta: { title: '用户管理' }
    },
    {
        path: 'userInfo',
        component: () => import('components/page/sys/user/UserInfo.vue'),
        meta: { title: '账号信息' }
    },
    {
        path: 'menuManage',
        component: () => import('components/page/sys/menu/MenuManage.vue'),
        meta: { title: '菜单管理' }
    },
    {
        path: 'roleManage',
        component: () => import('components/page/sys/role/RoleManage.vue'),
        meta: { title: '角色管理' }
    },
    {
        path: 'areaManage',
        component: () => import('components/page/sys/area/AreaManage.vue'),
        meta: { title: '区域管理' }
    },
    {
        path: 'dictManage',
        component: () => import('components/page/sys/dict/DictManage.vue'),
        meta: { title: '字典管理' }
    },
    {
        path: 'sysParam',
        component: () => import('components/page/sys/param/SysParamManage.vue'),
        meta: { title: '系统参数' }
    },
    {
        path: 'logManage',
        component: () => import('components/page/sys/log/LogManage.vue'),
        meta: { title: '系统日志' }
    },
    {
        path: 'modifyPassword',
        component: () => import('components/page/sys/user/ModifyPassword.vue'),
        meta: { title: '修改密码' }
    },
    {
        path: 'fastGenerate',
        component: () => import('components/page/sys/generate/FastGenerate.vue'),
        meta: { title: '快速生成' }
    },
    {
        path: 'bulletinManage',
        component: () => import('components/page/sys/bulletin/BulletinManage.vue'),
        meta: { title: '系统公告' }
    }
];
