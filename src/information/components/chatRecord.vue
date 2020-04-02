<template>
  <div class="flex-col" style="height:100%;" v-loading="loading">
    <div class="demo-drawer__footer title el">{{ title }}</div>
    <div class="demo-drawer__content flex-1" style="overflow:auto">
      <el-table stripe :data="list" height="100%" style="width: 100%">
        <el-table-column prop="user" label="姓名" width="180" show-overflow-tooltip></el-table-column>
        <el-table-column prop="body" label="内容" min-width="120">
          <template slot-scope="scope">
            <img class="table-img" :src="scope.row.body" v-if="scope.row.type == -2"> 
            <span v-else>{{ scope.row.body }}</span>   
          </template>
        </el-table-column>
        <el-table-column prop="time" label="发送时间" width="150"></el-table-column>
      </el-table>
    </div>
    <div class="demo-drawer__footer btn_footer">
      <el-button :disabled="queryParam.page==1" @click="changePage('prev')">上一页</el-button>
      <el-button :disabled="list.length<queryParam.pagesize" @click="changePage('next')">下一页</el-button>
      <el-button @click="$emit('back')">返回</el-button>
    </div>
  </div>
</template>

<script>
import * as port from "../api/record";

export default {
  props: {
    data: {
      type: Object,
      required: false,
      default: function(){
        return {}
      }
    },
    title: ''
  },
  data() {
    return {
      loading: false,
      list: [],
      queryParam: {
        group_id: '',
        page: 1,
        pagesize: 10
      }
    }
  },
  watch: {
    data: {
      handler: function(data){
        if(data && data.id){
          this.queryParam.group_id = data.id;
          this.queryParam.page = 1;
          this.$nextTick(()=>{
            this.fetchData()
          })
        }
      },
      deep: true, 
      immediate: true
    }
  },
  methods: {
    changePage(tag) {
      if(tag == 'prev') { // 上一页
        this.queryParam.page --;
      } else if(tag == 'next') {
        this.queryParam.page ++;
      }
      this.fetchData();
    },
    fetchData() {
      // 获取聊天记录
      this.loading = true;
      port.chatlist.r(this.queryParam).then(res => {
        this.loading = false;
        if(res.data.status == '200') {
          this.list = res.data.data;
        }
      });
    }
  },
}
</script>

<style scoped>
.flex-col > div { padding: 0 20px; }
.btn_footer { text-align: center; line-height: 50px; }
.el-table .table-img { max-width: 100%; }
</style>
