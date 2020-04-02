<template>
  <div class="exam-detail flex-1 flex-row" v-loading="loading">
    <div class="paper-main flex-1 answer-card scrollbar">
      <div class="answer-title">
        <h4>手动组卷</h4>
      </div>
      <div class="toolBar align-center flex-row">
        <div class="flex-1">
          <h3>{{ detail.sjmc }}</h3><span>总分：{{ detail.sjzf?detail.sjzf:0 }}&ensp;试题：{{ question_amount }}</span>
        </div>
        <el-button @click="dialogVisible = true" type="primary" icon="el-icon-plus" size="small">添加题型标记</el-button>
      </div>
      <el-table stripe :data="list" class="flex-1" style="width: 100%" default-expand-all>
        <el-table-column type="expand">
          <template slot-scope="props">
            <div class="ques-list flex-row" v-for="list in props.row.stList" :key="list.id">
              <div  class="list-item flex-1">
                <div class="flex-row mr10" :id="list.id">
                  <div>{{list.pxh}}、</div>
                  <div class="list-title mr10" v-html="list.title"></div>
                  <div style="white-space:nowrap;">({{list.score}}分)</div>
                </div>
                <div class="question-content">
                  <div class="list-info" v-html="list.option"></div>
                  <el-form>
                    <el-form-item label="正确答案："><span v-html="list.answer_text"></span></el-form-item>
                    <el-form-item label="答案解析："><span v-html="list.analysis"></span></el-form-item>
                  </el-form>
                </div>
              </div>
              <div class="question-list-opt">
                <el-button v-has="port.save" size="mini" type="primary" plain @click="editQuestion(list)">编辑</el-button>
                <el-button size="mini" type="danger" plain v-has="port.remove" @click="removeQuestion(list)">删除</el-button>
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

        <el-table-column label="操作" width="210">
          <template slot-scope="scope">
            <el-button v-has="port.save" size="mini" type="primary" plain @click="addQuestion(scope.row)">新增</el-button>
            <el-button v-has="port.save" size="mini" type="primary" plain @click="editTx(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" plain v-has="port.remove" @click="removeGroup(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="answer-card flex-col">
      <div class="answer-title"><h4>高级设置</h4></div>
      <dl class="set"><dt>试卷展示：</dt>
        <dd v-for="(item, index) in sjSet" :key="index">
          <el-radio v-model="detail.show_type" :label="item.id" @change="changeSet">{{ item.name }}</el-radio>
          <div>{{ item.text }}</div>
        </dd>
      </dl>
      <el-row class="btn-content">
        <el-button type="primary" @click="$router.push({name:'考试预览',query:{id:$route.query.sjid}})">预览</el-button>
      </el-row>
    </div>
    <!-- 编辑题型标记弹窗 -->
    <el-dialog :title="(editForm.id?'编辑':'新增')+'题型'" :visible.sync="dialogVisible" width="700px" @close="closeDialog">
      <el-form :model="editForm" :rules="rules" ref="editForm" label-width="100px">
        <el-form-item label="题型描述" prop="txbjnr">
          <el-input v-model="editForm.txbjnr"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm()">保存</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 编辑试题分数弹窗 -->
    <el-dialog title="设置每题分数" :visible.sync="scoreDialogVisible" width="700px" @close="closeDialog">
      <el-form :model="scoreForm" :rules="rules" ref="scoreForm" label-width="120px">
        <el-form-item label="设置每题分数" prop="score">
          <el-input style="width:200px" type="number" min="0" max="100" :maxlength="3" v-model.trim="scoreForm.score"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="scoreSubmitForm()">保存</el-button>
          <el-button @click="scoreDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 新增试题 -->
    <el-drawer
      title="新增试题"
      :visible.sync="questionDialogVisible"
      direction="rtl"
      size="600px"
      @close="closeDialog">
      <question :data="questionForm" :dialogVisible="questionDialogVisible"
        @submit="closeDialog();fetchData();" @cancel="closeDialog()" />
    </el-drawer>
  </div>
</template>

<script>
import * as port from "@/learn/api/exam";

