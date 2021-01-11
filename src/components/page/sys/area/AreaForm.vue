<template>
    <common-form ref="areaForm" :target-data="areaData" :template-data="templateData" :rules="rules" @save="saveArea"
                 @cancel="cancelSave" />
</template>

<script>
import { saveArea } from 'api/system';
import CommonForm from 'components/common/CommonForm';

export default {
    name: 'AreaForm',
    data: function() {
        return {
            templateData: [
                { key: 'parentId', val: '上级菜单', type: 'selectTree', data: [] },
                { key: 'name', val: '区域名称', type: 'text' },
                { key: 'code', val: '区域编号', type: 'text' },
                { key: 'sort', val: '排序', type: 'number' },
                {
                    key: 'type',
                    val: '区域类型',
                    type: 'select',
                    data: this.$CommonUtils.dictToSelectorByType('area_type')
                },
                {
                    key: 'actives', val: '', data: [
                        { name: '保存', eventName: 'save', type: 'primary' },
                        { name: '取消', eventName: 'cancel', type: '' }
                    ], type: 'button'
                }
            ],
            rules: {
                name: [
                    { required: true, message: '请输入区域名称', trigger: 'blur' },
                    { max: 100, message: '长度最多不能超过100', trigger: 'blur' }
                ],
                code: [
                    { required: true, message: '请输入区域编号', trigger: 'blur' },
                    { max: 100, message: '长度最多不能超过100', trigger: 'blur' }
                ],
                sort: [
                    { required: true, message: '请输入排序', trigger: 'blur' }
                ],
                type: [
                    { required: true, message: '请选择区域类型', trigger: 'blur' }
                ]
            }
        };
    },
    components: {
        CommonForm
    },
    props: {
        areaData: Object,
        treeData: Array
    },
    methods: {
        cancelSave() {
            this.$emit('cancelSave');
        },
        saveArea(area) {
            let param = {};
            param.id = area.id;
            param.name = area.name;
            param.code = area.code;
            param.sort = area.sort;
            param.type = area.type;
            param.parentId = area.parentId;
            param.parentIds = this.getParentIds(this.treeData, param.parentId);
            saveArea(param).then(ret => {
                if (ret.code == 1) {
                    this.$message.success('保存成功');
                    this.$emit('saveArea');
                } else {
                    this.$message.warning('保存失败');
                }
            }).catch(err => {
                this.$message.warning('保存异常');
            });
        },
        getParentIds(list, id) {
            if (id == 0) {
                return '0,';
            }
            for (let ind in list) {
                if (list[ind].id == id) {
                    return list[ind].parentIds + id + ',';
                }
                if (list[ind].children && list[ind].children.length > 0) {
                    let parentIds = this.getParentIds(list[ind].children, id);
                    if (parentIds) {
                        return parentIds;
                    }
                }
            }
            return '';
        },
        handleTreeData() {
            let root = {
                id: 0,
                name: '区域列表',
                code: '',
                sort: 0,
                type: '',
                parentId: 0,
                children: []
            };
            root.children = this.treeData;
            this.templateData[0].data = [];
            this.templateData[0].data.push(root);
        },
        resetForm() {
            if (this.$refs['areaForm']) {
                this.$refs['areaForm'].resetForm();
            }
        }
    },
    created() {
        this.handleTreeData();
    }
};
</script>

<style scoped>
</style>
