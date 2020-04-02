<template>
  <div class="blockLayout scrollbar">
    <div class="flex-row align-center toolBar">
      <div class="flex-1">
        <!-- title -->
        <el-button size="mini" type="danger" plain v-has="port.remove" 
          :disabled="!(delIds.id && delIds.id.length>0)" @click="handleRemove(delIds)">批量删除</el-button>
      </div>
      <el-input v-has="port.list" v-model="queryParam.keyword" @keyup.native.enter="query"
          placeholder="请输入版本号" size="small" class="search"></el-input>
      <el-button v-has="port.list" @click="query" size="small" type="primary">查询</el-button>
      <el-button size="small" type="primary" icon="el-icon-plus" v-has="port.add" @click="dialogVisible=true">发布版本号</el-button>
    </div>
    <!-- list -->
    <el-table stripe :data="list" style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="file_url" label="链接地址" show-overflow-tooltip></el-table-column>
      <el-table-column prop="version" label="版本号" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="intro" label="升级说明" show-overflow-tooltip></el-table-column>
      <el-table-column prop="admin_name" label="上传人" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="created_at" label="发布时间" width="130">
        <template slot-scope="scope">{{ scope.row.created_at | date() }}</template>
      </el-table-column>
      
      <el-table-column label="操作" align="right" width="90">
        <template slot-scope="scope">
          <!-- <el-button size="mini" plain type="primary" v-has="port" @click="down(scope.row)">下载</el-button> -->
          <el-button size="mini" type="danger" plain v-has="port.remove" @click="handleRemove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- page -->
    <page :length="list.length" :p="queryParam.p" :pagesize="queryParam.pagesize" :total="queryParam.totalRows" @current-change="handleCurrentChange" />
    <!-- 新增弹窗 -->
    <el-dialog
      class="comDialog"
      title="`发布版本号"
      :visible.sync="dialogVisible"
      width="800px"
      @close="resetForm">
      <version-edit :data="editForm" :dialogVisible="dialogVisible" @cancel="resetForm"
       @submit="resetForm();fetchData()" />
    </el-dialog>
  </div>
</template>

<script>
import * as port from "../api/version";

export default {
  components: {
    "version-edit": (resolve) => require(['../components/version-edit.vue'], resolve)
  },
  data () {
    return {
      port,
      list: [],
      queryParam: {
        pagesize: 10,
        p: 1,
        totalRows: 0,
        keyword: '',
        level: '',
        start_at: '',
        end_at: ''
      },
      delIds: {},
      editForm: {},
      dialogVisible: false,
    }
  },
  methods: {
    // 上传版本文件
    uploadCoverSuccess(data){
      if(data.id){
        this.editForm.file_id = data.id
        this.editForm.file_url = data.domain+data.file_key
      }
    },
    submitForm() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          port.add.r(this.ruleForm).then(res => {
            this.$message.success(res.data.message);
            this.$emit('submit')
          })
        } 
      });
    },
    resetForm() {
      this.dialogVisible=false;
      this.editForm={}
    },
    // 表格多选
    handleSelectionChange (selection){
      let uids = []
      selection.map(a=> { uids.push(a.id) })
      this.delIds = { id: uids };
    }, 
    // 点击查询
    query() {
      if(this.queryParam.start_at?(this.queryParam.end_at?(this.queryParam.start_at > this.queryParam.end_at):''):'') {
        this.$message({ message: "开始时间不能大于结束时间", type: "warning" });
        return
      }
      this.queryParam.p = 1;
      this.fetchData();
    },
    handleRemove(row) {
      if (!row) {
        return null;
      }
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定", cancelButtonText: "取消", type: "warning"
      }).then(() => {
        port.remove.r({id:row.id}).then((res) => {
          if(res.data.status == '200') {
            this.$message({ message: "删除成功", type: "success" });
            this.fetchData();
          }
        });
      });
    },
    handleCurrentChange(val) {
      this.queryParam.p = val;
      this.fetchData();
    },
    fetchData () {
      this.loading = true;
      port.list.r(this.queryParam).then(res => {
        this.loading = false;
        this.list = res.data.data;
        // this.queryParam.pagesize = res.data.pageSize;
        this.queryParam.totalRows = res.data.totalRows;
      });
    }
  },
  created: function(){
    this.fetchData();
  }
}
</script>

<style scoped>

</style>
