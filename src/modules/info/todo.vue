<template>
    <Loadmore 
        class="page-infinite"
            :on-infinite="onInfinite"  
            :init-scroll="initScroll" 
            :options="loadMoreOptions" 
            :style="{ height: wrapperHeight + 'px' }">
            <div>
                <router-link v-for="item in todoList" :key="item.id" class="mint-cell"
                :to="{ path: 'tododetail', query: { 
                    id: item.id ,
                    nodeId: item.curNodeId_,
                    definitionId_: item.definitionId_,
                    instanceId_:item.instanceId_,
                    business_Key_: item.business_Key_,
                    curNodeId_: item.curNodeId_,
                    taskId_: item.taskId_
                    }}">
                    <div class="mint-cell-wrapper">
                        <div class="mint-cell-title"><span class="approve-infor">信息管理</span>
                            <span class="mint-cell-text" v-html="item.title"></span> 
                        </div> 
                        <div class="mint-cell-value">
                            <label class="infor-label infor-date">{{parseTimeDate(item.createDate)}}</label>
                        </div>
                    </div>
                </router-link>
            </div>
    </Loadmore>
</template>
 
<script>
    import Loadmore from '@/components/loadmore';
    import Util from '@/libs/util.js';
    import { Toast } from 'mint-ui';
    export default {
        components:{
            Loadmore
        },
        data() {
            return {
                todoList: [],
                wrapperHeight: document.documentElement.clientHeight,
                //上拉刷新配置
                loadMoreOptions: {
                    up: {
                        toTop: {
                            src : true//不显示返回顶部按钮
                        },
                        page: {
                            size: 10
                        }
                    }
                },
                pageNum: 0
            }
        },
        activated(){
            this.pageNum = 0;
            this.getList(true);
        },
        methods: {
            initScroll(mescroll){
                this.mescroll = mescroll;
            },
            onInfinite(){
                this.pageNum++;
                this.getList();
            },
            parseTimeDate(stamp) {
                return Util.format(new Date(stamp), 'yyyy-MM-dd');
            },
            getList(keep){
                const _this = this;
                _this.Api.INFO.getTodoList(_this.pageNum).then( res => {
                    if (res.data.code === '000000') {
                        _this.todoList = keep ? res.data.body : _this.todoList.concat(res.data.body);
                    }else{
                        Toast(res.data.errormsg);
                    }
                    _this.mescroll.endSuccess(res.data.body.length);
                }).catch(error=>{});
            }
        }
    }
</script>
 
<style lang="scss">
    @import '../../assets/sass/params';
  
    .page-infinite {
        height: 100vh;
        overflow-y: scroll; 
        padding: $page-padding;
        .mint-cell:active {
            background: $list-active-bgcolor;
        }
        .mint-cell {
            padding:$list-type-padding;
            height: $list-height;
            border-bottom: $list-bottom-border;
            .mint-cell-allow-right::after {
                display: none;
            }
            .mint-cell-wrapper {
                position: relative;
                padding: 0;
                background-image: none;
                align-items: stretch;
                .mint-cell-title {
                    height: 30px;
                    line-height:28px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    .mint-cell-text {
                        line-height:30px;
                        position:absolute;
                        text-decoration: none;
                        font-size: $list-title-font;
                        color: $list-title-color;
                    }
                    .approve-infor {
                        padding:3px;
                        margin-right:10px;
                        font-size: $list-type-font;
                        color: $list-type-color;
                        border: $list-type-border;
                        box-sizing:border-box;
                        border-radius: $list-type-radius;
                    }
                }
                .mint-cell-value {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    .infor-date {
                        font-size: $list-label-font;
                        color: $list-label-color;
                    }
                    
                }
            }
            .toodjump {
                color: #333;
                text-decoration: none;
            }
        }
    }
</style>