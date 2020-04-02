<template>
  <div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" style="max-width:550px;" v-if="!loading">
      <el-form-item label="考试名称" prop="sjmc">
        <el-input v-model="ruleForm.sjmc"></el-input>
      </el-form-item>
      <el-form-item label="试卷类型" prop="sjlx">
        <el-radio-group v-model="ruleForm.sjlx">
          <el-radio label="1">正式试卷</el-radio>
          <el-radio label="0">模拟试卷</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="考试简介" prop="sjsm">
        <el-input type="textarea" :rows="3" v-model="ruleForm.sjsm"></el-input>
      </el-form-item>
      <el-form-item label="可考次数" prop="dtcs" v-if="ruleForm.sjlx == '1'">
        <el-input type="number" min="1" :maxlength="3" v-model="ruleForm.dtcs"><template slot="append">次</template></el-input>
      </el-form-item>
      <el-form-item label="考试时间" prop="kssj">
        <el-date-picker
          v-model="ruleForm.kssj"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始时间"
          value-format="timestamp"
          :default-time="['08:00:00', '17:00:00']"
          end-placeholder="结束时间">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="答卷时长" prop="kssc">
        <el-input type="number" min="1" max="1000" :maxlength="3" v-model="ruleForm.kssc"><template slot="append">分钟</template></el-input>
      </el-form-item>
      <el-form-item label="及格分数比例" prop="jgxbfb">
        <el-input type="number" min="1" max="100" :maxlength="3" v-model="ruleForm.jgxbfb"><template slot="append">%</template></el-input>
      </el-form-item>
      <el-form-item label="考试结束显示答案" prop="end_show">
        <el-radio-group v-model="ruleForm.end_show">
          <el-radio label="1">是</el-radio>
          <el-radio label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="组卷形式" prop="zjfs">
        <el-radio-group v-model="ruleForm.zjfs">
          <el-radio label="2">自动组卷</el-radio>
          <el-radio label="3">手动组卷</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">{{examType == 'edit'?'保存':'下一步'}}</el-button>
        <!-- <el-button>取消</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as exam from "@/learn/api/exam";

const TEMP = {
  sjid:"",
  sjmc:"",
  sjlx:"0",
  sjsm:"",
  dtcs:"1",
  kssj:[],
  kskssj:"",
  jskssj:"",
  kssc:"",
  jgxbfb:"",
  end_show:"0",
  zjfs:"2"
}

export default {
  data() {
    return {
      loading:true,
      examType:this.$route.query.examType || 'creat',
      queryParam:{
        sjid:this.$route.query.sjid || ''
      },
      ruleForm: Object.assign({}, TEMP),
      rules: {
          sjmc: [
            { required: true, message: '请输入考试名称', trigger: 'blur' }
          ],
          sjlx: [
            { required: true, message: '请选择试卷类型', trigger: 'blur' }
          ],
          dtcs: [
            { required: false, message: '请输入可考次数', trigger: 'blur' }
          ],
          kssj: [
            { required: false, message: '请选择考试时间', trigger: 'blur' }
          ],
          kssc: [
            { required: true, message: '请输入答卷时长', trigger: 'blur' }
          ],
          jgxbfb: [
            { required: true, message: '请输入及格分数比例', trigger: 'blur' }
          ],
          end_show: [
            { required: true, message: '请选择考试结束显示答案', trigger: 'blur' }
          ],
          zjfs: [
            { required: true, message: '请选择组卷形式', trigger: 'blur' }
          ]
      }
    }
  },
  watch: {
    'queryParam.sjid':{
      handler: function(sjid){
        if(sjid){
          this.fetchData()
        }else{
          this.ruleForm = Object.assign({}, TEMP)
          this.loading = false;
          this.$nextTick(()=>{
            this.$refs['ruleForm'].clearValidate()
          })
        }
      },
      deep: true, 
      immediate: true
    },
    'ruleForm.kssj'(new_val){
      if(!new_val){
        this.ruleForm.kskssj = ""
        this.ruleForm.jskssj = ""
        return
      }
      if(new_val[0]){
        this.ruleForm.kskssj = new_val[0]/1000
      }
      if(new_val[1]){
        this.ruleForm.jskssj = new_val[1]/1000
      }
    },
    'ruleForm.sjlx'(new_val){
      if(this.loading){return}
      if(Number(new_val)){
        this.rules.dtcs[0].required = true;
        this.rules.kssj[0].required = true;
        this.ruleForm.dtcs = '1';
      }else{
        this.rules.dtcs[0].required = false;
        this.rules.kssj[0].required = false;
        this.ruleForm.dtcs = '';
      }
    },
    'ruleForm.dtcs'(new_val,old_val){
      if(new_val < 0){
        this.ruleForm.dtcs = 0
      }
      if(new_val.length > 4){
        this.ruleForm.dtcs = old_val
      }
    },
    'ruleForm.kssc'(new_val,old_val){
      if(new_val < 0){
        this.ruleForm.kssc = 0
      }
      if(new_val > 1000){
        this.ruleForm.kssc = 1000
      }
    },
    'ruleForm.jgxbfb'(new_val,old_val){
      if(new_val < 0){
        this.ruleForm.jgxbfb = 0
      }
      if(new_val > 100){
        this.ruleForm.jgxbfb = 100
      }
    }
  },
  methods: {
    submitForm() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          let api = exam.examPapersCreate;
          if(this.ruleForm.sjid){
            api = exam.examPapersUpdate;
          }
          api.r(this.ruleForm).then(res => {
            let result = res.data;
            this.$message.success(result.message);
            if(this.examType == 'creat'){
              let id = result.data.id || "";
              let obj = {
                next_step:2,
                id:id
              }
              this.$emit('submit',obj)
            }
          })
        } 
      })
    },
    fetchData(){
      this.$nextTick(()=>{
        this.examType = this.$route.query.examType || "creat";
      })
      this.loading = true;
      exam.examPapersView.r(this.queryParam).then(res => {
        
        let result = res.data.data;
        this.ruleForm = Object.assign({}, TEMP, result);

        if(result.kskssj && result.jskssj){
          if(result.kskssj == 0 || result.kskssj == 0){
            this.ruleForm.kssj = [];
          }else{
            this.ruleForm.kssj = [result.kskssj*1000,result.jskssj*1000];
          }
        }
        if(result.dtcs == 0){
          this.ruleForm.dtcs = 1
        }
        this.$nextTick(()=>{
          if(this.ruleForm.sjlx == '1'){
            this.rules.dtcs[0].required = true;
            this.rules.kssj[0].required = true;
          }else{
            this.rules.kssj[0].required = false;
          }  
          this.loading = false;
        })
      });
    }
  }
}
</script>

<style scoped>
</style>