const TEMP = {
  sjid:"",
  txbjnr: ''
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
  components: {
    "question": (resolve) => require(['@/learn/components/exam/question-sjid.vue'], resolve),
  },
  data() {
    return {
      port,
      loading:true,
      examType:this.$route.query.examType || 'creat',
      queryParam:{
        sjid:this.$route.query.sjid || ''
      },
      editForm: Object.assign({}, TEMP),
      rules: {
        txbjnr: [ { required: true, message: '请输入题型描述', trigger: 'blur' }],
        score: [ { required: true, message: '请设置每题分数', trigger: 'blur' } ]
      },
      list: [],
      dialogVisible: false,
      sjSet: [
        {
          id: '0',
          name: '顺序模式',
          text: '试题及选项顺序相同'
        },{
          id: '1',
          name: '乱序模式',
          text: '试题相同顺序不同'
        }
      ],
      checkData: ['A', 'B', 'C', 'D' ,'E' ,'F', 'G','H','I','J','K','L','M','N'],
      questionDialogVisible: false,
      questionForm: {},
      scoreDialogVisible: false,
      scoreForm: {
        score: ''
      },
      question_amount: 0
    }
  },
  watch: {
    'queryParam.sjid':{
      handler: function(sjid){
        if(sjid){
          this.fetchData()
        }else{
          this.editForm = Object.assign({}, TEMP)
          this.$nextTick(()=>{
            this.resetForm('editForm');
          })
        }
      },
      deep: true, 
      immediate: true
    },
    'scoreForm.score'(new_val){
      let score = Number(new_val)
      if(score < 0){
        this.scoreForm.score = 0
      }
      if(score > 100){
        this.scoreForm.score = 100
      }
    }
  },
  methods: {
    // 删除试题
    removeQuestion(item){
      if(!item.id){
        return
      }
      this.$confirm('是否继续?').then(() => {
        port.manualDelQue.r({id:item.exam_paper_question_id}).then((res) => {
          this.$message.success(res.data.message);
          this.fetchData();
        })
      }).catch(() => {});
    },
    // 编辑分数
    scoreSubmitForm() {
      this.$refs['scoreForm'].validate((valid) => {
        if (valid) {
          port.manualEditQue.r(this.scoreForm).then(res => {
            if(res.data.status == '200') {
              this.$message.success('编辑成功');
              this.scoreDialogVisible = false;
              this.fetchData();
            }
          });
        } 
      })
    },
    // 编辑分数
    editQuestion(row) {
      let form = {
        id: row.exam_paper_question_id,
        score: row.score
      }
      this.scoreForm = form;
      this.scoreDialogVisible = true;
    },
    // 新增试题
    addQuestion(row) {
      let form = {
        sjid: this.$route.query.sjid,
        type: '', // 1-单选题 2-多选题 3-判断题
        stmc: '',// row.txbjnr
        page: 1,
        pid: row.id
      }
      this.questionForm = form;
      this.questionDialogVisible = true;
    },
    // 编辑题型
    editTx(row) {
      this.editForm = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;
    },
    // 设置试卷展示
    changeSet(val) {
      // 0顺序模式 1乱序模式
      let params = {
        sjid: this.$route.query.sjid,
        zjfs: this.$route.query.zjfs,
        show_type: val,
        sjmc: this.detail.sjmc
      }
      port.examPapersUpdate.r(params).then(res => {
        if(res.data.status == '200') {
          this.$message.success(res.data.message);
        }
      })
    },
    // 编辑题型标记
    submitForm() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          let api = port.addTxbjnr;
          if(this.editForm.sjid){
            api = port.editTxbjnr;
          }
          this.editForm.sjid = this.$route.query.sjid;
          api.r(this.editForm).then(res => {
            this.$message.success(res.data.message);
            this.fetchData();
            this.dialogVisible = false;
          })
        } 
      })
    },
    // 删除题型
    removeGroup(item){
      if(!item.id){
        return
      }
      this.$confirm('是否继续?').then(() => {
        port.delTxbjnr.r({id:item.id}).then((res) => {
          this.$message.success(res.data.message);
          this.fetchData();
        })
      }).catch(() => {});
    },
    fetchData(){
      this.loading = true;
      port.examManual.r(this.queryParam).then(res => {
        this.loading = false;
        this.list = res.data.data;
        
        let scoreNum = 0;     // 总试题数
        this.list.forEach(item => {
          if(!item.amount) {
            return;
          }
          scoreNum = scoreNum + item.amount;
        });
        this.question_amount = scoreNum;
          
        this.$emit('refresh')
      });
    },
    closeDialog(){
      this.editForm = {};
      this.dialogVisible=false;
      this.resetForm('editForm');
      this.questionDialogVisible = false;
      this.questionForm = {};
    },
    resetForm(formName) {
      this.$refs[formName] && this.$refs[formName].resetFields();
    },
  }
}
</script>

<style scoped>
.paper-main { margin-right: 10px; }
.toolBar {padding: 10px; margin: 0; }
.answer-card {width: 330px; background-color: #fff;border: #efefef 1px solid;box-shadow: 0 0 5px #eee;
  min-height: 150px;}
.answer-card .answer-title {padding: 15px 20px;border-bottom: 1px solid #ddd;}
.answer-card .answer-title h4 {font-weight: bold;position: relative;padding-left: 15px;
border-left: 5px solid #4170F6;line-height: 20px;}
.answer-card .set { padding: 15px; }
.answer-card .set dd > div { padding-left: 1.7em; color: #bbb; font-size: 13px; }
.btn-content { margin-bottom: 10px; padding: 10px; }
/* .btn-content .el-button {width: 150px;} */
.ques-list { border-bottom: 1px dashed #ddd; margin-bottom: 10px; }
.question-content .el-form-item { margin-bottom: 0; }
>>> .el-drawer .el-drawer__body { height: calc(100% - 100px); }
>>> .el-table__expanded-cell { padding: 10px 10px 10px 50px; }
</style>