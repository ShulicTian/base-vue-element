<template>
    <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="个人资料" name="info">
            <common-form ref="userForm" :rules="rules" :target-data="userData" :template-data="templateData"
                         style="width: 50%;"
                         @save="updateUserInfo" />
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import CommonForm from 'components/common/CommonForm';
import { updateUserInfo } from 'api/system';

export default {
    name: 'UserInfo',
    components: { CommonForm },
    data: function() {
        return {
            userData: {},
            activeName: 'info',
            templateData: [
                { key: 'nikeName', val: '昵称', type: 'text' },
                { key: 'username', val: '账号', type: 'text' },
                { key: 'name', val: '姓名', type: 'text' },
                { key: 'idCard', val: '身份证', type: 'text' },
                { key: 'mobile', val: '手机号', type: 'number' },
                { key: 'email', val: '邮箱', type: 'text' },
                {
                    key: 'actives', val: '', data: [
                        { name: '保存修改', eventName: 'save', type: 'primary' }
                    ], type: 'button'
                }
            ],
            rules: {
                nikeName: [
                    { max: 100, message: '长度最多不能超过100', trigger: 'blur' }
                ],
                username: [
                    { required: true, message: '请输入帐号', trigger: 'blur' },
                    { max: 100, message: '长度最多不能超过100', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { max: 100, message: '长度最多不能超过100', trigger: 'blur' }
                ],
                idCard: [
                    { required: true, message: '请输入身份证', trigger: 'blur' },
                    { max: 18, message: '长度最多不能超过18', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { max: 11, min: 11, message: '手机号必须为11位号码', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        updateUserInfo(user) {
            updateUserInfo(user).then(ret => {
                if (ret.code == 1) {
                    this.$message.success('保存资料成功');
                    this.$store.commit('system/setUser', user);
                } else {
                    this.$message.warning('保存资料失败');
                }
            }).catch(err => {
                this.$message.warning('请求异常');
            });
        }
    },
    created() {
        this.userData = this.$CommonUtils.cloneObj(this.$store.state.system.user);
    }
};
</script>

<style scoped>
</style>
