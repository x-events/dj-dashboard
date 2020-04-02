<template>
  <div class="blockLayout flex-col" v-loading="loading">
    <div class="toolBar flex-row">
      <div class="flex-1">
        <!-- title -->
      </div>
      <el-button
        v-has="permission.dcSave"
        type="primary"
        icon="el-icon-check"
        @click="submit()"
      >保存</el-button>
    </div>
    <div class="flex-1 scrollbar">
      <el-table
        :data="list"
        style="width: 100%">
        <el-table-column
          prop="name"
          label="党组织类型"
          width="180">
        </el-table-column>
        <el-table-column
          label="菜单权限"
        >
          <template slot-scope="scope">
            <el-tag v-for="(item,i) in checked(scope.row.menu)" :key="'menu'+i" type="info" class="mytag">
              {{item.name}}
            </el-tag>
            <el-button type="primary" size="small" plain @click="currentRow=scope;dialogVisible=true">编辑菜单权限</el-button>
            <!-- <el-checkbox v-for="(item,i) in scope.row.menu" :key="'menu'+i"
              v-model="item.checked"
            >{{item.name}}</el-checkbox> -->
          </template>
        </el-table-column>
        <el-table-column
          label="操作权限"
          width="330"
        >
          <template slot-scope="scope">
            <el-tag v-for="(item,i) in checked(scope.row.op)" :key="'menu'+i" type="warning" class="mytag">
              {{item.name}}
            </el-tag>
            <el-button type="primary" size="small" plain @click="currentRow=scope;dialogOpVisible=true">编辑操作权限</el-button>
            <!-- <el-checkbox v-for="(item,i) in scope.row.op" :key="'op'+i"
              v-model="item.checked"
            >{{item.name}}</el-checkbox> -->
          </template>
        </el-table-column>
      </el-table>

    </div>

    <el-dialog
      title="菜单权限"
      :visible.sync="dialogVisible"
      width="960px"
      >
      <div v-if="currentRow.row">
        <el-checkbox v-for="(item,i) in currentRow.row.menu" :key="'menu'+i"
          v-model="item.checked"
        >{{item.name}}</el-checkbox>
      </div>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </span>
    </el-dialog>
    
    <el-dialog
      title="操作权限"
      :visible.sync="dialogOpVisible"
      width="960px"
      >
      <div v-if="currentRow.row">
        <el-checkbox v-for="(item,i) in currentRow.row.op" :key="'op'+i"
          v-model="item.checked"
        >{{item.name}}</el-checkbox>
      </div>
      
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="setRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as permission from '@/work/api/permission';

export default {
  data () {
    return {
      permission,
      loading: false,
      dialogVisible: false,
      dialogOpVisible: false,
      list: [],
      currentRow: {}
    }
  },
  computed: {
    checkList: function(){
      let result = {};
      this.list.forEach(e => {
        const menu_auth = e.menu.filter(m => m.checked).map(m => m.value);
        const op_auth = e.op.filter(o => o.checked).map(o => o.value);
        result['menu_'+e.value] = menu_auth;
        result['op_'+e.value] = op_auth;
      })
      return result;
    }
  },
  methods: {
    setRights() {
      this.$set(this.list, this.currentRow.$index, this.currentRow.row);
      this.closeDialog()
    },
    closeDialog() {
      this.dialogVisible = false;
      this.dialogOpVisible = false;
      this.currentRow = {}
    },
    checked(arr) {
      return arr.filter(e => e.checked)
    },
    submit: function(){
      this.loading = true;
      permission.dcSave.r(this.checkList).then(() => {
        this.loading = false;
        this.fetchData();
      })
    },
    fetchData: function(){
      this.loading = true;
      permission.dcList.r().then(res => {
        this.loading = false;
        const result = res.data.data.map(e => {
          if(Array.isArray(e.menu)){
            e.menu.forEach(e => {
              e.checked = (e.checked ===1)
            })
          }
          if(Array.isArray(e.op)){
            e.op.forEach(e => {
              e.checked = (e.checked ===1)
            })
          }
          return e
        })
        this.list = result;
      })
    }
  },
  created: function(){
    this.fetchData()
  }
}
</script>

<style scoped>
.mytag{
  margin:0 5px 5px 0;
}
</style>
