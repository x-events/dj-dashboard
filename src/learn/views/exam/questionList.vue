<template>
  <div class="scrollbar blockLayout" v-loading="loading">
    <div class="flex-row align-center toolBar">
        <div class="flex-1"></div>
        <div class="count flex-row mr10" v-has="port.questionGroupView">
          <div class="pt5 mr10">
            共 <el-badge class="mark" :value="total_qst_num" /> 道题
          </div>
          <div class="pt5 mr10" v-for="(item, index) in type_num_list" :key="index">
            {{item.name}}
            <el-badge class="mark" :value="item.value" />
          </div>
        </div>
        <el-select v-has="port.questionIndex" v-model="queryParam.qst_type" placeholder="请选择" size="small" class="select" style="width:100px;" @change="queryParam.qst_title='';queryParam.p=1;fetchData();">
          <el-option
            v-for="item in qst"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input v-has="port.questionIndex" v-model.trim="queryParam.qst_title" placeholder="请输入" size="small" class="search"></el-input>
        <el-button v-has="port.questionIndex" @click="queryParam.p = 1;fetchData()" type="primary" size="small">查询</el-button>
        <el-button v-has="port.questionUpdate" type="primary" size="small" icon="el-icon-plus" @click="createNew('xuanze')">新增选择题</el-button>
        <el-button v-has="port.questionUpdate" type="primary" size="small" icon="el-icon-plus" @click="createNew('panduan')">新增判断题</el-button>
    </div>
    <el-table stripe :data="list" style="width: 100%">
      <el-table-column prop="order" label="题号" width="50" align="center"></el-table-column>
      <el-table-column prop="type_name" label="题型" width="150" align="center"></el-table-column>
      <el-table-column label="题干" show-overflow-tooltip>
        <template slot-scope="scope">
          <a v-html="scope.row.title" class="title link" @click="showView(scope.row)"></a>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template slot-scope="scope">
          <el-button v-has="port.questionUpdate" size="mini" type="primary" plain @click="handleEdit(scope.row)">编辑</el-button>
          <el-button v-has="port.questionDelete" size="mini" type="danger" plain @click="handleRemove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- page -->
    <page :length="list.length" :p="queryParam.p" :pagesize="queryParam.pagesize" :total="totalRows" @current-change="handleCurrentChange" />

    <!-- 编辑弹窗 -->
    <el-dialog :title="dialogTitle+'试题'" :visible.sync="dialogVisible" width="960px" @close="closeDialog">
      <!-- 选择题 -->
      <question-type1-editor 
        :data="editForm"
        v-if="quesType == 'xuanze'"
        @submit="closeDialog();fetchData();"
        @cancel="closeDialog()" />
      <!-- 判断题 -->
      <question-type2-editor 
        :data="editForm"
        v-if="quesType == 'panduan'"
        @submit="closeDialog();fetchData();"
        @cancel="closeDialog()" />
    </el-dialog>

    <el-dialog title="预览试题" :visible.sync="previewDialogVisible" width="960px" @close="closePreviewDialog">
      <question-view v-has="port.questionView"
        :data="viewInfo"
        @submit="closePreviewDialog();"
        @cancel="closePreviewDialog()" />
    </el-dialog>
  </div>
</template>

<script>
import * as port from "@/learn/api/exam";

const defaultEditForm = {
  id:''
}

export default {
  components: {
    "question-type1-editor": (resolve) => require(['@/learn/components/question-type1-editor.vue'], resolve),
    "question-type2-editor": (resolve) => require(['@/learn/components/question-type2-editor.vue'], resolve),
    "question-view": (resolve) => require(['@/learn/components/question-view.vue'], resolve)
  },
  data() {
    return {
      port,
      loading:true,
      queryParam:{
        group_id:this.$route.query.id,
        qst_title:"",
        qst_type:"",
        pagesize: 5,
        p: 1
      },
      totalRows:0,
      list:[],
      total_qst_num:0,
      type_num_list:[
        {
          name:'单选题',
          value:0,
        },
        {
          name:'多选题',
          value:0,
        },
        {
          name:'判断题',
          value:0,
        }
      ],

      quesType:"",
      dialogVisible:false,
      editForm:defaultEditForm,
      qst:[
        {
          label:'全部',
          value:''
        },
        {
          label:'单选题',
          value:0
        },
        {
          label:'多选题',
          value:1
        },
        {
          label:'判断题',
          value:2
        }
      ],

      previewDialogVisible:false,
      viewInfo:{},
      dialogTitle: "",
    };
  },
  methods: {
    createNew(type){
      this.dialogTitle = "新增";
      this.quesType = type;
      this.editForm = defaultEditForm;
      this.dialogVisible=true;
    },
    closeDialog(){
      this.quesType = "";
      this.editForm = {};
      this.dialogVisible=false;
    },
    handleEdit(item){
      this.dialogTitle = "编辑";
      if(item.id){
        this.editForm = item;
      }
      if(item.type == '0' || item.type == '1'){
        this.quesType = "xuanze";
      }else{
        this.quesType = "panduan";
      }
      this.dialogVisible=true;
    },
    handleRemove(item){
      if(!item.id){
        return
      }
      this.$confirm('是否继续?').then(() => {
        port.questionDelete.r({id:item.id}).then((res) => {
          this.$message.success(res.data.message);
          this.fetchData();
        })
      }).catch(()=>{})
    },
    handleCurrentChange(currentPage) {
      this.queryParam.p = currentPage;
      this.fetchData();
    },
    showView(item){
      this.viewInfo = item;
      this.previewDialogVisible = true;
    },
    closePreviewDialog(){
      this.viewInfo = {}
      this.previewDialogVisible = false;
    },
    fetchData() {
      this.loading = true;
      port.questionIndex.r(this.queryParam).then(res => {
        let result = res.data;
        this.loading = false;
        this.list = result.data;
        this.totalRows = result.totalRows;
      });

      port.questionGroupView.r({id:this.$route.query.id,qst_type:this.queryParam.qst_type}).then(res => {
        let result = res.data;
        this.loading = false;
        if(result.data.total_qst_num){
          this.total_qst_num = result.data.total_qst_num
        }
        if(result.data.type_num_list){
          result.data.type_num_list.forEach((e,i) => {
            this.type_num_list[i].value = e;
          });
          //console.log(this.type_num_list);
        }
        
      });
    }
  },
  created: function() {
    this.fetchData();
  }
};
</script>

<style scoped>
.title >>> img { width:auto; max-height:23px;}
</style>