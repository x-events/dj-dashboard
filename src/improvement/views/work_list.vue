<template>
    <div class="scrollbar blockLayout" v-loading="loading">
        <div class="flex-row align-center toolBar">
            <div class="flex-1">
                <div class="pt5">
                    <el-button v-has="port.remove" plain type="danger" size="small" @click="batchDeleteClick()"  :disabled="!multipleSelection.length">批量删除</el-button>
                </div>
            </div>
            <el-input v-has="port.list" v-model="queryParam.keywords" @keyup.native.enter="fetchData(true)"
              placeholder="请输入关键词" size="small" class="search"></el-input>
            <el-button v-has="port.list" @click="fetchData(true)" type="primary" size="small">查询</el-button>
            <el-button v-has="port.save" type="primary" size="small" icon="el-icon-plus" @click="addClick()">发布</el-button>
        </div>
        <!-- list -->
        <el-table stripe :data="list" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="title" label="工作动态标题" show-overflow-tooltip></el-table-column>
            <el-table-column prop="updated_at" label="修改时间" width="130">
                <template slot-scope="scope">{{ scope.row.updated_at | date }}</template>
            </el-table-column>
            <el-table-column prop="user_name" label="添加人" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column label="状态" width="120">
                <template slot-scope="scope">
                    <el-button class="statBtn" v-has="port.status" type="text" :disabled="scope.row.status != 0" @click="changeClick(scope.row.id,1)">上架</el-button>
                    /
                    <el-button class="statBtn" v-has="port.status" type="text" :disabled="scope.row.status == 0" @click="changeClick(scope.row.id,0)">下架</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="right">
                <template slot-scope="scope">
                    <el-button v-has="port.save" size="mini" type="primary" plain @click="edit(scope.row)">编辑</el-button>
                    <el-button v-has="port.remove" size="mini" type="danger" plain @click="deleteClick(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- page -->
        <page :length="list.length" :p="queryParam.p" :pagesize="queryParam.pagesize" :total="queryParam.totalRows" @current-change="handleCurrentChange" />

        <el-dialog :title="`${!editForm.id?'新增':'编辑'}工作动态`" :visible.sync="outerVisible" width="1000px" @closed="resetForm">
            <el-form size="small" ref="editForm" :rules="rules" :model="editForm" label-width="115px">
                <el-form-item label="工作动态标题" prop="title">
                    <el-input v-model="editForm.title"></el-input>
                </el-form-item>
                <!-- <el-form-item label="工作动态封面图" prop="file_id">
                    <el-col :span="10" v-if="editForm.cover_url.url" class="mb10">
                        <div class="img"><img :src="editForm.cover_url.url"></div>
                    </el-col>
                    <el-col :span="24">
                        <el-input v-model="editForm.file_id" type="hidden" class="hide"></el-input>
                        <qiniu class="up-box" btn_text="上传封面" :multiple="false" accept="img" @success="uploadImgSuccess"/>
                        <span>（最佳尺寸:280px X 160px)</span>
                    </el-col>
                </el-form-item> -->
                <el-form-item label="添加可见党员" prop="members_list">
                    <el-col :span="24">
                        <el-button class="addBtn" size="mini" type="primary" plain @click="addMembers">自主添加</el-button>
                        <span>已添加可见党员{{editForm.members_count}}名</span>
                        <el-input v-model="editForm.members" type="hidden" class="hide"></el-input>
                    </el-col>
                    <el-col :span="24" v-if="editForm.members_count">
                        <el-tag v-for="(tag,idx) in editForm.members_list" :key="idx" closable @close="handleClose(tag)">{{tag.name}}</el-tag>
                    </el-col>
                </el-form-item>
                <el-form-item label="工作动态内容" prop="content">
                    <editor :propvalue="editForm.content" @editorChange="editorContent" style="height:300px;" />
                </el-form-item>
            </el-form>
            <el-dialog width="920px" title="添加党员" :visible.sync="innerVisible" append-to-body @close="resetInnerForm">
                <div class="flex-row showbox" style="height:450px">
                    <div class="sideBar blockLayout flex-col">
                        <div class="header-box">
                            <div class="">
                                <div class="sidHeader">
                                    <span>按党员添加权限</span>
                                </div>
                            </div>
                        </div>
                        <div class="tree-box scrollbar flex-1">
                            <el-tree ref="tree" :data="treeData" :props="defaultProps" highlight-current :default-expanded-keys="['1']" node-key="id" @node-click="handleNodeClick"></el-tree>
                        </div>
                    </div>
                    <div class="flex-1 blockLayout flex-col">
                        <div class="header-box">
                            <el-col :span="12">
                                <div class="sidHeader">
                                    <span>按党员添加权限</span>
                                </div>
                            </el-col>
                            <el-col :span="12">
                                <el-button type="primary" size="mini" icon="el-icon-search" @click="searchClick"></el-button>
                                <el-input v-model="searchParam.keyword" placeholder="请输入党员姓名"></el-input>
                            </el-col>
                        </div>
                        <div class="align-center scrollbar flex-1">
                            <el-table stripe ref="multipleTable" :data="memberList" style="width: 100%" row-key="uid" @selection-change="selectionChange">
                                <el-table-column type="selection" width="55" :selectable="selectable" :value="selectable" :reserve-selection="true">
                                    <!--<template slot-scope="scope"><el-checkbox v-model="scope.row.disabled" :disabled="scope.row.disabled"></el-checkbox></template>-->
                                </el-table-column>
                                <el-table-column prop="realname" label="真实姓名" align="center"></el-table-column>
                                <el-table-column prop="cellphone" label="手机号" width="260" align="center"></el-table-column>
                            </el-table>
                        </div>

                        <!-- page -->
                        <page :length="memberList.length" :p="searchParam.p" :pagesize="searchParam.pagesize" :total="searchParam.totalRows" @current-change="handleCurChange" />
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="innerVisible = false">取 消</el-button>
                    <el-button type="primary" @click="saveAdd();innerVisible = false">确 定</el-button>
                </span>
            </el-dialog>
            <span slot="footer" class="dialog-footer">
                <el-button @click="outerVisible = false">取 消</el-button>
                <el-button type="primary" @click="save()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import * as util from "@/common/assets/util";
