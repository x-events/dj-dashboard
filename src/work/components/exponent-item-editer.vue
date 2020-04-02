<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="排序号" prop="order_num">
        <el-input type="number" v-model.number="ruleForm.order_num"></el-input>
      </el-form-item>
      <el-form-item label="指数名" prop="title">
        <el-input v-model="ruleForm.title"></el-input>
      </el-form-item>
      
      <el-form-item label="分值" prop="max_score">
        <el-input type="number" v-model.number="ruleForm.max_score"></el-input>
      </el-form-item>
      
      <el-form-item label="无上限" prop="is_infinite">
        <el-switch
          v-model="ruleForm.is_infinite"
          active-value="1"
          inactive-value="0">
        </el-switch>
      </el-form-item>
      
      <el-form-item label="绑定指标">
        <el-switch
          v-model="ruleForm.has_moudel"
          @change="toggleMoudel"
          >
        </el-switch>
      </el-form-item>
      <el-form-item label="指标" prop="model_id" v-if="ruleForm.has_moudel" v-loading="loading">
        <el-select v-model="ruleForm.model_id" >
          <el-option v-for="(item,index) in moudels" :key="'moudels'+index"
            :label="item.text"
            :value="item.value">
          </el-option>
          
        </el-select>
      </el-form-item>
      
      <el-form-item>
        <el-button type="primary" size="small" @click="submitForm()">提交</el-button>
        <el-button size="small" @click="$emit('cancel')">取消</el-button>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
import * as exponent from "@/work/api/exponent-item";

const TEMP = {
  "order_num": "0",
  "title": "",
  "is_infinite": "0",
  "max_score": 0,
  "model_id": "0"
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
  data() {
    return {
      loading: false,
      ruleForm: Object.assign({}, TEMP),
      rules: {
          order_num: [
            { required: true, message: '请输入排序号', trigger: 'blur' }
          ],
          title: [
            { required: true, message: '请输入指数名', trigger: 'blur' }
          ],
          max_score: [
            { required: true, message: '请输入分值', trigger: 'blur' }
          ]
      },
      moudels: []
    }
  },
  watch: {
    data: {
      handler: function(data){
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
    },
    ruleForm: {
      handler: function(ruleForm){
        let num = parseInt(ruleForm.order_num)
        if(isNaN(num)){
          num = 0
        }
        if(num<0){
          num = 0
        }
        this.$set(this.ruleForm, 'order_num', num);
      },
      deep: true
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
          const api = (this.ruleForm.id && !this.data.parentId) ? exponent.itemEdit : exponent.itemAdd;

          api.r(this.ruleForm).then(res => {
            
            this.$emit('submit')
          })
          
        } 
      });
    },
    fetchMoudels() {
      this.loading = true;
      exponent.moudels.r().then(res => {
        this.loading = false;
        this.moudels = res.data.data;
      })
    }
  },
  created: function(){
    this.fetchMoudels()
  }
}
</script>

<style scoped>

</style>
