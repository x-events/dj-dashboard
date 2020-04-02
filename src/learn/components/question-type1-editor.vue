<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
      <el-form-item label="题干" prop="title">
        <editor :toolBar_short="true" :propvalue="ruleForm.title" @editorChange="titleContent" style="height:150px;" />
      </el-form-item>
      <el-form-item label="备选项" prop="option">
        <editor :toolBar_short="true" :propvalue="ruleForm.option" @editorChange="optionContent" style="height:150px;" />
      </el-form-item>
      <el-form-item label="正确答案" prop="answer">
        <el-col :span="3">
          <el-select v-model="ruleForm.option_count" placeholder="请选择">
            <el-option
              v-for="item in option_count_list"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="1">&nbsp;</el-col>
        <el-col :span="20">
          <el-checkbox-group v-model="ruleForm.answer">
            <el-checkbox v-for="(item,index) in select_options" :label="item.value" :value="item.value" :key="index">{{item.name}}</el-checkbox>
          </el-checkbox-group>
        </el-col>
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
  qst_type_name:"xuanze",
  option:"",
  option_count:'4',
  answer:[],
  analysis:""
}

const selectTEMP = [
  {name:'A',value:'1'},
  {name:'B',value:'2'},
  {name:'C',value:'3'},
  {name:'D',value:'4'},
  {name:'E',value:'5'},
  {name:'F',value:'6'},
  {name:'G',value:'7'},
  {name:'H',value:'8'},
]

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
      loading:true,
      select_options:[],
      option_count_list:['2','3','4','5','6','7','8'],
      queryParam:{
        id:""
      },
      ruleForm:Object.assign({}, TEMP),
      rules: {
          title: [
            { required: true, message: '请输入题干', trigger: 'blur' }
          ],
          option: [
            { required: true, message: '请输入备选项', trigger: 'blur' }
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
          this.ruleForm.option_count = '4'
          this.ruleForm = Object.assign({}, TEMP)
          this.$nextTick(()=>{
            this.loading = false;
            this.$refs['ruleForm'].clearValidate()
          })
        }
        this.handleCurrentChange(Number(this.ruleForm.option_count));
      },
      deep: true, 
      immediate: true
    },
    'ruleForm.option_count':{
      handler: function(count){
        if(!this.loading){
          this.ruleForm.answer = [];
          this.handleCurrentChange(Number(count));
        }
      },
      deep: true
    }
  },
  methods: {
    titleContent(content){
      this.ruleForm.title = content;
      //this.$refs['ruleForm'].validateField('title')
    },
    optionContent(content){
      this.ruleForm.option = content;
      //this.$refs['ruleForm'].validateField('option')
    },
    analysisContent(content){
      this.ruleForm.analysis = content;
      //this.$refs['ruleForm'].validateField('option')
    },
    handleCurrentChange(count){
      this.select_options = [];
      selectTEMP.forEach((e,i) => {
        if(i < count){
          this.select_options.push(e);
        }
      });
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
        let result = res.data;
        this.ruleForm = Object.assign({}, TEMP, result.data)
        this.$nextTick(()=>{
          this.loading = false;
          this.handleCurrentChange(Number(this.ruleForm.option_count));
        })
      });
    }
  }
}
</script>

<style scoped>
</style>