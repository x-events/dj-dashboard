<template>
  <div class="flex-col" style="height:100%;" v-loading="loading">
    <div class="demo-drawer__footer btn_footer">
      <el-form ref="editForm" :model="editForm" label-width="90px" size="mini" label-suffix="：">
        <el-form-item label="通知标题"><div class="el">{{ editForm.title }}</div></el-form-item>
        <el-form-item label="发送时间">{{ editForm.created_at | date() }}</el-form-item>
      </el-form>
    </div>
    <div class="demo-drawer__content flex-1" style="overflow:auto">
      <!-- list -->
      <el-table stripe :data="list" style="width: 100%">
        <el-table-column prop="user_name" label="接收人姓名"></el-table-column>
        <el-table-column prop="part_name" label="所属党组织" min-width="90" show-overflow-tooltip></el-table-column>
        <el-table-column prop="is_read" label="是否查阅" width="80">
          <template slot-scope="scope">
            <span v-if="scope.row.is_read == 0">否</span>
            <span v-else-if="scope.row.is_read == 1">是</span>
          </template>
        </el-table-column>
        <el-table-column prop="updated_at" label="查阅时间" width="130">
          <template slot-scope="scope">{{ scope.row.updated_at | date() }}</template>
        </el-table-column>
      </el-table>
    </div>
    <div class="demo-drawer__footer btn_footer">
      <!-- page -->
      <page :length="list.length" :p="queryParam.p" :pagesize="queryParam.pagesize" :total="queryParam.totalRows" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import * as port from "../api/notice";

const TEMP = {
  title: '',
  created_at: ''
}

export default {
  props: {
    data: {
      type: Object,
      required: false,
      default: function(){
        return {}
      }
    },
  },
  data() {
    return {
      loading: true,
      queryParam: {
        pagesize: 10,
        p: 1,
        totalRows: 0,
        id: '',
        notice_id: ''
      },
      list: [],
      editForm: TEMP
    }
  },
  watch: {
    data: {
      handler: function(data){
        if(data && data.id){
          this.queryParam.p = 1;
          this.queryParam.id = data.id;
          this.queryParam.notice_id = data.id;
          this.$nextTick(()=>{
            this.fetchData()
            this.fetchDetail()
          })
        }else{
          this.editForm = Object.assign({}, TEMP, data)
        }
      },
      deep: true, 
      immediate: true
    },
  },
  methods: {
    handleCurrentChange: function(currentPage) {
      this.queryParam.p = currentPage;
      this.fetchData();
    },
    fetchData: function(reload) {
      if (reload) {
        this.queryParam.p = 1;
      }
      this.loading = true;
      port.receivelist.r(this.queryParam).then(res => {
        this.loading = false;
        this.list = res.data.data;
        this.queryParam.pagesize = res.data.pageSize;
        this.queryParam.totalRows = res.data.totalRows;
      });
    },
    fetchDetail: function(reload) {
      this.loading = true;
      port.detail.r(this.queryParam).then(res => {
        this.loading = false;
        this.editForm = res.data.data;
      });
    },
  },
}
</script>

<style scoped>
.flex-col > div { padding: 0 20px; }
</style>
