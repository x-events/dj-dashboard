<template>
  <div class="scrollbar blockLayout" v-loading="loading">
    <div class="flex-row align-center toolBar">
      <div class="flex-1">
        <!-- page title -->
      </div>
      <el-button
        v-has="resource.add"
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="editForm.type=1;editForm.pid=null;dialogVisible=true"
      >添加</el-button>
    </div>

    <div class="resourceWrap">
      <resourcePicker
        :listdata="list"
        @edit="edit"
        @append="append"
        @addResource="addResource"
        @remove="remove"
      />
    </div>

    <!-- 弹窗 -->
    <el-dialog
      :title="editForm.type==1 ? '路由信息' : '资源信息'"
      :visible="dialogVisible"
      width="800px"
      :show-close="false"
      :close-on-click-modal="false"
      @closed="resetForm"
    >
      <el-form size="small" ref="editForm" :rules="rules" :model="editForm" label-width="80px">
        <el-form-item label="名称" prop="title">
          <el-input v-model.trim="editForm.title"></el-input>
        </el-form-item>
        <el-form-item label="序号">
          <el-input v-model.trim="editForm.sort" type="number"></el-input>
        </el-form-item>
        <el-form-item label="方法" v-if="editForm.type!=1" prop="method">
          <el-select v-model="editForm.method" placeholder="请选择">
            <el-option
              v-for="(item, i) in rMethods"
              :key="'m'+i"
              :label="item.label"
              :value="item.label.toLowerCase()"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="editForm.type==1? '路由' : 'URL'" prop="url">
          <el-input v-model.trim="editForm.url"></el-input>
        </el-form-item>
        <el-form-item label="父级">
          <el-cascader
            v-model="editForm.pid"
            :options="list"
            :props="{ checkStrictly: true, label: 'title', value: 'id' }"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="save">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as util from "@/common/assets/util";
import * as resource from "../api/resource";

export default {
  components: {
    resourcePicker: resolve =>
      require(["../components/resourcePicker.vue"], resolve)
  },
  data() {
    const checkMethod = (rule, value, callback) => {
      if (this.editForm.type === 2 && !value) {
        return callback(new Error("请填写Method!"));
      } else {
        callback();
      }
    };

    return {
      resource,
      dialogVisible: false,
      loading: false,
      list: [],
      editForm: {
        pid: null,
        method: "get",
        title: '',
        url: ''
      },
      rules: {
        title: [{ required: true, message: "请输入名称", trigger: "blur" }],
        url: [{ required: true, message: "请输入路由/URL", trigger: "blur" }],
        method: [{ validator: checkMethod, trigger: "blur" }]
      },
      rMethods: [
        {
          label: "GET"
        },
        {
          label: "POST"
        },
        {
          label: "PUT"
        },
        {
          label: "DELETE"
        }
      ]
    };
  },
  methods: {
    edit: function(data) {
      this.editForm = JSON.parse(JSON.stringify(data));
      this.dialogVisible = true;
    },
    append(item) {
      this.editForm = {
        pid: item.id,
        type: 1,
        title: '',
        url: ''
      };
      this.dialogVisible = true;
    },
    addResource(item) {
      this.editForm = {
        pid: item.id,
        type: 2,
        method: "get",
        title: '',
        url: ''
      };
      this.dialogVisible = true;
    },
    save() {
      this.$refs["editForm"].validate(valid => {
        if (valid) {
          let formData = util.deepcopy(this.editForm);
          //处理pid
          if (Array.isArray(formData.pid)) {
            formData.pid = formData.pid[formData.pid.length - 1];
          }
          //处理method
          if (formData.method) {
            formData.method = formData.method.toLowerCase();
          }
          this.loading = true;
          if (!formData.id) {
            //添加菜单
            resource.add.r(formData).then(() => {
              this.fetchData();
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.dialogVisible = false;
            });
          } else {
            resource.edit.r(formData).then(() => {
              this.fetchData();
              this.$message({
                message: "编辑成功",
                type: "success"
              });
              this.dialogVisible = false;
            });
          }
        }
      });
    },
    resetForm: function() {
      this.$nextTick(function() {
        this.editForm = {};
        this.$refs["editForm"].resetFields();
      });
    },
    remove(item) {
      if (!item) {
        return null;
      }
      if(item.children) {
        this.$message({ message: "该菜单下还有子级或者资源", type: "error" });
        return
      }
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        resource.remove.r(item).then(() => {
          this.fetchData();
          this.$message({
            message: "删除成功",
            type: "success"
          });
        });
      });
    },
    fetchData: function() {
      this.loading = true;
      resource.list.r().then(res => {
        this.loading = false;
        //const menuArray = res.data.data.filter(e => e.type===1);
        this.list = util.buildMenu(res.data.data);
      });
    }
  },
  created: function() {
    this.fetchData();
  }
};
</script>

<style scoped>
</style>
