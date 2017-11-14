<template>
    <div id="app">
        <jc-header class="header" v-if="headerState"></jc-header>
        <main :style="{marginTop: headerState ? '50px' : ''}">
            <transition :name="transitionName" mode="out-in">
                <keep-alive>
                    <router-view class="child-view"></router-view>
                </keep-alive>
            </transition>
        </main>
    </div>
</template>
 
<script>
import JcHeader from "@/components/layout/header.vue";
//使用状态管理
import { mapState } from 'vuex';
 
export default {
    name: 'app',
    components: {
        JcHeader
    },
    data() {
        return {
            headerState: false,
            transitionName: 'slide-left'
        }
    },
    computed: {
        ...mapState({
            isLoading: state => state.JCFE.isLoading,
        })
    },
    watch: {
        '$route' (to, from) {
            const toDepth = to.path.length
            const fromDepth = from.path.length;
            this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
        }
    }
}
</script>
 
 
<style>
    #app {
        color: #2c3e50;
        height: 100vh;
        background: #fff;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    }
    .child-view {
        transition: all .5s cubic-bezier(.55,0,.1,1);
    }
    
    .slide-left-enter, .slide-right-leave-active {
        opacity: 0;
        -webkit-transform: translate(30px, 0);
        transform: translate(30px, 0);
    }
    .slide-left-leave-active, .slide-right-enter {
        opacity: 0;
        -webkit-transform: translate(-30px, 0);
        transform: translate(-30px, 0);
    }
 
</style>