<template>
  <div class="exam-detail blockLayout flex-row" v-loading="loading">
    <div class="paper-main flex-1 flex-col scrollbar">
      <div class="toolBar">
        <el-table stripe :data="detailList" height="100" style="width: 100%">
        <el-table-column prop="realname" label="姓名"></el-table-column>
        <el-table-column prop="org_name" label="部门" show-overflow-tooltip></el-table-column>
        <el-table-column prop="score" label="成绩">
          <template slot-scope="scope">{{ scope.row.score }}分</template>
        </el-table-column>
        <el-table-column prop="amount" label="题目详细">
          <template slot-scope="scope">
            共 {{ scope.row.amount }} 道题&emsp;对：{{ scope.row.right }}&emsp;错：<span style="color:red">{{ scope.row.error }}</span>
          </template>
        </el-table-column>
      </el-table>
      </div>
      <div class="flex-1">
        <h1>{{paperInfo.sjmc}}</h1>
        <div class="table-div">
          <div class="table">
            <el-row class="info-header">
              <el-col :span="8">试题</el-col>
              <el-col :span="8">总分</el-col>
              <el-col :span="8">及格分</el-col>
            </el-row>
            <el-row class="info-content">
              <el-col :span="8">{{paperInfo.question_amount?paperInfo.question_amount:0}}</el-col>
              <el-col :span="8">{{paperInfo.sjzf}}</el-col>
              <el-col :span="8">{{(paperInfo.sjzf*(paperInfo.jgxbfb/100)).toFixed(1)}}</el-col>
            </el-row>
          </div>
          <div class="score-big"><span>{{paperInfo.sjdf?paperInfo.sjdf:0}}</span>分</div>
        </div>

        <div class="exam-list">
          <el-table stripe v-if="question.length" :data="question" class="flex-1" style="width: 100%" default-expand-all>
            <el-table-column type="expand">
              <template slot-scope="props">
                <div class="ques-list flex-row" v-for="list in props.row.children" :key="list.id">
                  <div  class="list-item flex-1">
                    <div class="flex-row mr10" :id="list.id">
                      <div>{{list.xspxh}}、</div>
                      <div class="list-title mr10" v-html="list.title"></div>
                      <div style="white-space:nowrap;">({{list.score}}分)</div>
                    </div>
                    <div class="question-content">
                      <div class="list-info" v-html="list.option"></div>
                      <el-form>
                        <el-form-item label="考生答案："><span v-html="list.yhda"></span></el-form-item>
                        <el-form-item label="答案结果："><span :style="{color:list.zqbs == 0?'red':''}">{{ list.zqbs == 0?'错误':(list.zqbs == 1?'正确':'') }}</span></el-form-item>
                        <el-form-item label="正确答案："><span v-html="list.answer"></span></el-form-item>
                        <el-form-item label="答案解析："><span v-html="list.analysis"></span></el-form-item>
                      </el-form>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="txbjnr" label="题型"  show-overflow-tooltip>
              <template slot-scope="scope">
                <div class="flex-row">
                  <div class="el" :title="scope.row.txbjnr">{{ scope.row.txbjnr }}</div>
                  <div>（共 {{ scope.row.score }} 分，{{ scope.row.amount }} 道题）</div>
                </div>
              </template>
            </el-table-column>
          </el-table>
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
        "id": ""
      },
      list:[],
      info: {},
      totalRows: 0,

      paperInfo: {},
      question: [],
      checkData: ['A', 'B', 'C', 'D' ,'E' ,'F', 'G','H','I','J','K','L','M','N'],
      answer: [],
      detailList: []
    };
  },
  methods: {
    fetchData() {
      this.loading = true;
      port.statisticsDetail.r(this.queryParam).then(res => {
        if(res.data.status == '200') {
          this.loading = false;
          this.paperInfo = res.data.data.papers_info;
          this.paperInfo.sjdf = res.data.data.paper_record.sjdf;
          let question = res.data.data.paper_question_parent_list
          this.question = question;
          
          let obj = {
            org_name: res.data.data.gov_dept.name,
            realname: res.data.data.gov_user.realname,
            score: res.data.data.paper_record.sjdf,
            right: res.data.data.paper_record.objective_right_amount,
            error: res.data.data.paper_record.objective_error_amount,
            amount: res.data.data.paper_record.objective_amount,
          }
          this.detailList = [obj]

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
    if(this.$route.query.rid){
      this.queryParam.id = this.$route.query.rid
      this.fetchData();
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
.question-content .el-form .el-form-item { margin-bottom: 0; }
.btn-content {text-align: center;}
.btn-content .el-button {width: 150px;}
.btn-content .el-button:last-of-type {border-color: #4170F6;color: #4170F6;}
.btn-content .el-button.cancel {background: #fff;} 
.dialog-info {text-align: center;font-size: 16px;font-weight: bolder;color: #333;}

.table-div { position: relative; }
.table-div .score-big { position: absolute; right: 5%;top: 0;bottom: 0; margin: auto; color: red; }
.table-div .score-big span { font-size: 40px; padding-right: 5px; }
</style>