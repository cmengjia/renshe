<template>
    <div>
        <h1><i class="jcm-jiantou"></i>任务详情 </h1>
        <div class="box">
            <div class="par-title">基本信息</div>
            <table>
                <tr>
                    <td class="option">工作方面</td>
                    <td class="content">就业创业工作</td>
                </tr>
                <tr>
                    <td class="option">工作项目</td>
                    <td class="content"> 建立就业工作目标责任制考评机制（创新工作）</td>
                </tr>
            </table>
            <div class="par-title">详细信息</div>
            <div class="par-title">汇报详细</div>
            <div>
                <p><span>郭晓</span><span>推进状态：</span><span style="color: green">正常</span></p>
                <p><span>推进情况：</span>考核和表彰工作的考评表已下发至各下级单位</p>
                <p><span>相关附件</span><a href="#">链接</a></p>
                <span>2017-11-12</span>
            </div>
            <div>
                <p><span>张丽娜  </span><span>推进状态：</span><span style="color: red">滞后</span></p>
                <p><span>推进情况：</span>考核和表彰工作的考评表已下发至各下级单位</p>
                <p><span>相关附件</span><a href="#">链接</a></p>
                <span>2017-11-12</span>
            </div>
            <div class="par-title">下级任务列表</div>
            <p>没有下级任务</p>
            <div class="par-title">领导审批</div>
            <p>王文远：同意，请按照工作措施详细的开展工作</p>
            <div class="par-title">领导批注</div>
            <div> 曹宇光： 请按照XX管理办法正常推进<a href="#">回复</a></div>
            <div> 曹宇光： 请按照XX管理办法正常推进<a href="#">回复</a></div>
            <textarea style="width: 90%">
            fjgknkjsc
            </textarea>
            <a href="#">保存</a>
        </div>
    </div>
</template>
<script>
    export default {}
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


