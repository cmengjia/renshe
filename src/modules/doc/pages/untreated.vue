<template>
    <div class="archives-untreated info-wrapper" @click.stop="ctype ? ctype=false : ''">
        <div class="page-navbar">
            <mt-navbar v-model="selected">
                <mt-tab-item id="1">待办公文</mt-tab-item>
                <mt-tab-item id="2">收文查询</mt-tab-item>
                <mt-tab-item id="3">发文查询</mt-tab-item>
            </mt-navbar>
            <form action="" class="pagesearch">
                <div>
                    <a class="search-type" href="javascript:void(0);" @click.stop="ctype = !ctype">
                        <span >类型</span>
                        <label :style="{'transform' : 'rotate(' + (ctype ? 180 : 0) + 'deg)'}" class="type-button"></label>
                    </a>
                    <div class="mint-popup-1" v-show="ctype">
                        <span class="triangle-1"></span>
                        <ul class="flow-infor">
                            <li @click.stop="filterFlowData('all')">全部类型</li>
                            <li @click.stop="filterFlowData(flow.definitionId)" v-for="flow in flowsData" :key="flow.definitionId">{{flow.flowName}}</li>
                        </ul>
                    </div>
                </div>
                <input type="search" :style="{ width: searchWidth }" placeholder="搜索" v-model="val">
                <i class="mintui mintui-search"></i>
            </form>
            <div ref="wrapper">
                <div v-show="selected == '1'" style="width: 100%;">
                    <div class="untreatedList" :style="{ height: wrapperHeight + 'px'}">
                        <router-link class="mint-cell" v-for="todo in todoList" :key="todo.id" :to="linkOption(todo)">
                            <div class="mint-cell-wrapper">
                                <div class="mint-cell-value">
                                    <span class="mint-cell-text">{{todo.title}}</span> 
                                    <span class="mint-cell-label">
                                    	<span class="flow-type" :class="'flow-type'+flowIndex(todo.definitionId_)" v-if="todo.flowName">{{todo.flowName}}</span>
                                    	<span class="create-date">{{parseTimeDate(todo.createDate)}}</span>
                                    </span>
                                </div>
                            </div>
                        </router-link>
                    </div>
                </div>
                <div v-show="selected == '2' || selected == '3'">
                    <Loadmore  :on-infinite="onInfinite" :options="loadmoreOpt" :init-scroll="initScroll" :style="{ height: wrapperHeight + 'px'}">
                        <div class="mint-tab-item">
                            <router-link class="mint-cell" v-for="myObj in (selected == '2' ? receList : sendList)" :key="myObj.id" :to="linkOption(myObj)">
                                <div class="mint-cell-wrapper">
                                    <div class="mint-cell-value">
                                        <span class="mint-cell-text">{{myObj.title}}</span> 
                                        <span class="mint-cell-label">
	                                    	<span class="flow-type" :class="'flow-type'+flowIndex(myObj.definitionId_)" v-if="myObj.flowName">{{myObj.flowName}}</span>
	                                    	<span class="create-date">{{parseTimeDate(myObj.createDate)}}</span>
	                                    </span>
                                    </div>
                                </div>
                            </router-link>
                        </div>
                    </Loadmore>
                </div>
            </div>
        </div>
    </div>
</template>
 
