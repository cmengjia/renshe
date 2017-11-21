<template>
	<div class="emailDetail-wrap">
		<div>
			<div class="emailDetail-top">
				<h1>{{email.mailTitle}}</h1>
				<div class="emailDetail-send">
					<span><i>发件人:</i><i>{{email.senderUserName}}</i></span>
					<span v-if="attachUrlLength" class="attach" v-show="attachHide">{{email.attachUrl.length}}</span>
					<span class="fr" @click="onDetails" v-show="onDetailsClick">详情<b><i class="jcm-xiajiantou"></i></b></span>
					<span class="fr" @click="offDetails" v-show="offDetailsClick">隐藏<b><i class="jcm-xiajiantou_1"></i></b></span>
				</div>
				<div class="emailDetail-send" v-if="details">
					<span><i>收件人:</i></span>{{email.to}}
				</div>
				<div class="emailDetail-send" v-if="details">
					<span><i>抄　送:</i></span>{{email.cc}}
				</div>
				<div class="emailDetail-send" v-if="details">
					<span><i>密　送:</i></span>{{email.bcc}}
				</div>
				<div class="emailDetail-send" v-if="details">
					<span><i>时　间:</i>{{email.senderTime}}</span>
				</div>
				<div class="emailDetail-send" v-show="attachHide" v-if="details">
					<span class="attach"><i>附　件:</i>{{email.attachUrl.length}}</span>
				</div>
			</div>
			<div class="emailDetail-content">
				<div class="emaildetail-char" v-html="email.mailContent">
					
				</div>
				<div class="emaildetail-attach" v-show="attachHide">
					<div>附件:</div>
					<p v-for="info in email.attachUrl">
						<a :href="info.url">{{info.attachName}}</a>
					</p>
				</div>
			</div>
		</div>
		<mt-tabbar>
			<mt-tab-item id="回复" class="pr" @click.native="isShow()">
				回复
				<ul class="footerfirst-list" v-show="idReplyShow">
					<li @click="reply('all')">全部回复</li>
					<li @click="reply()">回复</li>
					<li>取消</li>
				</ul>
			</mt-tab-item>
			<mt-tab-item id="转发" @click.native="transpond('repeat')">
				转发
			</mt-tab-item>
			<mt-tab-item id="星标" class="addStarRtx" @click.native="addStarRtx()" v-show="starRtx">
				<i class="jcm-xingbiao"></i>星标
			</mt-tab-item>
			<mt-tab-item id="取消星标" class="deldelStarRtx" @click.native="delStarRtx()" v-show="!starRtx">
				<i class="jcm-biaoxing"></i>取消星标
			</mt-tab-item>
			<mt-tab-item id="删除" @click.native="showMailRtx()">
				删除
			</mt-tab-item>
		</mt-tabbar>
		<mt-actionsheet :actions="sheetData" v-model="sheetVisible" cancelText="取消"></mt-actionsheet>
	</div>
</template>

