<template>
  <div class="flex-col" style="height:100%;" v-loading="loading">
    <div class="demo-drawer__footer toolBar">
      <el-input class="search" size="small" placeholder="请输入数据项名称搜索" v-model="search_name"></el-input>
      <el-button size="small" type="primary" icon="el-icon-plus" v-has="port.list_save" @click="isEdit=false;saveDialogVisible=true">新增</el-button>
    </div>
    <div class="demo-drawer__content flex-1" style="overflow:auto;">
      <div class="el-table flex-row">
        <el-row class="table-header flex-1">
          <el-col :span="8" class="col1"><thead><th>数据项名称</th></thead></el-col>
          <el-col :span="5"><thead><th>数据项值</th></thead></el-col>
          <el-col :span="3"><thead><th>是否可选</th></thead></el-col>
          <el-col :span="2"><thead><th>排序</th></thead></el-col>
          <el-col :span="6"><thead><th>注释说明</th></thead></el-col>
        </el-row>
        <div class="table-header" style="width:200px;"><thead><th></th></thead></div>
      </div>
      <el-tree ref="tree"
        class="custom-tree"
        :data="list"
        :props="defaultProps"
        node-key="id"
        :default-expand-all="false"
        :filter-node-method="filterNode"
        :load="loadNode"
        :lazy="true"
        >
        <div slot-scope="{ node, data }" class="custom-tree-item">
          <div class="flex-1 extendLable">
            <span class="tree-span-width el" :title="data.name">{{data.name}}</span>
          </div>
          <span class="extendGroup">
            <span class="tree-span-width width_150 el" style="margin-right:12px;">{{data.value}}</span>
            <span class="tree-span-width width_sm el" style="margin-right:15px;">{{data.status == 0?'可选':(data.status == 1?'不可选':'')}}</span>
            <span class="tree-span-width width_xs el" style="margin-right:8px;">{{data.sort}}</span>
            <span class="tree-span-width width_190 el" style="margin-right:50px;" :title="data.remark">{{data.remark}}</span>
            <el-button v-has="port.list_save" size="small" type="text" @click.stop="append(data)">添加子级</el-button>
            <el-button v-has="port.list_save" size="small" type="text" @click.stop="edit(data)">编辑</el-button>
            <el-button v-has="port.list_remove" size="small" type="text" @click.stop="remove(data)">删除</el-button>
          </span>
        </div>
      </el-tree>
    </div>
    <!-- 新增修改弹窗 -->
    <el-dialog
      class="comDialog"
      :title="`${!isEdit?'新增':'编辑'}数据项`"
      :visible.sync="saveDialogVisible"
      :append-to-body="true"
      width="800px"
      @closed="resetForm">
      <tree-edit
      :data="editForm" :dialogVisible="saveDialogVisible" @cancel="resetForm()"
      @submit="resetForm();fetchData();" />
    </el-dialog>
  </div>
</template>

<script>
import * as util from '@/common/assets/util';
import * as port from "../api/datadict";
import * as allcommon from "@/common/api/common";

export default {
  props: {
    dialogVisible:{
      type: Boolean,
      required: true,
      default: function(){
        return false
      }
    },
    data: {
      type: Object,
      required: false,
      default: function(){
        return {}
      }
    },
  },
  components: {
    "tree-edit": (resolve) => require(['../components/tree-edit.vue'], resolve)
  },
  data() {
    return {
      port,
      editForm: {},
      loading: false,
      queryParam: {
        id:""
      },
      list: [],
      defaultProps: {
        children: 'children',
        label: 'name',
        isLeaf: (data, node)=>{ // 转换布尔值
          let is_latest = '';
          if(data.is_latest == '0') {
            is_latest = true;
          }else if(data.is_latest = '1') {
            is_latest = false;
          }
          return is_latest;
        },
      },
      saveDialogVisible: false,
      search_name: '',
      isEdit: false,            // 是否为编辑弹窗
    }
  },
  watch: {
    dialogVisible(val){
      if(val) {
        this.fetchData()
      }
    },
    data: {
      handler: function(data){
        if(data && data.code){
          this.queryParam.id = data.code;
          this.$nextTick(()=>{
            this.fetchData()
          })
        }
      },
      deep: true, 
      immediate: true
    },
    saveDialogVisible(val) {
      if(val) {
        this.editForm.dict_code = this.data.code;
      }
    },
    search_name(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    // 懒加载方法
    loadNode(node, resolve) {
      if (node.level != 0) {
          port.list_item.r({id: node.data.dict_code,pid: node.data.id}).then(res => {
              if(res.data.status == '200') {
                  return resolve(res.data.data)
              }
          })
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    append(row) {
      this.editForm.pid = row.id;
      this.saveDialogVisible = true;
    },
    edit(row) {
      this.isEdit = true;
      this.editForm = row;
      this.saveDialogVisible = true;
    },
    remove(row) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定", cancelButtonText: "取消", type: "warning"
      }).then(() => {
        port.list_remove.r({id:row.id}).then((res) => {
          if(res.data.status == '200') {
            this.$message({ message: "删除成功", type: "success" });
            this.fetchData();
          }
        });
      });
    },
    fetchData() {
      // 获取详情树
      this.loading = true;
      port.list_item.r(this.queryParam).then(res => {
        this.loading = false;
        if(res.data.status == '200') {
          this.list = util.buildMenu(res.data.data);
        }
      });
    },
    resetForm() {
      this.saveDialogVisible=false;
      this.editForm={};
    }
  },
}
</script>

<style scoped>
.toolBar { text-align: right; padding: 0 30px; }
.toolBar .search { float: left; width: 240px; }
.custom-tree { padding: 0 30px 0 20px; }
.custom-tree-item{flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px;}
.extendLable span{margin-right:4px;}
.extendLable .source{color:#999;font-size:14px;}
.custom-tree >>> .el-tree-node__content{ align-items: center; }
.tree-span-width { display: inline-block; width: 300px; vertical-align: middle; }
.tree-span-width.width_150 { width: 150px; }
.tree-span-width.width_sm { width: 90px; }
.tree-span-width.width_xs { width: 50px; }
.tree-span-width.width_190 { width: 190px; }
.tree-span-width.width_190,
.tree-span-width.width_150,
.tree-span-width.width_sm,
.tree-span-width.width_xs  { text-align: right; }
.table-header thead,
.table-header th { display: inline-block; }
.table-header thead,
.table-header th { width: 100%; height: 100%;text-align: right; }
.table-header .col1,
.table-header .col1 th { text-align: left; padding-left: 20px; }
</style>
