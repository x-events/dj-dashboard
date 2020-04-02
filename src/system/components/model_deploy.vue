<template>
    <div class="content-box">
        <el-form ref="modelData" label-width="auto">
            <el-form-item :label="item.title" v-for="(item,index) in modelData" :key="index">
                <el-input v-model="item.value" v-if="item.type == '0' || item.type == '1'"></el-input>
                <el-input type="textarea" v-model="item.value" :rows="5"
                          v-else-if="item.type == '2' || item.type == '3'"></el-input>
                <el-select v-model="item.value" style="width:100%;" v-else-if="item.type == '4'">
                    <el-option :label="i.label" :value="i.value" :key="i.value"
                               v-for="i in item.selectData"></el-option>
                </el-select>
                <el-input type="hidden" v-model="item.name" style="display: none;"></el-input>
                <span class="annotation">({{item.remark}})</span>
            </el-form-item>
            <el-form-item>
                <el-button v-has="port.update" type="primary" @click="modelSubmit">确定</el-button>
                <el-button>取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
    import * as port from "../api/systemsetting";
    export default {
        props: {
            modelData: {
                type: Array,
                default: []
            },
        },
        data() {
            return {
                port,
                modelForm: []
            }
        },
        watch: {},
        methods: {
            modelSubmit() {
                this.modelForm = [];
                this.modelData.forEach((item, index, arr) => {
                    this.modelForm.push({name: item.name, value: item.value})
                })
                this.$emit('modelSave', this.modelForm);
            },
        }
    }
</script>
<style scoped>
    .content-box {padding: 10px 10px 10px 0;}
    .el-form-item {margin-bottom: 5px;}
    .annotation { color: #aaa;}
</style>
