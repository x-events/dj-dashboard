<template>
  <div v-loading="loading">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px">
      <el-form-item label="添加参考学员" prop="user_id_list">
        <el-col :span="24">
          <el-button class="addBtn" type="primary" plain @click="addMembers">自主添加</el-button>
          <span>已添加学员{{editForm.members_count}}名</span>
          <el-input v-model="editForm.members" type="hidden" class="hide"></el-input>
        </el-col>
        <el-col :span="24" v-if="editForm.members_list.length">
          <el-tag v-for="(tag,idx) in editForm.members_list" :key="idx" closable @close="handleClose(tag)">{{tag.realname}}</el-tag>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm()">{{examType == 'edit'?'保存':'下一步'}}</el-button>
        <!-- <el-button>取消</el-button> -->
      </el-form-item>
    </el-form>

    <el-dialog width="920px" title="添加学员" :visible.sync="innerVisible" append-to-body @close="resetInnerForm">
      <div class="flex-row flex-1 showbox">
        <div class="sideBar blockLayout flex-col">
          <div class="header-box">
            <div class="flex-1">
              <div class="sidHeader">
                <span>按部门机构添加权限</span>
              </div>
            </div>
          </div>
          <div class="tree-box flex-col flex-1">
            <orgtree ref="tree" @nodeClick="handleNodeClick" v-if="innerVisible" class="flex-1" />
          </div>
        </div>
        <div class="flex-1 blockLayout flex-col">
          <div class="header-box">
            <el-col :span="12">
              <div class="sidHeader">
                <span>按学员添加权限</span>
              </div>
            </el-col>
            <el-col :span="12">
              <el-button type="primary" size="mini" icon="el-icon-search" @click="searchClick"></el-button>
              <el-input v-model="searchParam.keyword" placeholder="请输入学员姓名"></el-input>
            </el-col>
          </div>
          <div class="align-center scrollbar flex-1" v-loading="memberLoading">
            <el-table ref="multipleTable" :data="memberList" style="width: 100%" row-key="uid" @selection-change="selectionChange">
              <el-table-column type="selection" width="55" :selectable="selectable" :value="selectable" :reserve-selection="true">
                  <!--<template slot-scope="scope"><el-checkbox v-model="scope.row.disabled" :disabled="scope.row.disabled"></el-checkbox></template>-->
              </el-table-column>
              <el-table-column prop="realname" label="真实姓名" align="center" show-overflow-tooltip></el-table-column>
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
  </div>
</template>

<script>
import * as util from "@/common/assets/util";
import * as exam from "@/learn/api/exam";
import * as allcommon from "@/common/api/common";
import * as account from "@/permission/api/account";

const TEMP = {
  sjid:"",
  user_id_list:[],
  type:"1"
}

const searchTEMP = {
  org_id:'',
  pagesize: 10,
  p: 1,
  totalRows: 0,
  keywords: ''
}

export default {
  data() {
    return {
      loading:true,
      examType:this.$route.query.examType || 'creat',
      queryParam:{
        sjid:this.$route.query.sjid || ''
      },
      ruleForm: Object.assign({}, TEMP),
      rules:{
        // user_id_list: [
        //   {required: true, message: "请添加参考学员", trigger: "blur"}
        // ]
      },

      innerVisible: false,
      memberLoading:false,
      treeData: [],
      editForm: {
        members: '',
        members_count: 0,
        members_list:[],
      },
      defaultProps: {
        children: "children",
        label: "name"
      },
      searchParam: Object.assign({}, searchTEMP),
      memberList:[],
      selectedMembers:[],
      arrTagId:[],
    }
  },
  watch: {
    'queryParam.sjid':{
      handler: function(sjid){
        if(sjid){
          this.fetchData()
        }else{
          this.ruleForm = Object.assign({}, TEMP)
          this.$nextTick(()=>{
            this.$refs['ruleForm'].clearValidate()
          })
        }
      },
      deep: true, 
      immediate: true
    }
  },
  methods: {
    addMembers(){
      this.innerVisible = true;
    },
    resetInnerForm() {
      this.searchParam = Object.assign({}, searchTEMP);
      this.memberList = [];
      this.$refs.multipleTable.clearSelection();
    },
    handleNodeClick(data) {
      if(data.id){
          this.searchParam.org_id = data.id;
      }else{
          this.searchParam.org_id = '';
      }
      this.getMemberList();
    },
    getMemberList(){
      this.memberLoading = true;
      account.list.r(this.searchParam).then(res =>{
        this.memberLoading = false;
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
          this.$refs.multipleTable.toggleRowSelection(row,true);
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
        this.selectedMembers = this.selectedMembers.concat(this.editForm.members_list)
        let hash = {};
        const newArr = this.selectedMembers.reduce((item, next) => {
          hash[next.uid] ? '' : hash[next.uid] = true && item.push(next);
          return item
        }, []);
        this.editForm.members_list = [];
        this.arrTagId = [];
        this.editForm.members_list = newArr;
        newArr.forEach((item,index,arr)=>{
          //this.editForm.members_list.push({name:item.realname?item.realname:item.name,uid:item.uid});
          this.arrTagId.push(item.uid)
        });
        this.editForm.members_count = this.editForm.members_list.length;
        this.editForm.members = this.arrTagId.sort().join(",");
      }
    },
    handleCurChange(val){
      this.searchParam.p = val;
      this.getMemberList();
    },
    handleClose(tag) {
      this.loading = true;
      exam.examStudentDelete.r({sjid:this.ruleForm.sjid,uid:tag.uid}).then(res => {
        this.loading = false;
        let result = res.data;
        this.$message.success(result.message);
      })
      this.editForm.members_list.splice(this.editForm.members_list.indexOf(tag), 1);
      this.arrTagId.splice(this.arrTagId.indexOf(tag.uid), 1);
      this.editForm.members_count = this.editForm.members_list.length;
      this.editForm.members = this.arrTagId.join(",");
    },
    submitForm() {
      this.ruleForm.user_id_list = this.arrTagId;
      //console.log(this.ruleForm);
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          exam.examStudentCreat.r(this.ruleForm).then(res => {
            let result = res.data;
            this.$message.success(result.message);
            if(this.examType == 'creat'){
              let obj = {
                next_step:3,
                id:this.queryParam.sjid
              }
              this.$emit('submit',obj)
            }
          })
        }
      })
    },
    fetchData(){
      this.$nextTick(()=>{
        this.examType = this.$route.query.examType || "creat";
      })
      this.ruleForm.sjid = this.$route.query.sjid || '';
      this.loading = true;
      exam.examStudentIndex.r(this.queryParam).then(res => {
        this.loading = false;
        let result = res.data.data;
        if(result.length){
          // const oList = result;
          // result = oList.concat(items.filter(m => {
          //   return oList.map(e => e.uid).indexOf(m.uid)===-1
          // }))
          this.editForm.members_list = result;
          this.editForm.members_count = result.length;
          this.arrTagId = result.map(e=>{return e.uid});
        }
      });
    }
  }
}
</script>

<style scoped>
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
</style>