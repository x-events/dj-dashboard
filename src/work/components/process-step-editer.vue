<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="步骤名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="序号" prop="sort">
        <el-input type="number" v-model.number="ruleForm.sort"></el-input>
      </el-form-item>
      <el-form-item label="可选操作" prop="type">
        <el-checkbox-group v-model="ruleForm.type">
          <el-checkbox :label="1">流程中止</el-checkbox>
          <el-checkbox :label="2">增加协作者</el-checkbox>
          <el-checkbox :label="4">任务指派</el-checkbox>
          <el-checkbox :label="8">驳回</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
            
      <el-form-item>
        <el-button type="primary" size="small" @click="submitForm()">保存</el-button>
        <el-button v-if="ruleForm.id" type="primary" size="small" @click="submitForm(editForm)">保存并设置工作行为</el-button>
        <el-button size="small" @click="resetForm()">取消</el-button>
      </el-form-item>
    </el-form>
    
</template>

<script>
import * as process from "@/work/api/process";

const TEMP = {
        "id": 0,
        "name": "",
        "sort": 0,
        "process_nearest_id": 0,
        "parent_id": 0,
        "type": []
      }

export default {
  props: {
    data: {
      type: Object,
      required: false,
      default: function(){
        return {}
      }
    }
  },
  data() {
    return {
      drawerVisible: false,
      ruleForm: Object.assign({}, TEMP),
      rules: {
          name: [
            { required: true, message: '请输入步骤名称', trigger: 'blur' }
          ]
      }
    }
  },
  watch: {
    data: {
      handler: function(data){
        this.ruleForm = Object.assign({}, TEMP, data);
        if(!Array.isArray(this.ruleForm.type)){
          this.ruleForm.type = []
        }
      },
      deep: true, 
      immediate: true
    },
    ruleForm: {
      handler: function(ruleForm){
        let num = parseInt(ruleForm.sort)
        if(isNaN(num)){
          num = 0
        }
        if(num<0){
          num = 0
        }
        this.$set(this.ruleForm, 'sort', num);
      },
      deep: true
    }
  },
  methods: {
    editForm(item) {
      this.$nextTick(() => {
        this.$emit('callForm', item)
      })
    },
    submitForm(callback) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const api = this.ruleForm.id ? process.editStep : process.addStep;

          api.r(this.ruleForm).then(res => {
            if(typeof callback === 'function'){
              callback(res.data.data)
            }
            this.$emit('submit')
          })
          
        } 
      });
    },
    resetForm() {
      this.$emit('cancel');
      this.$refs['ruleForm'] && this.$refs['ruleForm'].resetFields()
    }
  }
}
</script>

<style scoped>

</style>
