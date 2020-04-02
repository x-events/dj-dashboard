<template>
  <div class="flex-row" v-loading="loading">
    <div class="sideBar blockLayout scrollbar">
      <orgtree ref="tree" @nodeClick="handleNodeClick" />
    </div>
    <div class="flex-1 blockLayout scrollbar">
      <div class="flex-row align-center toolBar">
        <div class="flex-1">
          <!-- title -->
          <el-button v-has="account.remove" size="mini" type="danger" plain 
            :disabled="!(delIds.uid && delIds.uid.length>0)" @click="remove(delIds)">批量删除</el-button>
        </div>
        <el-input v-has="account.list" v-model="queryParam.keyword" @keyup.native.enter="fetchData(true)"
          placeholder="请输入姓名" size="small" class="search"></el-input>
        <el-button v-has="account.list" @click="fetchData(true)" type="primary" size="small">查询</el-button>
        <!-- status=1 说明为党支部; 只有支部下可以加人 :disabled="!(+currentTree.status === 1)" -->
        <el-button v-has="account.save"
          type="primary" size="small" icon="el-icon-plus" @click="dialogVisible=true">新增用户</el-button>
      </div>
      <!-- list -->
      <el-table stripe :data="list" style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="realname" label="姓名" min-width="100" show-overflow-tooltip></el-table-column>
        <el-table-column prop="sex" label="性别" width="50">
          <template slot-scope="scope">{{ scope.row.sex == 0?'男':(scope.row.sex == 1?'女':'') }}</template>
        </el-table-column>
        <el-table-column prop="birth" label="出生日期" width="100"></el-table-column>
        <el-table-column prop="nation" label="民族" width="80" show-overflow-tooltip></el-table-column>
        <el-table-column prop="politics" label="政治面貌" width="80"></el-table-column>
        <el-table-column prop="join_time" label="参加组织日期" width="110"></el-table-column>
        <el-table-column prop="education" label="学历" width="90" show-overflow-tooltip></el-table-column>
        <el-table-column prop="work_post" label="工作岗位" show-overflow-tooltip></el-table-column>
        <el-table-column prop="org" label="党组织名称" min-width="90" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" width="150" align="right" fixed="right">
          <template slot-scope="scope">
            <el-button v-has="account.save" size="mini" type="primary" plain @click="edit(scope.row)">编辑</el-button>
            <el-button v-has="account.remove" size="mini" type="danger" plain @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="userNo" label="账号" width="150" align="center"></el-table-column>
        <el-table-column prop="username" label="用户名" width="150" align="center"></el-table-column>
        <el-table-column prop="roleName" label="角色" align="center"></el-table-column>
        <el-table-column label="状态" width="80" align="center">
          <template slot-scope="scope">
            <template v-if="scope.row.status!=1">
              <span style="color:#ff4949">已禁用</span>
            </template>
            <template v-else>
              <span style="color:#13ce66">已启用</span>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="300" align="center">
          <template slot-scope="scope">
            <el-button v-has="account.edit" size="mini" type="primary" plain @click="edit(scope.row)">编辑</el-button>
            <el-button
              v-has="account.resetPassword"
              size="mini"
              type="warning" plain
              @click="resetPassword(scope.row)"
            >重置密码</el-button>
            <el-button v-has="account.remove" size="mini" type="danger" plain @click="remove(scope.row)">删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>

      <!-- page -->
      <page :length="list.length" :p="queryParam.p" :pagesize="queryParam.pagesize" :total="queryParam.totalRows" @current-change="handleCurrentChange" />
    </div>
    <!-- 之前逻辑弹窗 -->
    <!-- <el-dialog
      title="账号信息"
      :visible="dialogVisible"
      width="800px"
      :show-close="false"
      :close-on-click-modal="false"
      @close="resetForm" >
      <el-form size="small" ref="editForm" :rules="rules" :model="editForm" label-width="80px">
        <el-form-item label="账号" prop="userNo">
          <el-input v-model="editForm.userNo"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username"></el-input>
        </el-form-item>
        <template v-if="!editForm.userId">
          <el-form-item label="密码" prop="password">
            <el-input type="password" v-model="editForm.password" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="editForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
        </template>
        <el-form-item label="角色">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
          >全选</el-checkbox>
          <el-checkbox-group
            style="margin: 15px 0;"
            v-model="editForm.roleIds"
            @change="handleCheckedChange"
          >
            <el-row :gutter="20">
              <el-col :span="10" v-for="role in rolesList" :key="'role'+ role.roleId">
                <el-checkbox :label="role.roleId">{{role.roleName}}</el-checkbox>
              </el-col>
            </el-row>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch
            v-model="editForm.status"
            active-text="启用"
            inactive-text="禁用"
            :active-value="1"
            :inactive-value="2"
          ></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save();dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog> -->
    <!-- 新增修改弹窗 -->
    <account-edit 
      :dialogVisible="dialogVisible"
      :data="editForm" 
      @cancel="closeDialog()"
      @submit="closeDialog();fetchData();" /><!-- $refs.tree.fetchTree(); -->
  
  </div>
