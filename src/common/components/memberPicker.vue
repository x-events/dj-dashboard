<template>
  <div v-loading="loading">
    <el-dialog
      class="comDialog"
      :title="title"
      :append-to-body="true"
      :visible="visible"
      width="1000px"
      @open="fetchData(true);fetchOrg();"
      @close="handleClose">
      <div class="flex-row borderLayout" v-loading="loading">
        <div class="picker-side scrollbar">
          <el-tree 
            node-key="id"
            style="width:800px"
            :data="org" 
            :props="defaultProps"
            :default-expanded-keys="['1']"
            highlight-current
            :load="loadNode"
            :lazy="false"
            @node-click="handleNodeClick" class="comTreeGray"></el-tree>

        </div>
        <div class="flex-1 scrollbar flex-col">
          <!-- search -->
          <div class="search-div toolBar">
            <el-input v-has="account.list" v-model="queryParam.keyword" @keyup.native.enter="fetchData(true)"
              placeholder="请输入姓名" size="small" class="search"></el-input>
            <el-button v-has="account.list" @click="fetchData(true)" size="small" type="primary">查询</el-button>
          </div>
          <!-- <el-form :inline="true" :model="queryParam" size="small" class="memberFilter">
            <el-form-item label="已选" v-if="!radio">
              <el-button type="text">{{selection.length}}</el-button>
            </el-form-item>
            <el-form-item label="">
              <el-select v-model="queryParam.role_id" placeholder="请选择">
                <el-option label="所有角色" value=""></el-option>
                <el-option
                  v-for="item in role"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            
          </el-form> -->
          <!-- list -->
          <el-table stripe ref="multipleTable"
              :data="list"
              height="100%"
              row-key="uid"
              style="width: 100%"
              :highlight-current-row="radio"
              @current-change="handleRadioPick"
              @selection-change="handleSelectionChange">
              <el-table-column v-if="!radio" type=selection :reserve-selection="true" width="55"></el-table-column>
              <el-table-column prop="realname"
                label="姓名" show-overflow-tooltip>
              </el-table-column>
              <el-table-column prop="org"
                label="所属党组织" show-overflow-tooltip>
              </el-table-column>
          </el-table>

          <!-- page -->
          <page :length="list.length" :p="queryParam.p" :pagesize="queryParam.pagesize" :total="totalRows" @current-change="handleCurrentChange" />
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button icon="el-icon-circle-check-outline" type="primary" @click="submit">确 定</el-button>
        <el-button icon="el-icon-circle-close-outline" @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as util from "@/common/assets/util";
import * as account from "@/permission/api/account";
import * as allcommon from "@/common/api/common";

export default {
  props: {
    visible: {
      type: Boolean,
      required: true
    },
    currentSelection: {
      type: Array,
      required: false
    },
    radio: {
      type: Boolean,
      required: false,
      default: false
    },
    allorg: {
      type: Boolean,
      required: false,
      default: false
    },
    title: {
      type: String,
      default: '选择人员'
    }
  },
  data() {
    return {
      account,
      loading: false,
      selection: [],
      list: [],
      totalRows: 0,
      queryParam: {
        p: 1,
        pagesize: 10,
        keyword: '',
        org_id: ''
      },
      org: [],
      role: [],
      defaultProps: {
        children: 'children',
        label: 'short_name',
        isLeaf: 'no_child'
      }
    }
  },
  watch: {
    /* queryParam: {
      handler: function(){
        this.fetchData(true)
      },
      deep: true
    }, */
    allorg: function(){
      this.fetchOrg()
    }
  },
  methods: {
    handleNodeClick: function(data,node){
      this.queryParam.org_id = data.id;
      this.fetchData(true);

      // this.queryParam.id = data.id;
      // if(data.status==='1'){
      //   this.queryParam.id = data.id;
      // }
    },
    handleSelectionChange: function(selection){
      this.selection = selection
    }, 
    handleRadioPick: function(selection){
      if(this.radio){
        this.selection = selection
      }
    },
    handleCurrentChange(val) {
      this.queryParam.p = val;
      this.fetchData()
    },
    fetchOrg: function(){
      allcommon.orgtree.r().then(res => {
        this.loading = false;
        this.org = util.buildMenu(res.data.data, "pid");
      }).catch(() => {
        this.loading = false
      });
      /* let apiCommand = this.allorg ? common.allorg : common.orglist;
      apiCommand().then(res => {
        this.org = res.data.data
        this.loading = false
      }).catch(() => {
        this.loading = false
      }); */
    },
    fetchData: function(init) {
      if(init){
        this.list = [];
        this.queryParam.p = 1;
      }
      this.loading = true
      account.list.r(this.queryParam).then(res => {
        this.loading = false;
        this.list = res.data.data;
        this.totalRows = res.data.totalRows;
      }).catch(() => {
        this.loading = false
      });
    },
    handleClose: function(){
      this.queryParam = {};
      this.$refs.multipleTable.clearSelection()
      this.$emit('close')
    },
    // 懒加载方法
    loadNode(node, resolve) {
        common.orglist({id: node.data.id}).then(res => {
            if(res.data.status == '200') {
                return resolve(res.data.data)
            }
        })
    },
    submit: function(){
      let result = this.selection;
      if(Array.isArray(this.currentSelection) && this.currentSelection.length){
        let filterKeys = this.currentSelection.map(e => e.uid)
        result = this.currentSelection.concat(result.filter(e => {
          return filterKeys.findIndex(k => {
            return k === e.uid
          }) === -1
        }))
      }
      this.$emit('choosen', result)
      // this.handleClose()     // 通过ref调用此方法
    }
  },
  created: function(){
    if(this.$root.user){
      this.loading = true
    }
  }
};
</script>

<style scoped>
.picker-side{width:350px;overflow: auto;border-right:1px solid #dfdfdf;height: 100%;padding-top: 10px;box-sizing:border-box;}
.borderLayout{border:1px solid #dfdfdf;height: 50vh;border-radius: 4px;}
.memberFilter {padding:15px;border-bottom: 1px solid #dfdfdf}
.memberFilter .el-form-item{margin-bottom:0;}
.pagination { margin: 5px 0; }
.search-div { padding: 5px 0 5px 5px; margin-bottom: 0;}
</style>
