<template>
    <div class="info-list">
        <mt-swipe :auto="2000" class="slide" v-if="info4RtxPicList.length">
            <mt-swipe-item v-for="pic in info4RtxPicList" :key="pic.id">
                <router-link 
                        class="link"
                        :to="{ path: '/home/detail', query: { 
                            id: pic.id,
                            nodeId: pic.curNodeId_?pic.curNodeId_:'',
                            instanceId: pic.instanceId_?pic.instanceId_:'',
                            definitionId:pic.definitionId_?pic.definitionId_:'',
                            businessKey: pic.business_Key_?pic.business_Key_:'' ,
                        }}">
                    <img :src="pic.picUrl" :alt="pic.title" class="stick">
                </router-link>
            </mt-swipe-item>
        </mt-swipe>
        <div class="nav-list">
            <mt-navbar v-model="selected">
                <mt-tab-item v-for="li in column4RtxList" :key="li.id" :id="li.id">{{li.name + '-' + li.id}}
                </mt-tab-item>
            </mt-navbar>
        </div>
        <div class="info-wrapper" ref="wrapper">
            <Loadmore
                :on-infinite="onInfinite"
                :options="loadmoreOpt"
                :init-scroll="initScroll"
                :style="{ height: wrapperHeight + 'px'}"
            >
                <!-- 这一层div如果有ul可以省略,没有则必须添加
                    需要有宽度和高度,否则在数据少的情况下ios会有空白现象 -->
                <div style="width:100%;">
                    <router-link class="mint-cell" v-for="info in info4RtxList"
                        :key="info.id"
                        :to="{ path: '/home/detail', query: { 
                            id: info.id,
                            nodeId: info.curNodeId_?info.curNodeId_:'',
                            instanceId: info.instanceId_?info.instanceId_:'',
                            definitionId:info.definitionId_?info.definitionId_:'',
                            businessKey: info.business_Key_?info.business_Key_:'' ,
                            }}">
                        <div class="mint-cell-wrapper">
                            <div class="mint-cell-title">
                                <span class="mint-cell-text">{{info.title}}</span> 
                                <span class="mint-cell-label">{{parseTimeDate(info.createDate)}}</span>
                            </div> 
                        </div>
                    </router-link>
                </div>

            </Loadmore>
            <router-link :to="'todo'">
                <mt-palette-button
                    class="pb"
                    mainButtonStyle="color:#fff;background-color:#26a2ff;font-size:12px;"
                    style="right:30px;z-index:999 ">待办
                    <div class="info-badge" v-if="todoSize > 0">
                        <mt-badge size="small" color="#fc5461"></mt-badge>
                    </div>
                    <div class="my-icon-button">{{todoSize}}</div>
                </mt-palette-button>
            </router-link>
        </div>
    </div>
</template>

<script>
    import {Indicator, Toast} from 'mint-ui';
    import Util from '@/libs/util.js';
    import Loadmore from '@/components/loadmore';
    //加载更多文档地址
    //http://www.mescroll.com/api.html
    export default {
        name : 'jc-infoList',
        components: {
            Loadmore
        },
        data() {
            return {
                //当前选中的栏目
                selected: '',
                //带有图片的信息
                info4RtxPicList: [],
                // 信息栏目列表
                column4RtxList: [],
                //默认第一个栏目下的信息
                info4RtxList: [],
                //加载数据的loading
                loading: false,
                //待办数量
                todoSize: 0,
                //控制容器的高度
                wrapperHeight: 200,
                /**
                 * 存放所有栏目的页面数据
                 * columns对象的key对应的是栏目的id, value是当前栏目的pageNum
                 */
                columns: {},
                //
                loadmoreOpt: {
                    up: {
                        toTop: {
                            src : false//不显示返回顶部按钮
                        },
                        page: {
                            size: 10
                        }
                    }
                }
            }
        },
        methods: {
            initScroll(mescroll){
                this.mescroll = mescroll;
            },
            onInfinite() {
                this.columns[this.selected]++;
                this.getList();
            },
            parseData(dataList) {
                let _this = this;
                _this.info4RtxPicList = dataList.info4RtxPicList;
                _this.info4RtxList = dataList.info4RtxList;
                _this.column4RtxList = dataList.column4RtxList.map((column) => {
                    _this.columns[column.id] = 0;
                    return column;
                });
                //将第一个栏目设置为选中
                _this.selected = _this.column4RtxList[0].id;
            },
            parseTimeDate(stamp) {
                return Util.format(new Date(stamp), 'yyyy-MM-dd');
            },
            getList() {
                let _this = this;
                //如果是切换tab过来的请求,分页信息重置
                if (_this.isTab) {
                    _this.columns[_this.selected] = 0;
                }
                //加载loading
                _this.showLoading();
                //获取数据
                _this.Api.INFO.getInfoList({
                    columnId: _this.selected,
                    pageNum: _this.columns[_this.selected]
                }).then(res => {
                    if (res.data.code === '000000') {
                        if (res.data.body.length) {
                            _this.info4RtxList = _this.isTab ? res.data.body : _this.info4RtxList.concat(res.data.body);
                        }
                        //需要把关闭加载进度的方法放到这里, 保证无论是否有数据都会调用
                        _this.mescroll.endSuccess(res.data.body.length);
                    } else {
                        Toast(res.data.errormsg);
                    }
                    _this.$nextTick(() => {
                        _this.hideLoading();
                    });
                    _this.isTab = false;
                }).catch(error => {
                    _this.hideLoading();
                })
            },
            getTodoSize() {
                var _this = this;
                //请求列表数据
                /* _this.Api.INFO.getTodoSize().then((res) => {
                    if (res.data.code === '000000') {
                        _this.todoSize = parseInt(res.data.body);
                    } else {
                        Toast({
                            message: res.data.errormsg,
                            position: 'bottom',
                            duration: 5000
                        });
                    }
                }).catch((error) => {}); */
            },
            showLoading() {
                Indicator.open();
            },
            hideLoading() {
                Indicator.close();
            }
        },
        mounted() {
            var _this = this;
            _this.showLoading();
            _this.isTab = false;
            //请求列表数据
            _this.Api.INFO.getInfoAll().then(function (res) {
                if (res.data.code === '000000') {
                    _this.parseData(res.data.body);
                } else {
                    Toast({
                        message: res.data.errormsg,
                        position: 'bottom',
                        duration: 5000
                    });
                }
                _this.$nextTick(() => {
                    _this.wrapperHeight = document.documentElement.clientHeight - _this.$refs.wrapper.getBoundingClientRect().top
                    _this.hideLoading();
                });
            }).catch(function (error) {
                _this.hideLoading();
            });
            _this.getTodoSize();
        },
        watch: {
            selected: function () {
                this.isTab = true;
                this.mescroll.resetUpScroll();
            }
        }
    }