<script>
	import { MessageBox } from 'mint-ui';
	import { Toast } from 'mint-ui';
	export default{
		name: "jc-emaildetail",
		beforeRouteEnter(to, from, next){
			next(vm=>{
				var selected = vm.$route.query.selected;
				vm.getMailById();
				vm.attachHide = true;
				vm.idReplyShow = false;
				vm.onDetailsClick = true;
				vm.offDetailsClick = false;
			})
		},
		data(){
			return{
				email: {},
				attachUrlLength: false,
				details: false,
				onDetailsClick: true,
				idReplyShow: false,
				offDetailsClick :false,
				starRtx: true,
				attachHide: true,
				emailData :{},
				sheetVisible: false,
				sheetData: [{name: '确定删除?'}, {name: '是',method: this.delMailRtx}, {name: '否',method: this.onCancel}],
			}
		},
		computed: {
			
		},
		methods:{
			getMailById: function(){
				let _this = this;
				if(this.$route.params && this.$route.query.id){
					_this.Api.MAIL.getMailById({
						id: _this.$route.query.id
					}).then(function(res) {
						if(res.data.code === '000000'){
							_this.$set(_this, 'email', res.data.body);
							_this.emailData = res.data.body;
							if(res.data.body.starMail==1){
								_this.starRtx = false;
							}else{
								_this.starRtx = true;
							}
							if(res.data.body.attachUrl.length){
								_this.attachUrlLength= true;
								for(var i=0;i<res.data.body.attachUrl.length;i++ ){
									res.data.body.attachUrl[i].url = _this.Api.MAIL.attachUrl(res.data.body.attachUrl[i].url);
								}
							}else{
								_this.attachHide = false;
							}
						}else{
							Toast({message: res.data.errormsg});
						}
					}).catch(function(error) {});
				}
			},
			reply(type){
				this.emailData.type = true;
				var str = JSON.stringify(this.emailData);
　　			   //存入
　　			   window.sessionStorage.setItem('replyData',str);
				this.$router.push({ path: '/mail/compose', query: { plan: type }});
				//this.$router.push({ name: 'Compose',params:});
			},
			isShow(){
				if(this.idReplyShow == true){
					this.idReplyShow = false;
				}else{
					this.idReplyShow = true
				}
				
			},
			onDetails(){
				let _this = this;
				_this.details = true;
				_this.onDetailsClick = false;
				_this.offDetailsClick = true;
				_this.attachUrlLength= false;
			},
			offDetails(){
				let _this = this;
				_this.details = false;
				_this.onDetailsClick = true;
				_this.offDetailsClick = false;
				_this.attachUrlLength= true;
			},
			transpond(type){
				this.emailData.type = true;
				var str = JSON.stringify(this.emailData);
　　			   //存入
　　			   window.sessionStorage.setItem('replyData',str);
				this.$router.push({ path: '/mail/compose', query: { repeat: type }});
			},
			addStarRtx(){
				let _this = this;
				_this.Api.MAIL.addStarRtx(
					_this.emailData.id
					).then(function(res) {
						if(res.data.code === '000000' && res.data.body ==='1'){
							_this.starRtx = false;
						}
				})
			},
			delStarRtx(){
				let _this = this;
				_this.Api.MAIL.delStarRtx(
					_this.emailData.id
					).then(function(res) {
						if(res.data.code === '000000' && res.data.body ==='1'){
							_this.starRtx = true;
						}
				})
			},
			onCancel(){
            	this.popupVisible = true;
           		this.sheetVisible = false;
            },
			showMailRtx(){
				let _this = this;
				_this.sheetVisible = true;
			},
			delMailRtx(){
				let _this = this;
				if(_this.$route.query.selected==="5"){
					_this.selected = 1;
				}else{  
					_this.selected = 0;
				}
				_this.Api.MAIL.delMailRtx(
					_this.emailData,_this.selected
				).then(function(res) {
					if(res.data.code === '000000'){
						_this.$router.replace({ path: '/mail/home', query: { selected: _this.$route.query.selected }});
					}
				})
			},
		},
		/* watch:{
			emailData:function
		}, */
	}
</script>

