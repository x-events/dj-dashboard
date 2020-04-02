<template>
  <div class="scrollbar blockLayout" v-loading="loading" id="examList">
    <div class="flex-row align-center toolBar">
        <div class="flex-1">
          <el-radio-group v-model="queryParam.sjlx" size="small" @change="queryParam.year = new Date().getFullYear();queryParam.status=0;queryParam.sjmc='';queryParam.p=1;fetchData()">
            <el-radio-button :label="1">正式考试</el-radio-button>
            <el-radio-button :label="0">模拟考试</el-radio-button>
          </el-radio-group>
        </div>

        <el-form :inline="true" :model="queryParam" size="small" class="myform" v-has="port.examPapersIndex">
          <el-form-item label="时间">
            <el-select v-model="queryParam.year" style="width:100px;">
              <el-option v-for="item in yearNumbers" :key="'year' + item" :label="item+'年'" :value="item"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态">
            <el-select v-model="queryParam.status" style="width:100px;">
              <el-option v-for="item in statusHash" :key="'status' + item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-input v-model="queryParam.sjmc" placeholder="请输入考试名称" style="width: 180px;"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" icon="el-icon-search" @click="fetchData()">查询</el-button>
          </el-form-item>
        </el-form>
        
        <el-button v-has="port.examPapersCreate" type="primary" size="small" icon="el-icon-plus" @click="createNew()">创建考试</el-button>
    </div>
    
    <el-table stripe :data="list" style="width: 100%">
      <el-table-column label="名称" show-overflow-tooltip>
        <template slot-scope="scope">
          <a class="link" @click="preview(scope.row)">{{scope.row.sjmc}}</a>
        </template>
      </el-table-column>
      <el-table-column label="信息" align="center" width="320">
        <template slot-scope="scope">
          <div>
            <el-tag type="info">总分：{{scope.row.sjzf}}</el-tag>
            <el-tag type="info">及格分：{{(scope.row.sjzf*scope.row.jgxbfb/100).toFixed(1)}}</el-tag>
            <el-tag type="info">时长：{{scope.row.kssc}}分钟</el-tag>
          </div>
          <div>
            <el-tag type="info">组卷形式： {{scope.row.zjfs | typeText}}</el-tag>
            <el-tag type="info">可考人数： {{scope.row.student_amount}}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="address" align="center" label="时间" min-width="190">
        <template slot-scope="scope">
          <div>
            <el-tag type="info">开放时间：{{scope.row.open_time | date}}</el-tag>
          </div>
          <div>
            <el-tag type="info">开始时间：{{scope.row.kskssj | date}}</el-tag> 
          </div>
          <div>
            <el-tag type="info">结束时间：{{scope.row.jskssj | date}}</el-tag>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="status_text" align="center" min-width="100" label="状态">
        <template slot-scope="scope">
          <el-tag effect="plain" type="success" v-if="scope.row.status_code == '0'">{{scope.row.status_text}}</el-tag>
          <el-tag effect="plain" type="info" v-else>{{scope.row.status_text}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="address" width="300" label="操作">
        <template slot-scope="scope">
          <el-button v-has="port.examPapersUpdate" size="mini" :type="scope.row.rec_flag == 0 ? 'danger':'primary'" @click="handleStatus(scope.row)">{{scope.row.rec_flag==0 ? '下架':'上架'}}</el-button>
          <el-button size="mini" plain @click="statistics(scope.row)">结果分析</el-button>
          <el-button v-has="port.examPapersUpdate" size="mini" plain  type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button v-has="port.examPapersDelete" size="mini" plain type="danger" v-if="scope.row.rec_flag!=0" @click="handleRemove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- page -->
    <page :length="list.length" :p="queryParam.p" :pagesize="queryParam.pagesize" :total="totalRows" @current-change="handleCurrentChange" />
  </div>
</template>

<script>
import * as port from "@/learn/api/exam";

export default {
  data() {
    return {
      port,
      loading:true,
      currentYear:new Date().getFullYear(),
      queryParam:{
        year: new Date().getFullYear(),
        status: 0,        // 0-全部 1-未开始 2-进行中 3-已结束
        sjmc: "",         // 名称
        sjlx: 1,           // 1 正式 2 模拟
        p: 1,
        pagesize:10
      },
      totalRows:0,
      list:[],
      statusHash: [{
        label: '全部',
        value: 0
      },{
        label: '未开始',
        value: 1
      },{
        label: '进行中',
        value: 2
      },{
        label: '已结束',
        value: 3
      }]
    };
  },
  computed: {
    yearNumbers: function(){
      return [this.currentYear + 1, this.currentYear, this.currentYear -1, this.currentYear -2, this.currentYear - 3]
    }
  },
  filters: {
    typeText: function(val){
      // 0-上传试卷，1-在线制作，2-自动组卷，3-手动组卷
      const hash = {
        "0": "上传试卷",
        "1": "在线制作",
        "2": "自动组卷",
        "3": "手动组卷"
      }

      return hash[val]
    }
  },
  methods: {
    handleCurrentChange(currentPage) {
      this.queryParam.p = currentPage;
      document.getElementById('examList').scrollTop = 0;
      this.fetchData();
    },
    statistics(item) {
      if(item.sjid){
        this.$router.push({name: '考试结果分析', query: {id: item.sjid}})
      }
    },
    createNew(){
      this.$router.push({name:'创建考试',query:{step:1}});
    },
    handleStatus(item){
      // -1:下架  0:上架
      let rec_flag = 0;
      if(item.rec_flag == 0){
        rec_flag = -1
      }else{
        rec_flag = 0
      }
      this.$confirm('是否继续?').then(() => {
        port.examPapersUpdate.r({sjid:item.sjid,sjmc:item.sjmc,rec_flag:rec_flag}).then((res) => {
          this.$message.success(res.data.message);
          this.fetchData();
        })
      }).catch(()=>{})
    },
    handleEdit(item){
      if(item.sjid){
        this.$router.push({name:'创建考试',query:{step:1,examType:'edit',sjid:item.sjid}});
      }
    },
    handleRemove(item){
      if(!item.sjid){
        return
      }
      this.$confirm('是否继续?').then(() => {
        port.examPapersDelete.r({sjid:item.sjid}).then((res) => {
          this.$message.success(res.data.message);
          this.fetchData();
        })
      }).catch(() => {});
    },
    preview(item){
      if (item.sjid) {
        this.$router.push({name:'考试预览',query:{id:item.sjid}});
      }
    },
    fetchData() {
      this.loading = true;
      port.examPapersIndex.r(this.queryParam).then(res => {
        let result = res.data;
        this.loading = false;
        this.list = result.data;
        this.totalRows = result.totalRows;
      });
    }
  },
  created: function() {
    this.fetchData();
  }
};
</script>

<style scoped>
.myform >>> .el-form-item{margin-bottom: 0;}
.el-tag { margin:2px 3px;}
.el-tag--plain { border:0; background-color:transparent; font-weight:bold;}
</style>