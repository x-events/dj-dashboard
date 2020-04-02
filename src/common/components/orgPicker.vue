<template>
  <el-dialog
    class="comDialog"
    title="选择组织"
    :append-to-body="true"
    :visible="visible"
    width="800px"
    @open="fetchData(true)"
    @close="handleClose">
    <div v-loading="loading">
      <el-tree 
        node-key="id"
        :data="org" 
        :props="defaultProps"
        :show-checkbox="!radio"
        check-on-click-node
        check-strictly
        :default-expanded-keys="['1']"
        :load="loadNode"
        :lazy="false"
        @check="handleNodeCheck"
        @node-click="handleNodeClick"></el-tree>
    </div>
      
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
// import * as common from '@/api/common'
// import * as work from '@/api/work'
import * as util from "@/common/assets/util";
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
      default: true
    },
    // 2019-5-20 lxr
    ableOpt: {
        type: [String, Number],
        default: ''
    },
    ableIds: {
        type: Array,
        default:() => {
            return []
        }
    },
    disableIds: {
        type: Array,
        default:() => {
            return []
        }
    },
    disableTip: {
        type: String,
        default: '无法转入该组织!'
    },
    except: {
      type: String,
      required: false,
      default: ''
    },
    issub: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      selection: null,
      org: [],
      defaultProps: {
        children: 'children',
        label: 'short_name',
        isLeaf: 'no_child'
      }
    }
  },
  computed: {
    command: function(){
      return allcommon.orgtree.r
      // return this.except ? work.orgExcept : (this.issub ? work.orgChildren : common.orglist)
    }
  },
  methods: {
    handleNodeClick: function(data,node){
      if(this.radio){
        if(this.disableIds.indexOf(data.id) !== -1){
          //黑名单
          this.selection = null
          this.$message({ message: this.disableTip, type: 'warning',  duration: 800 });
        }else if((this.ableOpt !== '' && (data.status != this.ableOpt)) || (this.ableIds.length && (this.ableIds.indexOf(data.id) != -1))) {
          //白名单
          this.selection = null
          this.$message({ message: this.disableTip, type: 'warning',  duration: 800 });
        }else {
          this.selection = data
        }
      }
    },
    handleNodeCheck: function(node, list){
      if(!this.radio){
        this.selection = list.checkedNodes
      }
    },
    handleClose: function(){
      this.$emit('close')
    },
    // 懒加载方法
    loadNode(node, resolve) {
      /* if (node.level != 0) {
          this.command({
            except_org_id: this.except,
            id: node.data.id
          }).then(res => {
              if(res.data.status == '200') {
                  return resolve(res.data.data)
              }
          })
      } */
    },
    submit: function(){
      const result = this.selection || (this.radio ? {
          name:'',
          id:''
      } : [])
      this.$emit('choosen', result)
      this.handleClose()
    },
    fetchData: function(init){
      if(init){
        this.selection = null
      }
      this.loading = true
      // 懒加载模式
      // this.command({
      //   except_org_id: this.except
      // }).then(res => {
      //   this.org = res.data.data
      //   this.loading = false
      // })
      this.command().then(res => {
        this.loading = false;
        this.org = util.buildMenu(res.data.data, "pid");
      });
      
    }
  },
  created: function(){
    if(this.$root.user){
      this.fetchData()
    }
    
  }
};
</script>

<style>

</style>
