<template>
  <div class="blockLayout flex-col" v-loading="loading">
    <div class="toolBar flex-row">
      <div class="flex-1">
        <div v-has="port.detail" class="el"><span>指数名称：</span>{{ detail.title }}</div>
        <div v-has="port.detail"><span>考核对象：</span>{{ detail.group }}</div>
      </div>
      <div>
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          v-has="exponent.itemAdd"
          @click="createNew()"
        >新增指数</el-button>
      </div>
    </div>
    <div class="flex-1 scrollbar">
      <el-table
        :data="list"
        style="width: 100%;"
        row-key="id"
        default-expand-all
        :tree-props="{children: 'children'}"
        border
        >
        <el-table-column
          prop="title"
          label="指数名"
          width="300"
          show-overflow-tooltip
          >
        </el-table-column>
        <el-table-column
          prop="model_text"
          label="模型"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="max_score"
          label="得分"
          align="center"
          >
        </el-table-column>
        <el-table-column
          label="操作"
          width="260"
          align="right"
          >
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-has="exponent.itemEdit"
              @click="edit(scope.row)"
              >
              编辑
            </el-button>
            
            <template v-if="scope.row.model_id==0">
              
              <el-button
                size="mini"
                type="primary"
                v-has="exponent.itemAdd"
                @click="append(scope.row)"
                >
                添加子节点
              </el-button>
              
            </template>
            <template v-else>
              <el-button
                size="mini"
                type="warning"
                v-has="[exponent.itemEdit, exponent.itemAdd]"
                @click="manage(scope.row)"
                >
                指标管理
              </el-button>
              
            </template>

            <el-button
              size="mini"
              type="danger"
              v-has="exponent.itemRemove"
              @click="remove(scope.row)"
              >
              删除
            </el-button>
            
          </template>
        </el-table-column>
        
      </el-table>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog
      title="编辑"
      :visible.sync="dialogVisible"
      width="960px"
      @close="closeDialog"
      >
      
      <exponent-item-editer
        :data="editForm"
        @submit="closeDialog();fetchData()"
        @cancel="closeDialog()"
       />
    </el-dialog>

    <!-- 管理弹窗 -->
    <el-dialog
      title="指标管理"
      :visible.sync="manageVisible"
      width="960px"
      @close="closeDialog"
      >
      
      <exponent-manage
        :data="editForm"
        @submit="closeDialog();fetchData()"
        @cancel="closeDialog()"
       />
    </el-dialog>
  </div>

</template>

<script>
import * as port from '@/work/api/exponent';
import * as exponent from '../../api/exponent-item';
import * as util from '@/common/assets/util';

export default {
  components: {
    "exponent-item-editer": (resolve) => require(['@/work/components/exponent-item-editer.vue'], resolve),
    "exponent-manage": (resolve) => require(['@/work/components/exponent-manage.vue'], resolve)
  },
  data () {
    return {
      exponent,
      port,
      loading: true,
      dialogVisible: false,
      manageVisible: false,
      list: [],
      editForm: {},
      detail: {}
    }
  },
  methods: {
    closeDialog() {     
      this.dialogVisible = false;
      this.manageVisible = false;
      this.editForm = {}
    },
    edit(item) {
      this.editForm = item;
      this.dialogVisible = true;
    },
    append(item) {
      this.editForm = Object.assign({}, item, {
        parentId: item.id
      });
      this.dialogVisible = true;
    },
    manage(item) {
      this.editForm = item;
      this.manageVisible = true;
    },
    remove(item) {
      if(Array.isArray(item.children) && item.children.length){
        return this.$message({
          message: '请先删除子节点！',
          type: 'warning'
        });
      }
      this.$confirm('是否继续?').then(() => {
        this.loading = true;
        exponent.itemRemove.r({
          id: item.id
        }).then(() => {
          this.fetchData()
        })
      }).catch(()=>{})
    },
    createNew() {
      this.editForm = {
        exponent_id: this.$route.query.id
      }
      this.dialogVisible = true;
    },
    fetchDetail() {
      port.detail.r({
        id: this.$route.query.id
      }).then(res => {
        this.detail = res.data.data;
      })
    },
    fetchData() {
      this.loading = true;
      exponent.itemList.r({
        exponent_id: this.$route.query.id
      }).then(res => {
        this.loading = false;
        this.list = util.buildMenu(res.data.data, 'parent_id') ;
      })
    }
  },
  created() {
    if(this.$route.query.id){
      
    }
    this.fetchDetail()
    this.fetchData()
  }
}
</script>

<style scoped>
.custom-tree-item{flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; }
</style>
