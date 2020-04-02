<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="流程名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="ruleForm.description"></el-input>
      </el-form-item>
      <el-form-item label="难度系数" prop="difficulty">
        <el-radio-group v-model="ruleForm.difficulty">
          <el-radio v-for="(item,index) in 5" :key="'dif'+index"
            :label="item+''">{{item}}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="跳转方式" prop="transmit_type">
        <el-radio-group v-model="ruleForm.transmit_type" :disabled="ruleForm.id">
          <el-radio label="1">顺序流转</el-radio>
          <!-- 2019-9-5 测试要求去掉 -->
          <!-- <el-radio label="2">自由流转</el-radio>
          <el-radio label="3">无流转</el-radio> -->
          <el-radio label="4">流程2类流转</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="small" @click="submitForm()">保存</el-button>
        <el-button type="primary" size="small" @click="submitForm(editStep)">保存并编辑步骤</el-button>
        <el-button size="small" @click="$emit('cancel')">取消</el-button>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
import * as process from "@/work/api/process";

const TEMP = {
  "name": "",
  "description": "",
  "transmit_type": '1',
  "difficulty": '1'
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
            { required: true, message: '请输入流程名称', trigger: 'blur' }
          ]
      }
    }
  },
  watch: {
    data: {
      handler: function(data){
        if(data && data.process_category_id){
          this.ruleForm = Object.assign({}, TEMP, data)
        }else{
          this.ruleForm = Object.assign({}, TEMP)
          this.$nextTick(() => {
            this.$refs['ruleForm'].clearValidate()
          })
        }
      },
      deep: true, 
      immediate: true
    }
  },
  methods: {
    editStep(item) {
      this.$nextTick(() => {
        this.$emit('callStep', item)
      })
    },
    submitForm(callback) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const api = this.ruleForm.id ? process.edit : process.add;

          api.r(this.ruleForm).then(res => {
            if(typeof callback === 'function'){
              callback(res.data.data)
            }
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
