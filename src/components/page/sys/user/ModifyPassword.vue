<template>
    <el-tabs type="border-card" v-model="activeName">
        <el-tab-pane label="修改密码" name="info">
            <common-form style="width: 50%;" ref="userForm" :target-data="userData" :template-data="templateData"
                         :rules="rules"
                         @save="updatePassword" />
        </el-tab-pane>
    </el-tabs>
</template>

<script>
import CommonForm from 'components/common/CommonForm';
import { updatePassword } from 'api/system';
import store from '@/store';
import router from '@/router';

export default {
    name: 'ModifyPassword',
    components: { CommonForm },
    data: function() {
        let validatePass = (rule, value, callback) => {
            if (this.userData.password) {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.userData.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            } else {
                callback();
            }
        };
        return {
            userData: {
                password: '',
                rePassword: ''
            },
            activeName: 'info',
            templateData: [
                { key: 'password', val: '密码', type: 'password' },
                { key: 'rePassword', val: '确认密码', type: 'password' },
                {
                    key: 'actives', val: '', data: [
                        { name: '保存修改', eventName: 'save', type: 'primary' }
                    ], type: 'button'
                }
            ],
            rules: {
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 16, message: '密码必须为6-16位', trigger: 'blur' }
                ],
                rePassword: [
                    { required: true, validator: validatePass, trigger: 'blur' },
                    { min: 6, max: 16, message: '密码必须为6-16位', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        updatePassword(user) {
            user.id = this.$store.state.system.user.id;
            updatePassword(user).then(ret => {
                if (ret.code == 1) {
                    this.$message.success('修改密码成功，请重新登录');
                    this.$store.commit('system/cleanCache');
                    router.push('/login');

                } else {
                    this.$message.warning('修改密码失败');
                }
            }).catch(err => {
                this.$message.warning('请求异常');
            });
        }
    },
    created() {
    },
    watch: {
        userData(val) {
            if (val.password) {
                this.rules.password = [
                    { min: 6, max: 16, message: '密码必须为6-16位', trigger: 'blur' }
                ];
            } else {
                this.rules.password = [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 16, message: '密码必须为6-16位', trigger: 'blur' }
                ];
            }
        }
    }
};
</script>

<style scoped>
</style>
