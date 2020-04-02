<template>
  <div class="blockLayout flex-col" v-loading="loading">
    <div class="toolBar flex-row">
      <div class="flex-1">
        
      </div>
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="small"
        v-has="exponent.add"
        @click="createNew()"
      >新增</el-button>
    </div>
    <div class="flex-1 scrollbar">
      <el-table
        :data="list"
        style="width: 100%">
        <el-table-column
          prop="title"
          label="名称"
          width="180">
        </el-table-column>
        <el-table-column
          prop="total"
          label="总分数"
          align="center"
          >
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          >
          <template slot-scope="scope">
            {{scope.row.created_at | date}}
          </template>
        </el-table-column>
        <el-table-column
          prop="member"
          label="创建人"
          >
        </el-table-column>
        <el-table-column
          prop="group"
          label="考核对象"
          width="300"
          >
        </el-table-column>
        <el-table-column
          label="状态"
          align="center"
          >
          <template slot-scope="scope">
            {{scope.row.status==1 ? '启用' : '禁用'}}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="300"
          align="center"
          >
          <template slot-scope="scope">
            <el-button
              size="mini"
              plain
              v-has="exponent.edit"
              @click="edit(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="primary"
              plain
              @click="change(scope.row)"
            >管理</el-button>
            <el-button
              size="mini"
              type="warning"
              plain
              v-has="exponent.copy"
              @click="copy(scope.row)"
            >复制指数</el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              v-has="exponent.remove"
              @click="remove(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog
      title="指数"
      :visible.sync="dialogVisible"
      width="960px"
      @close="closeDialog"
      >
      
      <exponent-editer 
        :data="editForm"
        @submit="closeDialog();fetchData()"
        @cancel="closeDialog()"
       />

    </el-dialog>
  </div>

</template>

<script>
import * as exponent from '@/work/api/exponent';

//import * as util from '@/base/assets/util';

export default {
  components: {
    "exponent-editer": (resolve) => require(['@/work/components/exponent-editer.vue'], resolve)
  },
  data () {
    return {
      exponent,
      loading: true,
      dialogVisible: false,
      list: [],
      editForm: {}
    }
  },
  methods: {
    closeDialog() {
      this.dialogVisible = false;
      this.editForm = {}
    },
    edit(item) {
      this.editForm = item;
      this.dialogVisible = true;
    },
    change(item) {
      this.$router.push({name: '指数项管理', query: {id: item.id}})
    },
    copy(item) {
      this.$confirm('是否继续?').then(() => {
        this.loading = true;
        exponent.copy.r({
          id: item.id
        }).then(() => {
          this.fetchData()
        })
      }).catch(()=>{})
    },
    remove(item) {
      this.$confirm('是否继续?').then(() => {
        this.loading = true;
        exponent.remove.r({
          id: item.id
        }).then(() => {
          this.fetchData()
        })
      }).catch(()=>{})
    },
    createNew() {
      this.dialogVisible = true;
    },
    fetchData() {
      this.loading = true;
      exponent.list.r().then(res => {
        this.loading = false;
        this.list = res.data.data;
      })
    }
  },
  created() {
    this.fetchData()
  }
}
</script>

<style scoped>

</style>
