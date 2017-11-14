<template>
    <div class="td">
        <div class="flow" @click.stop="hideApprove" ref="textBox"  v-on:scroll="scrolls">
            <div class="flow-detail" id="flow-detail" ref="viewBox" >
                <mt-cell title="标题">
                    <span v-html="info.title"></span>
                </mt-cell>
                <mt-cell title="作者">
                    <span v-html="info.author"></span>
                </mt-cell>
                <mt-cell title="作者单位" >
                    <span v-html="info.author_unit"></span>
                </mt-cell>
                <mt-cell title="首页显示图片">
                    <span><img :src="info.picUrl" alt="暂无图片"></span>
                </mt-cell>
                <mt-cell title="发布时间">
                    <span v-html="info.sendTime"></span>
                </mt-cell>
                <mt-cell title="发布人">
                    <span v-html="info.author"></span>
                </mt-cell>
                <mt-cell title="内容" >
                    <p v-html="info.infoContent"></p>
                </mt-cell>
                <div class="advice" ref="advice">
                    <a class="advice-title"  @click="suggest" ref="suggest">流转意见</a>
                    <div class="advice-content">
                        <p v-if="suggestMap.length < 1" style="text-align:center;font-size:14px;color:#999;">暂无流转意见</p>
                        <div v-for="(suggests,sindex) in suggestMap" >
                        
                            <div class="view"   >
                                <div for="" class="view-label">
                                <!--view-icon-un 控制是否为灰色-->
                                <i class="view-icon jcm-duihao2" v-bind:class="sindex > 1 && sindex == suggestMap.length-1 ?  'view-icon-un' :  ''"></i>
                                <!-- {{suggest.suggestName}} -->主办意见
                                </div>
                                <!--view-content-un 控制是否为灰色-->
                                <div  v-bind:class="sindex == suggestMap.length-1 ?  'view-content view-last-content' :  'view-content'"> 
                                    <div class="view-main" v-for="(suggest,indexs) in suggests" >
                                    <img v-bind:src="suggest.signature" alt="" v-if="suggest.signature">
                                        {{suggest.message}}
                                        <div class="label-mes">
                                            <span class="view-date">{{parseTimeDate(suggest.signDate)}}</span>
                                            <span class="view-name">{{suggest.userName}}</span>
                                        </div>
                                    </div>
                                
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        

        <!-- message进行配置常用词
            btnText1配置第一个按钮显示文字
            btnText2配置第二个按钮显示文字
            fnSign  签批回调
            fnBtn1  第一个按钮回调
            fnBtn2  第二个按钮回调
 			types   进行组件类型配置(布尔型，默认是true)
            write   是否可写(默认为true)
            *** 必填参数 *** status.sync 控制控制审批的显隐,需添加sync修饰符
        -->
        <Examine ref="examine" :fn-btn2="onSubmit" :status.sync="isShow"  :showing="shows" :types="apptypes"></Examine>
        
        <!-- popupVisible 控制显隐
            nodeList 可选节点列表
            isSingle 节点是否单选
            fnBtn1 确认回调
            fnBtn2 取消回调
        -->
        <JcApprove v-model="popupVisible" v-if="popupVisible"
        	:actions="nodeList" 
        	:isSingle="choiceFlag=='single'" 
        	:fn-btn1="onConfirm">
        </JcApprove>
        
        <mt-actionsheet :actions="sheetData" v-model="sheetVisible" cancelText=""></mt-actionsheet>
        </div>
    </div>     
</template>

