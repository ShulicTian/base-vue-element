<template>
    <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="消息发送" name="list">
            <el-form ref="form" :model="form" :rules="rules" label-width="80px" style="width: 50%;">
                <el-form-item label="消息类型" prop="msgType">
                    <el-select v-model="form.msgType" placeholder="请选择消息类型">
                        <el-option label="文本消息" value="text"></el-option>
                        <el-option label="文本卡片消息" value="textcard"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发送用户" prop="sendUsers">
                    <el-select v-model="form.sendUsers" multiple placeholder="请选择发送用户">
                        <el-option v-for="user in userList" :label="user.name" :value="user.mobile"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item v-if="form.msgType==='textcard'" label="URL" prop="message.url">
                    <el-input v-model="form.message.url" type="text" />
                </el-form-item>
                <el-form-item v-if="form.msgType==='textcard'" label="按钮文本" prop="message.btntxt">
                    <el-input v-model="form.message.btntxt" type="text" />
                </el-form-item>
                <el-form-item v-if="form.msgType==='textcard'" label="标题" prop="message.title">
                    <el-input v-model="form.message.title" type="text" />
                </el-form-item>
                <el-form-item v-if="form.msgType==='textcard'" label="描述" prop="message.description">
                    <el-input v-model="form.message.description" type="textarea" />
                </el-form-item>
                <el-form-item v-if="form.msgType==='text'" label="内容" prop="message.content">
                    <el-input v-model="form.message.content" type="textarea" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="sendMessage">发送消息</el-button>
                </el-form-item>
            </el-form>
        </el-tab-pane>
    </el-tabs>
</template>

<script>

import { findListBySelector, sendMessage } from 'api/system';

export default {
    name: 'WechatMessage',
    components: {},
    data: function() {
        return {
            activeName: 'list',
            form: {
                msgType: '',
                message: { title: '', description: '', url: '', content: '' },
                toUser: '',
                sendUsers: []
            },
            userList: [],
            rules: {
                msgType: [{ required: true, message: '请选择消息类型', trigger: 'change' }],
                'message.title': [{ required: true, message: '请填写标题', trigger: 'blur' }],
                'message.description': [{ required: true, message: '请填写描述', trigger: 'blur' }],
                'message.url': [{ required: true, message: '请填写跳转的URL', trigger: 'blur' }],
                'message.content': [{ required: true, message: '请填写内容', trigger: 'blur' }],
                'message.btntxt': [{ required: true, message: '请填写跳转按钮文本', trigger: 'blur' }],
                sendUsers: [{ required: true, message: '请选择发送用户', trigger: 'change' }]
            }
        };
    },
    methods: {
        sendMessage() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.form.toUser = this.form.sendUsers.join('|');
                    sendMessage(this.form).then(ret => {
                        if (ret.code === '1' && ret.result) {
                            this.$message.success('发送成功');
                        } else {
                            this.$message.warning('发送失败');
                        }
                    });
                }
            });
        },
        getUserList() {
            findListBySelector({}).then(ret => {
                if (ret.code === '1') {
                    this.userList = ret.result;
                } else {
                    this.$message.warning('获取用户列表失败');
                }
            });
        }
    },
    created() {
        this.getUserList();
    }
};
</script>

<style scoped>
</style>
