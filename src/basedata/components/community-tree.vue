<template>
  <div class="flex-col" style="height:100%">
    <div class="flex-1 scrollbar" v-loading="loading">
      <el-tree ref="tree" :data="treeData" :props="defaultProps" highlight-current @node-click="handleNodeClick"
        :load="loadNode" :current-node-key="current_key" node-key="value" v-show="!loading"
        :lazy="true"></el-tree>
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
    },
    current_node_key:{      // 因无法给第一项加上样式(渲染问题，dom取不到)，使用外层传选中值渲染
      type: [String,Number],
      default: ()=> {
        return ''
      }
    },
  },
  data () {
    return {
      loading:true,
      treeData: [],
      defaultProps: {
        children: "children",
        label: "name",
        isLeaf: (data, node)=>{ // 转换布尔值
          let is_latest = '';
          if(data.is_latest == '0') {
            is_latest = true;
          }else if(data.is_latest = '1') {
            is_latest = false;
          }
          // 是二级的数据  将叶子节点置为true -不显示箭头
          if(data.value && data.value.indexOf('Street') != -1) {
            is_latest = true;
          }
          return is_latest;
        },
      },
      current_key:'',
      default_expanded_keys:[]
    }
  },
  watch: {
    current_node_key: {
      handler(val) {
        this.current_key = val;
      },
      immediate: true
    }
  },
  methods: {
    // 懒加载方法
    loadNode(node, resolve) {
      if (node.level != 0) {
        
        let val = node.data.value.indexOf('District');
        if(val == -1) {
          return resolve([]);
        }
        common.distroct_getstreet.r({ id: node.data.id }).then(res => {
          if(res.data.status == '200') {
              return resolve(res.data.data)
          }
        })
      }
    },
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