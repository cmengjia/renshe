<template>
<div>

<mt-navbar v-model="selected">
  <mt-tab-item id="1"><i class="jcm-jiahao"></i>重点任务概览</mt-tab-item>
  <mt-tab-item id="2"><i class="jcm-jiahao"></i>全厅任务汇报</mt-tab-item>
   <mt-tab-item id="2"></mt-tab-item>
  </mt-navbar>
  <div class="title">重点任务概览<i class="jcm-youjiantou1"></i></div>
  <mt-tab-container v-model="selected">
  <mt-tab-container-item id="1">
    <mt-cell v-for="n in 10" :title="'content ' + n" />
  </mt-tab-container-item>
  <mt-tab-container-item id="2">
    <mt-cell v-for="n in 4" :title="'content ' + n" />
  </mt-tab-container-item>
 </mt-tab-container>
  </div>
</template>
<script>
export default {
  data(){
      return{
          selected:'1'
      }
  }
}
</script>
<style>
.mint-tab-item-label{
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
.title{
    height: 30px;
    line-height: 30px;
    background-color: #1451a1;
    color: #fff;
    padding-left: 30px;

}
.jcm-youjiantou1{
 float: right;
 line-height: 30px;
}
</style>


