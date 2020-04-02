<template>
    <div class="scrollbar blockLayout" v-loading="loading">
        <div class="flex-row align-center toolBar">
            <div class="flex-1">
              <el-button v-has="news.remove" :disabled="!multipleSelection.length"
                plain type="danger" size="small" icon="el-icon-plus" @click="batchDeleteClick()">批量删除</el-button>
            </div>
            <el-input v-has="news.list" v-model="queryParam.keywords" @keyup.native.enter="fetchData(true)"
              placeholder="请输入关键词" size="small" class="search"></el-input>
            <el-button v-has="news.list" @click="fetchData(true)" type="primary" size="small">查询
            </el-button>
            <el-button v-has="news.save" type="primary" size="small" icon="el-icon-plus" @click="addClick()">发布</el-button>
        </div>
        <el-table stripe :data="list" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="cover_url.url" label="新闻封面" width="200">
                <template slot-scope="scope"><img :src="scope.row.cover_url.url" alt="" style="width:80px;"></template>
            </el-table-column>
            <el-table-column prop="title" label="新闻标题" show-overflow-tooltip></el-table-column>
            <el-table-column prop="created_at" label="发布时间" width="130">
                <template slot-scope="scope">{{ scope.row.created_at | date() }}</template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="80">
                <template slot-scope="scope">{{scope.row.status == '0'?'未上线':'已上线'}}</template>
            </el-table-column>
            <el-table-column label="操作" width="150" align="right">
                <template slot-scope="scope">
                    <el-button v-has="news.save" size="mini" type="primary" plain @click="edit(scope.row)">编辑
                    </el-button>
                    <el-button v-has="news.remove" size="mini" type="danger" plain @click="deleteClick(scope.row.id)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- page -->
        <page :length="list.length" :p="queryParam.p" :pagesize="queryParam.pagesize" :total="queryParam.totalRows" @current-change="handleCurrentChange" />

        <el-dialog
                :title="`${!editForm.id?'新增':'编辑'}新闻`"
                :visible.sync="dialogVisible"
                width="900px"
                @closed="resetForm">
            <el-form size="small" ref="editForm" :rules="rules" :model="editForm" label-width="112px">
                <el-form-item label="新闻标题" prop="title">
                    <el-input v-model="editForm.title"></el-input>
                </el-form-item>
                <el-form-item label="新闻封面" prop="cover_file_id">
                    <el-col :span="10" v-if="editForm.cover_url.url" class="mb10">
                        <div class="img"><img :src="editForm.cover_url.url"></div>
                    </el-col>
                    <el-col :span="24">
                        <el-input v-model="editForm.cover_file_id" type="hidden" class="hide"></el-input>
                        <qiniu btn_text="上传封面" :multiple="false" accept="img" @success="uploadImgSuccess"/>
                    </el-col>
                </el-form-item>
                <el-form-item label="新闻内容" prop="content">
                    <editor :propvalue="editForm.content" @editorChange="editorContent" style="height:300px;" />
                </el-form-item>
                <el-form-item label="新闻来源" prop="source">
                    <el-input v-model="editForm.source"></el-input>
                </el-form-item>
                <el-form-item label="是否投放上线" prop="status">
                    <el-radio v-model="editForm.status" label="1">是</el-radio>
                    <el-radio v-model="editForm.status" label="0">否</el-radio>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import * as util from "@/common/assets/util";
    import * as news from "../api/newsmanage";

    export default {
        components: {
            "editor": (resolve) => require(['@/common/components/editor.vue'], resolve)
        },
        data() {
            return {
                news,
                loading: false,
                queryParam: {
                    pagesize: 10,
                    p: 1,
                    totalRows: 0,
                    keywords: ''
                },
                list: [],
                editForm:{
                    title:'',
                    cover_file_id:'',
                    cover_url:{
                        id:'',
                        url:'',
                        title:'',
                    },
                    content:'',
                    source:'',
                    status:'',
                },
                rules: {
                    title: [{required: true, message: "请输入新闻标题", trigger: "blur"}],
                    cover_file_id: [
                        {required: true, message: "请上传新闻封面", trigger: "blur"}
                    ],
                    content: [
                        {required: true, message: "请描述工作动态内容", trigger: "blur"}
                    ],
                    status: [
                        {required: true, message: "请选择是否上线", trigger: "change"}
                    ],
                },
                dialogVisible:false,
                multipleSelection:[],
            }
        },
        watch: {
        },
        methods: {
            addClick() {
                this.dialogVisible = true;
                this.editForm.id = 0;
                this.editForm.status = '1';
            },
            uploadImgSuccess(data) {
                this.editForm.cover_file_id = data.id;
                this.editForm.cover_url.url = data.domain + data.file_key
            },
            handleSelectionChange(val){
                this.multipleSelection = val;
                console.log(33,val)
            },
            batchDeleteClick() {
                if(this.multipleSelection.length>0){
                    let arrS = [];
                    this.multipleSelection.forEach((item,index,arr)=>{
                        arrS.push(item.id)
                    })
                    this.$confirm('确定要删除选中的新闻吗?', '提示', {
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
                        message: '请选择要删除的新闻'
                    });
                }
            },
            deleteClick(id){
                if(!id){
                    return
                }
                this.$confirm('确定要删除本条新闻吗?', '提示', {
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
                news.remove.r({id:id}).then(res => {
                    this.loading = false;
                    this.$message.success(res.data.message);
                    this.fetchData();
                })
            },
            resetForm() {
                this.editForm = {
                    title: '',
                    cover_file_id: '',
                    cover_url: {
                        id: "",
                        title: "",
                        url: ""
                    },
                    content: '',
                    source:'',
                    status:'',
                }
                this.$refs['editForm'] && this.$refs['editForm'].resetFields();
            },
            handleCurrentChange(val) {
                this.queryParam.p = val;
                this.fetchData();
            },
            edit(row){
                this.dialogVisible = true;
                this.loading = true;
                this.getDetail(row.id);
            },
            editorContent(content){
                this.editForm.content = content;
            },
            submitForm(){
                this.$refs['editForm'].validate((valid) => {
                    if (valid) {
                        news.save.r(this.editForm).then(res => {
                            if(res.data.status == '200') {
                                this.dialogVisible = false;
                                this.$message.success(res.data.message);
                                this.fetchData();
                            }
                        })
                    }
                });
            },
            getDetail(id){
                news.detail.r({id:id}).then(res => {
                    console.log(22,res.data.data)
                    this.loading = false;
                    this.editForm = res.data.data;
                    this.editForm.status = '1';
                });
            },
            fetchData(reload) {
                if (reload) {
                  this.queryParam.p = 1;
                }
                this.loading = true;
                news.list.r(this.queryParam).then(res => {
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

</style>
