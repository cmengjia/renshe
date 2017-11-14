<template>
  <div id="app">
    <jc-header class="header" v-if="headerState"></jc-header>
    <main :style="{marginTop: headerState ? '50px' : ''}">
          <transition>
              <router-view></router-view>
          </transition>
    </main>
    <!-- 页面切换时执行的动画 -->
    
  </div>
</template>

<script>
window.addEventListener('touchmove', function(e){
    if ( window.cantouch ){
        e.preventDefault();
    }
});
import JcHeader from "@/components/layout/header.vue";
import JcFooter from "@/components/layout/footer.vue";
//使用状态管理
import {mapState} from 'vuex';

export default {
    name: 'app',
    components: {
        JcHeader,
        JcFooter
    },
    data(){
        return {
            headerState: false
        }
    },
    computed: {
        ...mapState({
            isLoading: state => state.JCFE.isLoading
        })
    }
  }
</script>


<style>

  #app ,.main{
      overflow: hidden;
  }

</style>