import * as port from "../api/worklist";
import * as account from "../../permission/api/account";
import * as allcommon from "@/common/api/common";

export default {
    components: {
        "editor": (resolve) => require(['@/common/components/editor.vue'], resolve)
    },
    data() {
        return {
            port,
            account,
            loading: false,
            list: [],
            queryParam: {
                pagesize: 10,
                p: 1,
                totalRows: 0,
                keywords: ''
            },
            multipleSelection:[],
            outerVisible: false,
            innerVisible: false,
            editForm: {
                id:'',
                title: '',
                file_id: '',
                cover_url:{
                    id:'',
                    url:'',
                    title:'',
                },
                content: '',
                members: '',
                members_count: 0,
                members_list:[],
            },
            rules: {
                title: [{required: true, message: "请输入工作动态标题", trigger: "blur"}],
                members_list: [
                    {type: 'array',required: true, message: "请添加可见党员", trigger: "blur"}
                ],
                content: [
                    {required: true, message: "请描述工作动态内容", trigger: "blur"}
                ],
            },
            treeData: [],
            defaultProps: {
                children: "children",
                label: "short_name"
            },
            searchParam: {
                org_id:'',
                pagesize: 10,
                p: 1,
                totalRows: 0,
                keywords: ''
            },
            memberList:[],
            selectedMembers:[],
            arrTagId:[],
        }
    },
    watch: {
        outerVisible() {
            this.editForm = {
                id:'',
                title: '',
                file_id: '',
                cover_url: {
                    id: "",
                    title: "",
                    url: ""
                },
                content: '',
                members: '',
                members_count: 0,
                members_list:[],
                currentCat: {},
            }
        },
        currentCat: {
            handler: function(currentCat){
                if(currentCat.id){
                    this.getMemberList();
                }else{
                    this.memberList = []
                }
            },
            deep: true
        }
    },
    methods: {
        addClick() {
            this.outerVisible = true;
        },
        /* uploadImgSuccess(data) {
            this.editForm.file_id = data.id;
            this.editForm.cover_url.url = data.domain + data.file_key
        }, */
        addMembers(){
            this.innerVisible = true;
            this.fetchTree();
        },
        fetchTree: function() {
            this.loading = true;
            allcommon.orgtree.r().then(res => {
                this.loading = false;
                this.treeData = util.buildMenu(res.data.data, "pid");
            });
        },
        handleNodeClick(data) {
          this.searchParam.p = 1;
            if(data.id){
                this.searchParam.org_id = data.id;
            }else{
                this.searchParam.org_id = '';
            }
            this.getMemberList();
        },
        getMemberList(){
            this.loading = true;
            account.list.r(this.searchParam).then(res =>{
                this.loading = false;
                this.memberList = res.data.data;
                this.searchParam.totalRows = res.data.totalRows;
                this.memberList.some((member,index,arr)=>{
                    this.editForm.members_list.some((item,index,arr)=>{
                        if(member.uid == item.uid){
                            this.$set(member,'disabled',true);
                            this.selectedMembers.push(member)
                        }
                    })
                })
                this.toggleSelection(this.selectedMembers)
            })
        },
        toggleSelection(rows){
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            }
        },
        selectable(row,index){
            if(row.disabled == true){
                return false;
            }else{
                return true;
            }
        },
        searchClick(){
            this.getMemberList();
        },
        selectionChange(val){
            this.selectedMembers = val;
        },
        saveAdd(){
            if(this.selectedMembers.length>0){
                this.editForm.members_count = this.selectedMembers.length;
                this.selectedMembers = this.selectedMembers.concat(this.editForm.members_list)
                let hash = {};
                const newArr = this.selectedMembers.reduce((item, next) => {
                    hash[next.uid] ? '' : hash[next.uid] = true && item.push(next);
                    return item
                }, []);
                this.editForm.members_list = [];
                this.arrTagId = [];
                newArr.forEach((item,index,arr)=>{
                    this.editForm.members_list.push({name:item.realname?item.realname:item.name,uid:item.uid});
                    this.arrTagId.push(item.uid)
                });
                this.editForm.members = this.arrTagId.sort().join(",");
            }
        },
        handleCurChange(val){
            this.searchParam.p = val;
            this.getMemberList();
        },
        handleClose(tag) {
            this.editForm.members_list.splice(this.editForm.members_list.indexOf(tag), 1);
            this.arrTagId.splice(this.arrTagId.indexOf(tag.uid), 1);
            this.editForm.members_count = this.editForm.members_list.length;
            this.editForm.members = this.arrTagId.join(",");
        },
        handleSelectionChange(val){
            this.multipleSelection = val;
        },
        batchDeleteClick() {
            if(this.multipleSelection.length>0){
                let arrS = [];
                this.multipleSelection.forEach((item,index,arr)=>{
                    arrS.push(item.id)
                })
                this.$confirm('确定要删除选中的工作动态吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.remove(arrS);
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }else{
                this.$message({
                    type: 'info',
                    message: '请选择要删除的工作动态'
                });
            }
        },
        changeClick(rowId, val) {
            this.loading = true;
            let id = rowId;
            let ope = val;
            port.status.r({id, ope}).then((res) => {
                this.loading = false;
                this.fetchData();
            })
        },
        edit(row){
            this.outerVisible = true;
            this.loading = true;
            this.getDetail(row.id)
        },
        deleteClick(id){
            if(!id){
                return
            }
            this.$confirm('确定要删除本条工作动态吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let arrId = [];
                arrId.push(id);
                this.remove(arrId);
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        remove(id){
            this.loading = true;
            port.remove.r({id:id}).then(res => {
                this.loading = false;
                this.$message.success(res.data.message);
                this.fetchData();
            })
        },
        getDetail(id){
            port.detail.r({id:id}).then(res => {
                this.loading = false;
                this.editForm = res.data.data;
                this.editForm.members_list.forEach((item,index,arr)=>{
                    this.arrTagId.push(item.uid);
                })
                this.arrTagId.sort();
            });
        },
        editorContent(content){
            this.editForm.content = content;
        },
        save(){
            this.$refs['editForm'].validate((valid) => {
                if (valid) {
                    port.save.r(this.editForm).then(res => {
                        if(res.data.status == '200') {
                            this.outerVisible = false;
                            this.$message.success(res.data.message);
                            this.fetchData();
                        }
                    })
                }
            });
        },
        resetForm() {
            this.editForm = {
                title: '',
                file_id: '',
                cover_url: {
                    id: "",
                    title: "",
                    url: ""
                },
                content: '',
                members: '',
                members_count: 0,
                members_list:[],
                currentCat: {},
            }
            this.arrTagId = [];
            this.$refs['editForm'] && this.$refs['editForm'].resetFields();
        },
        resetInnerForm() {
            this.searchParam = {};
            this.memberList = [];
            this.$refs.multipleTable.clearSelection();
        },
        handleCurrentChange(val) {
            this.queryParam.p = val;
            this.fetchData();
        },
        fetchData(reload) {
            if (reload) {
              this.queryParam.p = 1;
            }
            this.loading = true;
            port.list.r(this.queryParam).then(res => {
                this.loading = false;
                this.list = res.data.data;
                // this.queryParam.pagesize = res.data.pageSize;
                this.queryParam.totalRows = res.data.totalRows;
            });
        }
    },
    created: function () {
        this.fetchData();
    }
}
</script>

<style scoped>
.el-table .statBtn { margin: 0 5px;}
.addBtn{margin-right:20px;}
.showbox{height:400px;border:1px solid #ddd;border-radius: 5px;}
.showbox .blockLayout{margin:0;box-shadow:none; padding:5px 10px;}
.showbox .sideBar {border-right:1px solid #ddd;}
.tree-box{margin-top:10px;}
.showbox .blockLayout .header-box {height:40px;border-bottom:1px solid #ddd; width:100%;}
.showbox .blockLayout .header-box .el-col-12 .el-input{width:230px;height:35px;float:right;margin-right:6px;}
.showbox .blockLayout .header-box .el-col-12 .el-input >>> .el-input__inner{width:230px;height:35px;}
.showbox .blockLayout .header-box .el-col-12 .el-button{width:35px;height:35px;float:right;padding:7px 0;}
.showbox .sidHeader {height:40px;}
.showbox .sidHeader span{line-height:40px;border-left: 5px solid #1b97e9;padding-left: 12px;}
.showbox .flex-col .scrollbar{margin:5px 0; clear: both;}
.showbox .flex-col .pagination{margin:5px 0;}
.el-tag{margin-right:10px;margin-top:10px;}
.up-box{display: inline-block;}
</style>
