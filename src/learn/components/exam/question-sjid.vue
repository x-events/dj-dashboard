<template>
  <div class="flex-col" style="height:100%;" v-loading="loading">
    <div class="demo-drawer__footer toolBar" v-has="port.manualQuestions">
      <span>题型筛选：</span>
      <el-select v-model="queryParam.type" placeholder="全部" size="small" clearable class="search" style="width:100px;">
          <el-option :label="item.name" :value="item.value" :key="index" v-for="(item, index) in typeData"></el-option>
      </el-select>
      <el-input v-has="port.listindex" v-model="queryParam.stmc" @keyup.native.enter="fetchData(true)"
        placeholder="请输入试题名称搜索" size="small" class="search"></el-input>
        <el-button @click="fetchData" type="primary" size="small">查询</el-button>
    </div>
    <div class="demo-drawer__content flex-1" style="overflow:auto">
      <el-table stripe :data="list" height="100%" style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="试题名称">
          <template slot-scope="scope">
            <div v-html="scope.row.title"></div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="demo-drawer__footer align-center toolBar flex-row">
      <span class="flex-1">已选 {{ sessions.length }} 道题</span>
      <el-button size="small" :disabled="queryParam.page == 1" @click="changePage('prev')">上一页</el-button>
      <el-button size="small" :disabled="queryParam.page == page.totalPages || page.totalPages == 0" @click="changePage('next')">下一页</el-button>
    </div>
    <div class="demo-drawer__footer btn_footer flex-row">
      <el-form ref="editForm" class="flex-1" :rules="rules" :model="editForm" label-width="120px" size="mini" label-suffix="：">
        <el-form-item label="设置每题分数" prop="score">
          <el-input style="width:200px" type="number" min="0" max="100" :maxlength="3" v-model.trim="editForm.score"></el-input>
        </el-form-item>
      </el-form>
        <el-button type="primary" size="small" @click="submitForm">确定</el-button>
        <el-button size="small" @click="$emit('cancel')">取消</el-button>
    </div>
  </div>
</template>

<script>
import * as port from "@/learn/api/exam";

const TEMP = {
  score: ''
}

export default {
  props: {
    data: {
      type: Object,
      required: false,
      default: function(){
        return {}
      }
    },
    title: ''
  },
  data() {
    return {
      port,
      loading: false,
      list: [],
      page:{
        page:1,
        totalPages:0,
        totalRows:0
      },
      queryParam: {
        sjid: '',
        type: '', // 1-单选题 2-多选题 3-判断题
        stmc: '',
        page: 1,
        pagesize:10
      },
      editForm: TEMP,
      rules: {
        score: [
          { required: true, message: '请设置每题分数', trigger: 'blur' }
        ]
      },
      sessions: [],
      typeData: [
        {
          name: '单选题',
          value: '1'
        },{
          name: '多选题',
          value: '2'
        },{
          name: '判断题',
          value: '3'
        }],
    }
  },
  watch: {
    data: {
      handler: function(data){
        if(data && data.sjid){
          this.queryParam = Object.assign({},this.queryParam, data);
          this.$nextTick(()=>{
            this.fetchData()
          })
        }
        this.resetForm('editForm');        
      },
      deep: true, 
      immediate: true
    },
    'editForm.score'(new_val){
      let score = Number(new_val)
      if(score < 0){
        this.editForm.score = 0
      }
      if(score > 100){
        this.editForm.score = 100
      }
    }
  },
  methods: {
    // 添加试题
    submitForm() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          let params = {
            sjid: this.queryParam.sjid,
            score: this.editForm.score,
            pid: this.queryParam.pid,
            question_id: this.sessions
          }
          port.manualAddQue.r(params).then(res => {
            if(res.data.status == '200') {
              this.$message.success('编辑成功');
              this.$emit('submit')
            }
          });
        } 
      });
    },
    // 切换页码
    changePage(tag) {
      if(tag == 'prev') { // 上一页
        this.queryParam.page --;
      } else if(tag == 'next') {
        this.queryParam.page ++;
      }
      this.fetchData();
    },
    // 表格多选
    handleSelectionChange (selection){
      let ids = []
      selection.map(a=> { ids.push(a.id) })
      this.sessions = ids;
    }, 
    resetForm(formName) {
      this.$refs[formName] && this.$refs[formName].resetFields();
    },
    fetchData() {
      // 获取习题列表
      this.loading = true;
      port.manualQuestions.r(this.queryParam).then(res => {
        this.loading = false;
        let result = res.data

        this.list = result.data;
        this.page = {
          page:result.page,
          totalPages:result.totalPages,
          totalRows:result.totalRows
        }
      });
    }
  },
}
</script>

<style scoped>
.flex-col > div { padding: 20px 20px 0; }
/* .btn_footer {height: 60px; } */
.btn_footer .el-button { margin-bottom: 20px; }
.toolBar { margin-bottom: 0; }
</style>
