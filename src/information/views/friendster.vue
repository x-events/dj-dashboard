<template>
  <div class="blockLayout scrollbar">
    <div class="flex-row align-center toolBar">
      <div class="flex-1">
        <!-- title -->
      </div>
      <div class="date">
        <span>发送时间：</span>
        <el-date-picker v-model="queryParam.start_at" size="small" style="width:130px;" type="date" value-format="yyyy-MM-dd" placeholder="开始日期"></el-date-picker>
        -
        <el-date-picker v-model="queryParam.end_at" size="small" style="width:130px;" type="date" value-format="yyyy-MM-dd" placeholder="结束日期" class="search"></el-date-picker>
      </div>
      <el-input v-has="port.list" v-model="queryParam.title" placeholder="请输入发布人姓名或关键字" size="small" class="search"></el-input>
      <el-button v-has="port.list" @click="query" size="small" type="primary">查询</el-button>
    </div>
    <!-- list -->
    <el-table stripe :data="list" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-suffix="：" class="demo-table-expand">
            <el-form-item label="内容">
              <span v-html="props.row.body"></span>
            </el-form-item>
            <el-form-item label="" v-if="props.row.img_list.length > 0">
              <div class="table-expand-img">
                <img :src="item" v-for="(item, index) in props.row.img_list" :key="index" @click="dialogVisible = true;dialogImageUrl=item">
              </div>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column prop="user_avatar" label="" width="50">
        <template slot-scope="scope"><img class="head-icon" :src="scope.row.user_avatar"></template>
      </el-table-column>
      <el-table-column prop="user_name" label="姓名" width="90" show-overflow-tooltip></el-table-column>
      <el-table-column prop="body" label="内容" show-overflow-tooltip>
        <template slot-scope="scope"><span v-html="scope.row.body"></span></template>
      </el-table-column>
      <el-table-column prop="part_name" label="所属党支部" show-overflow-tooltip></el-table-column>
      <el-table-column prop="created_at" label="发送时间" width="100">
        <template slot-scope="scope">{{ scope.row.created_at | date('day') }}</template>
      </el-table-column>

      <el-table-column label="操作" align="right" width="90">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" plain v-has="port.remove" @click="handleRemove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- page -->
    <page :length="list.length" :p="queryParam.p" :pagesize="queryParam.pagesize" :total="queryParam.totalRows" @current-change="handleCurrentChange" />
    <!-- 放大图片弹窗 -->
    <el-dialog :visible.sync="dialogVisible" style="text-align:center">
      <img :src="dialogImageUrl" alt="" style="max-height:400px;width:auto;">
    </el-dialog>
  </div>
</template>

<script>
import * as port from "../api/friendster";

export default {
  data () {
    return {
      port,
      list: [],
      queryParam: {
        pagesize: 10,
        p: 1,
        totalRows: 0,
        title: '',
        start_at: '',
        end_at: ''
      },
      dialogVisible: false,
      dialogImageUrl: '',
      // delIds: {},
    }
  },
  methods: {
    // 表格多选
    /* handleSelectionChange (selection){
      let uids = []
      selection.map(a=> { uids.push(a.id) })
      this.delIds = { id: uids };
    },  */
    // 点击查询
    query() {
      if(this.queryParam.start_at?(this.queryParam.end_at?(this.queryParam.start_at > this.queryParam.end_at):''):'') {
        this.$message({ message: "开始时间不能大于结束时间", type: "warning" });
        return
      }else if((!this.queryParam.start_at && this.queryParam.end_at) || (this.queryParam.start_at&&!this.queryParam.end_at)) {
        this.$message({ message: "开始时间和结束时间不能为空", type: "warning" });
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
.head-icon { border-radius: 50%; overflow: hidden; width: 40px; height: 30px; }
.table-expand-img img { max-width: 150px; max-height: 150px; margin-right: 20px; margin-bottom: 20px; }
</style>
