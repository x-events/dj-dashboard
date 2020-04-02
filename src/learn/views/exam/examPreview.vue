<template>
  <div class="exam-detail blockLayout flex-row" v-loading="loading">
    <div class="paper-main flex-1  flex-col">
      <div class="toolBar">
        <el-button plain @click="fetchData" type="primary" size="small" v-if="paperInfo.zjfs == 2">换一组</el-button>
        <el-button plain @click="step4Click" type="primary" size="small">编辑</el-button>
        <!-- <el-button plain @click="back" type="danger" size="small">退出</el-button> -->
      </div>
      <div class="flex-1 scrollbar">
        <h1>{{paperInfo.sjmc}}</h1>
        <div class="table">
          <el-row class="info-header">
            <el-col :span="6">总分</el-col>
            <el-col :span="6">及格分比例</el-col>
            <el-col :span="6">试题</el-col>
            <el-col :span="6">答卷时长</el-col>
          </el-row>
          <el-row class="info-content">
            <el-col :span="6">{{paperInfo.sjzf}}</el-col>
            <el-col :span="6">{{paperInfo.jgxbfb}}%</el-col>
            <el-col :span="6">{{paperInfo.question_amount?paperInfo.question_amount:0}}</el-col>
            <el-col :span="6">{{paperInfo.kssc}}分钟</el-col>
          </el-row>
        </div>

        <div class="exam-list">
          <el-row v-for="(item, index) in question" :key="index">
            <el-row class="type-title" type="flex" justify="space-between"
              v-if="question[index].stList.length > 0">
              <p class="list-type">
                {{item.txbjnr}}
                <span>（共{{item.score}}分&ensp;共{{item.amount}}道题）</span>
              </p>
            </el-row>
            <div v-for="list in question[index].stList"
              :key="list.id"  class="list-item">
              <div class="flex-row" :id="`que${list.id}`">
                <div>{{list.pxh}}、</div>
                <div class="list-title flex-1" v-html="list.title"></div>
                <div style="width:70px;">({{list.score}}分)</div>
              </div>
              <div class="question-content">
                <div class="list-info" v-html="list.option"></div>
                <el-radio-group v-model="list.answer" v-if="list.type == '0'">
                  <el-radio v-for="(check, index) in checkData.slice(0, list.option_count)" :key="check"
                  :label="index+1">
                    <b class="radio">{{check}}</b>
                  </el-radio>
                </el-radio-group>
                <el-checkbox-group v-model="list.answer" v-if="list.type == '1'">
                  <el-checkbox v-for="(check,index) in checkData.slice(0, list.option_count)" :key="check" :label="index+1">
                    <b class="radio _checkbox">{{check}}</b>
                  </el-checkbox>
                </el-checkbox-group>
                <!-- 判断 -->
                <div v-if="list.type == '2'">
                  <div>A、对&emsp;B、错</div>
                  <el-radio-group v-model="list.answer">
                    <el-radio v-for="(check, index) in ifData" :key="check.value"
                    :label="index+1">
                      <b class="radio">{{check.name}}</b>
                    </el-radio>
                  </el-radio-group>
                </div>
              </div>
            </div>
          </el-row>
        </div>
      </div>
    </div>

    <div class="answer-card flex-col">
      <div class="answer-title"><h3>答题卡</h3></div>

      <div class="qlist flex-1 scrollbar">
        <div v-for="(item, index) in question" :key="index">
          <div class="result-title" v-if="item.stList.length > 0">{{item.txbjnr}}</div>
          <el-row class="result-list" type="flex" >
            <p
            v-for="(list, idx) in item.stList" :key="list.id" 
            :class="{active: list.answer.length > 0 || list.answer > 0}">
              <a class="ahref" href="" @click.prevent="custormAnchor(`que${list.id}`)">{{idx+1}}</a>
              <!-- <a class="ahref" :href="`#que${list.id}`">{{idx+1}}</a> -->
            </p>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import * as port from "@/learn/api/exam";

export default {
  data() {
    return {
      loading:true,
      queryParam:{
        // "pagesize": 10,
        // "p": 1,
        "sjid": ""
      },
      list:[],
      info: {},
      totalRows: 0,

      paperInfo: {},
      question: [],
      checkData: ['A', 'B', 'C', 'D' ,'E' ,'F', 'G','H','I','J','K','L','M','N'],
      answer: [],
      ifData: [       // 判断题选项写死
        {
          name:'A',
          value: 1
        },{
          name: 'B',
          value: 2
        }
      ]
    };
  },
  methods: {
    back() {
      this.$router.go(-1)
    },
    // 解决vue与锚点冲突事件
    custormAnchor(anchorName) {
        // 找到锚点
        let anchorElement = document.getElementById(anchorName);
        // 如果对应id的锚点存在，就跳转到锚点
        if(anchorElement) { anchorElement.scrollIntoView(); }
    },
    // 编辑按钮跳转到编辑第四步
    step4Click() {
      let sjid = ""
      if(this.$route.query.id){
        sjid = `&sjid=${this.$route.query.id}`
      }
      window.location.href=`/#/learn/examManage/examCreat?examType=edit&step=4${sjid}`
      if(this.isIE()){
        window.location.reload();
      }
    },
    isIE() {
      if (!!window.ActiveXObject || "ActiveXObject" in window)
        return true;
        else
        return false;
    },
    getDetail() {
      this.loading = true;
      port.examPapersView.r(this.queryParam).then(res => {
        this.loading = false;
        this.paperInfo = res.data.data;
        this.fetchData();
      });
    },
    fetchData(reload) {
      if(reload){
        
      }
      this.loading = true;
      let apiCommand = '';
      if(this.paperInfo.zjfs == 2) { // 自动组卷
        apiCommand = port.examOnline;
      } else if(this.paperInfo.zjfs == 3) { // 手动组卷
        apiCommand = port.examManual;
      }
      
      apiCommand.r(this.queryParam).then(res => {
        if(res.data.status == '200') {
          this.loading = false;
          let question = res.data.data
          question.forEach( item => {
            item.stList.forEach( child => {
              child.answer = []
            })
          })
          this.question = question;
          
          let scoreNum = 0;     // 总试题数
          this.question.forEach(item => {
            if(!item.amount) {
              return;
            }
            scoreNum = scoreNum + item.amount;
          });
          this.paperInfo.question_amount = scoreNum;
        }
      })
    }
  },
  created: function() {
    if(this.$route.query.id){
      this.queryParam.sjid = this.$route.query.id
      this.getDetail();
    }
    
  }
};
</script>

