<template>
    <el-cascader
        v-model="value"
        :options="options"
        :props="casProps"
        :disabled="disabled"
        @change="handleChange"></el-cascader>
</template>

<script>

export default {
    name: 'CommonAreaSelector',
    data: function() {
        return {
            value: '',
            options: [],
            casProps: {
                label: 'name',
                value: 'id'
            }
        };
    },
    props: {
        level: Number,
        defaultVal: Array,
        disabled: Boolean
    },
    methods: {
        getAreaList() {
            this.$store.dispatch('system/requestAreaList').then(ret => {
                let list = ret.result.filter(obj => obj.type === '1');
                this.handleTree(list, ret.result, this.level);
                this.options = list;
            });
        },
        handleTree(list, allList, level) {
            if (level > 1) {
                list.forEach(obj => {
                    let children = allList.filter(child => child.parentId == obj.id);
                    if (children && children.length > 0) {
                        this.handleTree(children, allList, level - 1);
                        obj.children = children;
                    }
                });
            }
        },
        handleChange(val) {
            this.$emit('change', val);
        }
    },
    created() {
        this.getAreaList();
        if (this.defaultVal) {
            this.value = this.defaultVal;
        }
    },
    watch: {
        defaultVal(val) {
            this.value = val;
        }
    }
};
</script>

<style scoped>
.refClass:hover {
    opacity: 0.6;
    cursor: pointer;
}
</style>
