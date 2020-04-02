<template>
  <div class="scrollbar blockLayout" v-loading="loading">
    <div class="flex-row align-center toolBar">
        <div class="flex-1"></div>
        <el-input v-has="port.questionGroupIndex" v-model.trim="queryParam.group_title" placeholder="请输入题库名称" size="small" class="search"></el-input>
        <el-button v-has="port.questionGroupIndex" @click="queryParam.p = 1;fetchData()" type="primary" size="small">查询</el-button>
        <el-button v-has="port.questionGroupCreate" type="primary" size="small" icon="el-icon-plus" @click="createNew()">新增</el-button>
    </div>
    <el-table stripe :data="list" style="width: 100%">
      <el-table-column label="题库名称" show-overflow-tooltip>
        <template slot-scope="scope"><a class="link" @click="$router.push({name:'试题管理',query:{id:scope.row.id}})">{{scope.row.title}}</a></template>
      </el-table-column>
      <el-table-column prop="question_num" label="试题数量" width="150" align="center"></el-table-column>
      <el-table-column label="创建时间" width="200">
        <template slot-scope="scope">
          {{scope.row.input_time | date}}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160" align="right">
        <template slot-scope="scope">
          <el-button v-has="port.questionGroupUpdate" size="mini" type="primary" plain @click="handleEdit(scope.row)">编辑</el-button>
          <el-button v-has="port.questionGroupDelete" size="mini" type="danger" plain @click="handleRemove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- page -->
    <page :length="list.length" :p="queryParam.p" :pagesize="queryParam.pagesize" :total="totalRows" @current-change="handleCurrentChange" />

    <!-- 编辑弹窗 -->
    <el-dialog :title="(editForm.id?'编辑':'新增')+'题库'" :visible.sync="dialogVisible" width="700px" @closed="closeDialog">
      <question-bank-editor 
        :data="editForm"
        @submit="closeDialog();fetchData();"
        @cancel="closeDialog()" />
    </el-dialog>
  </div>
</template>

<script>
import * as port from "@/learn/api/exam";

const defaultEditForm = {
  id:'',
  title:''
}

export default {
  components: {
    "question-bank-editor": (resolve) => require(['@/learn/components/question-bank-editor.vue'], resolve)
  },
  data() {
    return {
      port,
      loading:true,
      queryParam:{
        group_title:"",
        pagesize: 10,
        p: 1
      },
      totalRows:0,
      list:[],

      dialogVisible:false,
      editForm:defaultEditForm
    };
  },
  methods: {
    createNew(){
      this.editForm = defaultEditForm;
      this.dialogVisible=true;
    },
    closeDialog(){
      
      this.dialogVisible=false;
      setTimeout(() => {
        this.editForm = {};
      }, 1000);
    },
    handleEdit(item){
      if(item.id){
        this.editForm = item;
      }
      this.dialogVisible=true;
    },
    handleRemove(item){
      if(!item.id){
        return
      }
      this.$confirm('是否继续?').then(() => {
        port.questionGroupDelete.r({id:item.id}).then((res) => {
          this.$message.success(res.data.message);
          this.fetchData();
        })
      }).catch(()=>{})
    },
    handleCurrentChange(currentPage) {
      this.queryParam.p = currentPage;
      this.fetchData();
    },
    fetchData() {
      this.loading = true;
      port.questionGroupIndex.r(this.queryParam).then(res => {
        let result = res.data;
        this.loading = false;
        this.list = result.data;
        this.totalRows = result.totalRows;
      });
    }
  },
  created: function() {
    this.fetchData();
  }
};
</script>

<style scoped>
</style>