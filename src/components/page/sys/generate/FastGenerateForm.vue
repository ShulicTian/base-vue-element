<template>
    <common-form ref="fastGenerateForm" :target-data="formData" :template-data="templateData" :rules="rules"
                 @save="save"
                 @cancel="cancelSave" />
</template>

<script>
import { entityList, saveFastGenerate } from 'api/system';
import CommonForm from 'components/common/CommonForm';

export default {
    name: 'FastGenerateForm',
    data: function() {
        return {
            templateData: [
                { key: 'entityName', val: '实体名称', type: 'select', data: [] },
                { key: 'url', val: 'ctrl类路由', type: 'text', placeholder: '例：/system/user' },
                { key: 'permissionPrefix', val: '权限前缀', type: 'text', placeholder: '例：system:user' },
                { key: 'description', val: '描述', type: 'text' },
                {
                    key: 'actives', val: '', data: [
                        { name: '生成', eventName: 'save', type: 'primary' }
                    ], type: 'button'
                }
            ],
            rules: {
                entityName: [
                    { required: true, message: '请选择实体', trigger: 'change' }
                ],
                url: [
                    { required: true, message: '请输入URL', trigger: 'blur' }
                ],
                permissionPrefix: [
                    { required: true, message: '请输入权限前缀', trigger: 'blur' }
                ],
                description: [
                    { required: true, message: '请输入描述', trigger: 'blur' }
                ]
            },
            entityList: []
        };
    },
    components: {
        CommonForm
    },
    props: {
        formData: Object
    },
    methods: {
        cancelSave() {
            this.$emit('cancelSave');
        },
        save(obj) {
            obj.createDate = null;
            obj.path = this.entityList.filter(entity => entity.entityName == obj.entityName)[0].path;
            saveFastGenerate(obj).then(ret => {
                if (ret.code == 1) {
                    this.$message.success('保存成功');
                    this.$emit('saved');
                } else {
                    this.$message.warning('保存失败');
                }
            }).catch(err => {
                this.$message.warning('保存异常');
            });
        },
        getEntityList() {
            entityList().then(ret => {
                this.entityList = ret.result;
                let data = this.templateData.filter(obj => obj.key == 'entityName')[0].data;
                ret.result.forEach(entity => {
                    data.push({ id: entity.entityName, name: entity.entityName });
                });
            });
        },
        resetForm() {
            if (this.$refs['fastGenerateForm']) {
                this.$refs['fastGenerateForm'].resetForm();
            }
        }
    },
    created() {
        this.getEntityList();
    },
    watch: {}
};
</script>

<style scoped>
</style>
