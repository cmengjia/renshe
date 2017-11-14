import Vue from 'vue';
import Mint from 'mint-ui';
//mint样式库
import 'mint-ui/lib/style.css';
//vue入口文件
import App from './App';
//vue-router配置文件
import router from './router';
//vuex配置文件
import store from './store';
//解决click点击300毫秒延时问题
import FastClick from 'fastclick';
//API
import Api from './libs/api';
//引用mint-vue库
Vue.use(Mint);
//设置为 false 以阻止 vue 在启动时生成生产提示。
Vue.config.productionTip = false
//将接口挂载到vue实例是再 作用域内可适用 this.Api调用
Vue.prototype.Api = Api;
//应用到全局
FastClick.attach(document.body);
/* 初始化 */
new Vue({
    el: '#app',
    store,
    router,
    render: h => h(App)
    // template: '<App/>',
    // components: { App }
})