<template>
    <div class="scrollbar blockLayout" v-loading="loading">
        <div class="flex-row align-center toolBar">
            <div class="flex-1">
                <el-radio-group v-model="queryParam.group" @change="changeGroup">
                    <el-radio-button v-for="(tab, i) in tabList" :label="tab.value" :key="'tab'+i">{{tab.label}}</el-radio-button>
                </el-radio-group>
            </div>
            <el-input v-has="port.list" v-model="queryParam.name" placeholder="请输入配置名称" size="small"
                      class="search" @keyup.native.enter="queryParam.p = 1;fetchData()"></el-input>
            <el-button v-has="port.list" @click="queryParam.p = 1;fetchData()" type="primary" size="small">查询
            </el-button>
            <el-button v-has="port.create" type="primary" size="small" icon="el-icon-plus" @click="addClick()">新增
            </el-button>
        </div>
        <!-- list -->
        <el-table stripe :data="list" style="width: 100%" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <!-- <el-table-column prop="id" label="ID" width="80"></el-table-column> -->
            <el-table-column prop="name" label="名称" show-overflow-tooltip></el-table-column>
            <el-table-column prop="title" label="标题" show-overflow-tooltip></el-table-column>
            <el-table-column prop="group" label="分组" width="80">
                <template slot-scope="scope">
                    {{ scope.row.group == 0?"":(scope.row.group == 1?"基本":(scope.row.group == 2?"内容":(scope.row.group == 3?"用户":"系统"))) }}
                </template>
            </el-table-column>
            <el-table-column prop="type_text" label="类型" width="80" align="center"></el-table-column>
            <el-table-column label="操作" width="150" align="right">
                <template slot-scope="scope">
                    <el-button v-has="port.save" size="mini" type="primary" plain @click="edit(scope.row)">编辑
                    </el-button>
                    <el-button v-has="port.remove" size="mini" type="danger" plain @click="deleteClick(scope.row.id)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>

        <!-- page -->
        <page :length="list.length" :p="queryParam.p" :pagesize="queryParam.pagesize" :total="queryParam.totalRows" @current-change="handleCurrentChange" />
        
        <el-dialog :title="`${!editForm.id?'新增':'编辑'}配置`" :visible.sync="dialogVisible"
                   width="1000px" @closed="resetForm">
            <el-form size="small" ref="editForm" :model="editForm" :rules="rules" label-width="90px">
                <el-form-item label="配置标识" prop="name">
                    <!-- <el-tooltip class="item" effect="light" content="" placement="right"> -->
                    <el-input v-model="editForm.name" placeholder="用于C函数调用，只能使用英文且不能重复"></el-input>
                    <!-- </el-tooltip> -->
                </el-form-item>
                <el-form-item label="配置标题" prop="title">
                    <el-input v-model="editForm.title" placeholder="用于后台显示的配置标题"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sort">
                    <el-input v-model="editForm.sort" placeholder="用于分组显示的顺序"></el-input>
                </el-form-item>
                <el-form-item label="配置类型" prop="type">
                    <el-select v-model="editForm.type" placeholder="请选择配置类型，系统会根据不同类型解析配置值" style="width:100%;">
                        <el-option :label="item.value" :value="item.id" :key="index" v-for="(item, index) in typeData"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="配置分组" prop="group">
                    <el-select v-model="editForm.group" placeholder="请选择配置分组，配置分组 用于批量设置 不分组则不会显示在系统设置中" style="width:100%;">
                        <el-option :label="item.value" :value="item.id" :key="index" v-for="(item, index) in groupData"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="配置值" prop="value">
                    <el-input type="textarea" v-model="editForm.value" :rows="3" placeholder="配置值"></el-input>
                </el-form-item>
                <el-form-item label="配置项" prop="extra">
                    <el-input type="textarea" v-model="editForm.extra" :rows="3" placeholder="如果是枚举型,需要配置该项"></el-input>
                </el-form-item>
                <el-form-item label="说明" prop="remark">
                    <el-input type="textarea" v-model="editForm.remark" :rows="3" placeholder="配置详细说明"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="save()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import * as util from "@/common/assets/util";
    import * as port from "../../api/systemsetting";
    export default {
        data() {
            return {
                port,
                loading: false,
                list: [],
                queryParam: {
                    group:'all',
                    pagesize: 10,
                    p: 1,
                    totalRows: 0,
                    name: ''
                },
                tabList:[
                    {
                        label:'全部',
                        value:'all'
                    },
                    {
                        label:'基本',
                        value:1
                    },
                    {
                        label:'内容',
                        value:2
                    },
                    {
                        label:'用户',
                        value:3
                    },
                    {
                        label:'系统',
                        value:4
                    },
                ],
                multipleSelection:[],
                dialogVisible:false,
                editForm: {
                    name: '',
                    title: '',
                    sort: 0,
                    type: '',
                    group: '',
                    value: '',
                    extra: '',
                    remark: '',
                },
                rules: {
                    name: [{required: true, message: "请输入配置标识", trigger: "blur"}],
                    title: [{required: true, message: "请输入配置标题", trigger: "blur"}],

                },
                typeData:[],
                groupData:[],
            }
        },
        methods: {
            addClick(){
                this.dialogVisible = true;
            },
            changeGroup(){
                this.queryParam.p = 1;
                this.fetchData();
            },
            handleSelectionChange(val){
                this.multipleSelection = val;
            },
            handleCurrentChange(val) {
                this.queryParam.p = val;
                this.fetchData();
            },
            edit(row){
                this.dialogVisible = true;
                this.editForm = JSON.parse(JSON.stringify(row));
                /*this.editForm.type = parseInt(row.type);
                this.editForm.group = parseInt(row.group);*/

            },
            save(){
                this.$refs['editForm'].validate((valid) => {
                    if (valid) {
                        if(this.editForm.id){
                            port.save.r(this.editForm).then(res => {
                                if(res.data.status == '200') {
                                    this.dialogVisible = false;
                                    this.$message.success(res.data.message);
                                    this.fetchData();
                                }
                            })
                        }else{
                            port.create.r(this.editForm).then(res => {
                                if(res.data.status == '200') {
                                    this.dialogVisible = false;
                                    this.$message.success(res.data.message);
                                    this.fetchData();
                                }
                            })
                        }
                    }
                });
            },
            deleteClick(id){
                if(!id){
                    return
                }
                this.$confirm('确定要删除本条配置吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.loading = true;
                    port.remove.r({id:id}).then(res => {
                        this.loading = false;
                        this.$message.success(res.data.message);
                        this.fetchData();
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            resetForm() {
                this.editForm = {}
                this.$refs['editForm'] && this.$refs['editForm'].resetFields();
            },
            fetchData() {
                this.loading = true;
                port.list.r(this.queryParam).then(res => {
                    this.loading = false;
                    this.list = res.data.data;
                    // this.queryParam.pagesize = res.data.pageSize;
                    this.queryParam.totalRows = res.data.totalRows;
                });
            },
            getTypeData(){
                this.loading = true;
                port.select.r({name:'CONFIG_TYPE_LIST'}).then(res => {
                    this.loading = false;
                    if(res.data.data.value){
                        let obj = res.data.data.value;
                        for(let i in obj){
                            this.typeData.push({id:i,value:obj[i]})
                        }
                    }
                });
            },
            getGroupData(){
                this.loading = true;
                port.select.r({name:'CONFIG_GROUP_LIST'}).then(res => {
                    this.loading = false;
                    if(res.data.data.value){
                        let obj = res.data.data.value;
                        this.groupData = [{id:'0',value:'不分组'}];
                        for(let i in obj){
                            this.groupData.push({id:i,value:obj[i]})
                        }
                    }
                });
            },
        },
        created: function () {
            this.fetchData();
            this.getTypeData();
            this.getGroupData();
        }
    }
</script>

<style scoped>

</style>
