<template>
  <div class="scrollbar " v-loading="loading">
    <div class="toolBar hd blockLayout" v-if="info.sjlx == 1">
      <h2 class="_T">{{info.sjmc}}</h2>
      <div class="flex-row">
        <div class="flex-1">
          <h3 class="_t">考试时间</h3>
          <div class="_p">
            <div>开始时间：{{info.kskssj | date}}</div>
            <div>结束时间：{{info.jskssj | date}}</div>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="_t">答卷时长</h3>
          <div class="_p">
            {{info.kssc}}分钟
          </div>
        </div>
        <div class="flex-1">
          <h3 class="_t">考试人数</h3>
          <div class="_p">
            <div>总人数：{{info.count}}</div>
            <div>参加考试：{{info.do_count}} | <span style="font-weight:700;color:red;">未参加考试：{{info.do_not_count}}</span></div>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="_t">及格率</h3>
          <div class="_p" >
            <div>{{info.success_percent}} %</div>
            <div>及格：{{info.success_count}} | <span style="font-weight:700;color:red;">不及格：{{info.fail_count}}</span></div>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="_t">平均分</h3>
          <div class="_p" >
            <div>{{info.score_average}}</div>
            <div>总分：{{info.sjzf}} | <span style="font-weight:700;color:red;">及格分：{{(info.sjzf*info.jgxbfb/100).toFixed(1)}}</span></div>

          </div>
        </div>
      </div>
    </div>
    <div class="toolBar hd blockLayout" v-if="info.sjlx == 0">
      <h2 class="_T">{{info.sjmc}}</h2>
      <div class="flex-row">
        <div class="flex-1">
          <h3 class="_t">考试时间</h3>
          <div class="_p">
            <div v-if="+info.kskssj">开始时间：{{info.kskssj | date}}</div>
            <div v-if="+info.jskssj">结束时间：{{info.jskssj | date}}</div>
            <div v-if="!+info.kskssj && !+info.jskssj">无限制</div>
          </div>
        </div>
        <div class="flex-1">
          <h3 class="_t">总分</h3>
          <div class="_p">
            {{info.sjzf}}
          </div>
        </div>
        <div class="flex-1">
          <h3 class="_t">及格分</h3>
          <div class="_p">
            {{(info.sjzf*info.jgxbfb/100).toFixed(1)}}
          </div>
        </div>
        <div class="flex-1">
          <h3 class="_t">答卷时长</h3>
          <div class="_p">
            {{info.kssc}}分钟
          </div>
        </div>
        <div class="flex-1">
          <h3 class="_t">考试人次</h3>
          <div class="_p">
            {{info.record_times}}
          </div>
        </div>
      </div>
    </div>

    <div class="blockLayout">
      <div class="flex-row toolBar querytool">
        <div class="flex-1">
          <!-- title -->
        </div>
        <el-form :inline="true" :model="queryParam" size="small" class="myform">
          <el-form-item label="所属部门" v-if="info.sjlx == 1">
            <el-input v-model="queryParam.org_name"  style="width: 180px;"></el-input>
          </el-form-item>
          <el-form-item label="考试状态" v-if="info.sjlx == 1">
            <el-select v-model="queryParam.record_status" style="width:100px;">
              <el-option  label="全部" :value="-1"></el-option>
              <el-option  label="已考" :value="1"></el-option>
              <el-option  label="未考" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="考试成绩">
            <el-select v-model="queryParam.sjdf_status" style="width:100px;">
              <el-option  label="全部" :value="-1"></el-option>
              <el-option  label="及格" :value="1"></el-option>
              <el-option  label="不及格" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" icon="el-icon-search" @click="fetchData(true)">查询</el-button>
          </el-form-item>
        </el-form>
      </div>
      
      <el-table stripe :data="list" style="width: 100%">
        <el-table-column prop="rank" label="排名" width="50"></el-table-column>
        <el-table-column prop="realname" label="姓名" show-overflow-tooltip></el-table-column>
        <el-table-column prop="org_name" label="部门" show-overflow-tooltip></el-table-column>
        <el-table-column prop="status_text" align="center" width="80" label="考试状态">
          <template slot-scope="scope">
          {{scope.row.record_times > 0 ? '已考' : '未考'}}
          </template>
        </el-table-column>
        <el-table-column prop="record_times" align="center" width="80" label="考试次数"></el-table-column>
        <el-table-column prop="use_time" align="center" width="120" label="答卷时长">
          <template slot-scope="scope">{{ getTimeStamp(scope.row.use_time) }}</template>
        </el-table-column>
        <el-table-column prop="sjdf" align="center" width="80" label="成绩"></el-table-column>
        <el-table-column prop="is_pass_text" align="center" width="80" label="是否及格"></el-table-column>
        <el-table-column prop="sjtjsj" align="center" width="130" label="最近交卷时间">
          <template slot-scope="scope">{{ scope.row.sjtjsj | date() }}</template>
        </el-table-column>
        <el-table-column width="80" label="操作" align="right">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="toDetail(scope.row)" v-if="scope.row.record_id">查看试卷</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- page -->
      <page :length="list.length" :p="queryParam.p" :pagesize="queryParam.pagesize" :total="totalRows" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import * as exam from "@/learn/api/exam";

