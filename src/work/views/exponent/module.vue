<template>
  <div class="blockLayout flex-col" v-loading="loading">
    <div class="toolBar flex-row">
      <div class="flex-1">
        
      </div>
      <el-button
        type="primary"
        icon="el-icon-plus"
        v-has="moudle.add"
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
          prop="model"
          label="模型"
          align="center"
          >
        </el-table-column>
        <el-table-column
          prop="method"
          label="方法"
          >
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
              v-has="moudle.edit"
              @click="edit(scope.row)"
            >编辑</el-button>
            <el-button
              size="mini"
              type="danger"
              plain
              v-has="moudle.remove"
              @click="remove(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 编辑弹窗 -->
    <el-dialog
      title="计算模型"
      :visible.sync="dialogVisible"
      width="960px"
      @close="closeDialog"
      >
      
      <moudle-editer 
        :data="editForm"
        @submit="closeDialog();fetchData()"
        @cancel="closeDialog()"
       />

    </el-dialog>
  </div>

</template>

<script>
import * as moudle from '../../api/moudle';
//import * as util from '@/base/assets/util';

export default {
  components: {
    "moudle-editer": (resolve) => require(['@/work/components/moudle-editer.vue'], resolve)
  },
  data () {
    return {
      moudle,
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
    remove(item) {
      this.$confirm('是否继续?').then(() => {
        this.loading = true;
        moudle.remove.r({
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
      moudle.list.r().then(res => {
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
