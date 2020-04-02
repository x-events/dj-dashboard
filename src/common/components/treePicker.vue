<template>
    <el-dialog
        class="comDialog dc-tree-picker"
        :title="`选择${title}`"
        :append-to-body="true"
        :visible="visible"
        width="800px"
        @open="fetchData(true)"
        @close="handleClose">
        <div v-loading="loading" v-if="typeId != 'nativePlace_tree'">
            <el-tree v-show="islazy"
                node-key="id"
                :data="treeData" 
                :props="defaultProps"
                :show-checkbox="!radio"
                @check="handleNodeCheck"
                @node-click="handleNodeClick"
                :load="loadNode"
                :lazy="true"></el-tree>
            <el-tree v-show="!islazy"
                node-key="id"
                :data="treeData" 
                :props="defaultProps"
                :show-checkbox="!radio"
                :default-expand-all="true"
                @check="handleNodeCheck"
                @node-click="handleNodeClick"></el-tree>
        </div>
        <areatree :data="nodes" @click="handleNodeClick" v-else/>
        
        <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
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
        disableOpt: {
            type: [String, Number],
            default: ''
        },
        title: {
            type: String,
            required: true,
            default: ''
        },
        typeId: {
            type: [String, Number],
            required: true,
            default: ''
        }
    },
    components: {
      areatree: (resolve) => require(['@/common/components/ztree.vue'], resolve),
    },
    data() {
        return {
            loading: false,
            selection: null,
            org: [],
            defaultProps: {
                children: 'children',
                label: 'name',
                isLeaf: 'no_child'
            },
            treeData: [],
            isExpand: true,
            islazy: false,
            nodes: []
        }
    },
    methods: {
        handleNodeClick: function(data){
            if(this.radio){
                /* if(data.status && data.status != '0') {
                    this.selection = null
                    this.$message({ message: '该选项不可选择！', type: 'error', duration: 800 });
                }else {
                    this.selection = data
                } */
                this.selection = data
            }
        },
        handleNodeCheck: function(node, list){
            if(!this.radio){
                this.selection = list.checkedNodes
            }
        },
        // 懒加载方法
        loadNode(node, resolve) {
            if (this.typeId == 'native'){        // 籍贯
                if (node.level != 0) {
                    // datacenter.get_native_first({id: node.data.id}).then(res => {
                    //     if(res.data.status == '200') {
                    //         return resolve(res.data.data)
                    //     }
                    // })
                }
            }else {
                let type = '';
                if(this.typeId == 'work') { type = 7 }
                else if (this.typeId == 'health') { type = 5 }
                else if (this.typeId == 'newSocial') { type = 8 }
                else if (this.typeId == 'titles') { type = 10 }
                else if (this.typeId == 'org_type') { type = 1 }
                else if (this.typeId == 'duty') { type = 'duties' }
                else if (this.typeId == 'org_relation') { type = 2 }
                else if (this.typeId == 'education_degree' || this.typeId == 'two_education_degree') { type = 'education_degree' }
                else if (this.typeId == 'profession_type' || this.typeId == 'two_profession_type') { type = 'profession_type' }
                else {
                    type = this.typeId
                }
                if (node.level != 0) {
                    allcommon.dict_tree.r({code: type,pid: node.data.data_id}).then(res => {
                        if(res.data.status == '200') {
                            return resolve(res.data.data)
                        }
                    })
                }
            }
        },
        handleClose: function(){
            this.$emit('close')
        },
        submit: function(){
            if(this.selection) {
                if(this.selection.status && this.selection.status != '0') {
                    this.$message({ message: '该选项不可选择！', type: 'error', duration: 800 });
                    return
                }
            }
            this.$emit('choosen', this.typeId, this.selection)
            this.handleClose()
        },
        fetchData: function(init){
            if(init){
                this.selection = null
            }
            this.treeData = []
            this.loading = true
            // this.islazy = true;
            if(this.typeId == 'nativePlace_tree') {
              allcommon.areatree.r().then(res => {
                  this.nodes = res.data.data
                  this.loading = false
              })
              return
            }
            allcommon.dict_tree.r({id: this.typeId}).then(res => {
                this.treeData = util.buildMenu(res.data.data, "pid");
                this.loading = false
            })
        }
    },
    created: function(){
        if(this.$root.user){
            // this.fetchData()
        }
    }
};
</script>

<style scoped>
.dc-tree-picker /deep/ .el-dialog__body { max-height: 50vh; overflow: auto; }
</style>
