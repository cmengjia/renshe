<template>
    <div class="success">
        <router-link class="record" to="/record" replace>
            <i class="jcm-calendar"></i>
        </router-link>
        <div class="success-img">
            <div class="success-bg"></div>
            <h1>打卡成功</h1>
        </div>
        <div class="success-info">
            <p>时间 <span>{{$route.params.time}}</span></p>
            <p>位置 <span>{{$route.params.name}}</span></p>
        </div>
    </div>

</template>

<script>

    export default {

    }

</script>

<style lang="scss">
    @import '../../../assets/sass/params';
    .success {
        .success-img {
            border-top: 1px solid #ccc;
            .success-bg {
                width: 116px;
                height: 116px;
                margin: 75px auto 25px;
                background: url("../images/duihao.png") no-repeat;
                background-size: 100% 100%;
                border-radius: 50%;
            }
            h1 {
                font-size: 20px;
                font-weight: bold;
                color: $global-base-color;
                text-align: center;
            }
        }
        .success-info {
            width: 260px;
            margin: 75px auto 0;
            border-top: 1px solid #e2e2e2;
            p {
                font-size: 14px;
                color: $list-label-color;
                margin-top: 22px;
            }
            span {
                float: right;
                color: $list-title-color;
            }
        }
        .record {
            color: $global-base-color;
        }
    }
</style>