</script>

<style lang="scss">
    @import '../../assets/sass/base.scss';
    .info-list{
        .slide {
            padding: $padding-default;
            background-color: #fff;
            .link{
                display: block;
                height: 100%;
            }
        }

        .stick {
            width: 100%;
            height: 182px;
            border-radius: 6px;
        }

        // .info-wrapper {
        //     a:nth-last-child(2) {
        //         border-bottom: none;
        //     }
        // }

        .yo-scroll .inner {
            padding: 0 $padding-default;
        }

        .nav-list {
            background-color: #fff;
            white-space: nowrap;
            /*控制横向混动  规定段落中的文本不进行换行：*/
            overflow-x: auto;
            /*控制横向混动  	裁剪内容 - 提供滚动机制。*/
            overflow-y: hidden;
            /*控制横向混动  	裁剪内容 - 不提供滚动机制。*/
            border-bottom: 1px solid #ccc;
        }

        .normal .nav-list a {
            border: none;
            display: inline-block;
            /*控制横向混动*/
            height: 60px;
            /*控制横向混动*/
            padding: 0 $padding-default;
            /*控制横向混动*/
        }

        .mint-tab-item-label {
            font-size: 18px;
            min-width: 85px;
            margin: 0 5px;
        }

        .mint-cell-text {
            font-size: 18px;
            color: #333;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .mint-swipe-indicators {
            position: absolute;
            bottom: 10px;
            left: 50%;
        }

        .mint-swipe-indicator {
            width: 8px;
            height: 8px;
            display: inline-block;
            border-radius: 100%;
            background: #8c8882;
            opacity: 1;
            margin: 0 3px;
        }

        .mint-cell-title {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }

        .mint-cell {
            padding: $page-padding;
            border-bottom: 1px solid #e2e2e2;
        }

        .mint-swipe,
        .mint-swipe-items-wrap,
        .mint-swipe-items-wrap > div {
            height: 200px;
        }

        .mint-cell-label {
            font-size: 14px;
        }

        .mint-navbar .mint-tab-item.is-selected {
            margin: 0;
            color: $tabNav-color-active;
            border-bottom: 3px solid $tabNav-color-active;
        }

        .pb {
            position: relative;
            width: 60px;
            height: 60px;
            line-height: 60px;
            color: #FFF;
            position: fixed;
            bottom: 30px;
            box-shadow:0 10px 20px -6px #4d8afe ;
        }

        .mint-cell-wrapper {
            height: 65px;
            background: none;
            padding: 0;
        }

        .mint-cell-label {
            margin-top: 10px;
        }
        .mint-main-button{
            background: $tabNav-color-active !important;
        }

        .my-icon-button {
            position: absolute;
            top: -20px;
            left: 3px;
            color: #fff;
            font-size: 20px;
            font-weight: bold;
            z-index: 666;
        }

        .mint-sub-button-container {
            position: absolute;
            top: 9px;
            left: 18px;
            color: #fff;
            font-size: 13px;
            z-index: 999;
        }

        .mint-badge.is-primary {
            padding: 0;
            width: 10px;
            height: 10px;
            border-radius: 50%;
        }
        .mint-sub-button-container>*{
            transition: none;
        }

        .mint-sub-button-container > .info-badge {
            width: 20px;
            height: 20px;
            position: absolute;
            left: auto;
            top: -32px;
            right: -25px;
            padding: 0;
        }
        .expand .palette-button-11-sub-1 {
            transform: none;
        }
    }
    @component-namespace page @component infinite {
        @descendent desc {
            text-align: center;
            color: #666;
            padding-bottom: 5px;
            border-bottom: solid 1px #eee;
        }
        @descendent listitem {
            height: 50px;
            line-height: 50px;
            border-bottom: solid 1px #eee;
            text-align: center;
            &:first-child {
                border-top: solid 1px #eee;
            }
        }
        @descendent wrapper {
            margin-top: -1px;
            overflow: scroll;
        }
        @descendent loading {
            text-align: center;
            height: 50px;
            line-height: 50px;
            div {
                display: inline-block;
                vertical-align: middle;
                margin-right: 5px;
            }
        }
    }
</style>
