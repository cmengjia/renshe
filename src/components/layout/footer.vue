<template>
  <div class="mint-tabbar">
  	  <router-link 
			:to="'compose'"
			 class="mint-tab-item">
			<i class="foot-icon jcm-xieyoujian"></i>写邮件
	  </router-link>
  </div>
</template>


<script>
export default {
  name: 'jc-footer',
  data(){
  	return {
  		selected: 'foot1'
  	}
  }
}
</script>

<style>
.footer{
	left: 10px;
	right: 10px;
	background: #4e8dff;
}
.mint-tab-item-label{
	padding-top: 8px;
	min-height: 30px;
	font-size: 14px;
}
.footer .mint-tab-item{
	color: #fff;
}
.foot-icon{
	height: 24px;
	width: 24px;
	font-size: 24px;
	margin-right: 5px;
}

</style>
