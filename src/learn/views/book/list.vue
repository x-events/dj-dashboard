<template>
  <div class="scrollbar blockLayout" v-loading="loading">
    <div class="flex-row align-center toolBar">
        <div class="flex-1"></div>
        <el-button v-has="port.bookSave" type="primary" size="small" icon="el-icon-plus" @click="createNew()">新增</el-button>
    </div>
    
    <div class="imgList">
      <ul v-if="list.length">
        <li v-for="(e,i) in list" :key="i" class="flex-row">
          <div class="img flex-row align-center justify-center"><img :src="e.cover_url.url" :alt="e.title"></div>
          <div class="flex-1">
            <div class="title el" :title="e.title">
              <el-tag :type="e.status == 1 ? 'success':'info'" effect="dark" size="mini">{{e.status == 1 ? '已上架':'未上架'}}</el-tag>
              {{e.title}}
            </div>
            <div class="category">分类：{{e.category}}</div>
          </div>
          <div class="options flex-col">
            <div class="flex-1">
              <el-button v-has="port.bookSave" size="mini" type="primary" plain @click="handleEdit(e)">编辑</el-button>
              <el-button v-has="port.bookDel" size="mini" type="danger" plain @click="handleStatus(e,'0')">删除</el-button>
            </div>
            <div class="tr">
              <el-button v-has="port.bookDel" size="mini" :type="e.status == 1 ? 'danger':'primary'" @click="handleStatus(e,e.status)" v-if="e.status">{{e.status == 1 ?'下架':'上架'}}</el-button>
            </div>
          </div>
        </li>
      </ul>
      <nodata mode="pic" v-if="!list.length && !loading" />
    </div>

    <!-- page -->
    <page :length="list.length" :p="queryParam.p" :pagesize="queryParam.pagesize" :total="totalRows" @current-change="handleCurrentChange" />

    <!-- 编辑弹窗 -->
    <el-dialog :title="dialogTitle+'书籍'" :visible.sync="dialogVisible" width="700px" @close="closeDialog">
      <book-editor 
        :data="editForm"
        @submit="closeDialog();fetchData();"
        @cancel="closeDialog()" />
    </el-dialog>
  </div>
</template>

<script>
import * as port from "@/learn/api/book";

const defaultEditForm = {
  id:''
}

const defaultDelForm = {
  id:'',
  ope:'',
}

export default {
  components: {
    "book-editor": (resolve) => require(['@/learn/components/book-editor.vue'], resolve)
  },
  data() {
    return {
      port,
      loading:true,
      queryParam:{
        pagesize: 10,
        p: 1
      },
      totalRows:0,
      list:[],

      dialogVisible:false,
      editForm:defaultEditForm,

      delForm:defaultDelForm,
      dialogTitle:""
    };
  },
  methods: {
    createNew(){
      this.dialogTitle = "新增";
      this.editForm = defaultEditForm;
      this.dialogVisible=true;
    },
    closeDialog(){
      this.editForm = {};
      this.dialogVisible=false;
    },
    handleEdit(item){
      this.dialogTitle = "编辑";
      if(item.id){
        this.editForm = item;
      }
      this.dialogVisible=true;
    },
    handleStatus(item,ope){
      if(!item.id){
        return
      }
      this.$confirm('是否继续?').then(() => {
        let cur_ope;
        switch (ope) {
          case '1':
            cur_ope = '2'
            break;
          case '2':
            cur_ope = '1'
            break;
          default:
            cur_ope = '0'
            break;
        }
        this.delForm = {id:item.id,ope:cur_ope};
        port.bookDel.r(this.delForm).then((res) => {
          this.$message.success(res.data.message);
          this.delForm = defaultDelForm;
          this.fetchData();
        })
      }).catch(()=>{})
    },
    handleCurrentChange(currentPage) {
      this.queryParam.p = currentPage;
      this.fetchData();
    },
    fetchData() {
      this.loading = true;
      port.bookLists.r(this.queryParam).then(res => {
        let result = res.data;
        this.loading = false;
        this.list = result.data;
        this.totalRows = result.totalRows;
      });
    }
  },
  created: function() {
    this.fetchData();
  }
};
</script>

<style scoped>
</style>