<template>
    <div class="login-wrap">
        <div class="ms-login">
            <div class="ms-title">{{ sysName }}</div>
            <el-form :model="param" :rules="rules" ref="login" label-width="0px" class="ms-content">
                <el-form-item prop="username">
                    <el-input v-model="param.username" placeholder="用户名">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input
                        type="password"
                        placeholder="密码"
                        v-model="param.password">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="repassword">
                    <el-input
                        type="password"
                        placeholder="再次输入密码"
                        v-model="param.repassword">
                        <el-button slot="prepend" icon="el-icon-lx-lock"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="nikeName">
                    <el-input v-model="param.nikeName" placeholder="昵称">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="name">
                    <el-input v-model="param.name" placeholder="姓名">
                        <el-button slot="prepend" icon="el-icon-lx-people"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="mobile">
                    <el-input type="number" v-model="param.mobile" placeholder="手机号">
                        <el-button slot="prepend" icon="el-icon-mobile"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="idCard">
                    <el-input v-model="param.idCard" placeholder="身份证号">
                        <el-button slot="prepend" icon="el-icon-bank-card"></el-button>
                    </el-input>
                </el-form-item>
                <el-form-item prop="email">
                    <el-input v-model="param.email" placeholder="邮箱">
                        <el-button slot="prepend" icon="el-icon-message"></el-button>
                    </el-input>
                </el-form-item>
                <div class="login-btn">
                    <el-button type="primary" @click="submitForm()">注册</el-button>
                </div>
                <p class="login-tips">已有账号？
                    <el-link href="#/login" type="primary">前往登入</el-link>
                </p>
            </el-form>
        </div>
    </div>
</template>

<script>
import { isExist, register } from 'api/system';

export default {
    data: function() {
        let userNameExist = (rule, value, callback) => {
            if (value === '') {
                callback('请输入用户名');
            } else {
                isExist({ username: value, unloading: true }).then(ret => {
                    if (ret.code == 1) {
                        if (ret.result == true) {
                            callback('用户名已存在');
                        } else {
                            callback();
                        }
                    } else {
                        callback('用户名检测异常');
                    }
                }).catch(err => {
                    callback('用户名检测异常');
                });
            }
        };
        let mobileExist = (rule, value, callback) => {
            if (value === '') {
                callback('请输入手机号');
            } else {
                isExist({ mobile: value, unloading: true }).then(ret => {
                    if (ret.code == 1) {
                        if (ret.result == true) {
                            callback('手机号已存在');
                        } else {
                            callback();
                        }
                    } else {
                        callback('手机号检测异常');
                    }
                }).catch(err => {
                    callback('手机号检测异常');
                });
            }
        };
        let idCardExist = (rule, value, callback) => {
            if (value === '') {
                callback('请输入身份证号');
            } else {
                isExist({ idCard: value, unloading: true }).then(ret => {
                    if (ret.code == 1) {
                        if (ret.result == true) {
                            callback('身份证号已存在');
                        } else {
                            callback();
                        }
                    } else {
                        callback('身份证号检测异常');
                    }
                }).catch(err => {
                    callback('身份证号检测异常');
                });
            }
        };
        return {
            param: {
                username: '',
                repassword: '',
                password: '',
                nikeName: '',
                name: '',
                mobile: '',
                idCard: '',
                email: ''
            },
            rules: {
                username: [{ required: true, validator: userNameExist, trigger: 'blur' }],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 16, message: '密码必须由6-16位字母、数字、符号组成', trigger: 'blur' }
                ],
                name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
                mobile: [
                    { required: true, trigger: 'blur', validator: mobileExist },
                    { min: 11, max: 11, message: '手机号校验错误', trigger: 'blur' }
                ],
                idCard: [{ required: true, trigger: 'blur', validator: idCardExist }],
                repassword: [{ required: true, message: '请再次输入密码', trigger: 'blur' }]
            },
            sysName: ''
        };
    },
    computed: {},
    methods: {
        submitForm() {
            this.$refs.login.validate(async valid => {
                if (!this.confirmPassWord()) {
                    this.$message.error('两次密码输入不一致');
                    return false;
                }
                if (valid) {
                    await register(this.param).then(data => {
                        if (data.code == 1) {
                            this.$message.success('注册成功');
                            this.$store.dispatch('system/saveUser', data.result);
                            this.$router.replace('/login');
                        } else {
                            this.$message.error(data.msg);
                        }
                    }).catch(err => {
                        console.log(err);
                        this.$message.error('接口异常');
                    });
                } else {
                    this.$message.error('请输入必填信息');
                    return false;
                }
            });
        },
        confirmPassWord() {
            if (this.param.repassword == this.param.password) {
                return true;
            }
            return false;
        },
        init() {
            this.sysName = this.$store.state.sysName;
            if (this.$store.state.system.user) {
                this.$router.replace('/index');
            }
        }
    },
    created() {
        this.init();
    }
};
</script>

<style scoped>
.login-wrap {
    position: relative;
    width: 100%;
    height: 100%;
    background-image: url(../../../assets/img/login-bg.jpg);
    background-size: 100%;
}

.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    color: #333;
    border-bottom: 1px solid #ddd;
}

.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.3);
    overflow: hidden;
}

.ms-content {
    padding: 30px 30px;
}

.login-btn {
    text-align: center;
}

.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 10px;
}

.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #333;
}
</style>