<script>
    import {
        Indicator,
        Toast
    } from 'mint-ui';
    import Util from '@/libs/util.js';
    import Loadmore from '@/components/loadmore';
    export default {
        components: {
            Loadmore
        },
        data() {
            return {
                //流程列表
                flowsList: [],
                //搜索框的宽度
                searchWidth: '',
                //搜索框中内容
                val: '',
                //多选公文类型
                //types:['办公室收文','信息中心收文','财务科收文','秘书处收文','办公室发文','省政府发文'],
                //公文类型
                ctype: false,
                //当前选中的栏目
                selected: '',
                //加载数据的loading
                loading: false,
                //控制容器的高度
                wrapperHeight: document.documentElement.clientHeight - 111,
                /**
                 * 存放所有栏目的页面数据
                 * columns对象的key对应的是栏目的id, value是当前栏目的pageNum
                 */
                columns: {},
                //上拉刷新配置
                loadmoreOpt: {
                    up: {
                        toTop: {
                            src: true //不显示返回顶部按钮
                        },
                        page: {
                            size: 10
                        },
                        noMoreSize: 5
                    }
                },
                //收文发文分页数量存储
                pageNums: {},
                //待办存储
                todoList:[],
                //收文
                receList:[],
                //发文
                sendList:[],
            }
        },
        methods: {
            initScroll(mescroll) {
                this.mescroll = mescroll;
            },
            onInfinite() {
                this.pageNums[this.selected]++;
                this.getDOCList();
            },
            parseTimeDate(stamp) {
                return Util.format(new Date(stamp), 'yyyy-MM-dd');
            },
            //公文列表
            getDOCList() {
                let _this = this;
                //加载loading
                _this.showLoading();
                //获取数据
                _this.Api.DOC[_this.selected == '2' ? 'getReceiveFlows' : 'getSendFlows'](_this.pageNums[_this.selected]).then(function(res) {
                    if (res.data.code === '000000') {
                        let data = res.data.body;
                        if(_this.selected == 2){
                            _this.receList = _this.cacheData['rece'] = _this.cacheData['rece'].concat(Array.isArray(data) ? data : JSON.parse(data));
                        }else{
                            _this.sendList = _this.cacheData['send'] = _this.cacheData['send'].concat(Array.isArray(data) ? data : JSON.parse(data));
                        }
                        //传入当前页码,保证插件计算是否有下一页时使用插件内部的变量导致出错问题
                        _this.mescroll.endSuccess(data.length , null, _this.pageNums[_this.selected]);
                    } else {
                        _this.receList = _this.sendList = [];
                        Toast(res.data.errormsg);
                    }
                    _this.$nextTick(() => {
                        _this.hideLoading();
                    });
                }).catch(error => {
                    _this.hideLoading();
                })
            },
            //待办列表
            getToDoList() {
                var _this = this;
                _this.showLoading();
                _this.Api.DOC.getToDosList().then(function(res) {
                    if (res.data.code === '000000') {
                        let data = res.data.body;
                        _this.todoList = _this.cacheData['todo'] = Array.isArray(data) ? data : JSON.parse(data);
                    } else {
                        Toast(res.data.errormsg);
                    }
                    _this.$nextTick(() => {
                        _this.hideLoading();
                    });
                }).catch(error => {
                    _this.hideLoading();
                })
            },
            //流程列表
            flowList() {
                var _this = this;
                _this.Api.DOC.getFlows().then(function(res) {
                    if (res.data.code === '000000') {
                        let data = res.data.body;
                        _this.flowsList = Array.isArray(data) ? data : JSON.parse(data);
                    } else {
                        Toast(res.data.errormsg);
                    }
                })
            },
            searchW: function() {
                this.searchWidth = document.body.clientWidth - 123 + 'px';
            },
            showLoading() {
                Indicator.open();
            },
            hideLoading() {
                Indicator.close();
            },
            //点击列表
            linkOption(obj){
                return { 
                    path: obj.docType == 1  ? 'receivedetails' : 'senddetails' , 
                    query: { 
                        id: obj.id ,
                        nodeId: obj.curNodeId_ ? obj.curNodeId_ : '',
                        definitionId_: obj.definitionId_,
                        instanceId_:obj.instanceId_,
                        business_Key_: obj.business_Key_,
                        curNodeId_: obj.curNodeId_ ? obj.curNodeId_ : '',
                        taskId_: obj.taskId_ ? obj.taskId_ : '',
                        selected: this.selected,
                    }
                }
            },
            //过滤工作流类型
            filterFlowData(type){
                let index = this.selected;
                //获取当前sheet页过滤需要数据集
                let data = this.cacheData[index == 1 ? 'todo' : index == 2 ? 'rece' : 'send'];
                if(index == 1){
                    this.todoList = type == 'all' ? data : data.filter(function(item) {
                        return item.definitionId_ == type;
                    })
                }
                if(index == 2){
                    this.receList  = type == 'all' ? data : data.filter(function(item) {
                        return item.definitionId_ == type;
                    })
                }
                if(index == 3){
                    this.sendList  = type == 'all' ? data : data.filter(function(item) {
                        return item.definitionId_ == type;
                    })
                }
                this.ctype = false;
            },
            filterSearchData(key){//根据查询关键字过滤数据
                let index = this.selected;
                let data = this.cacheData[index == 1 ? 'todo' : index == 2 ? 'rece' : 'send'];
                if(index == 1){
                    this.todoList = data.filter(function(item) {
                        return item.title.indexOf(key) != -1;
                    })
                }
                if(index == 2){
                    this.receList = data.filter(function(item) {
                        return item.title.indexOf(key) != -1;
                    })
                }
                if(index == 3){
                    this.sendList = data.filter(function(item) {
                        return item.title.indexOf(key) != -1;
                    })
                }
            },
            flowIndex(definitionId){//获取流程类型索引
        		for(let i=0;i<this.flowsList.length;i++){
        			if(this.flowsList[i].definitionId == definitionId){
        				return i/10;
        			}
        		}
        		return -1;
        	}
        },
        mounted() {
            this.cacheData = {
                todo: [],
                rece: [],
                send: []
            };
            this.searchW();
            //请求列表数据
            this.flowList();
            this.selected = '1';
            this.wrapperHeight = document.documentElement.clientHeight - this.$refs.wrapper.getBoundingClientRect().top
        },
        watch: {
            selected: function() {
            	this.val='';
                this.cacheData = {
                    todo: [],
                    rece: [],
                    send: []
                };
                if(this.selected == '1'){
                    this.getToDoList();
                }else{
                    this.pageNums[this.selected] = 0;
                    this.getDOCList();
                }
            },
            val: function(value){
            	if(value.length>0){
            		this.filterSearchData(value);
            	}else{
            		this.filterFlowData('all');
            	}
            }
        },
        computed:{
        	flowsData: function(){
        		if(this.selected == '1'){
        			return this.flowsList;
        		}else if(this.selected == '2'){
        			return this.flowsList.filter(function(item){
						return item.extStr1 == '1';
					})
        		}else{
        			return this.flowsList.filter(function(item){
						return item.extStr1 == '0';
					})
        		}
        		
        	}
        }
    }
