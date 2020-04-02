<template>
  <div class="flex-row" v-loading="loading">
    <div class="sideBar blockLayout scrollbar">
      <street-tree ref="tree" :firstCheck="true" @firstCheckValue="default_org" @nodeClick="handleNodeClick" />
    </div>
    <div class="flex-1 blockLayout scrollbar">
      <div class="flex-row align-center toolBar">
        <div class="flex-1">
          <!-- title -->
        </div>
        <el-input v-has="port.list" v-model="queryParam.keywords" @keyup.native.enter="fetchData(true)"
          placeholder="请输入街乡名称" size="small" class="search"></el-input>
        <el-button v-has="port.list" @click="fetchData(true)" type="primary" size="small">查询</el-button>
        <el-button v-has="port.save" @click="createNew" :disabled="!currentTree.id" type="primary" size="small" icon="el-icon-plus">新增街乡</el-button>
      </div>
      <!-- list -->
      <el-table stripe :data="list" style="width: 100%">
        <el-table-column prop="name" label="街乡名称"></el-table-column>
        <el-table-column prop="code" label="街乡代码"></el-table-column>
        <el-table-column prop="area" label="总面积"></el-table-column>
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
        :title="`${!editForm.id?'新增':'编辑'}街乡`"
        :visible.sync="dialogVisible"
        width="800px"
        @closed="resetForm">
        <el-form size="small" ref="editForm" :rules="rules" :model="editForm" label-width="100px">
          <el-form-item label="所属">
            {{ editForm.district_name }}
          </el-form-item>
          <el-form-item label="街乡名称" prop="name">
            <el-input v-model="editForm.name" maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="街乡代码">
            <el-input v-model="editForm.code" maxlength="20" 
              type="text" oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
          </el-form-item>
          <el-form-item label="总面积" prop="area">
            <el-input v-model="editForm.area" style="width:95%" type="number" maxlength="10" :oninput="oninput(10,'area')"></el-input> km²
          </el-form-item>
          <el-form-item label="坐标范围">
            <el-input type="textarea" rows="8" v-model="editForm.range" maxlength="200"></el-input>
          </el-form-item>
          <el-form-item label="坐标中心">
            <el-input v-model="editForm.center" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="gis定位点">
            <el-input v-model="editForm.gis" maxlength="50"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as util from "@/common/assets/util";
import * as common from "@/basedata/api/common";
import * as port from "@/basedata/api/street";

export default {
  components: {
    "street-tree": (resolve) => require(['../components/street-tree.vue'], resolve)
  },
  data () {
    return {
      port,
      loading: false,
      list: [],
      queryParam: {
        pagesize: 10,
        p: 1,
        totalRows: 0,
        keywords: '',
        node: ''
      },
      editForm: {},
      rules: {
        name: [{ required: true, message: "请输入街乡名称", trigger: "blur" }],
        area: [{ required: true, message: "请输入总面积", trigger: "blur" }]
      },
      dialogVisible: false,
      currentTree: {}
    }
  },
  watch: {
    currentTree: {
      handler: function(currentTree){
        if(currentTree.id){
          this.fetchData(true)
        }else{
          this.list = []
        }
      },
      deep: true,
      immediate: true
    },
    'editForm.area'(val) {
        let result = parseFloat(val);
        if(isNaN(result)) {
            result = ''
        }else {
            if(result > 999999.9999) {
                result = 999999.9999
            }
            if(result < 0) {
                result = 0
            }
        }
        this.editForm.area = result;
    }
  },
  methods: {
    oninput(len,field) {
        if(this.editForm[field] && this.editForm[field].length> len) this.editForm[field]=this.editForm[field].slice(0, len)
    },
    //默认请求
    default_org(data){
      if(data){
        this.currentTree = data;
      }
    },
    handleNodeClick(data) {
      this.currentTree = data;
      this.queryParam.keywords = ''
    },
    createNew: function(){
      this.editForm.district_id = this.currentTree.id;
      this.editForm.district_name = this.currentTree.name;
      this.dialogVisible=true;
    },
    handleEdit (row){
      port.detail.r({id: row.id}).then(res => {
        if(res.data.status == '200') {
          this.editForm = res.data.data;
          this.editForm.district_name = this.currentTree.name;
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
      let treeid = this.currentTree.id;
      this.queryParam.node = treeid;
      if(!treeid){
        return console.warn('参数错误')
      }
      if (reload) {
        this.queryParam.p = 1;
      }
      this.loading = true;
      port.list.r(this.queryParam).then(res => {
        this.loading = false;
        this.list = res.data.data
        // this.queryParam.pagesize = res.data.pageSize;
        this.queryParam.totalRows = res.data.totalRows;
      })
    }
  }
}
</script>

<style scoped>
</style>
