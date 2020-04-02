<template>
    <el-select v-model="svalue" :placeholder="placeholder" style="width: 100%;">
        <!-- <el-option :label="placeholder" value="0"></el-option> -->
        <el-option :label="item[optField.label]" :value="item[optField.value]" v-for="(item, index) in option" :key="index" :disabled="item.status && item.status != '0'"></el-option>
    </el-select>
</template>

<script>

export default {
    props: {
        value: {
            type: String
        },//接受外部v-model传入的值
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
                    value: 'id',
                    label: 'value'
                }
            }
        }
    },
    data() {
        return {
            options:[],
            svalue: ''
        };
    },
    watch: {
        //判断下拉框的值是否有改变
        svalue(val, oldVal) {
            // console.log('new: %s, old: %s', val, oldVal)
            if(val!=oldVal){
                this.$emit('input', this.svalue);
            }
        },
        value(val) {
            if(val == '0') { val = '' }
            this.svalue = val
        }
    },
    methods: {
    },
    mounted() {
        this.svalue = this.value
    },
};
</script>

<style scoped>

</style>
