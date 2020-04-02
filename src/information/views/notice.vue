<template>
  <div class="blockLayout scrollbar">
    <div class="flex-row align-center toolBar">
      <div class="flex-1">
        <!-- title -->
        <el-button size="mini" type="danger" plain v-has="port.remove" 
          :disabled="!(delIds.id && delIds.id.length>0)" @click="handleRemove(delIds)">批量删除</el-button>
      </div>
      <span>优先级：</span>
      <el-select v-model="queryParam.level" placeholder="全部" size="small" clearable class="search" style="width:80px;">
          <el-option :label="item.name" :value="item.value" :key="index" v-for="(item, index) in levelData"></el-option>
      </el-select>
      <div class="date">
        <span>发送时间：</span>
        <el-date-picker v-model="queryParam.start_at" size="small" style="width:130px;" type="date" value-format="yyyy-MM-dd" placeholder="开始日期"></el-date-picker>
        -
        <el-date-picker v-model="queryParam.end_at" size="small" style="width:130px;" type="date" value-format="yyyy-MM-dd" placeholder="结束日期" class="search"></el-date-picker>
      </div>
      <el-input v-has="port.list" v-model="queryParam.title" placeholder="请输入通知公告标题" size="small" class="search"></el-input>
      <el-button v-has="port.list" @click="query" size="small" type="primary">查询</el-button>
    </div>
    <!-- list -->
    <el-table stripe :data="list" style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="title" label="通知标题" show-overflow-tooltip></el-table-column>
      <el-table-column prop="user_name" label="发送人" width="100" show-overflow-tooltip></el-table-column>
      <el-table-column prop="level" label="优先级" width="70">
        <template slot-scope="scope">
          <span v-if="scope.row.level == 1">极高</span>
          <span v-else-if="scope.row.level == 2">较高</span>
          <span v-else-if="scope.row.level == 3">普通</span>
        </template>
      </el-table-column>
      <el-table-column prop="created_at" label="发送时间" width="130">
        <template slot-scope="scope">{{ scope.row.created_at | date() }}</template>
      </el-table-column>
      <el-table-column prop="user_count" label="接收人" width="80">
        <template slot-scope="scope">{{  scope.row.user_count }}人</template>
      </el-table-column>
      
      <el-table-column label="操作" align="right" width="200">
        <template slot-scope="scope">
          <!-- 阅读回执 0-关闭  1-开启 -->
          <el-button size="mini" plain type="primary" v-has="port" v-if="scope.row.receipt == 1" @click="handleEdit(scope.row)">查看阅读回执</el-button>
          <el-button size="mini" type="danger" plain v-has="port.remove" @click="handleRemove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- page -->
    <page :length="list.length" :p="queryParam.p" :pagesize="queryParam.pagesize" :total="queryParam.totalRows" @current-change="handleCurrentChange" />
    <!-- 阅读回执弹窗 -->
    <el-drawer
      title="阅读回执"
      :visible.sync="dialogVisible"
      direction="rtl"
      size="960px"
      @close="resetForm">
      <readReceipt :data="editForm" />
    </el-drawer>
  </div>
</template>

<script>
import * as port from "../api/notice";

export default {
  components: {
    "readReceipt": (resolve) => require(['@/information/components/readReceipt.vue'], resolve)
  },
  data () {
    return {
      port,
      list: [],
      queryParam: {
        pagesize: 10,
        p: 1,
        totalRows: 0,
        title: '',
        level: '',
        start_at: '',
        end_at: ''
      },
      editForm: {},
      dialogVisible: false,
      levelData: [{
        name: '极高',
        value: '1'
      },{
        name: '较高',
        value: '2'
      },{
        name: '普通',
        value: '3'
      }],
      delIds: {},
    }
  },
  methods: {
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
    handleEdit (row){
      this.editForm = row;
      this.dialogVisible = true;
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
    resetForm (){
      this.editForm = {};
      this.dialogVisible = false;
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
