const INFOROUTER = [
    {
        path: '/info',
        name: 'Info',
        component: resolve => require(['@/modules/info/info.vue'], resolve),
        meta: {
            title: '信息管理'
        }
    },
    {
        path: '/info/todo',
        name: 'InfoTodo',
        component: resolve => require(['@/modules/info/todo.vue'], resolve),
        meta: {
            title: '待办列表',
            keepAlive: true
        }
    }, {
        path: '/info/tododetail',
        name: 'InfoTodoDetail',
        component: resolve => require(['@/modules/info/todoDetail.vue'], resolve),
        meta: {
            title: '待办详情',
            keepAlive: false
        }
    },
    {
        path: '/info/detail',
        name: 'InfoDetail',
        component: resolve => require(['@/modules/info/detail.vue'], resolve),
        meta: {
            title: '信息详细',
            keepAlive: false
        }
    }
];

export {INFOROUTER}