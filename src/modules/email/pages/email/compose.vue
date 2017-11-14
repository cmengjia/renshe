<template>
<div @click="ccbccHide()" class="compose">
    <div class="userlist">
        <ul>
            <li>
                <div @click.stop="goContacts(1)">
                    <span>收件人</span>
                    <div>
                        <a :key="userList.id" v-for="(userList,userIndex) in user" @click.stop="removeUser(1,userIndex)" >{{userList.displayName}}<i class="jcm-guanbi"></i></a>
                    </div>
                    <i class="jcm-jiahao cutImg" @click.stop="goContacts(1)"></i>
                </div>
            </li>
            <li @click.stop="ccbcc()" v-show="copyto">
                <div>
                    <span class="w-p100">抄送/密送</span>
                </div>
            </li>
            <li v-show="!copyto" @click.stop="doop">
                <div @click.stop="goContacts(2)">
                    <span>抄送</span>
                    <div v-model="sendMail.cc"> 
                        <a v-html="userList2.displayName" :id="userList2.id" :key="userList2.id" v-for="(userList2,userIndex) in user2" @click="removeUser(2,userIndex)"></a>
                    </div>
                    <i class="jcm-jiahao cutImg" @click.stop="goContacts(2)"></i>
                </div>
            </li>
            <li v-show="!copyto" @click.stop="doop">
                <div @click.stop="goContacts(3)">
                    <span>密送</span>
                    <div v-model="sendMail.bcc">
                        <a v-html="userList3.displayName" :key="userList3.id" v-for="(userList3,userIndex) in user3" @click="removeUser(3,userIndex)"></a>
                    </div>
                    <i class="jcm-jiahao cutImg" @click.stop="goContacts(3)"></i>
                </div>
            </li>
            <li>
                <div>
                    <span>主题</span>
                    <div>
                        <input type="text" class="theme"  v-model="sendMail.mailTitle" />
                    </div>
                    <Uploader class="w50" :options="option1"></Uploader>  
                    <label class="blueCol" v-show="files.length">{{files.length}}</label>
                </div>
            </li>
        </ul>
    </div> 
    <div placeholder="请输入正文" @click.stop="toFocus" class="textarea" ref="textCon" contenteditable="true"></div>
    <div v-if="allCon" class="allCon">
        <div ref="textCons" class="textarea" contenteditable="true">
            <div>--------------原始邮件--------------</div>
            <div class="allConTitle">
                <p><strong>发件人：</strong>{{replyItem.senderUserName}}</p>
                <p><strong>发送时间：</strong>{{replyItem.senderTime}}</p>
                <p><strong>收件人：</strong>{{replyItem.to}}</p>
                <p><strong>抄送：</strong>{{replyItem.cc}}</p>
                <p><strong>密送：</strong>{{replyItem.bcc}}</p>
                <p><strong>主题：</strong>{{replyItem.mailTitle}}</p>
                <p><strong>内容：</strong></p>
                <div v-html="sendMail.mailContent"></div>
            </div>
            
        </div>
    </div>
    <div class="sendBtn" :style="{bottom: files.length ? '120px' : '10px'}">
        <mt-button type="primary" @click="send()">发送</mt-button>
    </div>
    <div class="picList" v-show="files.length">
        <ul id="target">
            <li v-for="info in files" :key="info.id">
                <img :src="info.url"  width="60px" height="60px" />
                <a class="deleteId" @click="deleteId(info.id)"><i class="jcm-shanchu"></i></a>
            </li>
        </ul>
    </div>
    <!-- 人员选择树控件说明：
        hasCheck 是否显示checkbox, true
        isSingle 是否单选, 默认false
        selectedUser 已选用户
        selectedDept 已选用户
        optionUser 可选用户
        onSubmit 人员选择回调
        onHiden 隐藏界面
    -->
    <contacts 
        :hasCheck="true" 
        :isSingle="isSingle" 
        :selectedUser="selectedUser" 
        @onSubmit="onSubmit"
        @onHiden="onHiden"
        v-if="userVisible" >
    </contacts>
    <mt-actionsheet :actions="sheetData" v-model="sheetVisible" cancelText="取消"></mt-actionsheet>
