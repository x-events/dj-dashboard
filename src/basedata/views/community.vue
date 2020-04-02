<template>
  <div class="flex-row" v-loading="loading">
    <div class="sideBar blockLayout scrollbar">
      <community-tree ref="tree" :current_node_key="current_node_key" @nodeClick="handleNodeClick" v-if="!isShow" />
    </div><!-- @firstCheckValue="default_org" -->
    <div class="flex-1 blockLayout scrollbar">
      <div class="flex-row align-center toolBar">
        <div class="flex-1">
          <!-- title -->
        </div>
        <el-input v-has="port.list" v-model="queryParam.keywords" @keyup.native.enter="fetchData(true)"
          placeholder="请输入社区名称" size="small" class="search"></el-input>
        <el-button v-has="port.list" @click="fetchData(true)" type="primary" size="small">查询</el-button>
        <el-button v-has="port.save" @click="createNew" :disabled="(currentTree.value ? currentTree.value:'').indexOf('Street')==-1" 
          type="primary" size="small" icon="el-icon-plus">新增社区</el-button>
      </div>
      <!-- list -->
      <el-table stripe :data="list" style="width: 100%">
        <el-table-column prop="name" label="社区名称"></el-table-column>
        <el-table-column prop="code" label="社区代码"></el-table-column>
        <el-table-column prop="create_username" label="创建人"></el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="130">
          <template slot-scope="scope">{{ scope.row.create_time | date() }}</template>
        </el-table-column>
        <el-table-column prop="area1" label="照片" width="50">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="showPhotos(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        
        <el-table-column label="操作" align="right" width="150">
          <template slot-scope="scope">
            <el-button size="mini" plain type="primary" v-has="port.save" @click="handleEdit(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" plain v-has="port.remove" @click="handleRemove(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- page -->
      <page :length="list.length" :p="queryParam.p" :pagesize="queryParam.pagesize" :total="queryParam.totalRows" @current-change="handleCurrentChange" />
    </div>
    <!-- 弹窗 -->
    <el-dialog
      :title="`${!editForm.id?'新增':'编辑'}社区`"
      :visible.sync="dialogVisible"
      width="800px"
      @closed="resetForm">
      <el-form size="small" ref="editForm" :rules="rules" :model="editForm" label-width="100px">
        <el-form-item label="所属">
          {{ editForm.community_name }}
        </el-form-item>
        <el-form-item label="社区名称" prop="name">
          <el-input v-model="editForm.name" maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="社区代码">
          <el-input v-model="editForm.code" maxlength="20" type="text" oninput="value=value.replace(/[^0-9.]/g,'')"></el-input>
        </el-form-item>
        <el-form-item label="总面积" prop="area">
          <el-input v-model="editForm.area" style="width:95%" type="number" maxlength="10" :oninput="oninput(10,'area')"></el-input> km²
        </el-form-item>
        <el-form-item label="坐标范围">
          <el-input type="textarea" rows="8" v-model="editForm.range" maxlength="200"></el-input>
        </el-form-item>
        <el-form-item label="坐标中心">
          <el-input v-model="editForm.center" maxlength="30"></el-input>
        </el-form-item>
        <el-form-item label="gis定位点">
          <el-input v-model="editForm.gis" maxlength="30"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm">确 定</el-button>
      </span>
    </el-dialog>
    <el-drawer title="查看照片" :visible.sync="photoDialogVisible" direction="rtl" size="360px" @close="closeDialog">
      <div class="flex-col photo-dialog">
        <div class="el">所属：{{ curPhotoInfo.community }}</div>
        <qiniu btn_text="上传照片" :multiple="false" accept="img" :show_file_list="true" 
          :propvalue="curPhotoInfo.list" @success="uploadCoverSuccess" @remove="removePhoto" />
        <nodata class="flex-1" mode="" v-if="!curPhotoInfo.list.length && !loading" />
      </div>
    </el-drawer>
  </div>
</template>

<script>
import * as util from "@/common/assets/util";
import * as common from "@/basedata/api/common";
import * as port from "@/basedata/api/community";
import * as allcommon from "@/common/api/common";

