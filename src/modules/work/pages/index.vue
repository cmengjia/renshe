<template>
    <div class="work-content" :style="{ height: wrapperHeight + 'px' }">
        <calendar
        :events="calendar.events"
        :jcmday="currentDate"
        @select="calendar.select"
        @selectMonth="calendar.selectMonth"
        @selectYear="calendar.selectYear"
        id="workCalendar">
        </calendar>
        <div class="work-new clearfix">
            <span class="fl" style="float:left">{{today}}</span>
             <i class="mintui plus" @click="viewDiary()"></i>
        </div>
        <div class="work-main" :style="{ height: workListHeight + 'px' }">
            <ul class="work-list" v-show="workList.length>0">
            	<li v-for="item in workList" @click="viewDiary(item)">
	                <span class="list-time">{{item.startTimeStr}}-{{item.endTimeStr}}</span>
	                <span class="list-title white-space">{{item.title}}</span>
	                <i class="mint-cell-allow-right"></i>
                </li>
            </ul>
            <div class="work-no" v-show="workList.length==0">
            	<img src="../images/no.png" height="44px" width="44px">
            	<p>暂无相关日程</p>
            </div>
        </div>
    </div>
</template>

<script>
import calendar from '@/components/calendar';
import Api from '@/libs/api';
import Util from '@/libs/util.js';
import { Toast } from 'mint-ui';
export default{
    components:{
        calendar
    },
    data(){
        let _this = this;
        return {
        	currentDate: [],//当前日期
            calendar: {
                events:{},
                select(value){
                	_this.updateDate(value);
                },
                selectMonth(value){
                	_this.updateDate(value);
                },
                selectYear(value){
                	_this.updateDate(Array.of(value));
                }
            },
            dirayList:[],//月份日程
            wrapperHeight: document.documentElement.clientHeight //控制容器的高度
        }
    },
    beforeRouteEnter (to, from, next) {
    	next((vm) => {
    		vm.queryDiary();
    	})
  	},
    methods: {
    	updateDate(newDate){//调整日期
    		let lastDate = this.currentDate;
    		if(newDate.length==1){//年
    			newDate[1] = this.currentDate[1];
    			newDate[2] = this.currentDate[2];
    		}else if(newDate.length==2){//年月
    			newDate[2] = this.currentDate[2];
    		}
    		this.currentDate = newDate;
    		if(this.currentDate[0]!=lastDate[0]||this.currentDate[1]!=lastDate[1]){//年或者月改变了
    			this.queryDiary();
    		}
    	},
        queryDiary(){//根据年月获取月日程
        	let _this = this;
	      	_this.Api.WORK.queryDiary({
	      		year:_this.currentDate[0],
	      		month:_this.currentDate[1]
	      	}).then(function(res){
	            if(res.data.code === '000000'){
	            	if(_this.currentDate.length==0){//从服务器获取当期日期
	            		let today = new Date(res.data.body.time);
	                	_this.currentDate = [today.getFullYear(), today.getMonth() + 1, today.getDate()]
	            	}
	                _this.dirayList = res.data.body.dirayList;
	                _this.calendar.events = {};
	                _this.dirayList.forEach(function(element,index){
	                	if(element){
		            		_this.calendar.events[_this.currentDate[0] + '-' + _this.currentDate[1] + '-' + (index+1)] = '$';
	                	}
	                })
	            }else{
	           		Toast(res.data.errormsg);
	           	}
	        }).catch(function(error){
	        	Toast('加载失败......');
	        })
        },
        viewDiary(item){//去往详情页
        	window.sessionStorage.setItem("diaryDetail",JSON.stringify(item));
	    	window.sessionStorage.setItem("currentDate",JSON.stringify(this.currentDate));
	    	this.$router.push({ name: 'Detail', params: { id : item ? item.id : 0 }});
        }
    },
    computed:{
    	today:function(){//格式化日期
    		if(this.currentDate.length>0){
    			let iosdate = this.currentDate.join("/"); //解决ios不能正确转换日期
    			return Util.format(new Date(iosdate) ,'yyyy年MM月dd日');
    		}else{
    			return "";
    		}
	    },
	    workList:function(){//当天日程
	    	let day = this.currentDate[2];
	    	return this.dirayList[day-1]?this.dirayList[day-1].dirayList:[];
	    },
	    workListHeight:function(){//日程区域高度
	    	let workListHeight = 0;
	    	let dom = document.getElementById("workCalendar");
	    	if(this.workList.length==0&&dom){
	    		workListHeight = this.wrapperHeight - dom.clientHeight - 100;
	    	}
	    	return workListHeight
	    }
    },
}


</script>

<style scoped lang="scss">
$global-work-color: #eee !default;

.work-content{
    overflow:scroll;
    background-color: #eee;
    
    .calendar{
	    padding-bottom: 5px;
	}
    .work-new{
	    position:relative;
	    height:46px;
	    line-height:46px;
	    padding:0px 15px;
	    font-size:16px;
	    background-color:$global-work-color;
	}
	.work-new i{
		position:relative;
		float:right;
		height:46px;
		width:46px;
	}
	.work-main{
		display: flex;
		justify-content: center;
		align-items: center;
	    color:#333;
	}
	.work-list{
	    width:100%;
	    height:100%;
	    background-color:$global-work-color;
	}
	.work-list li{
	    position: relative;
	    width:100%;
	    height:50px;
	    margin-bottom:5px;
	    padding:0px 15px;
	    line-height:50px;
	    font-size:16px;
	    background-color:#fff;
	}
	.list-time{
	    display:inline-block;
	    width:75px;
	    height:25px;
	    line-height:25px;
	    text-align:center;
	    border-radius:4px ;
	    color:#fff;
	    font-size:12px;
	}
	.work-list li:nth-of-type(4n-3) .list-time{
	    background-color:#50c14e;
	}
	.work-list li:nth-of-type(4n-2) .list-time{
	    background-color:#4e8dff;
	}
	.work-list li:nth-of-type(4n-1) .list-time{
	    background-color:#9da5be;
	}
	.work-list li:nth-of-type(4n) .list-time{
	    background-color:#ff7f5c;
	}
	.work-list .list-title{
	    width: 60%;
	    margin-left:8px;
	}
	.work-list li .mint-cell-allow-right::after{
	    width:16px;
	    height:16px;
	    color:#aaa;
	    right:20px;
	}
	.work-no{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		p{
			font-size: 12px;
			color: #999999;
			margin-top: 10px;
		}
	}
	.white-space {
	    display: inline-block;
	    white-space: nowrap;
	    text-overflow: ellipsis;
	    overflow: hidden;
	    vertical-align: middle;
	    word-break: break-all;
	}
	.plus:before{
	    content: '';
	    position: absolute;
	    right:0px;
	    top:20px;
	    width: 20px;
	    height: 2px;
	    background-color: currentColor;
	    color:#4e8dff;
	}
	.plus:after{
	    content: '';
	    position: absolute;
	    right:0px;
	    top:20px;
	    width: 20px;
	    height: 2px;
	    background-color: currentColor;
	    -webkit-transform: rotate(90deg);
	    transform: rotate(90deg);
	    color:#4e8dff;
	}
}

.work-content::-webkit-scrollbar {width: 0px;height: 0px;}
</style>
