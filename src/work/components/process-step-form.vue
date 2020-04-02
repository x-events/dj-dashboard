<template>
  <div style="height:100%" class="scrollbar" v-loading="loading">
    <div class="flex-row align-center toolBar">
      <div class="flex-1">
        <!-- title -->
      </div>
      <el-button
        v-if="!list.length"
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="createNew()"
      >添加工作行为</el-button>
    </div>
    
    <!-- list -->
    <form-editer
      v-if="list.length"
      :data="list[0]"
      currentNodeId=""
      :picker="true"
      @remove="handleFormRemove"
      @submit="handleFormChange"
      @cancel="$emit('cancel')"
    />
    
    <!-- process-picker -->
    <el-drawer
      title="选择工作行为"
      :visible.sync="dialogVisible"
      direction="rtl"
      size="960px"
      >

      <form-picker 
        :picker="true"
        @pick="handlePickForm"  
      />

    </el-drawer>

  </div>
</template>

<script>
import * as util from "@/common/assets/util";
import * as process from "@/work/api/process";

export default {
  props: {
    currentStep: {
      type: Object,
      required: false,
      default: function(){
        return {}
      }
    }
  },
  components: {
    "form-picker": (resolve) => require(['@/work/views/manage/form.vue'], resolve),
    "form-editer": (resolve) => require(['@/work/components/form-editer.vue'], resolve)
  },
  data() {
    return {
      process,
      loading: false,
      dialogVisible: false,
      list: [],
      editForm: {}
    }
  },
  watch: {
    currentStep: {
      handler: function(currentStep){
        if(currentStep.id){
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
    handleFormRemove: function(form){
      this.$confirm('是否继续?').then(() => {
        if(!form.relation_id){
          return this.list = []
        }
        this.loading = true;
        process.removeForm.r({
          id: form.relation_id
        }).then(() => {
          this.loading = false;
          this.fetchList()
        })
      }).catch(()=>{})
    },
    handleFormChange: function(form){
      this.update(form)
    },
    handlePickForm: function(form){
      this.$set(this.list, 0, form);
      this.dialogVisible = false;
    },
    
    createNew: function(){
      this.editForm.process_nearest_step_id = this.currentStep.id;
      this.dialogVisible=true;
      // 工作行为选择器
    },
    update: function(form){
      this.loading = true;
      process.editForm.r({
        process_nearest_step_id: this.currentStep.id,
        form: [form]
      }).then(res => {
        this.loading = false;
        this.$emit('update')
      })
    },
    remove: function(item){
      this.$confirm('是否继续?').then(() => {
        this.loading = true;
        process.removeForm.r({
          id: item.id
        }).then(() => {
          this.fetchList()
        })
      }).catch(()=>{})
    },
    fetchList() {
      this.loading = true;
      process.formList.r({
        process_nearest_step_id: this.currentStep.id
      }).then(res => {
        this.loading = false;
        this.list = res.data.data;
      })
    }
  }
}
</script>

<style scoped>

</style>
