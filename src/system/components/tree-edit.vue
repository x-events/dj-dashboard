<template>
  <div v-loading="loading">
    <el-form size="small" ref="editForm" :rules="rules" :model="editForm" :label-width="formwidth">
      <el-form-item label="数据项名称" prop="name">
        <el-input v-model="editForm.name"></el-input>
      </el-form-item>
      <el-form-item label="数据项值" prop="value">
        <el-input v-model="editForm.value" type="number" maxlength="20" :oninput="oninput(20,'value')"></el-input>
      </el-form-item>
      <el-form-item label="是否可选">
        <el-radio-group v-model="editForm.status"><!-- 0-是 1-否 -->
          <el-radio label="0">是</el-radio>
          <el-radio label="1">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序号">
        <el-input v-model="editForm.sort" type="number" maxlength="20" :oninput="oninput(20,'sort')"></el-input>
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
  value: '',
  status: '0',
  sort: '',
  remark: '',
  dict_code: '',
  pid: ''
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
        name: [{ required: true, message: "请输入数据项名称", trigger: "blur" }],
        value: [{ required: true, message: "请输入数据项值", trigger: "blur" }],
        status: [{ required: true, message: "请选择是否可选", trigger: "blur" }],
        sort: [{ required: true, message: "请输入排序号", trigger: "blur" }],
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
      this.resetForm('editForm');
      this.editForm = Object.assign({}, TEMP, this.data)
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
          port.list_save.r(this.editForm).then(res => {
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
      port.list_detail.r(this.queryParam).then((res) => {
        this.loading = false;
        if(res.data.status == '200') {
          this.editForm = res.data.data;
        }
      });
    },
    oninput(len,field) {
        if(this.editForm[field] && this.editForm[field].length> len) this.editForm[field]=this.editForm[field].slice(0, len)
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
