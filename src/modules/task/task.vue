<template>
    <div>

        <mt-navbar v-model="selected">
            <mt-tab-item id="1"><i class="jcm-jiahao"></i>重点任务概览</mt-tab-item>
            <mt-tab-item id="2"><i class="jcm-jiahao"></i>全厅任务汇报</mt-tab-item>
            <mt-tab-item id="3"></mt-tab-item>
        </mt-navbar>
        <div class="title">重点任务概览<i class="jcm-youjiantou1"></i></div>
        <mt-tab-container v-model="selected">
            <mt-tab-container-item id="1">
                <div v-for="it in importantTaskList">
                    <p>{{it.reportTitle}}<span>汇报时间：{{it.reportDate}}</span></p>
                    <p>推进情况：{{it.推进情况}}<span>推进状态：{{it.状态}}</span></p>
                    <p><span>{{it.reportUser}}</span><span>{{it.reportUnit}}</span></p>
                </div>
            </mt-tab-container-item>
            <mt-tab-container-item id="2">
                <div v-for="gt in generalTaskList">
                    <p>{{gt.grneralTitle}}<span>生成日期：{{gt.grneralDate}}</span></p>
                </div>
            </mt-tab-container-item>
        </mt-tab-container>
    </div>
</template>
<script>
    export default {
        data(){
            return {
                selected: '1',
                importantTaskList: [],
                generalTaskList:[]
            }
        }
    }
</script>
<style>
    .mint-tab-item-label {
        font-size: 18px;
    }

    .jcm-jiahao {
        display: block;
        margin: 10px auto;
        width: 60px;
        height: 60px;
        background-color: #1451a1;
        border-radius: 6px;
        font-size: 30px;
        color: #fff;
        line-height: 60px;
        text-align: center;
    }

    .title {
        height: 30px;
        line-height: 30px;
        background-color: #1451a1;
        color: #fff;
        padding-left: 30px;

    }

    .jcm-youjiantou1 {
        float: right;
        line-height: 30px;
    }
</style>


