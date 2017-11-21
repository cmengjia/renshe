<template>
    <div class="header">
        <h1><img src="../../../static/images/cockade.png" width='30' height='30' >吉林省人社厅协同办公平台</h1>
        <div class="nav">
            <router-link to="/rs" class="active">首页</router-link>
            <router-link to="/doc">公文处理</router-link>
            <router-link to="/mail/home">电子邮件</router-link>
            <router-link to="/email">工作任务</router-link>
            <router-link to="/email">即时通讯</router-link>
            <router-link to="/email">通讯录</router-link>
        </div>
    </div>
</template>

<script>
export default {
  name: 'jc-header',
   data() {
        return {

        }
   }
}
</script>
<style>
	.header h1{
		background: #13529f;
		height: 52px;
		line-height: 52px;
		font-size: 16px !important;
		color: #fff;
        padding-left: 10px;
	}
    .header h1 img{
        vertical-align: middle;
        margin-right: 10px;
    }
    .nav{
        height: 42px;
        display: table;
        width: 100%;
        background: url('../../../static/images/navBg.jpg') repeat-x;
    }
    .nav a{
        display: table-cell;
        height: 42px;
        line-height: 42px;
        text-align: center;
        font-size: 14px;
        color: #000;
    }
    .nav a.active{
        color: #13529f;
        background: #dedede;
        border-radius : 10px;
        background: url('../../../static/images/navActive.png') repeat-x;
        background-size: 100% 100%;
    }
</style>
