<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <div class="flex-row">
        <el-form-item label="名称" prop="title" class="flex-1">
          <el-input v-model="ruleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="方法" prop="method" class="flex-1">
          <el-input type="text" v-model="ruleForm.method"></el-input>
        </el-form-item>
      </div>

      <el-divider>参数配置(输入sql以sql为准，没有sql以配置项为准)</el-divider>

      <template v-for="(param,index) in ruleForm.params">
        <el-row :key="'param'+index">
          <el-col :span="12">
            <el-form-item label="标题" >
              <el-input type="text" v-model="param.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字段名" >
              <el-input type="text" v-model="param.name"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="模型及方法">
              <el-input type="text" v-model="param.module"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="字段类型">
              <div class="flex-row">
                <el-select v-model="param.type" placeholder="请选择" class="flex-1">
                  <el-option
                    label="下拉框"
                    value="select">
                  </el-option>
                  <el-option
                    label="下拉框（多选）"
                    value="multiple">
                  </el-option>
                  <el-option
                    label="文本框"
                    value="text">
                  </el-option>
                  <el-option
                    label="多选框"
                    value="checkbox">
                  </el-option>
                </el-select>
                <el-button type="danger" style="margin-left:1em" @click="ruleForm.params.splice(index,1)">删除</el-button>
              </div>
            </el-form-item>
          </el-col>

        </el-row>
      </template>

      <el-form-item>
        <el-button type="info" size="small" @click="ruleForm.params.push(Object.assign({}, paramsInit))">添加参数</el-button>
        <el-button type="primary" size="small" @click="submitForm()">提交</el-button>
        <el-button size="small" @click="$emit('cancel')">取消</el-button>
      </el-form-item>
    </el-form>
    
  </div>
</template>

<script>
import * as util from "@/common/assets/util";

import * as moudle from "@/work/api/moudle";

const TEMP = function() {
  return {
    "type": "common",
    "title": "",
    "model": "Common/Exponent",
    "method": "",
    "params": []
  }
}

const paramsInit = {
    "title": "",
    "module": "",
    "type": "select",
    "name": ""
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
      paramsInit,
      drawerVisible: false,
      ruleForm: Object.assign({}, TEMP()),
      rules: {
          title: [
            { required: true, message: '请输入名称', trigger: 'blur' }
          ],
          method: [
            { required: true, message: '请输入方法', trigger: 'blur' }
          ]
      },
      objs: []
    }
  },
  watch: {
    data: {
      handler: function(data){
        if(data && data.id){
          this.ruleForm = Object.assign({}, TEMP(), util.deepcopy(data))
        }else{
          this.ruleForm = Object.assign({}, TEMP())
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
    submitForm(callback) {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          //过滤params
          const myParams = Object.assign({}, this.ruleForm);
          myParams.params = myParams.params.filter(p => {
            return p.title.trim() && !!p.module.trim()
          })
          const api = myParams.id ? moudle.edit : moudle.add;

          api.r(myParams).then(res => {
            
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
