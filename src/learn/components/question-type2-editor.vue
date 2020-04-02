<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="题干" prop="title">
        <editor :toolBar_short="true" :propvalue="ruleForm.title" @editorChange="titleContent" style="height:150px;" />
      </el-form-item>
      <el-form-item label="正确答案" prop="answer">
        <el-radio-group v-model="answer_panduan">
          <el-radio :label="1">正确</el-radio>
          <el-radio :label="2">错误</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="试题解析" prop="analysis">
        <editor :toolBar_short="true" :propvalue="ruleForm.analysis" @editorChange="analysisContent" style="height:150px;" />
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
  group_id:"",
  id: "",
  title: "",
  qst_type_name:"panduan",
  answer:[],
  analysis:""
}

export default {
  components:{
    "editor":(resolve) => require(['@/common/components/editor.vue'],resolve)
  },
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
      answer_panduan:"",
      queryParam:{
        id:""
      },
      ruleForm:Object.assign({}, TEMP),
      rules: {
          title: [
            { required: true, message: '请输入题干', trigger: 'blur' }
          ],
          answer: [
            { required: true, message: '请设置参考答案', trigger: 'blur' }
          ]
      }
    }
  },
  watch: {
    data: {
      handler: function(data){
        if(data && data.id){
          //this.ruleForm = Object.assign({}, TEMP, data)
          this.queryParam.id = data.id;
          this.$nextTick(()=>{
            this.fetchData()
          })
        }else{
          this.ruleForm = Object.assign({}, TEMP)
          this.$nextTick(()=>{
            this.$refs['ruleForm'].clearValidate()
          })
        }
      },
      deep: true, 
      immediate: true
    },
    answer_panduan(new_val){
      this.ruleForm.answer = [new_val]
    }
  },
  methods: {
    titleContent(content){
      this.ruleForm.title = content;
      //this.$refs['ruleForm'].validateField('title')
    },
    analysisContent(content){
      this.ruleForm.analysis = content;
      //this.$refs['ruleForm'].validateField('option')
    },
    submitForm() {
      //console.log(this.ruleForm);
      this.ruleForm.group_id = this.$route.query.id || '';
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          exam.questionUpdate.r(this.ruleForm).then(res => {
            this.$message.success(res.data.message);
            this.$emit('submit')
          })
        } 
      });
    },
    fetchData() {
      //获取试题详情
      this.loading = true;
      exam.questionView.r(this.queryParam).then(res => {
        this.loading = false;
        let result = res.data;
        this.ruleForm = Object.assign({}, TEMP, result.data)
        if(result.data.answer[0]){
            this.answer_panduan = Number(result.data.answer[0])
          }
      });
    }
  }
}
</script>

<style scoped>
</style>