<template>
  <div class="blockLayout scrollbar">
    <div class="flex-row align-center toolBar">
      <div class="flex-1">
      </div>
      <el-input v-has="port.list" v-model="queryParam.keywords" @keyup.native.enter="queryParam.p = 1;fetchData()"
         placeholder="请输入类型名称/类型编码/字段名称" size="small" class="search" style="width:240px;"></el-input>
      <el-button v-has="port.list" @click="queryParam.p = 1;fetchData()" size="small" type="primary">查询</el-button>
      <el-button size="small" type="primary" icon="el-icon-plus" v-has="port.save" @click="isEdit=false;dialogVisible=true">新增</el-button>
    </div>
    <!-- list -->
    <el-table stripe :data="list" style="width: 100%">
      <!-- <el-table-column type="selection" width="55"></el-table-column> -->
      <el-table-column prop="id" label="类型ID" width="70"></el-table-column>
      <el-table-column prop="name" label="类型名称" show-overflow-tooltip></el-table-column>
      <el-table-column prop="code" label="类型编码" width="130" show-overflow-tooltip></el-table-column>
      <el-table-column prop="syllable" label="字段名称" width="150" show-overflow-tooltip></el-table-column>
      <el-table-column prop="remark" label="注释说明" show-overflow-tooltip></el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="130">
        <template slot-scope="scope">{{ scope.row.create_time | date() }}</template>
      </el-table-column>
      
      <el-table-column label="操作" align="right" width="220">
        <template slot-scope="scope">
          <el-button v-has="port.save" size="mini" type="primary" plain @click="edit(scope.row)">编辑</el-button>
          <el-button v-has="port.list_item" size="mini" type="primary" plain @click="dictlist(scope.row)">数据项</el-button>
          <el-button size="mini" type="danger" plain v-has="port.remove" @click="handleRemove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- page -->
    <page :length="list.length" :p="queryParam.p" :pagesize="queryParam.pagesize" :total="queryParam.totalRows" @current-change="handleCurrentChange" />
    <!-- 新增修改弹窗 -->
    <el-dialog
      class="comDialog"
      :title="`${!isEdit?'新增':'编辑'}数据项`"
      :visible.sync="dialogVisible"
      width="800px"
      @closed="resetForm">
      <datadict-edit :data="editForm" :dialogVisible="dialogVisible" @cancel="resetForm"
       @submit="resetForm();fetchData()" />
    </el-dialog>
    <!-- 数据项弹窗 -->
    <el-drawer
      :title="`${dictForm.name}-数据项`"
      :visible.sync="dialogVisible2"
      direction="rtl"
      size="1000px"
      @close="resetForm"
      >
      <dictdata-tree
      :data="dictForm" :dialogVisible="dialogVisible2" @cancel="resetForm()"
      @submit="resetForm();fetchData();" />
    </el-drawer>
  </div>
</template>

<script>
import * as port from "../api/datadict";

export default {
  components: {
    "datadict-edit": (resolve) => require(['../components/datadict-edit.vue'], resolve),
    "dictdata-tree": (resolve) => require(['../components/dictdata-tree.vue'], resolve)
  },
  data () {
    return {
      port,
      list: [],
      queryParam: {
        pagesize: 10,
        p: 1,
        totalRows: 0,
        keywords: ''
      },
      editForm: {},
      dialogVisible: false,
      dialogVisible2: false,
      dictForm: {},
      isEdit: false,            // 是否为编辑弹窗
    }
  },
  methods: {
    edit: function(data) {
      this.isEdit = true;
      this.editForm = data;
      this.dialogVisible = true;
    },
    dictlist: function(data) {
      this.dictForm = data;
      this.dialogVisible2 = true;
    },
    resetForm() {
      this.dialogVisible=false;
      this.editForm={};
      this.dialogVisible2 = false;
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
>>> .el-drawer .el-drawer__body { height: calc(100% - 100px); }
</style>
