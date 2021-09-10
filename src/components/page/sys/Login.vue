<template>
    <el-container v-loading="loading"
                  class="login-wrap"
                  element-loading-background="rgba(0, 0, 0, 0.7)"
                  element-loading-spinner="el-icon-loading"
                  element-loading-text="努力登陆中">
        <el-main>
            <div style="padding: 30px;">
                <el-image :src="hytIcon" />
            </div>
            <div class="ms-login">
                <div class="ms-title">
                    <div style="text-align: center;">{{ sysName }}</div>
                </div>
                <el-form ref="login" :model="param" :rules="rules" class="ms-content" label-width="0px">
                    <el-form-item prop="userName">
                        <el-input v-model="param.username" placeholder="请输入账号/手机号/身份证" prefix-icon="el-icon-user" />
                    </el-form-item>
                    <el-form-item prop="passWord">
                        <el-input
                            v-model="param.password"
                            placeholder="请输入密码"
                            prefix-icon="el-icon-lock"
                            type="password"
                            @keyup.enter.native="submitForm()" />
                    </el-form-item>
                    <div class="login-tips">
                        <div style="float: left;">
                            <el-checkbox v-model="checked">记住密码</el-checkbox>
                        </div>
                        <div style="float: right;">
                            <span style="color: #035bb6;text-decoration: underline;font-size: 14px;">找回密码</span>
                        </div>
                        <div style="clear: both;"></div>
                    </div>
                    <div class="login-btn">
                        <el-button :disabled="disabled" type="primary" @click="submitForm()">登录</el-button>
                    </div>
                </el-form>
            </div>
        </el-main>
        <el-footer
            style="text-align: center;background-color: rgba(255,255,255,0.2);height: 25px;color: white;font-size: 12px;line-height: 25px;opacity: 0.6;">
            Copyright ©
            2018-2021 考试运营管理服务平台 - Powered By Seaskyland V4.3.7
        </el-footer>
    </el-container>
</template>

<script>
import HYT from 'assets/img/hyt_logo.png';

export default {
    data: function() {
        return {
            checked: false,
            hytIcon: HYT,
            param: {
                username: '',
                password: ''
            },
            rules: {
                username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
                password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
            },
            sysName: '',
            disabled: false,
            loading: false
        };
    },
    methods: {
        submitForm() {
            this.$refs.login.validate(async valid => {
                if (valid) {
                    this.disabled = true;
                    this.loading = true;
                    this.param.rememberMe = this.checked;
                    this.$store.dispatch('system/login', this.param).then(ret => {
                        this.disabled = false;
                        this.loading = false;
                    }).catch(err => {
                        console.log(err);
                        this.disabled = false;
                        this.loading = false;
                    });
                } else {
                    this.disabled = false;
                    this.loading = false;
                    this.$message.error('请输入账号和密码');
                    return false;
                }
            });
        },
        init() {
            this.sysName = '考试运营管理服务平台';
            if (this.$store.state.system.user) {
                this.$router.replace('/system/userInfo');
            } else {
                this.$store.commit('system/cleanCache');
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
    background-image: url(../../../assets/img/back.png);
    background-size: 100% 100%;
}

.ms-title {
    width: 100%;
    line-height: 50px;
    text-align: center;
    font-size: 20px;
    font-weight: 600;
    color: #035bb6;
    letter-spacing: 4px;
    font-family: 'PingFang SC', "Helvetica Neue", Helvetica, "microsoft yahei", arial, STHeiTi, sans-serif;
    padding: 40px 0 10px 0;
}

.ms-login {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 350px;
    margin: -190px 0 0 -175px;
    border-radius: 3px;
    background: rgb(255, 255, 255);
    overflow: hidden;
}

.ms-content {
    padding: 20px;
}

.login-btn {
    text-align: center;
}

.login-btn button {
    width: 100%;
    height: 36px;
    margin-bottom: 30px;
    border-radius: 5px;
    background-color: #0c6cd0;
}

.login-tips {
    font-size: 12px;
    line-height: 30px;
    color: #333;
    padding-bottom: 20px;
}

/deep/ .el-input--small .el-input__inner {
    height: 40px;
    line-height: 40px;
    box-shadow: 3px 2px 3px rgba(156, 156, 156, 0.1);
}

/deep/ .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #035bb6;
}
</style>
