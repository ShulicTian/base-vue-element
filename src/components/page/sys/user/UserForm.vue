<template>
    <common-form ref="userForm" :rules="rules" :target-data="userData" :template-data="templateData" @save="saveUser" />
</template>

<script>
import { findRoleList, saveUser } from 'api/system';
import CommonForm from 'components/common/CommonForm';

export default {
    name: 'UserForm',
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
            templateData: [
                { key: 'nikeName', val: '昵称', type: 'text' },
                { key: 'username', val: '用户名', type: 'text' },
                { key: 'password', val: '密码', type: 'password' },
                { key: 'rePassword', val: '确认密码', type: 'password' },
                { key: 'name', val: '姓名', type: 'text' },
                { key: 'idCard', val: '身份证', type: 'text' },
                { key: 'mobile', val: '手机号', type: 'number' },
                { key: 'email', val: '邮箱', type: 'text' },
                { key: 'roleIdList', val: '用户角色', data: [], type: 'checkbox' },
                {
                    key: 'actives', val: '', data: [
                        { name: '保存', eventName: 'save', type: 'primary' }
                    ], type: 'button'
                }
            ],
            rules: {
                nikeName: [
                    { max: 100, message: '长度最多不能超过100', trigger: 'blur' }
                ],
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 4, max: 20, message: '账号必须为4-20位', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 16, message: '密码必须为6-16位', trigger: 'blur' }
                ],
                rePassword: [
                    { required: true, validator: validatePass, trigger: 'blur' },
                    { min: 6, max: 16, message: '密码必须为6-16位', trigger: 'blur' }
                ],
                name: [
                    { required: true, message: '请输入姓名', trigger: 'blur' },
                    { max: 100, message: '长度最多不能超过100', trigger: 'blur' }
                ],
                idCard: [
                    { max: 18, message: '长度最多不能超过18', trigger: 'blur' }
                ],
                mobile: [
                    { required: true, message: '请输入手机号', trigger: 'blur' },
                    { max: 11, min: 11, message: '手机号必须为11位号码', trigger: 'blur' }
                ],
                roleIdList: [
                    { required: true, message: '请选择用户角色', trigger: 'change' }
                ]
            }
        };
    },
    props: {
        userData: Object
    },
    methods: {
        saveUser(user) {
            // this.$emit('saved');
            if (user.idCard == '') {
                user.idCard = user.mobile;
            }
            saveUser(user).then(ret => {
                if (ret.code == 1) {
                    this.$message.success('保存用户成功');
                    this.$emit('saved');
                } else {
                    this.$message.warning('保存用户失败');
                }
            });
        },
        async requestRoleList() {
            await findRoleList({ usable: 1 }).then(ret => {
                this.templateData.filter(temp => temp.key == 'roleIdList')[0].data = ret.result;
            });
        },
        resetForm() {
            if (this.$refs['userForm']) {
                this.$refs['userForm'].resetForm();
            }
        }
    },
    created() {
        this.requestRoleList();
    },
    watch: {
        userData(val) {
            if (val.id && val.id != -1) {
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
