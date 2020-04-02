<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" class="flex-1 flex-col">
    <h3 class="tc">{{detail.sjmc}}</h3>
    <div class="flex-row mb10">
      <div class="flex-1">已选题库设置：</div>
      <div>考试总分：<b class="red">{{total}}</b> 分</div>
    </div>
    <el-table stripe :data="data" style="width:100%" :default-expand-all="true" height="100%" class="flex-1 mb10">
      <el-table-column type="expand">
        <template slot-scope="props">
          <div class="flex-row zjRow" v-if="props.row.paper_question_group">
            <div>[单选 {{props.row.radio}}]</div>
            <div>
              <el-input size="small" type="number" min="0" :max="Number(props.row.radio)" v-model="props.row.paper_question_group.dx_count" :disabled="!props.row.radio" @change="checkMax(props.row,'dx_count');totalCount()">
                <template slot="prepend">抽题数量</template>
              </el-input>
            </div>
            <div>
              <el-input size="small" type="number" min="0" max="100" :maxlength="3" v-model="props.row.paper_question_group.dx_score" :disabled="!props.row.radio" @change="checkScore(props.row,'dx_score');totalCount()">
                <template slot="prepend">每题分数</template>
              </el-input>
            </div>
          </div>
          <div class="flex-row zjRow" v-if="props.row.paper_question_group">
            <div>[多选 {{props.row.checkbox}}]</div>
            <div>
              <el-input size="small" type="number" min="0" :max="Number(props.row.checkbox)" v-model="props.row.paper_question_group.dxt_count" :disabled="!props.row.checkbox" @change="checkMax(props.row,'dxt_count');totalCount()">
                <template slot="prepend">抽题数量</template>
              </el-input>
            </div>
            <div>
              <el-input size="small" type="number" min="0" max="100" :maxlength="3" v-model="props.row.paper_question_group.dxt_score" :disabled="!props.row.checkbox" @change="checkScore(props.row,'dxt_score');totalCount()">
                <template slot="prepend">每题分数</template>
              </el-input>
            </div>
          </div>
          <div class="flex-row zjRow" v-if="props.row.paper_question_group">
            <div>[判断 {{props.row.judge}}]</div>
            <div>
              <el-input size="small" type="number" min="0" :max="Number(props.row.judge)" v-model="props.row.paper_question_group.pd_count" :disabled="!props.row.judge" @change="checkMax(props.row,'pd_count');totalCount()">
                <template slot="prepend">抽题数量</template>
              </el-input>
            </div>
            <div>
              <el-input size="small" type="number" min="0" max="100" :maxlength="3" v-model="props.row.paper_question_group.pd_score" :disabled="!props.row.judge" @change="checkScore(props.row,'pd_score');totalCount()">
                <template slot="prepend">每题分数</template>
              </el-input>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="题库名称" prop="title" show-overflow-tooltip></el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          共{{scope.row.total}}道题
          <el-tag class="tagCount">单选题 {{scope.row.radio}}</el-tag>
          <el-tag class="tagCount">多选题 {{scope.row.checkbox}}</el-tag>
          <el-tag class="tagCount">判断题 {{scope.row.judge}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button size="mini" plain type="danger" @click="handleRemove(scope.row,scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-form-item>
      <el-button type="primary" @click="submitForm()">组卷</el-button>
      <el-button @click="submitForm('preview')">预览</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import * as exam from "@/learn/api/exam";
import * as util from "@/common/assets/util";

const TEMP = {
  sjid:"",
  group_set_list:[]
}

export default {
  props: {
    detail: {
      type: Object,
      default: ()=>{
        return {}
      }
    }
  },
  data() {
    return {
      loading:true,
      examType:this.$route.query.examType || 'creat',
      queryParam:{
        sjid:this.$route.query.sjid || ''
      },
      ruleForm: Object.assign({}, TEMP),
      rules: {},
      data:[],
      total:0
    }
  },
  watch: {
    'queryParam.sjid':{
      handler: function(sjid){
        if(sjid){
          this.fetchData()
        }
      },
      deep: true, 
      immediate: true
    },
    data(new_val){
      this.totalCount();
    }
  },
  methods: {
    checkMax(row,type){
      if(!row.paper_question_group){
        return
      }
      if(type == 'dx_count'){
        if(Number(row.paper_question_group.dx_count)>Number(row.radio)){
          return row.paper_question_group.dx_count = parseInt(row.radio)
        }
        if(Number(row.paper_question_group.dx_count) < 0){
          return row.paper_question_group.dx_count = 0
        }
        return row.paper_question_group.dx_count = parseInt(row.paper_question_group.dx_count) || 0;
      }
      if(type == 'dxt_count'){
        if(Number(row.paper_question_group.dxt_count)>Number(row.checkbox)){
          return row.paper_question_group.dxt_count = row.checkbox
        }
        if(Number(row.paper_question_group.dxt_count) < 0){
          return row.paper_question_group.dxt_count = 0
        }
        return row.paper_question_group.dxt_count = parseInt(row.paper_question_group.dxt_count) || 0;
      }
      if(type == 'pd_count'){
        if(Number(row.paper_question_group.pd_count)>Number(row.judge)){
          return row.paper_question_group.pd_count = row.judge
        }
        if(Number(row.paper_question_group.pd_count) < 0){
          return row.paper_question_group.pd_count = 0
        }
        return row.paper_question_group.pd_count = parseInt(row.paper_question_group.pd_count) || 0;
      }
    },
    checkScore(row,type){
      if(!row.paper_question_group){
        return
      }
      if(type == 'dx_score'){
        if(!row.paper_question_group.dx_score){
          return row.paper_question_group.dx_score = parseFloat(0.0).toFixed(1);
        }
        if(Number(row.paper_question_group.dx_score)>100){
          return row.paper_question_group.dx_score = parseFloat(100.0).toFixed(1);
        }
        if(Number(row.paper_question_group.dx_score) < 0){
          return row.paper_question_group.dx_score = parseFloat(0.0).toFixed(1);
        }
        return row.paper_question_group.dx_score = parseFloat(row.paper_question_group.dx_score).toFixed(1);
      }
      if(type == 'dxt_score'){
        if(!row.paper_question_group.dxt_score){
          return row.paper_question_group.dxt_score = parseFloat(0.0).toFixed(1);
        }
        if(Number(row.paper_question_group.dxt_score)>100){
          return row.paper_question_group.dxt_score = parseFloat(100.0).toFixed(1);
        }
        if(Number(row.paper_question_group.dxt_score) < 0){
          return row.paper_question_group.dxt_score = parseFloat(0.0).toFixed(1);
        }
        return row.paper_question_group.dxt_score = parseFloat(row.paper_question_group.dxt_score).toFixed(1);
      }
      if(type == 'pd_score'){
        if(!row.paper_question_group.pd_score){
          return row.paper_question_group.pd_score = parseFloat(0.0).toFixed(1);
        }
        if(Number(row.paper_question_group.pd_score)>100){
          return row.paper_question_group.pd_score = parseFloat(100.0).toFixed(1);
        }
        if(Number(row.paper_question_group.pd_score) < 0){
          return row.paper_question_group.pd_score = parseFloat(0.0).toFixed(1);
        }
        return row.paper_question_group.pd_score = parseFloat(row.paper_question_group.pd_score).toFixed(1);
      }
    },
    totalCount(){
      setTimeout(() => {
        this.total = 0;
        this.data.forEach(e => {
          let item = e.paper_question_group;
          if(item){
            this.total += parseFloat(item.dx_count)*parseFloat(item.dx_score);
            this.total += parseFloat(item.dxt_count)*parseFloat(item.dxt_score);
            this.total += parseFloat(item.pd_count)*parseFloat(item.pd_score);
          }
        });
      }, 100);
    },
    handleRemove(item,index){
      if(!item.id){
        return
      }
      this.$confirm('是否继续?').then(() => {
        exam.deleteGroupForPaper.r({sjid:this.queryParam.sjid,group_id:item.id}).then((res) => {
          this.$message.success(res.data.message);
          this.data.splice(index, 1);
        })
      }).catch(() => {});
    },
    submitForm(type) {
      this.ruleForm.sjid = this.queryParam.sjid;
      // if(this.total == 0){
      //   this.$message.warning('抽题数量不能为0，请设置抽题数量')
      //   return
      // }
      this.ruleForm.group_set_list = this.data.map(e=>{
        let q_group = e.paper_question_group;
        if(q_group){
          return {
            group_id:e.id,
            radio_num:q_group.dx_count,
            radio_score:q_group.dx_score,
            checkbox_num:q_group.dxt_count,
            checkbox_score:q_group.dxt_score,
            judge_num:q_group.pd_count,
            judge_score:q_group.pd_score
          }
        }else{
          return {
            group_id:e.id
          }
        }
      })
      if(this.ruleForm.group_set_list.length == 0){
        this.$message.warning('未设置题库')
        return
      }
      exam.examPaperQuestionGroupCreate.r(this.ruleForm).then(res => {
        let result = res.data;
        this.$message.success(result.message);
        this.fetchData();
        if(type=='preview'){
          this.$router.push({name:'考试预览',query:{id:this.queryParam.sjid}})
          return;
        }
        util.emit('closeCurrent');
        this.$nextTick(()=>{
          this.$router.push({name:'考试管理'});
        })
      })
    },
    fetchData(){
      this.loading = true;
      exam.examPaperQuestionGroupIndex.r({sjid:this.queryParam.sjid}).then(res => {
        this.loading = false;
        let result = res.data.data;
        if(result.question_group_list){
          this.data = result.question_group_list
        }
      });
    }
  }
}
</script>

<style scoped>
.tagCount { margin-left:8px;}
.el-table >>> .expanded td { background-color:#f3f3f3;}
.el-table >>> col[name="el-table_1_column_1"] { width:40px;}
.el-table >>> col[name="el-table_1_column_4"] { width:100%;}
.el-table >>> .el-table__expand-column .el-table__expand-icon { display:none;}

.zjRow { line-height:32px; padding:5px 10px;}
.zjRow > div { margin-right:10px;}
.zjRow >>> .el-input-group__prepend { padding:0 10px;}
.zjRow >>> .el-input__inner { text-align:center; padding-right:0;}
.zjRow .el-input { width:150px;}
</style>