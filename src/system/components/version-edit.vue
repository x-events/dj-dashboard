<template>
  <div>
    <el-form size="small" ref="editForm" :rules="rules" :model="editForm" label-width="110px">
      <el-form-item label="版本号" prop="version">
        <el-input v-model="editForm.version"></el-input>
      </el-form-item>
      <el-form-item label="版本号文件" prop="file_id">
        <div class="el video_list">{{ editForm.file_url }}</div>
        <qiniu btn_text="上传文件" :multiple="false" accept="apk" @success="uploadCoverSuccess" />
        <span class="tip">(只能是apk格式)</span>
      </el-form-item>
      <el-form-item label="升级说明" prop="intro">
        <el-input v-model="editForm.intro" type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="是否强制更新" prop="status">
        <el-radio-group v-model="editForm.status"><!-- 1-是 0-否 -->
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('cancel')">取 消</el-button>
      <el-button type="primary" @click="submitForm">确 定</el-button>
    </span>
  </div>
</template>

<script>
import * as port from "../api/version";

const TEMP = {
  version: '',
  file_id: '',
  intro: '',
  status: '0',
  file_url: ''
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
        version: [{ required: true, message: "请输入版本号", trigger: "blur" }],
        file_id: [{ required: true, message: "请选择版本号文件", trigger: "blur" }],
        intro: [{ required: true, message: "请输入升级说明", trigger: "blur" }],
        status: [{ required: true, message: "请选择是否强制更新", trigger: "blur" }]
      },
    }
  },
  watch: {
    dialogVisible(){
      //弹窗开启关闭重置表单
      this.editForm = TEMP;
      this.resetForm('editForm');
    }
  },
  methods: {
    submitForm() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          port.add.r(this.editForm).then(res => {
            if(res.data.status == '200') {
              this.$message.success('编辑成功');
              this.$emit('submit')
            }
          });
        } 
      });
    },
    // 上传版本文件
    uploadCoverSuccess(data){
      console.log(data,'data');
      if(data.id){
        this.editForm.file_id = data.id
        this.editForm.file_url = `${data.title}.${data.ext}`
      }
    },
    resetForm(formName) {
      this.editForm.file_url = '';
      this.$refs[formName] && this.$refs[formName].resetFields();
    },
  },
}
</script>

<style scoped>
.tip { font-size: 12px; color: #bbb; }
</style>
