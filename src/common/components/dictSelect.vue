<template>
    <div>
        <el-select v-if="type==='select'" v-model="svalue" :placeholder="placeholder" style="width: 100%;" @change="handleChange">
            <!-- <el-option :label="placeholder" value="0"></el-option> -->
            <el-option :label="item[optField.label]" :value="item[optField.value]" v-for="(item, index) in optVals" :key="index" :disabled="item.status && item.status != '0'"></el-option>
        </el-select>
        <el-checkbox-group v-if="type==='checkbox'" v-model="svalue" @change="handleChange">
            <el-checkbox v-for="(item, index) in optVals" :key="index" :label="item[optField.value]" v-if="item.status && item.status != '1'">
                {{item[optField.label]}}
            </el-checkbox>
            
        </el-checkbox-group>
    </div>
</template>

<script>
import * as allcommon from "@/common/api/common";

export default {
    props: {
        value: {
            type: [String, Array],
            required: true
        },
        placeholder: {
            type: String,
            default:() => {
                return '请选择'
            }
        },
        option: {
            type: Array,
            default:() => {
                return []
            }
        },
        optField: {
            type: Object,
            default:() => {
                return {
                    value: 'value',
                    label: 'name'
                }
            }
        },
        params: {
            type: String,
            default:() => {
                return ''
            }
        },
        type: {
            type: String,
            required: false,
            default: 'select'
        }
    },
    data() {
        return {
            svalue: '',
            optVals: this.option
        };
    },
    watch: {
        //判断下拉框的值是否有改变
        value: {
            handler: function(val){
                if(val == '0') { val = '' }
                this.svalue = val
            },
            immediate: true
        },
        option(val) {
          this.optVals = val;
        },
        params: {
            handler: function(){
                this.fetchData()
            },
            immediate: true
        }
    },
    methods: {
        handleChange(val) {
            this.$emit('input', val);
        },
        fetchData() {
            allcommon.dict_tree.r({id: this.params}).then(res => {
            this.optVals = res.data.data
            })
        }
    }
};
</script>

<style scoped>

</style>