<style scoped>
.blockLayout { background: none; box-shadow: none; padding: 0; }
.toolBar { text-align: right; padding: 10px; margin-bottom: 0; }

.exam-list .type-title {background-color: #F5F5F5;padding: 5px 10px;}
.exam-list .type-title p:first-of-type {font-weight: bold;color: #333;}
.exam-list .type-title .list-type span {color: #555555;font-weight: normal;}
.exam-list .type-title .type-score span {padding-left: 20px;}
.paper-main .exam-list .list-item:last-of-type {border-bottom: none;}
.paper-main .exam-list .list-item .list-title {word-wrap: break-word;word-break: break-all;
  overflow: hidden;}
/* .exam-detail {width: 1190px;margin: 20px auto;display: flex; justify-content: space-between;background:none; flex-direction:row;} */
.paper-main {/* width: 845px; */background-color: #fff;border: #efefef 1px solid;box-shadow: 0 0 5px #eee;
padding: 0 0 20px 20px; margin-right: 10px; box-sizing:border-box;}
.paper-main h1 {text-align: center;font-size: 24px;font-weight: bold;margin-bottom: 10px;
  word-break: break-all;padding: 0 80px;color: #333;}
.paper-main .table {width: 350px;margin: 10px auto;text-align: center;border: 1px solid #dbdbdb;}
.paper-main .table .info-header {border-bottom: 1px solid #dbdbdb;background-color: #f8f8f8;}
.paper-main .table .el-col {border-right: 1px solid #dbdbdb;}
.paper-main .table .el-col:last-of-type {border-right:none;}
.paper-main ._option label {cursor: pointer;margin-right: 15px;}
.question-content b {display: inline-block;width: 26px;height: 26px;text-align: center;
    line-height: 26px;border: #9b9b9b 1px solid;border-radius: 50%;font-weight: normal;}
.paper-main ._option label input {display: none;}
.question-content b.active {border-color: #f03a33;color: #f03a33;}
.paper-main .exam-list .question-content {padding:3px 20px;}
.paper-main .exam-list .question-content .list-info {margin: 8px 0;}
.question-content b._checkbox {border-radius: 5px;}
.paper-main .exam-list .list-item {padding: 20px 0 10px;border-bottom: 1px dotted #ccc;}

.answer-card {width: 330px; background-color: #fff;border: #efefef 1px solid;box-shadow: 0 0 5px #eee;
  min-height: 150px;}
.answer-card .answer-title {padding: 15px 20px;border-bottom: 1px solid #ddd;}
.answer-card .answer-title h3 {font-weight: bold;position: relative;padding-left: 15px;
border-left: 5px solid #4170F6;line-height: 20px;}
.answer-card .count-down {padding: 12px 0;color: #333;font-weight: bold;
display: flex;align-items: center;justify-content: center;}
.answer-card .count-down .ion {vertical-align: top;padding-right: 6px; color:#999; font-size: 16px;}
.answer-card .count-down .time {color: #f53129;font-size: 16px;padding-left: 6px;}
.answer-card .result-title {background-color: #f5f5f5;padding: 5px 13px;}
.answer-card .result-list {padding: 10px 0 6px 12px;flex-wrap: wrap;}
.answer-card .result-list p {width: 25px;height: 25px;line-height: 24px;text-align: center;
border: #bcbcbc 1px solid;margin-right: 6px;margin-bottom: 5px;font-size: 13px;cursor: pointer;}
.answer-card .result-list p:hover {color: #f53129;}
.answer-card .result-list p.active {background-color: #2fad88;color: #fff;border-color: #2fad88;}
.btn-content {text-align: center;}
.btn-content .el-button {width: 150px;}
/* .btn-content .el-button:first-of-type {background-color: #4170F6;border-color: #4170F6;color: #fff;}*/
.btn-content .el-button:last-of-type {border-color: #4170F6;color: #4170F6;}
.btn-content .el-button.cancel {background: #fff;} 
.dialog-info {text-align: center;font-size: 16px;font-weight: bolder;color: #333;}
.paper-main .exam-list .el-radio.is-checked .el-radio__label b,
.paper-main .el-checkbox-group .is-checked b._checkbox {border-color: #409EFF;color: #409EFF;}
.paper-main .exam-list .el-radio >>> .el-radio__input,
.paper-main .el-checkbox-group >>> .el-checkbox__input {display: none;}
.ahref { display: block; }
</style>