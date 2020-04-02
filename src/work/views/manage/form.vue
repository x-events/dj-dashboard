<template>
  <div class="flex-row" v-loading="loading">
    <div class="sideBar blockLayout scrollbar">
      <el-tree ref="tree" :data="cats" :props="defaultProps" highlight-current @node-click="handleNodeClick"></el-tree>
    </div>
    <div class="flex-1 blockLayout scrollbar">
      <div v-if="!picker" class="flex-row align-center toolBar">
        <div class="flex-1">
          <!-- title -->
        </div>
        <el-button
          :disabled="newGuideDisable"
          size="small"
          v-has="form.guideUpdate"
          @click="guideDialogVisible=true"
        >工作指引</el-button>
        <el-button
          v-has="form.add"
          :disabled="!currentNode || currentNode.type!='3'"
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="dialogVisible=true"
        >新建工作行为</el-button>

      </div>
      <!-- list -->
      <el-table
        :data="list"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="工作行为"
        >
        </el-table-column>
        
        <el-table-column
          label="操作"
          align="center"
          >
          <template slot-scope="scope">

            <el-button
              size="mini"
              plain
              v-if="scope.row.status==0"
              v-has="form.edit"
              @click="handleEdit(scope.row)"
            >{{ picker ? '查看' : '编辑' }}</el-button>

            <el-button v-if="!picker"
              size="mini"
              type="danger"
              plain
              v-has="form.remove"
              @click="handleRemove(scope.row)"
            >删除</el-button>

            <el-button
              v-if="picker"
              size="mini"
              type="primary"
              plain
              icon="el-icon-check"
              @click="$emit('pick', scope.row)"
            >选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog
      title="工作行为"
      :visible="dialogVisible"
      width="960px"
      append-to-body
      @close="closeDialog"
      >
      
      <form-editer 
        :data="editForm"
        :currentNodeId="currentNode.id"
        :preview="picker"
        @submit="handleSubmitForm"
        @cancel="closeDialog"
       />

    </el-dialog>

    <!-- 工作指引弹窗 -->
    <guide-editer 
      :visible="guideDialogVisible"
      :currentNode="currentNode"
      @submit="closeGuideDialog();fetchList()"
      @cancel="closeGuideDialog()"
      />
  </div>
</template>

<script>
import * as util from "@/common/assets/util";
import * as form from "@/work/api/form";

export default {
  props: {
    picker: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  components: {
    "form-editer": (resolve) => require(['@/work/components/form-editer.vue'], resolve),
    "guide-editer": (resolve) => require(['@/work/components/guide-editer.vue'], resolve)
  },
  data() {
    return {
      form,
      dialogVisible: false,
      guideDialogVisible: false,
      loading: false,
      cats: [],
      list: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      currentNode: {},
      editForm: {}
    };
  },
  watch: {
    currentNode: {
      handler: function(currentNode){
        if(currentNode.id){
          this.fetchList()
        }else{
          this.list = []
        }
      },
      deep: true
    }
  },
  computed: {
    currentForm: function(){
      if(this.list.length && this.list[0].form_category_id){
        return this.list[0]
      }else{
        return null
      }
    },
    newGuideDisable: function(){
      if(this.currentNode){
        if(this.currentNode.type=='2' || (this.currentNode.type=='3' && !this.currentNode.realType)){
          return false
        }
      }
      return true;
    }
  },
  methods: {
    closeGuideDialog() {
      this.guideDialogVisible = false;
    },
    handleSubmitForm: function(formData){
      this.loading = true;
      const api = this.editForm.id ? form.edit : form.add;
      const extParam = this.editForm.id ? {
        id: this.editForm.id
      } : {
        form_category_id: this.currentNode.id
      }
      api.r(Object.assign({}, extParam, formData)).then(res => {
        this.loading = false;
        this.fetchList()
      }).catch(() => {
        this.loading = false;
      })
      this.closeDialog()
    }, 
    closeDialog: function(){
      this.editForm={};
      this.dialogVisible=false
    },
    handleRemove: function(item){
      this.$confirm('是否继续?').then(() => {
        this.loading = true;
        form.remove.r({
          id: item.id
        }).then(() => {
          this.fetchList()
        })
      }).catch(()=>{})
    },
    handleEdit: function(item){
      this.editForm = item;
      this.dialogVisible = true;
    },
    handleNodeClick(data) {
      this.currentNode = (Number(data.type)===2 || Number(data.type)===3) ? data : {};
    },
    fetchList: function(){
      let form_category_id = this.currentNode.id;
      if(!form_category_id){
        return console.warn('参数错误')
      }
      this.loading = true;
      form.list.r({
        form_category_id
      }).then(res => {
        this.loading = false;
        this.list = res.data.data
      })
    },
    fetchCat: function() {
      this.loading = true;
      form.cat.r().then(res => {
        this.loading = false;
        const d = util.buildMenu(res.data.data, "parent_id");
        d.forEach(e => {
          if(e.type=='1' && Array.isArray(e.children)){
            e.children.forEach(c => {
              if(c.type=='2' && Array.isArray(c.children)){
                c.children.forEach(cc => {
                  if(cc.type=='3'){
                    cc.realType = '2';
                  }
                })
              }
            })
          }
        })
        this.cats = d;
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
