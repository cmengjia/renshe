<template>
  <div>
  	<h1>吉林省人社厅协同办公平台</h1>
	<mt-navbar v-model="selected">
        <mt-tab-item id="1">首页
            <div class="info-badge" v-show="unread">
                <mt-badge size="small" color="#fc5461"></mt-badge>
            </div>
        </mt-tab-item>
		<mt-tab-item id="1">公文处理
            <div class="info-badge" v-show="unread">
                <mt-badge size="small" color="#fc5461"></mt-badge>
            </div>
        </mt-tab-item>
        <router-link to="/info">
        电子邮件
        
        </router-link>
		<mt-tab-item id="1">电子邮件
            <div class="info-badge" v-show="unread">
                <mt-badge size="small" color="#fc5461"></mt-badge>
            </div>
        </mt-tab-item>
		<mt-tab-item id="1">工作任务
            <div class="info-badge" v-show="unread">
                <mt-badge size="small" color="#fc5461"></mt-badge>
            </div>
        </mt-tab-item>
		<mt-tab-item id="1">即时通讯
            <div class="info-badge" v-show="unread">
                <mt-badge size="small" color="#fc5461"></mt-badge>
            </div>
        </mt-tab-item>
		<mt-tab-item id="1">通讯录</mt-tab-item>
    </mt-navbar>
  </div>
	
</template>

<script>
import {Indicator, Toast} from 'mint-ui';
import { Search } from 'mint-ui';
import Util from '@/libs/util.js';
import Loadmore from '@/components/loadmore';
export default {
  name: 'jc-header',
   data() {
        return {
            //当前选中的栏目
            selected: '1',
            unread: true,
        }
   }
}
</script>

<style>
	h1{
		background: #13529f;
		height: 52px;
		line-height: 52px;
		font-size: 22px;
		color: #fff;
	}
</style>