const defaultEditForm = {
  id:''
}

export default {
  data() {
    return {
      loading:true,
      queryParam:{
        "pagesize": 10,
        "p": 1,
        "sjid": "",
        "org_name": "",
        "record_status": -1,
        "sjdf_status": -1
      },
      list:[],
      info: {},
      totalRows: 0,

    };
  },
  methods: {
    // 传入总秒转具体时间
    getTimeStamp(value) { 
      var theTime = parseInt(value);// 需要转换的时间秒 
      if(!theTime){
        return value
      }
      var theTime1 = 0;// 分 
      var theTime2 = 0;// 小时 
      var theTime3 = 0;// 天
      if(theTime > 60) { 
        theTime1 = parseInt(theTime/60); 
        theTime = parseInt(theTime%60); 
        if(theTime1 > 60) { 
        theTime2 = parseInt(theTime1/60); 
        theTime1 = parseInt(theTime1%60); 
        if(theTime2 > 24){
          //大于24小时
          theTime3 = parseInt(theTime2/24);
          theTime2 = parseInt(theTime2%24);
        }
        } 
      } 
      var result = '';
      if(theTime > 0){
        result = ""+parseInt(theTime)+"秒";
      }
      if(theTime1 > 0) { 
        result = ""+parseInt(theTime1)+"分"+result; 
      } 
      if(theTime2 > 0) { 
        result = ""+parseInt(theTime2)+"小时"+result; 
      } 
      if(theTime3 > 0) { 
        result = ""+parseInt(theTime3)+"天"+result; 
      }
      return result; 
    },
    toDetail(item){
      this.$router.push({name:'查看试卷',query:{rid:item.record_id}});
    },
    handleCurrentChange(currentPage) {
      this.queryParam.p = currentPage;
      this.fetchData();
    },
    createNew(){
      this.editForm = defaultEditForm;
      this.dialogVisible=true;
    },
    fetchData(reload) {
      if(reload){
        this.queryParam.p = 1;
      }
      this.loading = true;
      exam.statistics.r(this.queryParam).then(res => {
        this.loading = false;
        const resobj = res.data.data;
        this.info = resobj.papers_info;
        this.list = resobj.paper_student.data;
        this.totalRows = resobj.paper_student.totalRows;
      });
    }
  },
  created: function() {
    if(this.$route.query.id){
      this.queryParam.sjid = this.$route.query.id
      this.fetchData();
    }
    
  }
};
</script>

<style scoped>
h2._T { margin-bottom:10px;}
.hd{text-align: center;}
.querytool { margin-bottom: 0; }
</style>