</template>

<script>
import * as util from "@/common/assets/util";
import * as account from "../api/account";
import { list as requestRoles } from "../api/role";

export default {
  data() {
    const validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码"));
      } else {
        if (this.ruleForm.checkPass !== "") {
          this.$refs.ruleForm.validateField("checkPass");
        }
        callback();
      }
    };
    const validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.ruleForm.password) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };

    return {
      account,
      dialogVisible: false,
      loading: false,
      list: [],
      editForm: {},
      queryParam: {
        pagesize: 10,
        p: 1,
        totalRows: 0,
        keyword: '',
        org_id: ''
      },
      // totalRows: 0,
      rules: {
        userNo: [{ required: true, message: "请输入账号", trigger: "blur" }],
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        password: [{ validator: validatePass, trigger: "blur" }],
        checkPass: [{ validator: validatePass2, trigger: "blur" }]
      },
      isIndeterminate: true,
      checkAll: true,
      rolesList: [],
      currentTree: {},
      delIds: {},
      isEdit: false,            // 是否为编辑弹窗
    };
  },
  components: {
    "account-edit": (resolve) => require(['@/permission/components/account-edit.vue'], resolve)
  },
  watch: {
    currentTree: {
      handler: function(currentTree){
        if(currentTree.id){
          this.fetchData(true)
        }else{
          this.list = []
        }
      },
      deep: true
    }
  },
  methods: {
    // 表格多选
    handleSelectionChange (selection){
      let uids = []
      selection.map(a=> { uids.push(a.uid) })
      this.delIds = { uid: uids };
    }, 
    closeDialog(){
      this.dialogVisible=false;
      this.editForm={}
    },
    handleNodeClick(data) {
      this.currentTree = data;
    },
    /* handleCheckAllChange(checked) {
      this.$set(
        this.editForm,
        "roleIds",
        checked ? this.rolesList.map(x => x.roleId) : []
      );
      this.isIndeterminate = false;
    }, */
    /* handleCheckedChange() {
      let checkedCount = this.editForm.roleIds.length;
      this.checkAll = checkedCount === this.rolesList.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.rolesList.length;
    }, */
    handleCurrentChange: function(currentPage) {
      this.queryParam.p = currentPage;
      this.fetchData();
    },
    /* resetPassword: function(data) {
      if (!data) {
        return null;
      }
      this.$confirm(`确定重置账号 ${data.userNo} 的密码?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.loading = true;
        account.resetPassword.r(data).then(() => {
          this.fetchData();
          this.$alert(`密码已重置！`, {
            confirmButtonText: "我知道了"
          });
        });
      });
    }, */
    edit: function(data) {
      this.editForm = data;
      this.dialogVisible = true;
    },
    /* save() {
      let vm = this;
      vm.$refs["editForm"].validate(valid => {
        if (valid) {
          let formData = util.deepcopy(vm.editForm);

          if (!formData.userId) {
            account.save.r(formData).then(() => {
              vm.fetchData();
              vm.$message({
                message: "添加成功",
                type: "success"
              });
            });
          } else {
            account.edit.r(formData).then(() => {
              vm.fetchData();
              vm.$message({
                message: "编辑成功",
                type: "success"
              });
            });
          }
        }
      });
    }, */
    resetForm: function() {
      this.editForm = {
        roleIds: []
      };
      this.$nextTick(function() {
        this.$refs["editForm"].resetFields();
      });
    },
    remove(item) {
      if (!item) {
        return null;
      }
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        account.remove.r({ids: item.uid}).then(() => {
          this.fetchData();
          this.$message({
            message: "删除成功",
            type: "success"
          });
        });
      });
    },
    fetchData: function(reload) {
      let pid = this.currentTree.id;
      this.queryParam.org_id = pid;
      if (reload) {
        this.queryParam.p = 1;
      }
      this.loading = true;
      account.list.r(this.queryParam).then(res => {
        this.loading = false;
        this.list = res.data.data;
        // this.queryParam.pagesize = res.data.pageSize;
        this.queryParam.totalRows = res.data.totalRows;
      });
    },
    /* fetchRoles: function() {
      requestRoles.r().then(res => {
        this.rolesList = res.data.data;
      });
    } */
  },
  created: function() {
    this.fetchData();
    // this.fetchRoles();
  }
};
</script>

<style scoped>
>>> .el-drawer .el-drawer__body { height: calc(100% - 100px); }
</style>
