<template>
  <div class="scrollbar blockLayout" v-loading="loading">
    <div class="flex-row align-center toolBar">
      <div class="flex-1">
        <!-- title -->
      </div>
      <el-button v-has="role.edit" size="mini" type="primary" plain 
        :disabled="!(delIds.id && delIds.id.length>0)" @click="on(delIds)">批量启用</el-button>
      <el-button v-has="role.forbid" size="mini" type="danger" plain 
        :disabled="!(delIds.id && delIds.id.length>0)" @click="forbid(delIds)">批量禁用</el-button>
      <el-button v-has="role.remove" size="mini" type="danger" plain 
        :disabled="!(delIds.id && delIds.id.length>0)" @click="remove(delIds)">批量删除</el-button>
      <el-button v-has="role.add"
        type="primary" size="small" icon="el-icon-plus"
        @click="isEdit=false;dialogVisible=true">新增</el-button>
    </div>
    <el-table stripe :data="list" style="width: 100%"
        @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column prop="title" label="角色组" show-overflow-tooltip></el-table-column>
      <el-table-column prop="description" label="描述" show-overflow-tooltip></el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="scope">{{ scope.row.status == 1?'正常':(scope.row.status == 0?'禁用':'') }}</template>
      </el-table-column>

      <el-table-column label="授权" width="100" align="center">
        <template slot-scope="scope">
          <el-button v-has="role.remove" size="mini" type="primary" plain @click="memberAuthClick(scope.row)">成员授权</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="210" align="center">
        <template slot-scope="scope">
          <el-button v-has="role.edit" size="mini" plain @click="switchStatus(scope.row)"
            :type="scope.row.status == 1?'danger':(scope.row.status == 0?'primary':'')">
            {{ scope.row.status == 1?'禁用':(scope.row.status == 0?'启用':'') }}
          </el-button>
          <el-button v-has="role.edit" size="mini" type="primary" plain @click="edit(scope.row)">编辑</el-button>
          <el-button v-has="role.remove" size="mini" type="danger" plain @click="remove(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <!-- page -->
    <page :length="list.length" :p="queryParam.p" :pagesize="queryParam.pagesize" :total="queryParam.totalRows" @current-change="handleCurrentChange" />

    <!-- 新增弹窗 -->
    <el-dialog
      class="comDialog"
      :title="`${!isEdit?'新增':'编辑'}角色组`"
      :visible.sync="dialogVisible"
      width="800px"
      @closed="resetForm">
      <el-form size="small" ref="editForm" :rules="rules" :model="editForm" label-width="80px" v-show="dialogVisible">
        <el-form-item label="角色组" prop="title">
          <el-input v-model.trim="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model.trim="editForm.description" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="权限">
          <resourcePicker :expand="true" picker :checked="editForm.rules" @checked="editForm.rules = $event" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 成员授权弹窗 -->
    <el-drawer
      title="成员授权"
      :visible.sync="authDialogVisible"
      direction="rtl"
      size="600px"
      @close="resetForm">
      <div class="flex-col" style="height:100%;" v-loading="loading">
        <div class="demo-drawer__footer">
          <el-button type="primary" size="small" icon="el-icon-plus" @click="mpickerDialog = true">新增成员</el-button>
        </div>
        <div class="demo-drawer__content flex-1" style="overflow:auto">
          <el-table stripe :data="authMember" style="width: 100%" class="authTable">
            <el-table-column prop="realname" label="姓名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="lastlogintime" label="最后登录时间" min-width="110">
              <template slot-scope="scope">{{ scope.row.lastlogintime | date() }}</template>
            </el-table-column>
            <el-table-column prop="lastloginip" label="最后登录IP" min-width="120"></el-table-column>
            <el-table-column prop="status" label="状态" width="80">
              <template slot-scope="scope">{{ scope.row.status == 1?'正常':(scope.row.status == 0?'禁用':'') }}</template>
            </el-table-column>

            <el-table-column label="操作" width="90" align="right">
              <template slot-scope="scope">
                <el-button v-has="role.remove" size="mini" type="danger" plain @click="removeAuth(scope.row)">解除授权</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </el-drawer>
    <!-- 选党员 -->
    <member-picker ref="mpicker" :visible="mpickerDialog" :radio="false" @close="mpickerDialog=false" @choosen="memberChoosen" />
  </div>
</template>

<script>
import * as util from "@/common/assets/util";
import * as role from "../api/role";
import { mkdir } from 'fs';

