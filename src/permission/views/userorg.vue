<template>
  <div class="flex-row" v-loading="loading">
    <div class="sideBar blockLayout scrollbar">
      <orgtree ref="tree" :firstCheck="true" @firstCheckValue="default_org" @nodeClick="handleNodeClick" />
    </div>
    <div class="flex-1 blockLayout scrollbar">
      <div class="flex-row align-center toolBar">
        <div class="flex-1">
          <!-- title -->
        </div>
        <el-button v-has="port.add"
          type="primary" size="small" icon="el-icon-plus" @click="createNew(2, '添加管理员')">添加管理员</el-button>
        <el-button v-has="port.add"
          type="primary" size="small" icon="el-icon-plus" @click="createNew(1, '添加一般党员')">添加一般党员</el-button>
      </div>
      <!-- list -->
      <el-table stripe :data="list" style="width: 100%">
        <el-table-column prop="realname" label="姓名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="real_party_membership" label="身份" width="140">
          <template slot-scope="scope">{{ scope.row.real_party_membership == 1?'普通党员':(scope.row.real_party_membership == 2?'管理员':'') }}</template>
        </el-table-column>
        <el-table-column prop="org_name" label="党组织名称" show-overflow-tooltip></el-table-column>
        
        <el-table-column label="操作" align="right" width="90">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" plain v-has="port.remove" @click="handleRemove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- page -->
      <page :length="list.length" :p="queryParam.p" :pagesize="queryParam.pagesize" :total="queryParam.totalRows" @current-change="handleCurrentChange" />
    </div>
    <!-- 选党员 -->
    <member-picker ref="mpicker" :title="mtitle" :visible="mpickerDialog" :radio="false" @close="mpickerDialog=false;" @choosen="memberChoosen" />
  </div>
</template>

<script>
import * as port from "../api/userorg";

export default {
  components: {
    "org-edit": (resolve) => require(['@/permission/components/org-edit.vue'], resolve),
    memberPicker: resolve => require(["@/common/components/memberPicker.vue"], resolve)
  },
  data() {
    return {
      port,
      loading: false,
      list: [],
      currentTree: {},
      queryParam: {
        pagesize: 10,
        p: 1,
        totalRows: 0,
        keywords: '',
        org_id: ''
      },
      mpickerDialog: false,           // 党员库弹窗
      addType: '',                    // 添加类型  1-普通党员  2-管理员
      mtitle: '',                     // 选择党员弹窗标题
    };
  },
  watch: {
    currentTree: {
      handler: function(currentTree){
        if(currentTree.id){
          this.fetchData()
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
      this.queryParam.p = 1;
      this.currentTree = data;
    },
    createNew (type, title){
      this.addType = type;
      this.mpickerDialog=true;
      this.mtitle = title;
    },
    // 党员库选择之后 多选
    memberChoosen(arr) {
      // console.log('member',arr);
      if(!arr.length) {
        this.$message({ message: "请选择用户", type: "warning" });
        return
      }else {
        this.$refs.mpicker.handleClose();
      }
      let uids = []
      arr.map(a=> {
          uids.push(a.uid)
      })
      this.memberSubmit(uids, this.addType);
    },
    memberSubmit(uidArr,type) {
      let params = {
        user: uidArr,
        organization_id: this.queryParam.org_id,
        party_membership: type
      }
      port.add.r(params).then(res => {
        this.fetchData();
      });
    },
    handleRemove (item){
      this.$confirm('是否继续?').then(() => {
        port.remove.r({ uid: item.uid, party_membership: item.real_party_membership }).then((res) => {
          if(res.data.status == '200') {
            this.fetchData();
          }else {
            this.$message({ message: res.data.statusCode, type: 'error' });
          }
        })
      }).catch(()=>{})
    },
    handleCurrentChange(val) {
      this.queryParam.p = val;
      this.fetchData();
    },
    fetchData (){
      let pid = this.currentTree.id;
      this.queryParam.org_id = pid;
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
