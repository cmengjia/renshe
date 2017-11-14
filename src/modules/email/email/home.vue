<template>
    <div>
        <!--<mt-search v-model="search" cancel-text="取消" placeholder="搜索"></mt-search>-->
        <mt-navbar v-model="selected">
            <mt-tab-item id="1">未读
                <div class="info-badge" v-show="unread">
                    <mt-badge size="small" color="#fc5461"></mt-badge>
                </div>
            </mt-tab-item>
            <mt-tab-item id="2">收件箱</mt-tab-item>
            <mt-tab-item id="3"><i class="jcm-biaoxing"></i>邮件</mt-tab-item>
            <mt-tab-item id="4" v-show="false">草稿箱</mt-tab-item>
            <mt-tab-item id="5">已发送</mt-tab-item>
        </mt-navbar>
        <mt-search v-model="search" placeholder="搜索"></mt-search>
        <div ref="wrapper" class="page-infinite">
            <Loadmore
                :on-infinite="onInfinite"
                :options="loadmoreOpt"
                :init-scroll="initScroll"
                :style="{ height: wrapperHeight + 'px'}">
                <div class="homeBr">
                    <router-link v-for="info in getMailAll" :key="info.id" class="mint-cell"
                        :to="{ path: selected == '4' ? 'compose' : 'detail', query: { 
                            id: info.id, 
                            selected : selected
                        }}">
                            <div class="mint-cell-wrapper">
                                <div class="mint-cell-title">
                                    <span class="mint-cell-text">{{info.mailTitle}}</span> 
                                </div> 
                                <div class="mint-cell-value">
                                    <label class="infor-label infor-date"><span class="senderUserName">发件人：{{info.senderUserName}}</span>{{parseTimeDate(info.senderTime)}}</label>
                                </div>
                            </div>
                        </router-link>
                    </div>
            </Loadmore>
        </div>
    </div>
</template>
<script>
    import {Indicator, Toast} from 'mint-ui';
    import { Search } from 'mint-ui';
    import Util from '@/libs/util.js';
    import Loadmore from '@/components/loadmore';
    const URL_LIST = {
        '1': 'unReadMail',
        '2': 'receiveMail',
        '3': 'mailRtx',
        '4': 'manageDraft',
        '5': 'manageSend'
    }
    export default {
        beforeRouteEnter(to, from, next){
			next(vm=>{
                vm.getunread();
				// if(vm.$route.query.selected){
                //     vm.selected = vm.$route.query.selected;
                //     vm.getList(vm.selected);
                // }
			})
		},
        components: {
            Loadmore
        },
        data() {
            return {
                //菜单类
                searchState: true,
                //当前选中的栏目
                selected: '2',
                //默认第一个栏目下的信息
                getMailAll: [],
                //加载数据的loading
                loading: false,
                search: "",
                emailData :{},
                //待办数量
                unread: false,
                //控制容器的高度
                wrapperHeight: 200,
                /**
                 * 存放所有栏目的页面数据
                 * columns对象的key对应的是栏目的id, value是当前栏目的pageNum
                 */
                columns: {},
                //上拉刷新配置
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
            parseTimeDate(stamp) {
                return Util.format(new Date(stamp), 'yyyy-MM-dd');
            },
            getList(isTab) {
                let _this = this;
                //如果是切换tab过来的请求,分页信息重置
                if (isTab) {
                    _this.getMailAll= [];
                    _this.columns[_this.selected] = 0;
                    _this.$route.query.selected = _this.selected;
                }
                //请求列表数据
            _this.Api.MAIL.getMailAll({
                url: URL_LIST[_this.selected],
                pageNum : _this.columns[_this.selected]
            }).then(function (res) {
                if (res.data.code === '000000') {
                    if (res.data.body.length) {
                            _this.getMailAll = _this.oldData = isTab ? res.data.body : _this.getMailAll.concat(res.data.body);
                        }
                        //需要把关闭加载进度的方法放到这里, 保证无论是否有数据都会调用
                        _this.mescroll.endSuccess(res.data.body.length);
                } else {
                    Toast({
                        message: res.data.errormsg,
                        position: 'bottom',
                        duration: 5000
                    });
                    _this.mescroll.endSuccess();
                }
                _this.$nextTick(() => {
                    _this.hideLoading();
                });
            }).catch(error => {
                    _this.hideLoading();
                })
                _this.getunread();
            },
            getunread(){
                let _this = this;
                _this.Api.MAIL.getMailAll({
                    url: URL_LIST[1],
                    pageNum : 0
                }).then(function (res) {
                    if (res.data.code === '000000') {
                        if (res.data.body.length) {
                            _this.unread = true;
                        }
                        else{
                            _this.unread = false;
                        }
                    }
                });
            },
            showLoading() {
                Indicator.open();
            },
            hideLoading() {
                Indicator.close();
            }
        },
        mounted() {
            let selectIndex = window.sessionStorage.getItem('selectIndex');
            if(selectIndex){
                this.selected = selectIndex;
            }
            //内容盒子高度
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top - 50;
            this.columns[this.selected] = 0;
            this.getList();
            this.oldData = [];
        },
        watch: {
            selected: function (val) {
                window.sessionStorage.setItem('selectIndex', val)
                this.getList(true);
            },
            search: function(val){
                if(val){
                     this.getMailAll = this.oldData.filter((item)=>{
                        return item.mailTitle.indexOf(val) > -1;
                    })
                }else{
                    this.getMailAll = this.oldData;
                }
            }
        }
    }
</script>
 
<style lang="scss">
    @import '../../../assets/sass/params';
    .homeBr{
        width: 100%;
    }
    .mint-search .mintui-search{
        font-size: 18px;
        margin-right: 5px;
    }
    .mint-search{
        height: 44px;
        color: #333;
        font-size: 15px;
    }
    .mint-searchbar{
        background: #f2f2f2;
    }
    .mint-navbar .mint-tab-item{
        padding: 10px 0;
    }
    .mint-navbar .mint-tab-item.is-selected{
        margin: 0;
    }
    .mint-tab-item-label{
        font-size: 15px;
        position: relative;
    }
    .mint-tab-item-label > .info-badge {
        width: 20px;
        height: 20px;
        position: absolute;
        right: 5px;
        top: 5px;
        padding: 0;
    }
    .mint-tab-item-label i{
        color: #ffd213;
        margin-right: 3px;
        font-size: 17px;
        top: -1px;
        position: relative;
    }
    .mint-badge.is-size-small{
        border-radius: 50px;
        padding: 0;
        width: 6px;
        height: 6px;
    }
    .page-infinite {
        padding: $page-padding;
        .mint-cell:active {
            background: $list-active-bgcolor;
        }
        .mint-cell {
            height: 68px !important;
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
                        padding:$list-type-icon-padding;
                        margin-right:10px;
                        font-size: $list-type-font;
                        color: $list-type-color;
                        border: $list-type-border;
                        border-radius: $list-type-radius;
                    }
                }
                .mint-cell-value {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    .senderUserName{
                        margin-right: 20px;
                    }
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