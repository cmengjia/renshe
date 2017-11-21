<template>
    <div>
        <h1><i class="jcm-jiantou"></i>任务详情 </h1>
        <div class="box">
            <div class="par-title">基本信息</div>
            <table>
                <tr>
                    <td class="option">工作方面</td>
                    <td class="content">{{basicInformation.gzfm}}</td>
                </tr>
                <tr>
                    <td class="option">工作项目</td>
                    <td class="content">{{basicInformation.gzxm}}</td>
                </tr>
            </table>
            <div class="par-title">详细信息</div>
            <p>{{detailedInformation.xxxx}}</p>
            <div class="par-title" v-for="rd in reportDetail" :key="rd.id">汇报详细</div>
            <div>
                <p><span>{{rd.user}}</span><span>推进状态：</span><span style="color: green">{{rd.zt}}</span></p>
                <p><span>推进情况：</span>{{rd.tjzk}}</p>
                <p><span>相关附件</span><a href="#">链接</a></p>
                <span>{{rd.date}}</span>
            </div>
            <div class="par-title" v-for="sdt in subordinateTaskList" :key="sdt.id">下级任务列表</div>
            <p>{{sdt.rw}}</p>
            <div class="par-title">领导审批</div>
            <p><span>{{leadExamine.user}}</span>{{leadExamine.yj}}</p>
            <div class="par-title">领导批注</div>
            <div v-for="lp in leadPostilList"><span>{{lp.user}}</span>{{lpl.nr}}<a href="#">回复</a></div>
            <textarea style="width: 90%">
            fjgknkjsc
            </textarea>
            <a href="#">保存</a>
        </div>
    </div>
</template>
<script>
    export default {
        data(){
            return{
                //基本信息
                basicInformation:{ },
                //详细信息
                detailedInformation:{ },
                //汇报详细
                reportDetail:[ ],
                //下级任务列表
                subordinateTaskList:[ ],
                //领导审批
                leadExamine:{ },
                //领导批注
                leadPostil:[ ]
            }
        }
    }
</script>

<style lang="scss">
    @import '../../assets/sass/params';

    .box {
        padding: 0 10px;
    }

    h1 {
        height: 50px;
        line-height: 50px;
        color: #fff;
        background-color: #1451a1;
        margin-bottom: 10px;
    }

    .jcm-jiantou {
        display: inline-block;
        width: 50px;
        /* height: 50px; */
        color: #fff;
        font-size: 30px;
        margin: 15px;
    }

    .par-title {
        height: 30px;
        line-height: 30px;
        background-color: #f4f4f4;
        border: 1px solid #e4e4e4;
        margin-bottom: 10px;
    }

    table {
        width: 100%;
        margin: 5px 0;
    }

    .option {
        width: 30%;
        height: 48px;
        background-color: #f9f8f5;
        text-align: right;
        padding-right: 10px;
        font-weight: bold;
    }

    .content {
        width: 70%;
        padding-left: 5px;

    }

    td {
        border: 1px solid #ccc;
    }
</style>


