<template>
  <div v-loading="loading">
    <el-form size="small" ref="editForm" :rules="rules" :model="editForm" :label-width="formwidth">
      <el-form-item label="类型名称" prop="name">
        <el-input v-model="editForm.name"></el-input>
      </el-form-item>
      <el-form-item label="类型编码" prop="code">
        <el-input v-model="editForm.code"></el-input>
      </el-form-item>
      <el-form-item label="数据库字段" prop="syllable">
        <el-input v-model="editForm.syllable"></el-input>
      </el-form-item>
      <el-form-item label="注释说明">
        <el-input v-model="editForm.remark" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <div class="el-form-item">
        <div class="el-form-item__label" :style="{width:`${formwidth}`}">&emsp;</div>
        <div class="el-form-item__content">
          <el-button @click="$emit('cancel')">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </div>
      </div>
    </span>
  </div>
</template>

<script>
import * as port from "../api/datadict";

const TEMP = {
  name: '',
  code: '',
  syllable: '',
  remark: ''
}

export default {
  props: {
    dialogVisible:{
      type: Boolean,
      required: true,
      default: function(){
        return false
      }
    },
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
      editForm: TEMP,
      rules: {
        name: [{ required: true, message: "请输入类型名称", trigger: "blur" }],
        code: [{ required: true, message: "请输入类型编码", trigger: "blur" }],
        syllable: [{ required: true, message: "请输入数据库字段", trigger: "blur" }],
        remark: [{ required: true, message: "请输入注释说明", trigger: "blur" }],
      },
      loading: false,
      queryParam: {
        id:""
      },
      formwidth: '110px',
    }
  },
  watch: {
    dialogVisible(){
      //弹窗开启关闭重置表单
      this.editForm = TEMP;
      this.resetForm('editForm');
    },
    data: {
      handler: function(data){
        if(data && data.id){
          this.queryParam.id = data.id;
          this.$nextTick(()=>{
            this.fetchData()
          })
        }else{
          this.editForm = Object.assign({}, TEMP, data)
        }
      },
      deep: true, 
      immediate: true
    }
  },
  methods: {
    submitForm() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          port.save.r(this.editForm).then(res => {
            if(res.data.status == '200') {
              this.$message.success('编辑成功');
              this.$emit('submit')
            }
          });
        } 
      });
    },
    fetchData() {
      // 获取详情
      this.loading = true;
      port.detail.r(this.queryParam).then(res => {
        this.loading = false;
        if(res.data.status == '200') {
          this.editForm = res.data.data;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName] && this.$refs[formName].resetFields();
    },
  },
}
</script>

<style scoped>
.tip { font-size: 12px; color: #bbb; }
</style>
