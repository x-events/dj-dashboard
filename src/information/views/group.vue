<template>
  <div class="flex-row" v-loading="loading">
    <div class="sideBar blockLayout">
      <orgtree ref="tree" :isSearch="true" :firstCheck="true" @firstCheckValue="default_org" @nodeClick="handleNodeClick" />
    </div>
    <div class="flex-1 blockLayout scrollbar">
      <div class="flex-row align-center toolBar">
        <div class="flex-1">
          <!-- title -->
        </div>
        <el-input v-has="port.list" v-model="queryParam.keywords" @keyup.native.enter="fetchData(true)"
        placeholder="请输入组织名称" size="small" class="search"></el-input>
        <el-button v-has="port.list" @click="fetchData(true)" type="primary" size="small">查询</el-button>
      </div>
      <!-- list -->
      <el-table stripe :data="list" style="width: 100%">
        <el-table-column prop="name" label="党组织简称" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sum" label="成员人数" width="120"></el-table-column>
        <el-table-column prop="created_at" label="创建时间" width="130">
          <template slot-scope="scope">{{ scope.row.created_at | date() }}</template>
        </el-table-column>
        
        <el-table-column label="操作" align="right" width="200">
          <template slot-scope="scope">
            <el-button size="mini" plain type="primary" v-has="port.memberlist" @click="memberAuthClick(scope.row)">成员管理</el-button>
            <el-button size="mini" type="primary" plain v-has="record.chatlist" @click="showChatlist(scope.row)">聊天记录</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- page -->
      <!-- <page :length="list.length" :p="queryParam.p" :pagesize="queryParam.pagesize" :total="queryParam.totalRows" @current-change="handleCurrentChange" /> -->
      <!-- 聊天记录弹窗 -->
      <el-drawer
        :title="`党员消息记录/${currentTable.name}`"
        :visible.sync="dialogVisible"
        direction="rtl"
        size="960px"
        @close="closeDialog">
        <chatRecord :data="currentTable" @back="closeDialog" />
      </el-drawer>
      <!-- 成员管理弹窗 -->
      <el-drawer
        :title="`群组管理/${memberForm.name}`"
        :visible.sync="memberDialogVisible"
        direction="rtl"
        size="900px"
        append-to-body
        @close="closeDialog">
        <div class="flex-col" style="height:100%;">
          <div class="demo-drawer__footer toolBar">
          <el-input v-has="port.memberlist" v-model="queryParam2.keywords" @keyup.native.enter="queryParam2.p = 1;getMemberList(memberForm.group_id, true)"
            placeholder="请输入成员姓名/身份证号" size="small" class="search"></el-input>
          <el-button v-has="port.memberlist" @click="queryParam2.p = 1;getMemberList(memberForm.group_id, true)" type="primary" size="small">查询</el-button>
            <el-button v-has="port.create" type="primary" size="small" icon="el-icon-plus" @click="mpickerDialog = true">新增成员</el-button>
          </div>
          <div class="demo-drawer__content flex-1" style="overflow:auto">
            <el-table stripe :data="memberlist" style="width: 100%">
              <el-table-column type="index" width="50"></el-table-column>
              <!-- <el-table-column prop="id" label="成员ID" show-overflow-tooltip></el-table-column> -->
              <el-table-column prop="realname" label="成员姓名" width="150" show-overflow-tooltip></el-table-column>
              <el-table-column prop="card" label="身份证号" width="160"></el-table-column>
              <el-table-column prop="sex" label="性别" width="50">
                <template slot-scope="scope">{{scope.row.sex=='0' ? '男':(scope.row.sex == '1'?'女':'')}}</template>
              </el-table-column>
              <el-table-column prop="created_at" label="加入时间" width="130">
                <template slot-scope="scope">{{ scope.row.created_at | date() }}</template>
              </el-table-column>
              <el-table-column prop="org_name" label="所在党组织" show-overflow-tooltip></el-table-column>

              <el-table-column label="操作" width="90" align="right">
                <template slot-scope="scope">
                  <el-button v-has="port.remove" size="mini" type="danger" plain @click="removeMember(scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <!-- page -->
          <page :length="memberlist.length" :p="queryParam2.p" :pagesize="queryParam2.pagesize" :total="queryParam2.totalRows" @current-change="handleCurrentChange2" />
        </div>
      </el-drawer>
      <!-- 选党员 -->
      <member-picker ref="mpicker" :visible="mpickerDialog" :radio="false" @close="mpickerDialog=false" @choosen="memberChoosen" />
    </div>
  </div>
