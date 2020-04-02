<template>
  <div class="flex-row" v-loading="loading">
    <div class="sideBar blockLayout scrollbar">
      <orgtree ref="tree" :firstCheck="true" @firstCheckValue="default_org" @nodeClick="handleNodeClick" />
    </div>
    <div class="flex-1 blockLayout scrollbar">
      <div class="flex-row align-center toolBar">
        <div class="flex-1">
          <div class="pt5">
            <el-button v-has="port.govCourseDel" size="mini" plain type="danger" @click="handleRemove('all')" :disabled="!delForm.id.length" v-if="is_leaf">批量删除</el-button>
          </div>
        </div>
        <div class="count flex-row mr10" v-has="port.govCourseCount">
          <div class="pt5 mr10">
            必修课
            <el-badge class="mark" :value="count.course_count" />
          </div>
          <div class="pt5">
            共计学时
            <el-badge class="mark" :value="count.credit_count" />
          </div>
        </div>
        <el-button v-has="port.govCourseSave" type="primary" size="small" icon="el-icon-plus" @click="createNew()" v-if="is_leaf">添加必修课</el-button>
      </div>
      <!-- list -->
      <el-table stripe :data="list" style="width: 100%" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="70" align="center"></el-table-column>
        <el-table-column prop="course_name" label="课程" show-overflow-tooltip></el-table-column>
        <el-table-column prop="course_credit" label="学时" width="150" align="center"></el-table-column>
        <el-table-column prop="username" label="指导部门" width="200"></el-table-column>
        <el-table-column label="操作" width="90" align="right" v-if="is_leaf">
          <template slot-scope="scope">
            <el-button v-has="port.govCourseDel" size="mini" type="danger" plain @click="handleRemove('single',scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- page -->
      <page :length="list.length" :p="queryParam.p" :pagesize="queryParam.pagesize" :total="totalRows" @current-change="handleCurrentChange" />

    </div>

    <!-- 添加必修课弹窗 -->
    <el-dialog title="添加必修课" :visible.sync="dialogVisible" width="960px" @close="closeDialog">
      <required-course-add 
        :data="editForm"
        @submit="closeDialog();fetchData();"
        @cancel="closeDialog()" />
    </el-dialog>
  </div>
</template>

<script>
import * as port from "@/learn/api/course";

export default {
  components: {
    "required-course-add": (resolve) => require(['@/learn/components/required-course-add.vue'], resolve)
  },
  data() {
    return {
      port,
      dialogVisible: false,
      loading: false,
      currentTree: {},
      list: [],
      count:{
        course_count:0,
        credit_count:0
      },
      multipleSelection:[],
      queryParam:{
        org_id:"",
        p:1,
        pagesize:10
      },
      totalRows:0,
      editForm: {},
      delForm:{
        id:[],
        org_id:""
      },
      is_leaf:false
    };
  },
  watch: {
    currentTree: {
      handler: function(currentTree){
        if(currentTree.id){
          this.fetchData();
        }else{
          this.list = []
        }
      },
      deep: true
    },
    multipleSelection(new_val){
      //console.log(new_val,'multipleSelection');
      this.delForm.id = [];
      new_val.map(e=>{
        this.delForm.id.push(e.kcid)
      })
    }
  },
  methods: {
    handleSelectionChange(val){
      this.multipleSelection = val;
    },
    //默认请求
    default_org(org){
      if(org){
        this.currentTree = org;
      }
      if(org.pid && org.pid == 0){
        this.is_leaf = true;
      }
    },
    handleNodeClick(data){
      //console.log(data);
      if(data.pid && data.pid == 0){
        this.is_leaf = true;
      }else{
        this.is_leaf = false;
      }
      this.currentTree = data;
    },
    createNew(){
      this.editForm = {
        org_id:this.currentTree.id
      }
      this.dialogVisible=true;
    },
    closeDialog(){
      this.editForm = {};
      this.dialogVisible=false;
    },
    handleRemove(type,item){
      this.delForm.org_id = this.currentTree.id;
      if(type=='single' && item.kcid){
        this.delForm.id = [];
        this.delForm.id.push(item.kcid);
      }
      this.$confirm('是否继续?').then(() => {
        this.loading = true;
        port.govCourseDel.r(this.delForm).then((res) => {
          this.$message.success('删除成功');
          this.delForm.id = [];
          this.fetchData();
        })
      }).catch(()=>{})
    },
    handleCurrentChange(currentPage) {
      this.queryParam.p = currentPage;
      this.fetchData();
    },
    fetchData(){
      this.queryParam.org_id = this.currentTree.id;
      if(!this.queryParam.org_id){
        return console.warn('参数错误')
      }
      this.loading = true;
      port.govCourseLists.r(this.queryParam).then(res => {
        this.list = res.data.data
        this.totalRows = res.data.totalRows;

        //获取统计
        this.$nextTick(()=>{
          port.govCourseCount.r(this.queryParam).then(res => {
            this.loading = false;
            this.count = res.data.data;
          })
        })
      })
    }
  },
  created: function() {
    //this.fetchTree();
  }
};
</script>

<style scoped>
</style>