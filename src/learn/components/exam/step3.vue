<template>
  <div v-loading="loading">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
      
      <div class="flex-row mb10">
        <div class="flex-1 transGroup leftGroup">
          <el-table stripe ref="multipleTable" :data="data" style="width: 100%" row-key="id" @selection-change="selectionChange" height="412">
            <el-table-column type="selection" width="55" align="center" :selectable="selectable" :value="selectable" :reserve-selection="true"></el-table-column>
            <el-table-column align="left">
              <template slot="header" slot-scope="scope">
                <div class="tableTitle l">全部题库</div>
                <el-input v-model.trim="queryParam.keyword" size="small" placeholder="请输入题库名称" class="search r">
                  <el-button slot="append" icon="el-icon-search" @click="queryParam.p = 1; fetchData();"></el-button>
                </el-input>
              </template>
              <template slot-scope="scope">
                <div class="title el" :title="scope.row.title">{{scope.row.title}}</div>
                <div class="count">
                  <el-tag type="info" size="mini">共{{scope.row.total}}道题</el-tag>
                  <el-tag type="info" size="mini">单选{{scope.row.radio}}</el-tag>
                  <el-tag type="info" size="mini">多选{{scope.row.checkbox}}</el-tag>
                  <el-tag type="info" size="mini">判断{{scope.row.judge}}</el-tag>
                  <!-- <el-tag type="info" size="mini">填空{{scope.row.filling}}</el-tag>
                  <el-tag type="info" size="mini">主观{{scope.row.subjectivity}}</el-tag> -->
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="tableFootBar flex-row">
            <div class="flex-1">共 {{page.total}} 道题</div>
            <div class="miniPage flex-row">
              <el-button icon="el-icon-arrow-left" circle size="mini" @click="pageChange(0)" :disabled="page.page == 1"></el-button>
              <div class="status">{{page.page}} / {{page.totalPages}}</div>
              <el-button icon="el-icon-arrow-right" circle size="mini" @click="pageChange(1)" :disabled="page.page == page.totalPages"></el-button>
            </div>
          </div>
        </div>
        <div class="transBtn align-center justify-center flex-col">
          <el-button type="primary" icon="el-icon-d-arrow-right" @click="selectChange()"></el-button>
        </div>
        <div class="flex-1 transGroup rightGroup">
          <el-table stripe :data="data_selected" style="width: 100%" height="412">
            <el-table-column align="left">
              <template slot="header">
                <div class="tableTitle l">已选题库</div>
              </template>
              <template slot-scope="scope">
                <div class="title el" :title="scope.row.title">{{scope.row.title}}</div>
                <div class="count">
                  <el-tag type="info" size="mini">共{{scope.row.total}}道题</el-tag>
                  <el-tag type="info" size="mini">单选{{scope.row.radio}}</el-tag>
                  <el-tag type="info" size="mini">多选{{scope.row.checkbox}}</el-tag>
                  <el-tag type="info" size="mini">判断{{scope.row.judge}}</el-tag>
                  <!-- <el-tag type="info" size="mini">填空{{scope.row.filling}}</el-tag>
                  <el-tag type="info" size="mini">主观{{scope.row.subjectivity}}</el-tag> -->
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" width="100">
              <template slot-scope="scope">
                <el-button size="mini" plain type="danger" @click="handleRemove(scope.row,scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div class="tableFootBar flex-row"></div>
        </div>
      </div>

      <el-form-item v-if="examType == 'creat'">
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
  dtcs:"",
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
        sjid:this.$route.query.sjid || '',
        p:1,
        pagesize:4,
        keyword:""
      },
      page:{
        page:1,
        totalPages:1,
        totalRows:0,
        total:0
      },
      ruleForm: Object.assign({}, TEMP),
      rules: {
          sjmc: [
            { required: true, message: '请输入考试名称', trigger: 'blur' }
          ]
      },

      search:"",
      selected: [],
      data_status:false,
      data: [],
      data_selected_status:false,
      data_selected:[]
    }
  },
  watch: {
    'queryParam.sjid':{
      handler: function(sjid){
        if(sjid){
          this.fetchData();
          this.fetchSelected();
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
    data_status(status){
      //已选题库或全部题库数据有变化，就重新设置勾选状态
      if(status && this.data_selected_status){
        this.setStatus();
      }
    },
    data_selected_status(status){
      //已选题库或全部题库数据有变化，就重新设置勾选状态
      if(status && this.data_status){
        this.setStatus();
      }
    }
  },
  methods: {
    pageChange(type){
      if(type){
        this.queryParam.p +=1
      }else{
        this.queryParam.p -=1
      }
      this.fetchData();
    },
    selectable(row){
      if(row.disabled){
        return false;
      }else{
        return true;
      }
    },
    selectionChange(arr){
      this.selected = arr;
    },
    selectChange(){
      let orgIndex = this.data_selected.length;
      //console.log(orgIndex,'orgIndex');
      
      let addData = this.data_selected.concat(this.selected);
      //对象去重
      var obj = {};
      addData = addData.reduce((item, next)=> {
        obj[next.id] ? '' : obj[next.id] = true && item.push(next);
        return item;
      }, []);
      this.data_selected = addData;


      let selectedID = this.data_selected.map(e=>{return e.id})
      //console.log(selectedID,'selectedID');
      if(selectedID.length > orgIndex){
        selectedID.splice(0,orgIndex);
      }else{
        this.$message.warning('请选择题库')
        return
      }
      //console.log(selectedID,'selectedID');
      //添加
      exam.addGroupForPaper.r({sjid:this.queryParam.sjid,group_id:selectedID}).then(res => {
        this.$message.success(res.data.message);
        this.setStatus();
      })

    },
    handleRemove(item,index){
      if(!item.id){
        return
      }
      this.$confirm('是否继续?').then(() => {
        exam.deleteGroupForPaper.r({sjid:this.queryParam.sjid,group_id:item.id}).then((res) => {
          this.$message.success(res.data.message);
          this.data_selected.splice(index, 1);
          this.fetchData();
        })
      }).catch(() => {});
    },
    setStatus(){
      // console.log(this.data,'this.data');
      // console.log(this.data_selected,'this.data_selected');
      this.$refs.multipleTable.clearSelection();
      //设置左侧选中状态
      this.data.some(e=>{
        this.data_selected.some(ee=>{
          if(e.id == ee.id){
            this.$set(e,'disabled',true);
          }
        })
      })
      // console.log(this.data,'this.data111');
      
      let count = 0
      if(this.data_selected.length){
        this.data_selected.forEach(e => {
          this.data.forEach(ee => {
            if(e.id == ee.id){
              count +=1;
              this.$refs.multipleTable.toggleRowSelection(e,true);
            }
          });
        });
      }
      if(!count){
        this.$refs.multipleTable.clearSelection();
      }
    },
    submitForm() {
      // if(!this.data_selected.length){
      //   this.$message.warning("请选择试题库！")
      //   return
      // }
      if(this.examType == 'creat'){
        let obj = {
          next_step:4,
          id:""
        }
        this.$emit('submit',obj)
      }
    },
    fetchSelected(){
      this.data_selected_status = false;
      exam.examPaperQuestionGroupIndex.r({sjid:this.queryParam.sjid}).then(res => {
        this.loading = false;
        this.data_selected_status = true;
        let result = res.data;
        if(result.data.question_group_list){
          this.data_selected = result.data.question_group_list;
        }
      });
    },
    fetchData(){
      this.$nextTick(()=>{
        this.examType = this.$route.query.examType || "creat";
      })
      this.loading = true;
      this.data_status = false;
      exam.examPaperQuestionGroupAll.r(this.queryParam).then(res => {
        this.loading = false;
        this.data_status = true;
        let result = res.data;
        this.data = result.data;
        //this.data_selected = result.is_choose_list;
        this.page = {
          page:result.page,
          totalPages:result.totalPages,
          totalRows:result.totalRows,
          total:result.total_checkbox+result.total_filling+result.total_judge+result.total_radio+result.total_subjectivity
        }
      });
    }
  }
}
</script>

<style scoped>

.transGroup { border:#eee 1px solid;}
.tableTitle { line-height:32px; font-size:16px; padding:0;}
.count .el-tag { margin:0 5px 0 0;}
.search { width:auto; display:inline-table;}
.search >>> .el-input-group__append { display:table-cell; line-height:normal;}

.transBtn { padding:0 20px;}
.tableFootBar { background-color:#EEF0F7; height:28px; line-height:28px; padding:10px;}
.miniPage .status { padding:0 8px;}
</style>