export default {
  components: {
    resourcePicker: resolve => require(["../components/resourcePicker.vue"], resolve),
    memberPicker: resolve => require(["@/common/components/memberPicker.vue"], resolve),
  },
  data() {
    return {
      role,
      dialogVisible: false,
      dialogVisible2: false,
      authDialogVisible: false,
      loading: false,
      list: [],
      editForm: {
        title: "",
        description: "",
        rules: []
      },
      queryParam: {
        pagesize: 10,
        p: 1,
        totalRows: 0
      },
      rules: {
        title: [{ required: true, message: "请输入角色名称", trigger: "blur" }]
      },
      authForm: {
      },
      authMember: [],
      mpickerDialog: false,           // 党员库弹窗
      formwidth: '180px',
      delIds: {},
      isEdit: false,                  // 是否为编辑弹框
    };
  },
  methods: {
    handleSelectionChange (selection){
      let uids = []
      selection.map(a=> { uids.push(a.id) })
      this.delIds = { id: uids };
    }, 
    edit: function(data) {
      this.isEdit = true;
      this.dialogVisible = true;
      role.detail.r({id: data.id}).then(res => {
        if(res.data.status == '200') {
          this.editForm = res.data.data;
        }
      });
    },
    // 切换状态
    switchStatus(row) {
      row.status = row.status == 1? 0: (row.status == 0 ? 1: '')
      this.editPort(row, row.status);
    },
    // 点击成员授权
    memberAuthClick(row) {
      this.authForm.group_id = row.id;
      this.userbyRoleList(row.id, true);
    },
    // 根据角色获取用户
    userbyRoleList(id, isDia) {
      this.authMember = [];
      role.userbyRole.r({group_id: id}).then(res => {
        this.authDialogVisible = isDia;
        this.authMember = res.data.data;
      });
    },
    // 党员库选择之后 多选
    memberChoosen(arr) {
      // console.log('member',arr);
      if(!arr.length) {
        this.$message({ message: "请选择成员", type: "warning" });
        return
      }else {
        this.$refs.mpicker.handleClose();
      }
      let uids = []
      arr.map(a=> {
          uids.push(a.uid)
      })
      this.memberSubmit(uids, this.authForm.group_id);
    },
    memberSubmit(uidArr,gid) {
      let params = {
        group_id: gid,
        uid: uidArr,
      }
      role.create.r(params).then(res => {
        this.userbyRoleList(gid, true);
      });
    },
    // 成员授权-解除授权
    removeAuth(item) {
      if (!item) {
        return null;
      }
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        role.delAuth.r(item).then(res => {
          if(res.data.status == '200') {
            this.userbyRoleList(item.group_id, true);
            this.$message({ message: "解除成功", type: "success" });
          }
        });
      });
    },
    save() {
      let vm = this;
      vm.$refs["editForm"].validate(valid => {
        if (valid) {
          let formData = util.deepcopy(vm.editForm);

          if (!formData.id) {
            role.add.r(formData).then(() => {
              vm.dialogVisible = false;
              vm.fetchData();
              vm.$message({ message: "添加成功", type: "success" });
            });
          } else {
            this.editPort(formData);
          }
        }
      });
    },
    // 编辑更新接口
    editPort(data, status) {
      let vm = this;
      role.edit.r(data).then(() => {
        vm.dialogVisible = false;
        vm.fetchData();
        if(status == 1) {// 禁用
          this.$message({ message: "启用成功", type: "success" });
        }else if(status == 0) {
          this.$message({ message: "禁用成功", type: "success" });
        }else {
          vm.$message({ message: "编辑成功", type: "success" });
        }
      });
    },
    resetForm: function() {
      this.editForm = {
        title: "",
        description: "",
        rules: []
      };
      this.authForm = {}
      this.$refs["editForm"] && this.$refs["editForm"].resetFields();
    },
    // 启用
    on(row) {
      role.on.r({id: row.id}).then(res => {
        if(res.data.status == '200') {
          this.fetchData();
          this.$message({ message: "启用成功", type: "success" });
        }
      });
    },
    // 禁用
    forbid(row) {
      role.forbid.r({id: row.id}).then(res => {
        if(res.data.status == '200') {
          this.fetchData();
          this.$message({ message: "禁用成功", type: "success" });
        }
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
        role.remove.r({id:item.id}).then(() => {
          this.fetchData();
          this.$message({
            message: "删除成功",
            type: "success"
          });
        });
      });
    },
    handleCurrentChange: function(currentPage) {
      this.queryParam.p = currentPage;
      this.fetchData();
    },
    fetchData: function(reload) {
      if (reload) {
        this.queryParam.page = 1;
      }
      this.loading = true;
      role.list.r(this.queryParam).then(res => {
        this.loading = false;
        this.list = res.data.data;
        // this.queryParam.pagesize = res.data.pageSize;
        this.queryParam.totalRows = res.data.totalRows;
      });
    }
  },
  created: function() {
    this.fetchData();
  }
};
</script>

<style scoped>
* { box-sizing: border-box; }
>>> .el-drawer .el-drawer__body { height: calc(100% - 100px); }
.demo-drawer__content,
.demo-drawer__footer { padding: 0 20px; }
.demo-drawer__footer { margin-bottom: 20px; }
</style>
