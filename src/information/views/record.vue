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
        <el-input v-has="port.listindex" v-model="queryParam.keywords" @keyup.native.enter="fetchData(true)"
          placeholder="请输入姓名" size="small" class="search"></el-input>
        <el-button v-has="port.listindex" @click="fetchData(true)" type="primary" size="small">查询</el-button>
      </div>
      <!-- list -->
      <el-table stripe :data="list" style="width: 100%">
        <el-table-column prop="card" label="账号" width="160"></el-table-column>
        <el-table-column prop="user_name" label="姓名" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sex" label="性别" width="50"></el-table-column>
        <el-table-column prop="short_org_name" label="所属党支部" min-width="150" show-overflow-tooltip></el-table-column>
        
        <el-table-column label="操作" align="right" width="100">
          <template slot-scope="scope">
            <el-button size="mini" plain type="primary" v-has="port.list" @click="showChatlist(scope.row)">聊天记录</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- page -->
      <!-- <page :length="list.length" :p="queryParam.p" :pagesize="queryParam.pagesize" :total="queryParam.totalRows" @current-change="handleCurrentChange" /> -->
      <el-drawer
        :title="`党员消息记录/${currentChat.user_name}`"
        :visible.sync="dialogVisible"
        direction="rtl"
        size="600px"
        @close="closeDialog">
        <div class="flex-col drawer" style="height:100%;" v-loading="loading">
          <div class="demo-drawer__content flex-1" style="overflow:auto">
            <el-table stripe :data="chatlist" style="width: 100%" class="authTable">
              <el-table-column type="index" width="50" label="序号"></el-table-column>
              <el-table-column prop="org_name" label="接收人/群名称" show-overflow-tooltip></el-table-column>
              <el-table-column prop="type" label="群类型" width="80">
                <template slot-scope="scope">
                  <span v-if="scope.row.type == 1">群聊</span>
                  <span v-else-if="scope.row.type == 2">单聊</span>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="100" align="right">
                <template slot-scope="scope">
                  <el-button v-has="port.chatlist" size="mini" type="primary" plain @click="showRecord(scope.row)">查看详情</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <!-- page -->
          <page :length="chatlist.length" :p="queryParam2.p" :pagesize="queryParam2.pagesize" :total="queryParam2.totalRows" @current-change="handleCurrentChange2" />
        </div>
      </el-drawer>
      <!-- 聊天记录弹窗 -->
      <el-drawer
        :title="`党员消息记录/${currentChat.user_name}/${currentRecord.org_name}`"
        :visible.sync="recordDialogVisible"
        direction="rtl"
        size="960px"
        @close="closeDialog2">
        <chatRecord :data="currentRecord" @back="closeDialog2" />
      </el-drawer>
    </div>
  </div>
</template>

<script>
import * as port from "../api/record";

export default {
  components: {
    "chatRecord": (resolve) => require(['../components/chatRecord.vue'], resolve)
  },
  data() {
    return {
      port,
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
      chatlist: [],     // 弹窗聊天列表（接收人）
      currentChat: {},  // 当前选中列表(第一列表选中)
      recordDialogVisible: false,
      currentRecord: {},  // 当前选中 查看聊天记录（第二列表选中）
      queryParam2: {
        pagesize: 10,
        p: 1,
        totalRows: 0,
      },
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
    // 查看记录（第二列表点击）
    showRecord(row) {
      this.recordDialogVisible = true;
      this.currentRecord = row;
    },
    // 查看聊天列表(第一列表点击)
    showChatlist(row) {
      this.currentChat = row;
      this.chatlist = [];
      this.getList2(row.user_id, true);
    },
    // 获取第二列表数据
    getList2(id, isDia) {
      let params = Object.assign({}, this.queryParam2, {user_id: id})
      port.list.r(params).then(res => {
        this.dialogVisible = isDia;
        this.$nextTick(()=>{
          this.chatlist = res.data.data;
        })
        // this.queryParam2.pagesize = res.data.pageSize;
        this.queryParam2.totalRows = res.data.totalRows;  
      });
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
      this.currentChat={}
      this.queryParam2.p = 1;
    },
    // 聊天记录关闭(列表3)
    closeDialog2(){
      this.recordDialogVisible=false;
      this.currentRecord={}
    },
    // 列表2分页
    handleCurrentChange2(val) {
      this.queryParam2.p = val;
      this.getList2(this.currentChat.user_id, true);
    },/* 
    resetForm (){
      this.centerPoint = this.$root.mapcenter;
      this.editForm={}
      this.$refs['editForm'] && this.$refs['editForm'].resetFields();
    }, */
    handleCurrentChange(val) {
      this.queryParam.p = val;
      this.fetchData();
    },
    fetchData (reload){
      let pid = this.currentTree.id;
      this.queryParam.node = pid;
      // if(!process_category_id){
      //   return console.warn('参数错误')
      // }
      if (reload) {
        this.queryParam.p = 1;
      }
      this.loading = true;
      port.listindex.r(this.queryParam).then(res => {
        this.loading = false;
        this.list = res.data.data
        // this.queryParam.totalRows = res.data.totalRows;        
      })
    }
  },
  created: function() {
    // this.fetchData();
  }
};
</script>

<style scoped>
>>> .el-drawer .el-drawer__body { height: calc(100% - 100px); }
.drawer,
.demo-drawer__footer { padding: 0 20px; }
</style>
