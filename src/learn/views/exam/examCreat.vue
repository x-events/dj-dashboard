<template>
  <div class="scrollbar blockLayout" :class="{'flex-col':stepActive == 4}">
    <div class="flex-row align-center toolBar">
      <div class="flex-1">
        <el-radio-group v-model="stepActive" @change="stepClick">
          <el-radio-button v-for="(item, index) in examStep" :key="index" :label="item.value" :disabled="stepDisable(item.value)">{{item.name}}</el-radio-button>
        </el-radio-group>
      </div>
    </div>

    <!-- 设置基本信息 -->
    <step1 @submit="stepSuccess" @cancel="backList()" v-if="stepActive == 1" />
    <!-- 添加参考人员 -->
    <step2 @submit="stepSuccess" @cancel="backList()" v-if="stepActive == 2" />
    <!-- 选择组卷题库 -->
    <step3 @submit="stepSuccess" @cancel="backList()" v-if="stepActive == 3" />
    <!-- 开始组卷 -->
    <step4 @submit="stepSuccess" @cancel="backList()" v-if="stepActive == 4" />

  </div>
</template>

<script>
import * as util from "@/common/assets/util";

export default {
  components: {
    "step1": (resolve) => require(['@/learn/components/exam/step1.vue'], resolve),
    "step2": (resolve) => require(['@/learn/components/exam/step2.vue'], resolve),
    "step3": (resolve) => require(['@/learn/components/exam/step3.vue'], resolve),
    "step4": (resolve) => require(['@/learn/components/exam/step4.vue'], resolve)
  },
  data() {
    return {
      loading:true,
      sjid:this.$route.query.sjid || "",
      examType:this.$route.query.examType || 'creat',
      stepActive:this.$route.query.step || '',
      examStep:[
        {
          name:'1、设置基本信息',
          value:1
        },
        {
          name:'2、添加参考学员',
          value:2
        },
        {
          name:'3、选择组卷题库',
          value:3
        },
        {
          name:'4、开始组卷',
          value:4
        }
      ]
    }
  },
  watch: {
    $route(new_val){
      if(new_val.query.step){
        this.stepActive = new_val.query.step;
      }
      this.examType = this.$route.query.examType || 'creat';
      this.sjid = this.$route.query.sjid || "";
    }
  },
  methods: {
    changeTitle(){
      setTimeout(() => {
        if(this.examType == 'edit'){
          util.emit('changeTitle','编辑考试')
        }else{
          util.emit('changeTitle','创建考试')
        }
      }, 100);
    },
    stepDisable(value){
      if(value == 1){
        return false
      }
      if(this.examType == 'creat'){
        if(value > this.stepActive){
          return true
        }
      }else{
        return false
      }

      // if(this.sjid){
      //   return false
      // }else{
      //   return true
      // }
    },
    stepClick(data){
      let sjid = ""
      if(this.sjid){
        sjid = `&sjid=${this.sjid}`
      }
      window.location.href=`/#/learn/examManage/examCreat?examType=edit&step=${data}`+sjid
      this.changeTitle();

      if(this.isIE()){
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    },
    stepSuccess(obj){
      //下一步
      let new_id = obj.id || this.sjid;
      let next_step = obj.next_step;
      window.location.href=`/#/learn/examManage/examCreat?examType=${this.examType}&step=${next_step}&sjid=${new_id}`
      this.changeTitle();
      
      if(this.isIE()){
        setTimeout(() => {
          window.location.reload();
        }, 100);
      }
    },
    backList(){

    },
    isIE() {
      if (!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
        else
        return false;
    }
  },
  mounted() {
    this.changeTitle();
  },
};
</script>

<style scoped>
</style>