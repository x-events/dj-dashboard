<template>
  <div class="blockLayout scrollbar">
    <div class="flex-row align-center toolBar">
      <div class="flex-1">
        <!-- title -->
      </div>
      <el-input v-has="port.list" v-model="queryParam.keywords" @keyup.native.enter="fetchData(true)"
        placeholder="请输入行政区名称" size="small" class="search"></el-input>
      <el-button v-has="port.list" @click="fetchData(true)" type="primary" size="small">查询</el-button>
      <el-button v-has="port.save" @click="createNew" type="primary" size="small" icon="el-icon-plus">新增行政区</el-button>
    </div>
    <!-- list -->
    <el-table stripe :data="list" style="width: 100%">
      <el-table-column prop="name" label="行政区名称"></el-table-column>
      <el-table-column prop="code" label="行政区代码"></el-table-column>
      <el-table-column prop="create_username" label="创建人"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="130">
        <template slot-scope="scope">{{ scope.row.create_time | date() }}</template>
      </el-table-column>
      
      <el-table-column label="操作" align="right" width="150">
        <template slot-scope="scope">
          <el-button size="mini" plain type="primary" v-has="port.save" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="mini" type="danger" plain v-has="port.remove" @click="handleRemove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- page -->
    <page :length="list.length" :p="queryParam.p" :pagesize="queryParam.pagesize" :total="queryParam.totalRows" @current-change="handleCurrentChange" />

    <!-- 弹窗 -->
    <el-dialog
      :title="`${!editForm.id?'新增':'编辑'}行政区`"
      :visible.sync="dialogVisible"
      width="600px"
      @closed="resetForm">
      <el-form size="small" ref="editForm" :rules="rules" :model="editForm" label-width="100px">
        <el-form-item label="行政区名称" prop="name">
          <el-input v-model="editForm.name" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="行政区代码">
          <el-input v-model="editForm.code" maxlength="20" type="text" oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as util from "@/common/assets/util";
import * as port from "@/basedata/api/district";

export default {
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
      rules: {
        name: [{ required: true, message: "请输入行政区名称", trigger: "blur" }]
      },
      dialogVisible: false,
    }
  },
  methods: {
    oninput(len,field) {
        if(this.editForm[field] && this.editForm[field].length> len) this.editForm[field]=this.editForm[field].slice(0, len)
    },
    createNew: function(){
      // this.editForm.process_category_id = this.currentCat.id;
      this.dialogVisible=true;
    },
    handleEdit (row){
      port.detail.r({id: row.id}).then(res => {
        if(res.data.status == '200') {
          this.editForm = res.data.data;
          this.dialogVisible = true;
        }
      });
    },
    handleRemove(row) {
      if (!row) {
        return null;
      }
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定", cancelButtonText: "取消", type: "warning"
      }).then(() => {
        port.remove.r(row).then((res) => {
          if(res.data.status == '200') {
            this.$message({ message: "删除成功", type: "success" });
            this.fetchData();
          }
        });
      });
    },
    submitForm() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          port.save.r(this.editForm).then(res => {
            if(res.data.status == '200') {
              this.dialogVisible = false;
              this.fetchData();
            }
          });
        } 
      });
    },
    resetForm (){
      this.editForm = {};
      this.$refs['editForm'] && this.$refs['editForm'].resetFields();
    },
    handleCurrentChange(val) {
      this.queryParam.p = val;
      this.fetchData();
    },
    fetchData (reload) {
      if (reload) {
        this.queryParam.p = 1;
      }
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
>>> input.el-input__inner[type="number"] { text-align: left; } 
</style>
