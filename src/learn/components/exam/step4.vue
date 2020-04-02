<template>
  <div class="flex-1 flex-col">
    <!-- 自动组卷 -->
    <auto :detail="ruleForm" v-if="ruleForm.zjfs == 2"/>
    <!-- 手动组卷 -->
    <manual :detail="ruleForm" v-if="ruleForm.zjfs == 3" @refresh="fetchData"/>
  </div>
</template>

<script>
import * as exam from "@/learn/api/exam";

const TEMP = {
  sjid:"",
  sjmc:"",
  sjlx:"0",
  sjsm:"",
  dtcs:"",
  kssj:[],
  kskssj:"",
  jskssj:"",
  kssc:"",
  jgxbfb:"",
  end_show:"0",
  zjfs:""
}

export default {
  components: {
    "auto": (resolve) => require(['@/learn/components/exam/exam-auto.vue'], resolve),
    "manual": (resolve) => require(['@/learn/components/exam/exam-manual.vue'], resolve),
  },
  data() {
    return {
      loading:true,
      examType:this.$route.query.examType || 'creat',
      queryParam:{
        sjid:this.$route.query.sjid || ''
      },
      ruleForm: Object.assign({}, TEMP),
    }
  },
  watch: {
    'queryParam.sjid':{
      handler: function(sjid){
        if(sjid){
          this.fetchData()
        }else{
          this.ruleForm = Object.assign({}, TEMP)
        }
      },
      deep: true, 
      immediate: true
    }
  },
  methods: {
    fetchData(){
      this.loading = true;
      exam.examPapersView.r(this.queryParam).then(res => {
        this.loading = false;
        let result = res.data.data;
        this.ruleForm = Object.assign({}, TEMP, result);
        
      });
    }
  }
}
</script>

<style scoped>
</style>