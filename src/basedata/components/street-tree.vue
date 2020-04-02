<template>
  <div class="flex-col" style="height:100%">
    <div class="flex-1 scrollbar" v-loading="loading">
      <el-tree ref="tree" :data="treeData" :props="defaultProps" highlight-current :current-node-key="current_node_key" :default-expanded-keys="default_expanded_keys" node-key="id" @node-click="handleNodeClick" v-if="!loading"></el-tree>
    </div>
  </div>
</template>

<script>
import * as util from "@/common/assets/util";
import * as common from "@/basedata/api/common";

export default {
  props: {
    //默认选中最外层第一个
    firstCheck:{
      type: Boolean,
      default: ()=> {
        return false
      }
    }
  },
  data () {
    return {
      loading:true,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      current_node_key:'',
      default_expanded_keys:[]
    }
  },
  methods: {
    handleNodeClick(data) {
      this.$emit('nodeClick',data)
    },
    fetchTree () {
      this.loading = true;
      common.district_tree.r().then(res => {
        this.loading = false;
        this.treeData = util.buildMenu(res.data.data, "parent_id");

        this.treeData.map(e => {
          this.default_expanded_keys.push(e.id)
        })

        if(this.treeData[0] && this.treeData[0].id){
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
</style>