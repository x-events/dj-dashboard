<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="试题组名称" prop="title">
        <el-input v-model.trim="ruleForm.title"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">保存</el-button>
        <el-button @click="$emit('cancel')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as exam from "@/learn/api/exam";

const TEMP = {
  id: "",
  title: "",
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
      ruleForm: Object.assign({}, TEMP),
      rules: {
          title: [
            { required: true, message: '请输入试题组名称', trigger: 'blur' }
          ]
      }
    }
  },
  watch: {
    data: {
      handler: function(data){
        if(data && data.id){
          this.ruleForm = Object.assign({}, TEMP, data)
        }else{
          this.ruleForm = Object.assign({}, TEMP)
          this.$nextTick(()=>{
            this.$refs['ruleForm'].clearValidate()
          })
        }
      },
      deep: true, 
      immediate: true
    }
  },
  methods: {
    submitForm() {
      console.log(this.ruleForm);
      let api = exam.questionGroupUpdate;
      if(this.ruleForm.id == ''){
        api = exam.questionGroupCreate
      }
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          api.r(this.ruleForm).then(res => {
            this.$message.success(res.data.message);
            this.$emit('submit')
          })
        } 
      });
    }
  }
}
</script>

<style scoped>
</style>