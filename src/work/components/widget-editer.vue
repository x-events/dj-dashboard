<template>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="名称" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入"></el-input>
      </el-form-item>
      <el-form-item label="提示语" prop="placeholder">
        <el-input v-model="ruleForm.placeholder" placeholder="请输入"></el-input>
      </el-form-item>
      
      <el-form-item label="列宽" prop="column">
        <el-select v-model="ruleForm.column" placeholder="请选择">
          <el-option
            v-for="column in 24"
            :key="'column'+column"
            :label="column"
            :value="column">
          </el-option>
        </el-select>
      </el-form-item>
      
      <el-form-item label="占据整行" prop="is_row">
        <el-switch
          v-model="ruleForm.is_row"
          active-value="1"
          inactive-value="0">
        </el-switch>
      </el-form-item>
      <el-form-item label="必填" prop="required">
        <el-switch
          v-model="ruleForm.required"
          active-value="1"
          inactive-value="0">
        </el-switch>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" size="small" @click="submitForm()">保存</el-button>
        <el-button v-if="!ruleForm.relation_id" type="danger" size="small" @click="$emit('remove')">删除</el-button>
      </el-form-item>
    </el-form>
    
</template>

<script>
const TEMP = {
  "name": "",
  "required": "0",
  "is_row": "0",
  "column": "0",
  "placeholder": ""
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
          name: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ]
      }
    }
  },
  watch: {
    data: {
      handler: function(data){
        if(!data.name && data.label){
          data.name = data.label
        }
        this.ruleForm = Object.assign({}, TEMP, data);
      },
      deep: true, 
      immediate: true
    }
  },
  computed: {
    list: function(){
      if(this.ruleForm.component.length){
        return [this.ruleForm]
      }else{
        return []
      }
    }
  },
  methods: {
    submitForm() {

      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.$emit('submit', Object.assign({}, this.ruleForm))
        } 
      });
    },
    resetForm() {
      this.ruleForm = Object.assign({}, TEMP);
      this.$emit('cancel');
    }
  }
}
</script>

<style scoped>

</style>
