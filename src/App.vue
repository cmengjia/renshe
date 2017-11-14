<template>
  <div id="app">
    <jc-header class="header" v-if="headerState"></jc-header>
    <main :style="{bottom: footerState ? '43px' : '0'}" class="main">
        <router-view></router-view>
    </main>
    <!-- 页面切换时执行的动画 -->
    <div class="mint-indicator" v-if="isLoading">
        <div class="mint-indicator-wrapper" style="padding: 15px;">
            <span class="mint-indicator-spin">
                <div class="mint-spinner-snake" style="border-top-color: rgb(204, 204, 204); border-left-color: rgb(204, 204, 204); border-bottom-color: rgb(204, 204, 204); height: 32px; width: 32px;"></div>
            </span> 
           <!--<span class="mint-indicator-text">加载中...</span> -->
        </div> 
    </div>
  </div>
</template>

<script>
window.addEventListener('touchmove', function(e){
    if ( window.cantouch ){
        e.preventDefault();
    }
});
import JcHeader from "@/components/layout/header.vue";
//使用状态管理
import { mapState } from 'vuex';

export default {
    name: 'app',
    components: {
        JcHeader
    },
    data(){
        return {
          headerState: true
        }
    },
    computed: {
        ...mapState({
            isLoading: state => state.JCFE.isLoading,
            footerState: state => state.MAIL.isfooterState,
        })
    },
    methods: {}
  }
</script>


<style lang="scss">
    @import "assets/sass/base.scss";
</style>