<style scoped>
	.emailDetail-wrap header{
		height: 40px;
		flex-grow: 0;
	}
	.emailDetail-wrap{
		display: flex;
		flex-direction: column;
		background: #FAFAFA;
		word-break:break-all;
		bottom: 0;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		overflow: auto;
	}
	.emailDetail-top{
		padding: 10px 15px;
		border-top: 1px solid #EEEEEE;
		border-bottom: 1px solid #EEEEEE;
		background: #FFFFFF;
	}
	.emailDetail-top h1,.emailDetail-top .emailDetail-branch{
		padding: 5px 0;
		line-height: 30px;
		font-size: 22px;
		color: #000;
		overflow:hidden;
		text-overflow: ellipsis;
		white-space:nowrap;
	}
	.emailDetail-send{
		color: #333;
		line-height: 25px;
		min-height: 25px;
	}
	.emailDetail-send:before{
		content: '';
		display: block;
		width: 0;
		clear: both;
		visibility: hidden;
		overflow: hidden;
	}
	.emailDetail-send span{
		font-size: 15px;
		color: #333333;
		height: 20px;
		line-height: 20px;
	}
	.emailDetail-send span.attach{
		padding-right: 20px;
		background: url(../images/iconload.png) center right no-repeat;
	}	
	.emailDetail-send span i{
		font-size: 16px;
		font-style: normal;
		color: #333333;
		margin-right:10px ;
	}
	.emailDetail-send span b{
		float: right;
		width: 21px;
		height: 21px;
		margin-left: 6px;
		border: 1px solid #E2E2E2;
		border-radius: 3px;
		text-align: center;
	}
	.emailDetail-send span b i{
		margin: 0;
	}
	.emailDetail-send span.fr{
		float: right;
	}
	.emailDetail-content{
		color: #333;
		background: #FAFAFA;
		font-size: 16px;
		line-height: 25px;
		padding-bottom: 20px;
	}
	.emailDetail-wrap footer{
		flex-grow: 0;
		height: 52px;
		border-top: 1px solid #E8E8E8;
		background: #fff;
	}
	.emaildetail-char{
		padding: 10px 15px;
	}		
	.emaildetail-char p{
		line-height: 40px;
		text-indent: 2em;
		font-size: 18px;
		color: #333333;
	}
	.emaildetail-attach{
		position: relative;
		padding: 0 15px;
	}
	.emaildetail-attach > div{
		position: absolute;
		line-height: 30px;
		font-size: 15px;
		color: #333333;
	}
	.emaildetail-attach p{
		padding-left: 45px;
		line-height: 30px;
		font-size: 15px;
		color: #4e8dff;
	}
	footer > ul:before{
		content: '';
		display: block;
		height: 0;
		clear: both;
		visibility: hidden;
		overflow: hidden;
	}
	footer > ul{
		height: 100%;
		padding: 10px 15px;
	}
	footer > ul > li{
/*		position: relative;*/
		float: left;
		width: 25%;
		height: 100%;
		/*padding:0 15px;*/
	}
	footer > ul > li:first-child{
		position: relative;
	}
	footer > ul > li a{
		display: block;
		height: 100%;
		line-height: 31px;
		font-size: 15px;
		text-align: center;
		color: #4e8dff;
	}
	footer ul li:first-child .pbstyle{
		color: #fff;
		background-color:#4E8DFF;
		border-radius:3px;
	}
 	.footerfirst-list{
		width: 100%;
		position: absolute;
		z-index: 10;
		left: 0;
		top: -122px;
		border:1px solid #E4E4E4;
		border-radius:3px ;
		height: 112px;
		background: #fff;
	}
	.footerfirst-list{
		width: 100%;
		padding: 0 10px;
	}
	.footerfirst-list li{
		float: none;
		height: 36px;
		line-height: 36px;
		border-bottom: 1px solid #E2E2E2;
		color: #000;
		text-align: center;
		font-size: 14px;
	}
	.footerfirst-list li:last-child{
		border: none;
		color: #999999;
	}
	.footerfirst-list:before{
		position: absolute;
		bottom: -10px;
		left: 50%;
		margin-left: -8px;
		content: '';
		width: 0;
	    height: 0;
	    border-left: 8px solid transparent;
	    border-right: 8px solid transparent;
	    border-top: 10px solid #E8E8E8;
	}
	.footerfirst-list:after{
		position: absolute;
		bottom: -8px;
		left: 50%;
		margin-left: -6px;
		content: '';
		width: 0;
	    height: 0;
	    border-left: 6px solid transparent;
	    border-right: 6px solid transparent;
	    border-top: 8px solid #fff;
	}
	.pr{
		position: relative;
	}
	.addStarRtx i{
		font-size: 16px;
		margin-right: 5px;
	}
	.deldelStarRtx i{
		color: #ffd213;
		font-size: 16px;
		margin-right: 5px;
	}
	.mint-tabbar{
		border-top: 1px solid #e2e2e2;
		position: fixed;
		z-index: 1111;
	}
</style>