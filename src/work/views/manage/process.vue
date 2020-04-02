<template>
  <div class="flex-row" v-loading="loading">
    <div class="sideBar blockLayout scrollbar">
      <el-tree ref="tree" :data="cats" :props="defaultProps" highlight-current @node-click="handleNodeClick"></el-tree>
    </div>
    <div class="flex-1 blockLayout scrollbar">
      <div class="flex-row align-center toolBar">
        <div class="flex-1">
          <!-- title -->
        </div>
        <el-button
          v-has="process.add"
          :disabled="Number(currentCat.type)!==2"
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="createNew()"
        >新建工作流程</el-button>
      </div>
      <!-- list -->
      <el-table
        :data="list"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="流程名"
        >
        </el-table-column>
        
        <el-table-column
          label="操作"
          align="right"
          >
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              v-if="scope.row.status==1"
              @click="cancelState(scope.row)"
            >取消发布</el-button>
            <el-button
              size="mini"
              plain
              v-if="scope.row.status==0"
              v-has="process.edit"
              @click="handleEdit(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              plain
              v-if="scope.row.status==0"
              v-has="process.editStep"
              @click="handleEditStep(scope.row)"
            >编辑步骤</el-button>
            <el-button
              size="mini"
              type="primary"
              plain
              v-if="scope.row.status==0"
              @click="publishState(scope.row)"
            >发布</el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              v-has="process.remove"
              @click="handleRemove(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

    </div>

    <!-- 编辑弹窗 -->
    <el-dialog
      title="流程"
      :visible.sync="dialogVisible"
      width="960px"
      @close="closeDialog"
      >
      
      <process-editer 
        :data="editForm"
        @submit="closeDialog();fetchProcess()"
        @cancel="closeDialog()"
        @callStep="handleEditStep"
       />

    </el-dialog>

    <!-- 步骤列表 -->
    <el-drawer
      :title="(currentProcess.name || '') + ' 步骤'"
      :visible.sync="stepDialogVisible"
      direction="rtl"
      >
      
      <process-step-list 
        :currentProcess="currentProcess"
      />

    </el-drawer>

  </div>
</template>

<script>
import * as util from "@/common/assets/util";
import * as process from "@/work/api/process";

export default {
  components: {
    "process-editer": (resolve) => require(['@/work/components/process-editer.vue'], resolve),
    "process-step-list": (resolve) => require(['@/work/components/process-step-list.vue'], resolve)
  },
  data() {
    return {
      process,
      dialogVisible: false,
      stepDialogVisible: false,
      loading: false,
      cats: [],
      list: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      currentCat: {},
      currentProcess: {},
      editForm: {}
    };
  },
  watch: {
    currentCat: {
      handler: function(currentCat){
        if(currentCat.id){
          this.fetchProcess()
        }else{
          this.list = []
        }
      },
      deep: true
    }
  },
  methods: {
    
    handleEditStep: function(item){
      this.currentProcess = Object.assign({}, this.currentProcess, item);
      this.stepDialogVisible = true;
    },
    createNew: function(){
      this.$set(this.editForm, 'process_category_id', this.currentCat.id);
      this.dialogVisible=true;
    },
    closeDialog: function(){
      this.editForm={};
      this.dialogVisible=false;
    },
    handleRemove: function(item){
      this.$confirm('是否继续?').then(() => {
        this.loading = true;
        process.remove.r({
          id: item.id
        }).then(() => {
          this.fetchProcess()
        })
      }).catch(()=>{})
    },
    publishState: function(item){
      this.$confirm('是否继续?').then(() => {
        this.loading = true;
        process.changeStatus.r({
          id: item.id,
          status: 1
        }).then(() => {
          this.fetchProcess()
        })
      }).catch(()=>{})
    },
    handleEdit: function(item){
      this.editForm = item;
      this.currentProcess = item;
      this.dialogVisible = true;
    },
    cancelState: function(item){
      this.$confirm('是否继续?').then(() => {
        this.loading = true;
        process.changeStatus.r({
          id: item.id,
          status: 0
        }).then(() => {
          this.fetchProcess()
        })
      }).catch(()=>{})
    },
    handleNodeClick(data) {
      this.currentCat = Number(data.type)===2 ? data : {};
    },
    fetchProcess: function(){
      let process_category_id = this.currentCat.id;
      if(!process_category_id){
        return console.warn('参数错误')
      }
      this.loading = true;
      process.list.r({
        process_category_id
      }).then(res => {
        this.loading = false;
        this.list = res.data.data
      })
    },
    fetchCat: function() {
      this.loading = true;
      process.cat.r().then(res => {
        this.loading = false;
        this.cats = util.buildMenu(res.data.data, "parent_id");
      });
    }
  },
  created: function() {
    this.fetchCat();
  }
};
</script>

<style scoped>
</style>
