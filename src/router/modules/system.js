export default [
    {
        path: '/userManager',
        component: () => import('components/page/sys/user/UserManager.vue'),
        meta: { title: '用户管理' }
    },
    {
        path: '/userInfo',
        component: () => import('components/page/sys/user/UserInfo.vue'),
        meta: { title: '个人资料' }
    },
    {
        path: '/menuManager',
        component: () => import('components/page/sys/menu/MenuManager.vue'),
        meta: { title: '菜单管理' }
    },
    {
        path: '/roleManager',
        component: () => import('components/page/sys/role/RoleManager.vue'),
        meta: { title: '角色管理' }
    },
    {
        path: '/areaManager',
        component: () => import('components/page/sys/area/AreaManager.vue'),
        meta: { title: '区域管理' }
    },
    {
        path: '/dictManager',
        component: () => import('components/page/sys/dict/DictManager.vue'),
        meta: { title: '字典管理' }
    },
    {
        path: '/sysParam',
        component: () => import('components/page/sys/param/SysParamManager.vue'),
        meta: { title: '系统参数' }
    },
    {
        path: '/logManager',
        component: () => import('components/page/sys/log/LogManager.vue'),
        meta: { title: '系统日志' }
    },
    {
        path: '/modifyPassword',
        component: () => import('components/page/sys/user/ModifyPassword.vue'),
        meta: { title: '修改密码' }
    }
];
