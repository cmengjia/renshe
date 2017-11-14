const LOFINROUTER = [
    {
        path: '/login',
        name: 'Login',
        component: resolve => require(['@/modules/login/login.vue'], resolve),
        meta: {
            title: '登录页'
        }
    }
];

export {
    LOFINROUTER
};