</template>

<script>
import * as port from "../api/group";
import * as record from "../api/record";

export default {
  components: {
    "chatRecord": (resolve) => require(['../components/chatRecord.vue'], resolve),
    memberPicker: resolve => require(["@/common/components/memberPicker.vue"], resolve),
  },
  data() {
    return {
      port, record,
      dialogVisible: false,
      loading: false,
      list: [],
      currentTree: {},
      queryParam: {
        // pagesize: 10,
        // p: 1,
        // totalRows: 0,
        keywords: '',
        node: ''
      },
      queryParam2: {      // 成员管理弹窗 中列表
        pagesize: 10,
        p: 1,
        totalRows: 0,
        keywords: ''
      },
      currentTable: {},
      memberDialogVisible: false,   // 成员管理弹窗
      mpickerDialog: false,
      memberlist: [],
      memberForm: {},
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
    },
  },
  methods: {
    // 点击成员授权
    memberAuthClick(row) {
      this.memberForm.name = row.name;
      this.memberForm.group_id = row.id;
      this.getMemberList(row.id, true);
    },
    // 获取成员列表
    getMemberList(id, isDia) {
      //this.memberlist = [];
      let params = Object.assign({}, this.queryParam2, {group_id: id})
      port.memberlist.r(params).then(res => {
        this.memberDialogVisible = isDia;
        this.memberlist = res.data.data;
        this.queryParam2.pagesize = res.data.pageSize;
        this.queryParam2.totalRows = res.data.totalRows;        
      });
    },
    // 党员库选择之后 多选
    memberChoosen(arr) {
      // console.log('member',arr);
      if(!arr.length) {
        this.$message({ message: "请选择用户", type: "warning" });
        return
      }else {
        this.mpickerDialog = false;
        //this.$refs.mpicker.handleClose();
      }
      
      setTimeout(() => {
        this.memberSubmit(arr.map(e => e.uid), this.memberForm.group_id);
      }, 200)
    },
    memberSubmit(uidArr,gid) {
      let params = {
        group_id: gid,
        users: uidArr,
      }
      port.create.r(params).then(res => {
        this.getMemberList(gid, true);
        this.fetchData();
      });
    },
    // 成员管理-删除
    removeMember(item) {
      if (!item) {
        return null;
      }
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        port.remove.r(item).then(res => {
          if(res.data.status == '200') {
            this.getMemberList(item.group_id, true);
            this.$message({ message: "删除成功", type: "success" });
            this.fetchData();
          }
        });
      });
    },
    // 查看聊天记录
    showChatlist(row) {
      this.dialogVisible = true;
      this.currentTable = row;
    },
    //默认请求
    default_org(org){
      if(org){
        this.currentTree = org;
      }
    },
    handleNodeClick(data) {
      this.currentTree = data;
    },
    closeDialog(){
      this.dialogVisible=false;
      this.currentTable = {};
      this.memberDialogVisible = false;
      this.memberForm = {};
      this.queryParam2 = {};
      this.memberlist = [];
    },
    // 成员管理弹窗  列表分页
    handleCurrentChange2(val) {
      this.queryParam2.p = val;
      this.getMemberList(this.memberForm.group_id, true);
    },
    handleCurrentChange(val) {
      this.queryParam.p = val;
      this.fetchData();
    },
    fetchData (reload){
      let pid = this.currentTree.id;
      this.queryParam.node = pid;
      if (reload) {
        this.queryParam.p = 1;
      }
      this.loading = true;
      port.list.r(this.queryParam).then(res => {
        this.loading = false;
        this.list = res.data.data
        // this.queryParam.totalRows = res.data.totalRows;        
      })
    },
  },
  created: function() {
    this.fetchData();
  }
};
</script>

<style scoped>
>>> .el-drawer .el-drawer__body { height: calc(100% - 100px); }
.demo-drawer__content,
.demo-drawer__footer { padding: 0 20px; }
</style>