<script>
	import Util from '@/libs/util.js';
	import Jcmp from '@/libs/jcmp.js';
    import Examine from '@/components/examine';
    import JcApprove from '@/components/approve';
    import { Toast ,Indicator} from 'mint-ui';
    export default {
        components: {
            Examine,
            JcApprove
        },
        data() {
            return {
                info: {},
                isShow: false,
                suggestMap:[],
                popupVisible: false,
                nodeList:[],
                choiceFlag:"",
                submitParams:{},
                sheetData: [{name: '确定提交?'}, {name: '是',method: this.onSave}, {name: '否',method: this.onCancel}],
            	sheetVisible: false,
            	shows:true,
                apptypes:true,
            }
        },
        beforeRouteEnter(to, from, next) {
            next((vm) => {
            	let _this = vm;
                _this.getNewsDetail();
                _this.hideApprove();
                
                if(from.name=='Todo'){
                	_this.popupVisible = false;
                	_this.nodeList = [];
                }
            })
        },
        beforeUpdate(){
            this.$nextTick(function () {
               this.maodian = this.$refs.advice.clientHeight;
                this.boxheight = this.$refs.viewBox.scrollHeight;
                this.diff =this.boxheight - this.maodian - document.body.clientHeight;
                if(this.diff < 0){
                    this.$refs.suggest.style.position = "static";
                };
            })
            
        },
        methods: {
            getNewsDetail() {
                let _this = this;
                
                if (this.$route.query && this.$route.query.id) {
                    _this.submitParams = _this.$route.query;
                    _this.showLoading();
                    _this.Api.INFO.getInfoById({
                        id: _this.$route.query.id,
                        definitionId: _this.$route.query.definitionId_,
                        nodeId: _this.$route.query.nodeId ,
                        instanceId: _this.$route.query.instanceId_ ,

                        businessKey: _this.$route.query.business_Key_
                    }).then((res) =>{
                        _this.$set(_this, 'info', res.data.body);
                        _this.apptypes = !!_this.info.editSuggestName;
                        _this.info.sendTime = _this.parseTimeDate(_this.info.sendTime);
                        //_this.info.picUrl = _this.info.picUrl ? Jcmp.convertResourceUrl(_this.info.picUrl) : null;
	                	_this.submitParams.id = _this.info.id;
                        _this.submitParams.editSuggestName = _this.info.editSuggestName;
                        _this.suggestMap =  Object.keys(_this.info.suggestMap).map((item)=>{
                            return _this.info.suggestMap[item];
                        });
                        _this.hideLoading();
		        	}).catch((error) =>{
                        Toast({message:' 请求失败!!!'});
                    });
                }
            },
            hideApprove(){
                if(this.$refs.examine.types){
                    this.isShow = false;
                }
            },
            onSubmit(suggest){//提交
                let _this = this;
                _this.submitParams.suggest = suggest;
                _this.Api.INFO.getNextNodes({
                	definitionId_: _this.submitParams.definitionId_,//获取待办列表时获取的相应属性值
                	curNodeId_: _this.submitParams.curNodeId_,//获取待办列表时获取的相应属性值
                }).then((res)=>{
                    if(res.data.code === '000000'){
                		this.popupVisible = true;
                		this.nodeList = res.data.body.nextNodesList;
                		this.choiceFlag = res.data.body.choiceFlag;
                        _this.$nextTick(() => {
                            _this.hideLoading();
                        });
                    }else{
                        Toast({message: res.data.errormsg});
                        _this.hideLoading();
                    }
                })
                this.hideApprove();  
           	},
               initScroll(mescroll) {
                this.mescroll = mescroll;
            },
             showLoading() {
                Indicator.open();
            },
            hideLoading() {
                Indicator.close();
            },
           	onConfirm(confirmData){//确认
           		Object.assign(this.submitParams, confirmData);
           		this.popupVisible = false;
           		this.sheetVisible = true;
            },
            onCancel(){
            	this.popupVisible = true;
           		this.sheetVisible = false;
            },
            onSave(){
            	let _this = this;
           		_this.Api.INFO.commitApproval(_this.submitParams).then((res)=>{
                    if(res.data.code === '000000'){
                        Toast({message: '提交成功...'});
                        _this.$router.go(-1);
                    }else{
                        Toast({message: res.data.errormsg});
                    }
                })
            },
            scrolls(){
                 Util.debounce(()=>{
                    let diff =this.boxheight - this.maodian - document.body.clientHeight;
                    var top = this.$refs.textBox.scrollTop;
                    if(top > diff){
                        this.$refs.suggest.style.position = "static";
                    }else{
                        this.$refs.suggest.style.position = "absolute";
                    }
                 }, 100)(); 
            },
            suggest:function(){
                this.$refs.textBox.scrollTop = this.$refs.viewBox.scrollHeight;
                this.$refs.suggest.style.position="static";
            },
            parseTimeDate(stamp) {
                return Util.format(new Date(stamp), 'yyyy-MM-dd');
            }
        }
    }
</script>

<style lang="scss">
@import '../../assets/sass/params';
.td {
    height: 100vh;
.move-enter-active {
    animation-name: movetop;
    animation-duration: .4s;
}

.move-leave-active {
    animation-name: movebottom;
    animation-duration: .4s;
}

@keyframes movetop {
    0% {
        bottom: -342px;
    }

    100% {
        bottom: 0px;
    }
}

@keyframes movebottom {
    0% {
        bottom: 0px;
    }

    100% {
        bottom: -342px;
    }
}

.flow {
        -webkit-overflow-scrolling: touch;
        display: flex;
        flex-flow: column;
        overflow: scroll;
        height: 100vh;
        width: 100%;
        .label-mes {
            width: 100%;
            height: 20px;
        }
        .flow-detail {
            order: 1;
            
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

                .mint-cell-text {
                    display: block;
                    float: left;

                    width: 65px;

                    font-size: 16px;
                    color: $detail-label-color;

                    text-align: right;
                }
            }
            .mint-cell-value {
                span,p {
                    word-break: break-all;
                    font-size: 16px;
                    color: $detail-content-color;
                }
                img{
		        	height: 80px;
		        	width: 80px;
		        }
            }
            
        }
    }
    
    .mint-actionsheet-listitem {
        height: 50px;
        line-height: 50px;
    }

    .mint-actionsheet-listitem:first-child {
        height: 65px;
        line-height: 65px;
        font-size: 15px;
    }

    .mint-actionsheet-listitem:nth-child(2) {
        color: #ff4e4e;
    }

    .mint-actionsheet-button {
        height: 50px;
        line-height: 50px;
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
</style>