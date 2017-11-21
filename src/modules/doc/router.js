const DOCROUTER = [{
        path: '/doc',
        component: resolve => require(['@/modules/doc/untreated.vue'], resolve),
        meta: {
            title: '公文管理'
        }
    },
    {
        path: '/doc/receivedetails',
        name: 'Receivedetails',
        component: resolve => require(['@/modules/doc/receivedetails.vue'], resolve),
        meta: {
            title: '流程详情'
        }
    },
    {
        path: '/doc/senddetails',
        name: 'Senddetails',
        component: resolve => require(['@/modules/doc/senddetails.vue'], resolve),
        meta: {
            title: '流程详情'
        }
    }
];

export { DOCROUTER }