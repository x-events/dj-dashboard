<template>
  <div class="flex-row" v-loading="loading">
    <div class="sideBar blockLayout scrollbar">
      <orgtree ref="tree" :treeSid="treeSid" :firstCheck="true" @firstCheckValue="default_org" @nodeClick="handleNodeClick" />
    </div>
    <div class="flex-1 blockLayout scrollbar">
      <div class="flex-row align-center toolBar">
        <div class="flex-1">
          <!-- title -->
        </div>
        <el-button v-has="port.save" :disabled="currentTree.status == '1'"
          type="primary" size="small" icon="el-icon-plus" @click="createNew">新增党组织</el-button>
      </div>
      <!-- list -->
      <el-table stripe :data="list" style="width: 100%">
        <el-table-column prop="name" label="党组织全称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="short_name" label="党组织简称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="type" label="党组织类别" width="140"></el-table-column>
        <el-table-column prop="relation" label="党组织隶属关系" width="120" show-overflow-tooltip></el-table-column>
        
        <el-table-column label="操作" align="right" width="150">
          <template slot-scope="scope">
            <el-button size="mini" plain type="primary" v-has="port.save" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" plain v-has="port.remove" v-if="scope.row.id != 1" @click="handleRemove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- page -->
      <page :length="list.length" :p="queryParam.p" :pagesize="queryParam.pagesize" :total="queryParam.totalRows" @current-change="handleCurrentChange" />
      <!-- 弹窗 -->
      <el-drawer
        title="党组织信息"
        :visible.sync="dialogVisible"
        direction="rtl"
        size="960px"
        @closed="closeDialog"
        >
        <org-edit
        :data="editForm" @cancel="closeDialog()"
        :dialogVisible="dialogVisible"
        @submit="closeDialog();fetchData();$refs.tree.fetchTree();"></org-edit>
      </el-drawer>
    </div>
  </div>
</template>

<script>
import * as port from "../api/orgmanager";

export default {
  components: {
    "org-edit": (resolve) => require(['@/permission/components/org-edit.vue'], resolve)
  },
  data() {
    return {
      port,
      dialogVisible: false,
      loading: false,
      list: [],
      currentTree: {},
      editForm: {
        short_name: '',
        name: '',
        relation: '',
        relation_name: '',
        pid: '',
        pid_name: '',
        level: '',
        type: '',
        status: '0',
        type_name: '',
        cover_com_num: '',
        cover_person_num: '',
        cover_com_name: '',
        cover_building_name: '',
        secretary: '',
        company: '',
        approve_at: '',
        number: '',
        reason: '',
        tenure: '',
        community_id: '',
        community_name: '',
        addr: '',
        tel: '',
        contacts: '',
        change_time: '',
        code: '',
        sort: '',
        group_num: '',
        org_num: '',
        remark: '',
        lat: "",
        lng: "",
        address: [{
            lat: "39.92474600",
            lng: "116.48578600"
        }],
        address: [],
        zuobiao: '',
      },
      queryParam: {
        pagesize: 10,
        p: 1,
        totalRows: 0,
        keywords: '',
        pid: ''
      },
      treeSid: {},          // 选择当前树id 刷新树之后好继续操作
    };
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
      deep: true
    }
  },
  methods: {
    //默认请求
    default_org(org){
      if(org){
        this.currentTree = org;
      }
    },
    handleNodeClick(data) {
      this.currentTree = data;
      this.treeSid = data;
    },
    createNew (){
      this.dialogVisible=true;
      let org = {}
      org.pid = this.currentTree.id;
      org.pid_name = this.currentTree.short_name;
      this.editForm = Object.assign({}, this.editForm, org)
    },
    handleRemove (item){
      this.$confirm('是否继续?').then(() => {
        port.remove.r({ id: item.id }).then((res) => {
          if(res.data.status == '200') {
            this.fetchData()
            this.$refs.tree.fetchTree()
          }else {
            this.$message({ message: res.data.statusCode, type: 'error' });
          }
        })
      }).catch(()=>{})
    },
    handleEdit (item){
      if(item.id){
        this.editForm = item;
      }
      this.dialogVisible = true;
    },
    closeDialog(){
      this.dialogVisible=false;
      this.editForm={}
    },
    handleCurrentChange(val) {
      this.queryParam.p = val;
      this.fetchData();
    },
    fetchData (reload){
      let pid = this.currentTree.id;
      this.queryParam.pid = pid;
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
  },
  created: function() {
    this.fetchData();
  }
};
</script>

<style scoped>
>>> .el-drawer .el-drawer__body { height: calc(100% - 100px); }
</style>
