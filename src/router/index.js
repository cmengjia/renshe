/**
 * 路由配置文件
 */
import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';
//信息管理路由配置
import {INFOROUTER} from '@/modules/info/router.js';
//登录页路由配置,   build时应注释掉这行代码
import { LOFINROUTER } from '@/modules/login/router.js';

//邮件管理
import { MIALROUTE } from '@/modules/email/router.js';

Vue.use(Router);

const routerConfig = {
    routes: [
        {
            path: '/rs',
            name: 'Rs',
            component: resolve => require(['@/modules/home/home.vue'], resolve),
            meta: {
                title: '首页'
            }
        },
        {
            path: '/',
            redirect: '/rs'
        }
    ]
}

if(process.env.NODE_ENV != 'production'){
    routerConfig.routes = routerConfig.routes.concat(LOFINROUTER);
}

routerConfig.routes = routerConfig.routes.concat(INFOROUTER ,MIALROUTE);


const router = new Router(routerConfig);

//跳转到每个组件下时候,修改当前title, 在微信或RTX中可以直接显示在menubar中
router.beforeEach((to, from, next) => {
    document.title = to.meta.title || document.title;
    //移动端如果使用异步组件加载那么还是需要一点等待时间的，在网络慢时等待时间会更长。显示Loading状态缓解一下用户等待情绪就十分重要。
    store.commit('updateLoadingStatus', {
        isLoading: true
    })
    next();
});
router.afterEach(function (to) {
    store.commit('footerState', {
        isfooterState: to.name === 'Home'
    })
    store.commit('updateLoadingStatus', {
        isLoading: false
    })

})

export default router;
