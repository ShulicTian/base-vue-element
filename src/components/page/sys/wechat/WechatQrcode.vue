<template>
    <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="企业二维码" name="list">
            <div style="text-align: center;">
                <div>二维码只有7天有效时间</div>
                <el-image :src="url"></el-image>
            </div>

        </el-tab-pane>
    </el-tabs>
</template>

<script>


import { getQrcodeUrl } from 'api/system';

export default {
    name: 'WechatQrcode',
    components: {},
    data: function() {
        return {
            activeName: 'list',
            url: ''
        };
    },
    methods: {
        getQrcode() {
            getQrcodeUrl({ sizeType: '2' }).then(ret => {
                if (ret.code === '1' && ret.result) {
                    this.url = ret.result.joinQrcode;
                } else {
                    this.$message.warning('获取二维码失败');
                }
            });
        }
    },
    created() {
        this.getQrcode();
    }
};
</script>

<style scoped>
</style>