</script>
 
<style lang="scss">
    @import '../../../assets/sass/base.scss';
    .archives-untreated {
    	.create-date{
    		float: right;
    		font-size: 14px;
    		margin-top: 3px;
    	}
    	.flow-type{
    		font-size: 14px;
	    	padding: 4px;
	    	border-radius: 3px;
	    	&.flow-type-1{
	    		color: red;
	    		border: 1px solid red;
	    	}
	    	&.flow-type0{
	    		color: #4E8DFF;
	    		border: 1px solid #4E8DFF;
	    	}
	    	&.flow-type1{
	    		color: #50C14E;
	    		border: 1px solid #50C14E;
	    	}
	    	&.flow-type2{
	    		color: #3F48CC;
	    		border: 1px solid #3F48CC;
	    	}
	    	&.flow-type3{
	    		color: #880015;
	    		border: 1px solid #880015;
	    	}
	    	&.flow-type4{
	    		color: #B848FF;
	    		border: 1px solid #B848FF;
	    	}
	    	&.flow-type5{
	    		color: #B97A57;
	    		border: 1px solid #B97A57;
	    	}
	    	&.flow-type6{
	    		color: #FF2525;
	    		border: 1px solid #FF2525;
	    	}
	    	&.flow-type7{
	    		color: #FF7F5C;
	    		border: 1px solid #FF7F5C;
	    	}
	    	&.flow-type8{
	    		color: #7AB900;
	    		border: 1px solid #7AB900;
	    	}
	    	&.flow-type9{
	    		color: #7F7F7F;
	    		border: 1px solid #7F7F7F;
	    	}
    	}
        .type-button {
            position: absolute;
            width: 23px;
            height: 21px;
            padding: 1px;
            top: 17px;
            background: url(../../../assets/attence/images/jiantou0.png) center center no-repeat;
            box-shadow: none;
        }
        input[type=search]::-webkit-search-cancel-button {
            -webkit-appearance: none;
        }
        .mint-navbar {
            border-bottom: $list-bottom-border;
            .mint-tab-item-label {
                font-size: $tabNav-font;
            }
            .is-selected {
                color: $tabNav-color-active;
                margin: 0;
                border-bottom: 3px solid $tabNav-color-active;
            }
        }
        .mint-radiolist-title {
            margin: 0;
        }
        .mint-cell-wrapper {
            background: none;
        }
        .pagesearch {
            height: 55px;
            position: relative;
            padding: 10px 15px;
            background: #fafafa;
            font-size: $search-font;
            em {
                position: absolute;
                right: 10px;
                width: 30px;
                height: 35px;
                font-size: 15px;
                line-height: 35px;
                color: #999;
            }
            input {
                -webkit-appearance: none;
                border: $list-bottom-border;
                border-left: none;
                height: 35px;
                font-size: 16px;
                padding: 10px 30px 10px 15px;
                line-height: 18px;
                border-radius: 0 4px 4px 0;
                width: 100%;
            }
            input:focus {
                border: 1px solid #B9D3EE;
                box-shadow: 0 0 5px #B9D3EE;
                outline: none;
                border-radius: 4px;
            }
            .search-type {
                display: block;
                float: left;
                line-height: 32px;
                height: 35px;
                width: 90px;
                font-size: 16px;
                padding: 0 15px;
                border-radius: 4px 0 0 4px;
                color: #333;
                border: $list-bottom-border;
                background-position: 55px center;
                background-repeat: no-repeat;
                box-sizing: border-box;
            }
            .mint-search {
                height: 40px;
                font-size: 15px;
                .mint-searchbar {
                    background-color: none;
                    padding: 0;
                    border: $list-bottom-border;
                }
            }
            .archives-type {
                float: left;
            }
            .mintui-search {
                font-size: 17px;
                color: $search-color;
                position: absolute;
                top: 19px;
                right: 30px;
            }
            .mint-searchbar-core {
                line-height: 21px;
            }
            .mint-popup-1 {
                position: absolute;
                top: 60px;
                left: 15px;
                border: 1px solid #e2e2e2;
                min-width: 120px;
                font-size: 18px;
                z-index: 1;
                border-radius: 8px;
                opacity: 0.9;
                background: #fff;
                animation: 5s;
            }
            .mint-popup-1::before {
                display: inline-block;
                width: 0;
                height: 0;
                border: solid transparent;
                border-width: 10px;
                border-bottom-color: #e2e2e2;
                content: "";
                position: absolute;
                top: -21px;
                left: 48px;
            }
            .triangle-1 {
                display: inline-block;
                width: 0;
                height: 0;
                border: solid transparent;
                border-width: 10px;
                border-bottom-color: #fff;
                position: absolute;
                top: -20px;
                left: 48px;
            }
            .flow-infor {
                padding: 0;
                margin: 0;
                li {
                    color: #333;
                    list-style-type: none;
                    text-align: center;
                    width: 100%;
                    transform: all 4s ease;
                    a {
                        display: block;
                        padding: 10px;
                        color: #333;
                        border-bottom: 1px solid #f2f2f2;
                    }
                }
                li:first-child a {
                    border-radius: 4px 4px 0 0;
                }
                li:last-child a {
                    border-radius: 0 0 4px 4px;
                    border: none;
                }
                a:active {
                    background: #9da5be;
                    color: #fff;
                }
                .last-span {
                    border-bottom: 0;
                }
            }
        }
        .untreatedList, #loadMoreDataList {
            padding: $page-padding;
            overflow-y: scroll;
            .mint-cell-wrapper {
                padding: $list-type-padding;
                background-image: none;
                height: 80px;
                align-items: stretch;
                border-bottom: $list-bottom-border;
                .mint-cell-title {
                    flex: none;
                }
                .approve-infor {
                    margin-right: 10px;
                    padding: $list-type-icon-padding;
                    font-size: $list-type-font;
                    color: $list-type-color;
                    border: $list-type-border;
                    border-radius: $list-type-radius;
                    line-height: 30px;
                }
            }
            .mint-cell-wrapper:active {
                background: $list-active-bgcolor;
            }
        }
        .mint-cell-value {
            color: $list-title-color;
            font-size: $list-title-font;
            position: relative;
            width: 100%;
            line-height: 25px;
            align-items: stretch;
            display: block;
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
    .flow {
        -webkit-overflow-scrolling: touch;
        display: flex;
        flex-flow: column;
        height: 100vh;
        width: 100%;
        .label-mes {
            width: 100%;
            height: 20px;
        }
        .flow-detail {
            order: 1;
            overflow: scroll;
            padding: 0 0 60px 0;
            .mint-cell:last-child {
                background-image: none;
            }
            .mint-cell {
                padding: 0 15px;
                min-height: 26px;
                .mint-cell-wrapper {
                    padding: 10px 0 0;
                    align-items: flex-start;
                    line-height: 23px;
                    background-image: none;
                }
                .mint-cell-title {
                    margin-right: 15px;
                    flex: none;
                }
                .mint-cell-text {
                    display: block;
                    float: left;
                    width: 65px;
                    font-size: 16px;
                    color: $detail-label-color;
                    text-align: right;
                }
                .mint-cell-value {
                    span {
                        word-break: break-all;
                        font-size: 16px;
                        color: $detail-content-color;
                    }
                }
            }
            .mint-actionsheet-button {
                width: 30%;
            }
            .advice {
                &.nobtn{
                    padding-top: 15px;
                }
                .advice-title {
                    position: absolute;
                    bottom: 55px;
                    display: block;
                    width: 68px;
                    height: 25px;
                    font-size: 15px;
                    line-height: 25px;
                    color: #fff;
                    background: #4e8dff;
                    padding: 0 8px;
                    z-index: 3;
                    border-radius: 0 12px 12px 0;
                }
                .advice-content {
                    padding: 30px 30px;
                }
                .view {
                    position: relative;
                    margin: 0;
                    padding: 0;
                    font-size: 15px;
                    color: #4e8dff;
                    .view-label {
                        line-height: 16px;
                        vertical-align: bottom;
                        margin-left: 35px;
                        height: 15px!important;
                    }
                    .view-icon {
                        position: absolute;
                        left: 5px;
                        display: inline-block;
                        width: 17px;
                        height: 17px;
                        font-size: 10px;
                        text-align: center;
                        margin-right: 5px;
                        line-height: 18px;
                        border-radius: 50%;
                        background: #4e8dff;
                        color: #fff;
                    }
                    .view-icon-un {
                        box-sizing: border-box;
                        background: #fff;
                        border: 1px solid #999;
                    }
                    .view-date {
                        float: right;
                    }
                    .view-name {
                        float: right;
                        margin-right: 12px;
                    }
                    span {
                        font-size: 13px;
                        color: #999;
                        line-height: 21px;
                    }
                    .view-content {
                        margin-left: 13px;
                        padding: 15px 0 15px 22px;
                        border-left: 1px solid #4e8dff;
                    }
                    .view-content-un {
                        border-left: 1px solid #999;
                    }
                    .view-last-content {
                        border-left: transparent;
                    }
                    .view-main {
                        padding: 12px;
                        width: 100%;
                        color: #333;
                        background: #fbfbfb;
                        margin-bottom: 15px;
                        border: $list-bottom-border;
                        border-radius: 4px;
                        img {
                            width: 100%;
                        }
                    }
                }
            }
        }
    }
    .fd {
        height: 100vh;
        .mint-msgbox {
            border-radius: 8px;
        }
        .mint-option {
            float: left;
            min-height: 40px;
            width: 100%;
            margin-bottom: 15px;
        }
        .mint-msgbox-header {
            padding: 25px 0 0;
        }
        .mint-msgbox-title {
            padding: 0 25px;
            text-align: left;
            font-size: 18px;
            color: #333;
            font-weight: 400;
        }
        .mint-msgbox-content {
            float: left;
            width: 100%;
            padding: 10px 25px 20px 25px;
        }
        .mint-msgbox-message {
            line-height: 40px;
            float: left;
            width: 32%;
            color: #666;
            font-size: 16px;
            text-align: right;
        }
        .mint-msgbox-btns {
            height: 50px;
            float: left;
            width: 100%;
        }
        .mint-msgbox-btn {
            color: #666;
            font-size: 16px;
        }
        .submit-option {
            float: right;
            width: 65%;
            border-bottom: 1px solid #dedede;
            input {
                margin-left: 10px;
            }
            .mint-cell-wrapper {
                padding: 0;
                background: none;
            }
            .mint-radiolist {
                .mint-cell {
                    min-height: 40px;
                    line-height: 40px;
                    background: none;
                }
            }
            .mint-radiolist-label {
                padding: 0;
            }
        }
        .mint-msgbox-input {
            padding: 0;
            input {
                float: right;
                width: 66%;
                height: 40px;
                border: none;
                border-radius: 0px;
                padding-left: 35px;
                border-bottom: 1px solid #dedede;
            }
        }
        .mint-radiolist-title {
            background: none;
            margin: 0;
        }
        .jcm-user7 {
            position: absolute;
            margin-left: 10px;
            margin-top: 4px;
            font-size: 30px;
            color: #aeb5c9;
        }
    }
    .flow-layer-bg {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        opacity: 0.5;
        z-index: 9;
        background: #000;
    }
</style>