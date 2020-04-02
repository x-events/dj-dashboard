<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

      <el-form-item label="指数名" prop="title">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>
      
      <el-form-item label="满分" prop="total">
        <el-input type="number" v-model.number="ruleForm.total"></el-input>
      </el-form-item>

      <el-form-item label="考核对象" prop="group_ids">
        <dictSelect 
          params="1"
          :value="ruleForm.group_ids"
          type="checkbox"
          @input="ruleForm.group_ids=$event"
        />
      </el-form-item>
      
      <el-form-item label="类型" prop="type">
        <el-select v-model="ruleForm.type" >
          <el-option
            label="党建工作指数"
            value="work">
          </el-option>
          <el-option
            label="党员活跃度指数"
            value="active">
          </el-option>
          <el-option
            label="书记有为值指数"
            value="done">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-switch
          v-model="ruleForm.status"
          active-value="1"
          inactive-value="0"
          active-text="启用"
          inactive-text="禁用">
        </el-switch>
      </el-form-item>
      <el-form-item label="描述">
        <el-input type="textarea" v-model="ruleForm.description"></el-input>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" size="small" @click="submitForm()">提交</el-button>
        <el-button size="small" @click="$emit('cancel')">取消</el-button>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
import * as exponent from "@/work/api/exponent";

const TEMP = {
  "total": 0,
  "title": "",
  "group_ids": [],
  "type": 'work',
  "status": '1',
  "description": ""
}

export default {
  props: {
    data: {
      type: Object,
      required: true,
      default: function(){
        return {}
      }
    }
  },
  components: {
    dictSelect: (resolve) => require(['@/common/components/dictSelect.vue'], resolve)
  },
  data() {
    return {
      loading: false,
      ruleForm: Object.assign({}, TEMP),
      rules: {
          title: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          total: [
            { required: true, type: 'number', message: '请输入满分', trigger: 'blur' }
          ],
          group_ids: [
            { required: true, type: 'array', message: '请选择考核对象', trigger: 'blur' }
          ],
          type: [
            { required: true, message: '请选择类型', trigger: 'blur' }
          ]
      }
    }
  },
  watch: {
    data: {
      handler: function(data){
        data.total = data.total? parseInt(data.total): 0;
        if(data.id && !data.parentId){
          this.ruleForm = Object.assign({}, TEMP, data, {
            has_moudel: data.model_id!='0'
          })
        }else if(data.id && data.parentId){
          this.ruleForm = Object.assign({}, TEMP, {
            id: data.parentId,
            exponent_id: data.exponent_id
          })
        }else{
          this.ruleForm = Object.assign({}, TEMP, data)
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
    toggleMoudel(status) {
      if(status){
        this.ruleForm.model_id = '-1';
      } else {
        this.ruleForm.model_id = '0';
      }
    },
    submitForm(callback) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          const api = (this.ruleForm.id && !this.data.parentId) ? exponent.edit : exponent.add;

          api.r(this.ruleForm).then(res => {
            
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
