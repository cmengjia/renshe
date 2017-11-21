const MIALROUTE = [{
        path: '/contacts',
        redirect: '/contacts/100001',
        replace: true
    },
    {
        path: '/contacts/:id',
        name: 'Contacts',
        component: resolve => require(['@/components/contacts/index.vue'], resolve),
        meta: {
            title: '通讯录'
        }
    }, {
        path: '/mail',
        name: 'Mail',
        component: resolve => require(['@/components/contacts/mail.vue'], resolve),
        meta: {
            title: '通讯录'
        }
    }, {
        path: '/mail/home',
        name: 'Home',
        component: resolve => require(['@/modules/email/email/home.vue'], resolve),
        meta: {
            title: '邮件首页'
        }
    }, {
        path: '/mail/compose',
        name: 'Compose',
        component: resolve => require(['@/modules/email/email/compose.vue'], resolve),
        meta: {
            title: '写邮件'
        }
    }, {
        path: '/mail/detail',
        name: 'Detail',
        component: resolve => require(['@/modules/email/email/detail.vue'], resolve),
        meta: {
            title: '详细页面'
        }
    }
]
export {
    MIALROUTE
};