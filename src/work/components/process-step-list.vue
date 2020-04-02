<template>
  <div style="height:100%" class="scrollbar" v-loading="loading">
    <div class="flex-row align-center toolBar">
      <div class="flex-1">
        <!-- title -->
      </div>
      <el-button
        v-has="process.addStep"
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="createNew()"
      >新建步骤</el-button>
    </div>
    <el-tree ref="tree" 
      :data="list" 
      highlight-current 
      default-expand-all
      :expand-on-click-node="false"
      class="mytree"
      >
      <div class="flex-row flex-1" slot-scope="{ node, data }">
        <div class="flex-1 el">{{ data.name }}</div>
        <el-button
          size="mini"
          plain
          @click="edit(data)">
          编辑
        </el-button>
        <el-button
          size="mini"
          plain
          @click="handleEditForm(data)">
          设置工作行为
        </el-button>
        <el-button
          size="mini"
          plain
          @click="append(data)">
          添加子步骤
        </el-button>
        <el-button
          type="danger"
          size="mini"
          plain
          @click="remove(data)">
          删除
        </el-button>
      </div>
    </el-tree>
    
    <!-- 编辑弹窗 -->
    <el-dialog
      :title="(currentStep.name || '') + ' 步骤'"
      :visible.sync="dialogVisible"
      width="960px"
      append-to-body
      @closed="closeDialog"
      >
      
      <process-step-editer 
        :data="editForm"
        @submit="closeDialog();fetchList()"
        @cancel="closeDialog()"
        @callForm="handleEditForm"
       />

    </el-dialog>

    <!-- 工作行为 -->
    <el-drawer
      :title="(currentStep.name || '') + ' 工作行为'"
      :visible.sync="formDialogVisible"
      direction="rtl"
      size="960px"
      >
      
      <process-step-form 
        :currentStep="currentStep"
        @update="closeFormEditer();fetchList()"
        @cancel="closeFormEditer()"
      />

    </el-drawer>
  </div>
</template>

<script>
import * as util from "@/common/assets/util";
import * as process from "@/work/api/process";

export default {
  props: {
    currentProcess: {
      type: Object,
      required: false,
      default: function(){
        return {}
      }
    }
  },
  components: {
    "process-step-editer": (resolve) => require(['@/work/components/process-step-editer.vue'], resolve),
    "process-step-form": (resolve) => require(['@/work/components/process-step-form.vue'], resolve)
  },
  data() {
    return {
      process,
      loading: false,
      dialogVisible: false,
      formDialogVisible: false,
      defaultProps: {
        children: "children",
        label: "name"
      },
      list: [],
      editForm: {}, 
      currentStep: {}
    }
  },
  watch: {
    currentProcess: {
      handler: function(currentProcess){
        if(currentProcess.id){
          this.fetchList()
        }else{
          this.list = []
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    closeFormEditer: function(){
      this.currentStep = {};
      this.formDialogVisible=false;
    },
    createNew: function(){
      this.dialogVisible=true;
      this.$set(this.editForm, 'process_nearest_id', this.currentProcess.id)
    },
    handleEditForm: function(item){
      this.currentStep = Object.assign({}, this.currentStep, item);
      this.formDialogVisible = true;
    },
    closeDialog: function(){
      this.editForm={};
      this.dialogVisible=false;
    },
    edit: function(item){
      this.editForm = item;
      this.currentStep = item;
      this.dialogVisible = true;
    },
    append: function(item){
      this.$set(this.editForm, 'process_nearest_id', this.currentProcess.id)
      this.$set(this.editForm, 'parent_id', item.id)
      
      this.dialogVisible = true;
    },
    remove: function(item){
      this.$confirm('是否继续?').then(() => {
        this.loading = true;
        process.removeStep.r({
          id: item.id
        }).then(() => {
          this.fetchList()
        })
      }).catch(()=>{})
    },
    fetchList() {
      this.loading = true;
      process.stepList.r({
        process_nearest_id: this.currentProcess.id
      }).then(res => {
        this.loading = false;
        this.list = util.buildMenu(res.data.data, 'parent_id');
      })
    }
  }
}
</script>

<style scoped>
.mytree >>> .el-tree-node__content{margin:6px 6px 6px 0;}
</style>
