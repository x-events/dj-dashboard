<template>
  <div class="flex-col" style="height:100%">
    <div class="tree-search" v-if="isSearch">
      <el-input v-has="allcommon.orgtree" v-model="treeFilterText" placeholder="请输入关键字" size="small" prefix-icon="el-icon-search"></el-input>
    </div>
    <div class="flex-1 scrollbar" v-loading="loading">
      <el-tree ref="tree" :data="treeData" :props="defaultProps" highlight-current :current-node-key="current_node_key" :default-expanded-keys="default_expanded_keys" node-key="id" :expand-on-click-node="false" @node-click="handleNodeClick" :filter-node-method="filterNode" v-if="!loading"></el-tree>
    </div>
  </div>
</template>

<script>
import * as util from "@/common/assets/util";
import * as allcommon from "@/common/api/common";

export default {
  props: {
    isSearch: {
      type: Boolean,
      default: ()=> {
        return false
      }
    },
    //默认选中最外层第一个
    firstCheck:{
      type: Boolean,
      default: ()=> {
        return false
      }
    },
    treeSid: {
      type: Object,
      default: ()=>{
        return {}
      }
    }
  },
  data () {
    return {
      loading:true,
      allcommon,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "short_name"
      },
      treeFilterText: '',
      current_node_key:'',
      default_expanded_keys:[]
    }
  },
  watch: {
    treeFilterText(val) {
      this.$refs.tree.filter(val);
    },
    treeSid: {    // 父级传递当前选中树节点，记住当前选中
      handler(val) {
        this.current_node_key = val.id
      }
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleNodeClick(data) {
      this.$emit('nodeClick',data)
    },
    fetchTree () {
      this.loading = true;
      allcommon.orgtree.r().then(res => {
        this.loading = false;
        this.treeData = util.buildMenu(res.data.data, "pid");

        this.treeData.map(e => {
          this.default_expanded_keys.push(e.id)
        })

        if(Object.keys(this.treeSid).length) {      // 专为党组织添加使用，刷新树数据之后记住之前选中节点，好继续操作
          this.current_node_key = this.treeSid.id
          this.$emit('firstCheckValue',this.treeSid)
          return
        }
        if(this.firstCheck && this.treeData[0] && this.treeData[0].id){
          this.current_node_key = this.treeData[0].id;
          this.$emit('firstCheckValue',this.treeData[0])
        }
      });
    }
  },
  created: function(){
    this.fetchTree();
  }
}
</script>

<style scoped>
.tree-search .el-input { margin-bottom:10px;}
</style>