<template>
  <div>
    <el-form label-position="top" class="questionPreview" v-if="viewInfo.title">
      <el-form-item :label="'['+viewInfo.type_name+']'">
        <div v-html="viewInfo.title"></div>
      </el-form-item>
      <el-form-item label="正确答案：">
        <div class="answer" :class="viewInfo.answer[0] == '1' ? 'success':'error'" v-if="viewInfo.type == '2'">
          <i :class="viewInfo.answer[0] == '1' ? 'el-icon-success':'el-icon-error'"></i> {{answer}}
        </div>
        <div class="answer" v-else>{{answer}}</div>
      </el-form-item>
      <el-form-item label="试题解析：">
        <div v-html="viewInfo.analysis"></div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import * as exam from "@/learn/api/exam";

const TEMP = {
  type:"",
  type_name:"",
  title:"",
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
      queryParam:{
        id:""
      },
      viewInfo: Object.assign({}, TEMP),
      answer:""
    }
  },
  watch: {
    data: {
      handler: function(data){
        if(data && data.id){
          //this.viewInfo = Object.assign({}, TEMP, data)
          this.queryParam.id = data.id;
          this.$nextTick(()=>{
            this.fetchData()
          })
        }else{
          this.viewInfo = Object.assign({}, TEMP)
          this.answer = ""
        }
      },
      deep: true, 
      immediate: true
    },
    'viewInfo.answer':{
      handler: function(data){
        if(data && data.length){
          if(this.viewInfo.type == "2"){
            //判断题答案
            if(data[0] == '1'){
              this.answer = "正确"
            }else{
              this.answer = "错误"
            }
          }else{
            //选择题答案
            let answer = []
            data.forEach(e => {
              let index = Number(e)-1;
              answer.push(selectTEMP[index].name)
            });
            this.answer = answer.join('、');
          }
          
        }
      },
      deep: true, 
      immediate: true
    }
  },
  methods: {
    fetchData() {
      //获取试题详情
      this.loading = true;
      exam.questionView.r(this.queryParam).then(res => {
        this.loading = false;
        let result = res.data;
        this.viewInfo = Object.assign({}, TEMP, result.data)
      });
    }
  }
}
</script>

<style scoped>
.questionPreview >>> .el-form-item__label { font-size:16px; font-weight:bold; color:#333;}
.questionPreview >>> .el-form-item__content { line-height:1.5; font-size:16px;}
.answer { font-size:16px;}
.success { color:#28a745;}
.error { color:#dc3545;}
</style>