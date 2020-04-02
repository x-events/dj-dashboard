<template>
  <div class="scrollbar blockLayout" v-loading="loading">
    <div class="flex-row align-center toolBar">
        <div class="flex-1"></div>
        <el-button v-has="port.courseCategorySave" type="primary" size="small" icon="el-icon-plus" @click="createNew()">新增</el-button>
    </div>
    <el-table stripe :data="list" style="width: 100%">
      <el-table-column prop="name" label="分类名称" show-overflow-tooltip></el-table-column>
      <el-table-column label="创建时间" width="200">
        <template slot-scope="scope">
          {{scope.row.create_time | date}}
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" show-overflow-tooltip></el-table-column>
      <el-table-column label="操作" width="150" align="right">
        <template slot-scope="scope">
          <el-button v-has="port.courseCategorySave" size="mini" type="primary" plain @click="handleEdit(scope.row)">编辑</el-button>
          <el-button v-has="port.courseCategoryDel" size="mini" type="danger" plain @click="handleRemove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- page -->
    <page :length="list.length" :p="queryParam.p" :pagesize="queryParam.pagesize" :total="totalRows" @current-change="handleCurrentChange" />

    <!-- 编辑弹窗 -->
    <el-dialog :title="dialogTitle+'课程分类'" :visible.sync="dialogVisible" width="700px" @close="closeDialog">
      <course-category-editor 
        :data="editForm"
        @submit="closeDialog();fetchData();"
        @cancel="closeDialog()" />
    </el-dialog>
  </div>
</template>

<script>
import * as port from "@/learn/api/course";

const defaultEditForm = {
  id:'',
  name:'',
  remark:''
}

export default {
  components: {
    "course-category-editor": (resolve) => require(['@/learn/components/course-category-editor.vue'], resolve)
  },
  data() {
    return {
      port,
      loading:true,
      queryParam:{
        pagesize: 10,
        p: 1
      },
      totalRows:0,
      list:[],

      dialogVisible:false,
      editForm:defaultEditForm,
      dialogTitle:""
    };
  },
  methods: {
    createNew(){
      this.dialogTitle = "新增";
      this.editForm = defaultEditForm;
      this.dialogVisible=true;
    },
    closeDialog(){
      this.editForm = {}
      this.dialogVisible=false;
    },
    handleEdit(item){
      this.dialogTitle = "编辑";
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
        port.courseCategoryDel.r({id:item.id}).then((res) => {
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
      port.courseCategoryList.r(this.queryParam).then(res => {
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