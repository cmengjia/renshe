<template>
    <div>
        <Uploader :options="option1"></Uploader>  
        <Uploader :options="option2" class="jcupload"></Uploader>
        <div class="info-wrapper" ref="wrapper">
            <Loadmore 
                :on-refresh="onRefresh" 
                :on-infinite="onInfinite" 
                :options="loadMoreOptions">
                <mt-cell v-for="info in files" 
                    :key="info.id" 
                    :title="info.name" 
                    :to="'detail/'+info.id">
                </mt-cell>
            </Loadmore>
        </div>
    </div>
</template>

<script>
import Uploader from '@/components/uploader';
import Loadmore from '@/components/loadmore';
/**
 * 文档地址  http://172.16.3.71:8080/gitbucket/gezg/mobileUploader
 */
 
export default {
    name: 'jc-uploader',
    components: {
        Uploader,
        Loadmore
    },
    data(){
        let _this = this;
        return {
            files: [],
            //加载数据的loading
            loading: false,
            //上拉刷新配置
            loadMoreOptions: {
                noFlag: false //暂无更多数据显示
            },
            option1: {
                formData: {
                    businessId : 1,
                    businessTable : 'table',
                    category: 'category1'
                },
                server: 'http://172.16.3.77:7120/goa/ic/mailRtx/saveAttach.action?login-at=true&userId=200001',
                targetHandler(file){
                    _this.files.push(file);
                }
            },
            option2: {
                formData: {
                    businessId : 1,
                    businessTable : 'table',
                    category: 'category2'
                }
            }
        }
    },
    methods: {
            onRefresh() {
                setTimeout(() => {
                }, 2000);
            },
            onInfinite() {
                this.columns[this.selected]++;
                this.getList();
            },
            showLoading() {
                Indicator.open();
            },
            hideLoading() {
                Indicator.close();
            }
        }
}
</script>

<style>
    /**
    * 向下都是可以项目中自定义的样式 ,如无用可删除
    */
    .jcupload .webuploader-pick {
        width: 120px;
        background-color: #f90;
    }

    #target {
        padding: 0;
    }

    #target li {
        height: 40px;
        line-height: 40px;
        border-top: 1px solid #ccc;
        list-style: none;
    }

    #target li img {
        width: 40px;
        height: 40px;
    }
</style>