export default {
  components: {
    "community-tree": (resolve) => require(['../components/community-tree.vue'], resolve)
  },
  data () {
    return {
      port,
      loading: false,
      list: [],
      queryParam: {
        pagesize: 10,
        p: 1,
        totalRows: 0,
        keywords: '',
        node: ''
      },
      editForm: {},
      rules: {
        name: [{ required: true, message: "请输入街乡名称", trigger: "blur" }],
        area: [{ required: true, message: "请输入总面积", trigger: "blur" }]
      },
      dialogVisible: false,
      currentTree: {},
      treeData: [],
      photoDialogVisible: false,
      curPhotoInfo: {
        list: []
      },
      current_node_key: '',   // 当前选中树节点 第一项
      isShow: true,           // 渲染树第一项数据
    }
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
      deep: true,
      immediate: true
    },
    'editForm.area'(val) {
        let result = parseFloat(val);
        if(isNaN(result)) {
            result = ''
        }else {
            if(result > 999999.9999) {
                result = 999999.9999
            }
            if(result < 0) {
                result = 0
            }
        }
        this.editForm.area = result;
    }
  },
  methods: {
    oninput(len,field) {
        if(this.editForm[field] && this.editForm[field].length> len) this.editForm[field]=this.editForm[field].slice(0, len)
    },
    uploadCoverSuccess(data){
      if(data.id){
        this.curPhotoInfo.file_id = data.id;
        allcommon.filesave.r(this.curPhotoInfo).then((res) => {
          if(res.data.status == '200') {
            this.$message.success(res.data.message);
            this.photoDetail(this.curPhotoInfo.listid);
          }
        });
      }
    },
    removePhoto(file) {
        if(!file.id) return
        allcommon.fileremove.r({id: file.id}).then((res) => {
          if(res.data.status == '200') {
            this.$message.success(res.data.message);
            this.photoDetail(this.curPhotoInfo.listid);
          }
        });
    },
    showPhotos(row) {
      this.photoDialogVisible = true;
      this.photoDetail(row.id);
    },
    photoDetail(id) {
      allcommon.filelist.r({lev: 'community', id: id}).then((res) => {
        if(res.data.status == '200') {
          this.curPhotoInfo = {
            community: res.data.data.community,
            model: res.data.data.model,
            data_id: res.data.data.data_id,
            list: res.data.data.list,
            type: '1',    // web端调用该接口type为1，移动端type为2
            listid: id
          }
        }
      });
    },
    closeDialog(){
      this.photoDialogVisible=false;
      this.curPhotoInfo = {
        list: []
      }
    },
    handleNodeClick(data) {
      this.currentTree = data;
      this.queryParam.node = data.value;
      this.queryParam.keywords = '';
    },
    createNew: function(){
      this.editForm.district_id = this.currentTree.district_id;
      this.editForm.community_name = `${this.currentTree.district_name}/${this.currentTree.name}`;
      this.editForm.street_id = this.currentTree.id;
      this.dialogVisible=true;
    },
    handleEdit (row){
      port.detail.r({id: row.id}).then(res => {
        if(res.data.status == '200') {
          this.editForm = res.data.data;
          this.editForm.community_name = `${res.data.data.district_name}/${res.data.data.street_name}`;
          this.dialogVisible = true;
        }
      });
    },
    handleRemove(row) {
      if (!row) {
        return null;
      }
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定", cancelButtonText: "取消", type: "warning"
      }).then(() => {
        port.remove.r(row).then((res) => {
          if(res.data.status == '200') {
            this.$message({ message: "删除成功", type: "success" });
            this.fetchData();
          }
        });
      });
    },
    submitForm() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          port.save.r(this.editForm).then(res => {
            if(res.data.status == '200') {
              this.dialogVisible = false;
              this.fetchData();
            }
          });
        } 
      });
    },
    resetForm (){
      this.editForm = {};
      this.$refs['editForm'] && this.$refs['editForm'].resetFields();
    },
    handleCurrentChange(val) {
      this.queryParam.p = val;
      this.fetchData();
    },
    // 获取树第一条节点并赋值  原因组件中无法选中该样式
    fetchTree () {
      common.district_tree.r().then(res => {
        this.isShow = false;
        this.treeData = util.buildMenu(res.data.data, "parent_id");

        if(this.treeData[0] && this.treeData[0].value){
          this.current_node_key = this.treeData[0].value;
          this.currentTree = this.treeData[0];
          this.queryParam.node = this.treeData[0].value;
        }
      });
    },
    fetchData (reload) {
      let treeid = this.currentTree.value;
      if(!treeid){
        return console.warn('参数错误')
      }
      if (reload) {
        this.queryParam.p = 1;
      }
      this.loading = true;
      port.list.r(this.queryParam).then(res => {
        this.loading = false;
        this.list = res.data.data
        // this.queryParam.pagesize = res.data.pageSize;
        this.queryParam.totalRows = res.data.totalRows;
      })
    }
  },
  created() {
    this.fetchTree();
  },
}
</script>

<style scoped>
>>> .el-drawer .el-drawer__body { padding: 0 20px 20px; overflow: auto; }
.photo-dialog { height: 100%; overflow: auto; }
</style>