</div>
</template>
<script>
//使用状态管理
import {mapState} from 'vuex';
import { Toast } from 'mint-ui';
import JcUploader from "@/modules/email/pages/uploader.vue";
import Uploader from '@/components/uploader';
import jcmp from '@/libs/jcmp.js';
import Contacts from "@/components/contacts/index.vue";
export default {
    name: 'compose',
    beforeRouteEnter(to, from, next){
		next(vm=>{
			var replyData = window.sessionStorage.getItem('replyData');
            vm.sendMail.mailContent ="";
            vm.user=[];
            vm.user2=[];
            vm.user3=[];
            vm.copyto = true;
            vm.allCon = false;
            var selected = vm.$route.query.selected;
            //草稿进入编辑页面
            if(selected == 4){
                vm.getDraft();
                vm.replyCon = false;
                vm.replyTitle = true;
                vm.transpond = false;
            }
            //缓存
            else if(replyData){
                replyData = JSON.parse(replyData);
                let userNames = replyData.senderUserName;
                let userIds = replyData.senderUserId;
                vm.user.push({
                    id:userIds,
                    displayName:userNames
                });
                vm.replyItem = replyData;
                var plan = vm.$route.query.plan;
                var repeat = vm.$route.query.repeat;
                //转发
                if(repeat){
                    vm.replyCon = false;
                    vm.replyTitle = false;
                    vm.allCon = true;
                    vm.transpond = true;
                    vm.sendMail.mailContent = vm.replyItem.mailContent;
                    vm.sendMail.mailTitle = '转发：' + vm.replyItem.mailTitle;
                }
                else{
                    //全部回复
                    if(plan){
                        if(replyData.ccIds){
                            let ccUserIds = replyData.ccIds.split(',');
                            for(let i=0;i<ccUserIds.length;i++){
                                vm.user.push({
                                    id:ccUserIds[i],
                                });
                            }
                        }
                        if(replyData.cc){
                            let ccUserNames = replyData.cc.split(',');
                            for(let i=0;i<ccUserIds.length;i++){
                                vm.user.push({
                                    displayName:ccUserNames[i]
                                });
                            }
                        }
                        
                    }
                    vm.replyCon = false;
                    vm.replyTitle = true;
                    vm.allCon = true;
                    vm.transpond = false;
                    vm.sendMail.to = vm.replyItem.to;
                    vm.sendMail.mailContent = vm.replyItem.mailContent;
                    vm.sendMail.mailTitle = '回复：' + vm.replyItem.mailTitle;
                }
            }else{
                 vm.sendMail = {};
                 vm.replyItem = {};
                 vm.files = [];
                 vm.replyCon = true;
                 vm.replyTitle = false;
                 vm.transpond = false;
            }
		})
	},
    activated(){
        this.$refs.textCon.innerHTML = "";
    },
    components: {
        JcUploader,
        Uploader,
        Contacts
    },
    data(){
        let _this = this;
        return {
            index:1,//人员选择树 用户索引
            isSingle:false,//人员选择树 是否单选
            userVisible:false,//人员选择树 是否显示
            selectedUser:[],//人员选择树 已选用户
            user: [],
            user2: [],
            user3: [],
            files: [],
            introduction:'',
            theme:'',
            replyItem: {},
            picLength: false,
            replyCon: true,
            replyTitle : false,
            hiddenCon: false,
            allCon: false,
            transpond: false,
            copyto: true,
            isActive: false,
            sheetVisible: false,
            focusStatus: false,
			sheetData: [{name: '是否保存草稿?'}, {name: '是',method: this.saveDraft}, {name: '否',method: this.onCancel}],
            //加载数据的loading
            loading: false,
            //上拉刷新配置
            loadMoreOptions: {
                noFlag: false //暂无更多数据显示
            },
            option1: {
                headers: {
                    'client_app_id': jcmp._appId(),
                    'client_device_id': jcmp._deviceId(),
                    'access_token': jcmp._jcmpToken()
                },
                formData: {
                    businessId : 1,
                    businessTable : 'table',
                    category: 'category1',
                },
                targetHandler: (file)=>{
                    
                },
                style: 'jcimg',
		        label: '<i class="jcm-shangchuanfujian"></i>',
                server: 'http://192.168.140.14:9580/jcmp/gateway/api/v1/emailUpload',
                targetHandler(file){
                    if(file.ext == "jpg" || file.ext == "jpeg" || file.ext == "gif" || file.ext == "png" || file.ext == "bmp" || file.ext == "svg"){
                        file.url = file.url;
                    }
                    else if(file.ext == "doc" || file.ext == "docx"){
                        file.url = require('../../images/01-doc.png');
                    }
                    else if(file.ext == "ppt"){
                        file.url = require('../../images/02-ppt.png');
                    }
                    else if(file.ext == "xls" || file.ext == "xlsx"){
                        file.url = require('../../images/03-xls.png');
                    }
                    else if(file.ext == "zip" || file.ext == "rar"){
                        file.url = require('../../images/04-yasuobao.png');
                    }
                    else if(file.ext == "pdf"){
                        file.url = require('../../images/05-pdf.png');
                    }
                    else if(file.ext == "txt"){
                        file.url = require('../../images/07-txt.png');
                    }
                    else{
                        file.url = require('../../images/08-else.png');
                    }
                    _this.files.push(file);
                }
            },
            sendMail: {
                userId: '',//登录人id
                to:'' ,//收件人id，多个id间用逗号隔开
                cc:'',//抄送id，多个id间用逗号隔开
                bcc:'',//密送人id，多个id间用逗号隔开
                fileids:'',//附件id，多个id间用逗号隔开
                delattachIds:'',//删除的附件id，多个id间用逗号隔开
                mailContent:'',//邮件内容
                mailTitle:''//邮件标题
            },
        }
    },
    methods:{
        doop(){},
        ccbcc(){
           this.copyto = false;
        },
        ccbccHide(){
            if(!this.copyto){
                if(!this.user2.length && !this.user3.length){
                    this.copyto = true;
                }
            }
        },
        userSelect(id){
            let _this = this;
            _this.isActive = true;
        },
        send(){
            let _this = this;
            var textCon = _this.$refs.textCon.innerHTML;
            if(_this.allCon){
                var textCons = _this.$refs.textCons.innerHTML;
                var text = textCon + textCons;
            }else{
                var text = textCon;
            }
            _this.sendMail.mailContent = text;
            if(!_this.sendMail.to){
                Toast({
                    message: '请填写收件人后再发送',
                    duration: 5000
                });
            }else{
                _this.Api.MAIL.sendMail(
                    _this.sendMail
                ).then(function(res) {
                    if(res.data.code === '000000'){
                        _this.$router.replace({ path: '/home', query: { selected: '5', sendTo: true }});
                    }
                    Toast('发送成功');
                });
            }
        },
        deleteId(fileId){
            let index = -1;
            this.files.forEach((item ,inx)=>{
                if(item.id == fileId){
                    index = inx;
                }
            })
            if(index >= 0){
                this.$children.forEach((item)=>{
                    if(item.uploader){
                        item.uploader.removeFile(this.files[index]);
                    }
                })
                this.files.splice(index ,1);
            }
        },
        goContacts(index){//打开人员选择树
            this.index=index;
            if(index==1){
                this.selectedUser = this.user;
            }else if(index==2){
                this.selectedUser = this.user2;
            }else if(index==3){
                this.selectedUser = this.user3;
            }
            this.userVisible=true;
		},
		onSubmit(selected){//人员选择树确认回调
			this.userVisible=false;
			if(this.index==1){
				this.user = selected;
			}else if(this.index==2){
				this.user2 = selected;
			}else if(this.index==3){
				this.user3 = selected;
			}
		},
		onHiden(){//人员选择树隐藏
			this.userVisible=false;
		},
        removeUser(index,userIndex){//删除已选用户
            if(index==1){
                this.user.splice(userIndex,1);
            }else if(index==2){
                this.user2.splice(userIndex,1);
            }else if(index==3){
                this.user3.splice(userIndex,1);
            }
        },
        onCancel(){
           	this.sheetVisible = false;
            this.next();
        },
		showMailRtx(){
			let _this = this;
			_this.sheetVisible = true;
		},
        saveDraft(){
            let _this = this;
            _this.Api.MAIL.saveDraft(
				_this.sendMail
			).then(function(res) {
                if(res.data.code === '000000'){
                    _this.onCancel();
                    _this.next && _this.next();
                    _this.$router.replace({ path: '/home', query: { selected: '4' }});
                }
			})
        },
        getDraft(){
            let _this = this;
            _this.Api.MAIL.getMailById({
				id: _this.$route.query.id
			}).then(function(res) {
                if(res.data.code === '000000'){
                   _this.sendMail = res.data.body;
                }
                if(res.data.body.attachUrl){
                    _this.files.push(res.data.body.attachUrl);
                }
			})
        },
        toFocus(event){
            setTimeout(()=>{
                event.target.focus();
            },10)
        }
    },
    watch:{
        user:function(val){
            this.sendMail.to = val.map((item)=>{
                return item.id;
            }).join(',')
        },
        user2:function(val){
            this.sendMail.cc = val.map((item)=>{
                return item.id;
            }).join(',')
        },
        user3:function(val){
            this.sendMail.bcc = val.map((item)=>{
                return item.id;
            }).join(',')
        },
        files:function(val){
            this.sendMail.fileids = val.map((item)=>{
                return item.id;
            }).join(',');
        },
    },
    directives: {
        focus: {
            inserted: function (el, {value}) {
                debugger;
                if (value) {
                    el.focus();
                }
            }
        }
    },
    beforeRouteLeave(to, from, next){
        if(to.query.sendTo){
            next();
            return;
        }
        /* if(this.sendMail.to || this.sendMail.mailTitle){
            this.showMailRtx();
            this.next = next;
        }else{
            next();
        } */
        next();
		window.sessionStorage.removeItem('replyData');
	},
}
</script>
<style>
    .compose{
        padding: 0 20px;
    }
    .userlist {
        font-size: 16px;
    }
    .userlist ul li {
    	height: 50px;
    	padding: 0px;
    	border-bottom: 1px solid #e2e2e2;
    	display: flex;
    	align-items: center;
    }
    .userlist ul li div{
    	display: flex; 
    	align-items: center;
    	width: 100%;
        overflow: auto;
    }
    .userlist ul li div >a{
        padding: 0 10px;
        height:28px;
        line-height: 28px;
        font-size: 15px;
        background: #f2f2f2;
        white-space:nowrap;
        margin-right: 5px;
        border-radius: 5px;
    }
    .userlist ul li div >a i{
        margin-left: 5px;
        color: #333;
    }
   .userlist ul li div .theme{
       font-size: 16px;
       margin-right: 10px;
       border: 0;
       width: 100%;
       height: 30px;
    }
    .userlist ul li > span {
    	margin-right: 10px;
    }
    .userlist ul li span {
        width: 80px;
        color: #999;
    }
    .userlist ul li span.w-p100{
        width: 100%;
    }
    .list ul li img{
    	margin-left: 15px;
    }
    .cutImg {
        color: #4e8dff;
        width: 30px;
        height: 30px;
        font-size: 30px;
    }
    .picList{
        bottom: 10px;
        left: 20px;
        right: 20px;
        position: fixed;
        background: #eee;
        height: 80px;
        align-items: center;
        z-index: 1;
        overflow-x: auto;
    }
    .picList ul{
        width: 100%;
        position: absolute;
        height: 80px;
        overflow-y: hidden;
        overflow-x: auto;
    }
    .picList li{
        display: flex;
        padding: 10px;
        position: relative;
        float: left;
    }
    .deleteId{
        width: 20px;
        height: 20px;
        color: red;
        font-size: 20px;
        position: absolute;
        right: 0;
        top: 0;
    }
    .userlist ul li div.w50{
        overflow: hidden;
        width: 50px;
    }
    .webuploader-pick.jcimg {
        width: 30px;
        height: 30px;
        background: none;
        /* background: url(../../images/iconload.png) center right no-repeat; */
        display: inline-block;
        color: #4e8dff;
        font-size: 24px;
        padding: 0;
    }
    
    .sendBtn{
        position: fixed;
        bottom: 20px;
        padding: 5px 0;
        align-items: center;
        height: 42px;
        line-height: 42px;
        z-index: 2;
        right: 20px;
    }
    .sendBtn span{
        float: left;
    }
    .sendBtn button{
        float: right;
        background: #4e8dff;
        height: 32px;
    }
    .allConTitle{
        margin: 10px 0;
        padding: 5px 10px;
        background: #f0f0f0;
        border-radius: 5px;
        color: #212121;
        font-size: 15px;
    }
    .allConTitle p{
        text-align: left;
        line-height: 24px;
    }
    .allContent{
        margin: 0 10px;
        color: #212121;
    }
    .compose textarea,.compose .textarea{
        margin: 10px 0;
        resize: none;
        width: 100%;
        border: 0;
        min-height: 100px;
        line-height: 25px;
        font-size: 15px;
        color: #333;
        -webkit-user-select: text;
        border: 1px solid #f2f2f2;
    }
    .blueCol{
        color: #4e8dff;
    }
</style>