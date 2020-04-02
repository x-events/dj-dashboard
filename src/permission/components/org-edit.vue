<template>
  <div class="flex-col" style="height:100%;" v-loading="loading">
    <div class="demo-drawer__content flex-1" style="overflow:auto">
      <el-form class="scrollbar" :model="editForm" :rules="rules" ref="editForm" :label-width="formwidth" size="medium" label-suffix=":">
          <el-row class="form-row">
              <el-col :span="12">
                  <el-form-item class="col-name" label="党组织全称" prop="name">
                      <el-input v-model="editForm.name" placeholder="请输入党组织全称" maxlength="50"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item class="col-name" label="党组织简称" prop="short_name">
                      <el-input v-model="editForm.short_name" placeholder="请输入党组织简称" maxlength="50"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item class="col-name" label="党组织隶属关系" prop="relation_name">
                      <el-input v-model="editForm.relation_name" readonly placeholder="请选择隶属关系" 
                      @focus="treepickerDialog=true;treeType='2';treeTitle='党组织隶属关系'"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item class="col-name" label="上级党组织" prop="pid_name">
                      <div class="el" :title="editForm.pid_name">{{editForm.pid_name || ""}}</div>
                  </el-form-item>
              </el-col>
              <!-- <el-col :span="12">
                  <el-form-item class="col-name" label="级别" prop="level">
                      <selectOpt v-model="editForm.level" placeholder="请选择级别" :option="leavelData" @input="editForm.level=$event" v-if="!disabledTag" />
                      <span class="sblock" :title="editForm.level_name" v-else>{{editForm.level_name || ""}}</span>
                  </el-form-item>
              </el-col> -->
              <el-col :span="24">
                  <el-form-item class="col-name" label="党组织类别" prop="type">
                      <el-input v-model="editForm.type_name" readonly placeholder="请选择党组织类别" 
                      @focus="treepickerDialog=true;treeType='1';treeTitle='党组织类别'" ></el-input>
                  </el-form-item>
              </el-col>
              <!-- <el-col :span="12">
                  <el-form-item class="col-name" label="是否为党支部" prop="status">
                      <el-radio-group v-model="editForm.status" v-if="!disabledTag">
                          <el-radio label="1">是</el-radio>
                          <el-radio label="0">否</el-radio>
                      </el-radio-group>
                      <span class="sblock" :title="(editForm.status=='1'?'是':'否')" v-else>{{(editForm.status=='1'?'是':'否') || ""}}</span>
                  </el-form-item>
              </el-col> -->
              <el-col :span="24" v-if="coverTag==1">
                  <el-form-item class="col-name" label="覆盖企业数">
                      <el-input type="number" maxlength="10" :oninput="oninput(10,'cover_com_num')" v-model="editForm.cover_com_num" placeholder="请输入覆盖数量"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="24" v-if="coverTag==1">
                  <el-form-item class="col-name" label="覆盖企业名称">
                      <el-input v-model="editForm.cover_com_name" placeholder="请输入覆盖名称" maxlength="300"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="24" v-if="coverTag==2">
                  <el-form-item class="col-name" label="覆盖居民总数">
                      <el-input type="number" maxlength="10" :oninput="oninput(10,'cover_person_num')" v-model="editForm.cover_person_num" placeholder="请输入覆盖数量"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="24" v-if="coverTag==2">
                  <el-form-item class="col-name" label="覆盖居民楼院">
                      <el-input v-model="editForm.cover_building_name" placeholder="请输入覆盖名称" maxlength="300"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item class="col-name" label="党组织编码">
                      <el-input v-model="editForm.code" placeholder="请输入党组织编码" maxlength="50"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item class="col-name" label="排序">
                      <el-input v-model="editForm.sort" placeholder="请输入排序" type="number" max="3" :oninput="oninput(3,'sort')"></el-input>
                  </el-form-item>
              </el-col>
              <!-- 2019-8-20 确定不展示 -->
              <!-- <el-col :span="24" v-if="editForm.id">
                  <el-form-item class="col-name" label="党组织书记">
                      <span class="sblock" :title="editForm.secretary">{{editForm.secretary || ""}}</span>
                  </el-form-item>
              </el-col>
              <el-col :span="24" v-if="editForm.id">
                  <el-form-item class="col-name" label="单位">
                      <span class="sblock" :title="editForm.company">{{editForm.company || ""}}</span>
                  </el-form-item>
              </el-col> -->
              <el-col :span="12">
                  <el-form-item class="col-name" label="批准建立党组织日期">
                      <el-date-picker type="date" placeholder="请选择日期" value-format="yyyy-MM-dd" v-model="editForm.approve_at" style="width: 100%;"></el-date-picker>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item class="col-name" label="批准建立党组织文号">
                      <el-input v-model="editForm.number" placeholder="请输入批准建立党组织文号" maxlength="50"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="24">
                  <el-form-item class="col-name" label="建立党组织原因">
                      <el-input v-model="editForm.reason" type="textarea" :rows="3" placeholder="请输入建立党组织原因" maxlength="300"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item class="col-name" label="任期(年)">
                      <el-input v-model="editForm.tenure" placeholder="请输入任期" type="number" maxlength="5" :oninput="oninput(5,'tenure')"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item class="col-name" label="换届时间">
                      <el-date-picker type="date" placeholder="请选择日期" value-format="yyyy-MM-dd" v-model="editForm.change_time" style="width: 100%;"></el-date-picker>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item class="col-name" label="所属社区">
                      <el-select v-model="editForm.community_id" placeholder="请选择所属社区" style="width:100%;">
                          <el-option :label="item.name" :value="item.id" :key="index" v-for="(item, index) in communityData"></el-option>
                      </el-select>
                    <!-- <dictSelect v-model="editForm.community_id" placeholder="请选择所属社区" params="47" @input="editForm.community_id=$event"/>  -->
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item class="col-name" label="工作地址">
                      <el-input v-model="editForm.addr" placeholder="请输入地址" maxlength="200"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item class="col-name" label="联系方式">
                      <el-input v-model="editForm.tel" placeholder="请输入联系方式" maxlength="20"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item class="col-name" label="联系人">
                      <el-input v-model="editForm.contacts" placeholder="请输入联系人" maxlength="50"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item class="col-name" label="党小组数">
                      <el-input v-model="editForm.group_num" placeholder="请输入党小组数" type="number" maxlength="10" :oninput="oninput(10,'group_num')"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="12">
                  <el-form-item class="col-name" label="农民专业合作社组织数">
                      <el-input v-model="editForm.org_num" placeholder="请输入农民专业合作社组织数" type="number" maxlength="10" :oninput="oninput(10,'org_num')"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="24">
                  <el-form-item class="col-name" label="备注">
                      <el-input v-model="editForm.remark" type="textarea" :rows="3" placeholder="请输入备注" maxlength="300"></el-input>
                  </el-form-item>
              </el-col>
              <el-col :span="24" class="map-content">
                  <el-form-item label="位置">
                      <bdmap class="map" :data="editForm.address" :getPoint="true" :centerPoint="centerPoint" @callPoint="getMapPoint"></bdmap>
                  </el-form-item>
              </el-col>
              <el-col :span="24">
                  <el-form-item label="坐标点">
                      <el-input v-model="editForm.zuobiao" @input="mapInputChange" placeholder="请输入坐标点"></el-input>
                  </el-form-item>
              </el-col>
          </el-row>
      </el-form>
    </div>
    <div class="demo-drawer__footer btn_footer">
      <div class="el-form-item">
        <div class="el-form-item__label" :style="{width:`${formwidth}`}">&emsp;</div>
        <div class="el-form-item__content">
          <el-button type="primary" @click="submitForm('editForm')">保存</el-button>
          <el-button @click="$emit('cancel')">取消</el-button>
        </div>
      </div>
    </div>
    <treePicker :visible="treepickerDialog" @close="treepickerDialog=false" 
      :typeId="treeType" :title="treeTitle" @choosen="treechoosenPicker" />
  </div>
</template>

<script>
import * as port from "../api/orgmanager";
import * as allcommon from "@/common/api/common";
import * as community from "@/basedata/api/community";

const TEMP = {
  short_name: '',
  name: '',
  relation: '',
  relation_name: '',
  pid: '',
  pid_name: '',
  level: '',
  type: '',
  status: '0',
  type_name: '',
  cover_com_num: '',
  cover_person_num: '',
  cover_com_name: '',
  cover_building_name: '',
  secretary: '',
  company: '',
  approve_at: '',
  number: '',
  reason: '',
  tenure: '',
  community_id: '',
  community_name: '',
  addr: '',
  tel: '',
  contacts: '',
  change_time: '',
  code: '',
  sort: '',
  group_num: '',
  org_num: '',
  remark: '',
  lat: "",
  lng: "",
  address: [{
      lat: "39.92474600",
      lng: "116.48578600"
  }],
  address: [],
  zuobiao: '',
}

export default {
  props: {
    data: {
      type: Object,
      required: false,
      default: function(){
        return {}
      }
    },
    dialogVisible:{
      type: Boolean,
      required: false,
      default: function(){
        return false
      }
    },
  },
  components: {
    dictSelect: (resolve) => require(['@/common/components/dictSelect.vue'], resolve),
    treePicker: (resolve) => require(['@/common/components/treePicker.vue'], resolve),
    bdmap: (resolve) => require(['@/common/components/bdmap.vue'], resolve)
  },
  data() {
    return {
      loading:true,
      editForm: TEMP,
      rules: {
          name: [ { required: true, message: '请输入党组织全称', trigger: 'change' }],
          short_name: [ { required: true, message: '请输入党组织简称', trigger: 'change' } ],
          relation_name: [ { required: true, message: '请选择隶属关系', trigger: 'change' }],
          level: [ { required: true, message: '请选择级别', trigger: 'change' }],
          type: [ { required: true, message: '请选择党组织类别', trigger: 'change' }],
          // status: [ { required: true, message: '请选择是否为党支部', trigger: 'change' }],
      },
      queryParam:{
        id:""
      },
      coverTag: 0,
      treepickerDialog: false,        // 树弹窗
      treeType: '',       // tree下拉框类型
      treeTitle: '',      // tree下拉框title
      communityData: [],
      centerPoint: this.$root.mapcenter,
      formwidth: '165px'
    }
  },
  watch: {
    data: {
      handler: function(data){
        if(data && data.id){
          this.queryParam.id = data.id;
          this.$nextTick(()=>{
            this.fetchData()
          })
        }else{
          this.editForm = Object.assign({}, TEMP, data)
        }
        this.getDicData();
      },
      deep: true, 
      immediate: true
    },
    dialogVisible(){
      //弹窗开启关闭重置表单
      // this.editForm = {}
      this.resetForm('editForm');
    },
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName] && this.$refs[formName].resetFields();
    },
    submitForm() {
      this.$refs['editForm'].validate((valid) => {
        if (valid) {
          port.save.r(this.editForm).then(res => {
            if(res.data.status == '200') {
              this.$message.success(res.data.message);
              this.$emit('submit')
            }
          });
        } 
      });
    },
    oninput(len,field) {
        if(this.editForm[field] && this.editForm[field].length> len) this.editForm[field]=this.editForm[field].slice(0, len)
    },
    // 地图获取坐标
    getMapPoint(data) {
        // lng,lat
        this.editForm.lng = data[0]
        this.editForm.lat = data[1]
        this.$set( this.editForm, 'zuobiao', data.join(','))
    },
    // 监听坐标点input赋值并给地图赋值
    mapInputChange(val) {
        let data = val.split(',')
        this.editForm.lng = data[0]
        this.editForm.lat = data[1]
        this.mapSet(data)
    },
    mapSet(data) {
        this.editForm.address = [{
            lng: data[0],
            lat: data[1]
        }]
        this.centerPoint = data
    },
    // 选择党组织
    groupTypeChange(val) {
        console.log('s-val',val);
        // this.editForm.cover_com_num = ''
        // this.editForm.cover_com_name = ''
        // this.editForm.cover_person_num = ''
        // this.editForm.cover_building_name = ''
        this.editForm.type = val
        let arr1 = [26, 21, 22, 23, 30]         // 覆盖企业数 1
        let arr2 = [24, 12, 13, 20]             // 覆盖居民楼 2
        if(arr1.indexOf(Number(val)) > -1) {           // 存在企业
            this.coverTag = 1
        }else if(arr2.indexOf(Number(val)) > -1) {     // 存在居民
            this.coverTag = 2
        }else {
            this.coverTag = 0
        }
    },
    // 树下拉列表
    treechoosenPicker(type, obj) {
        let field_id = '';
        let field_name = '';
        if(type == '1') {
            field_id = 'type'
            field_name = 'type_name'
            this.groupTypeChange(obj==null?'':obj.value)
        } else if(type == '2') {
            field_id = 'relation'
            field_name = 'relation_name'
        }
        if( Object.keys(obj!=null && obj).length == 0) {
            this.editForm[field_id] = ''
            this.editForm[field_name] = ''
            return 
        }
        
        this.editForm[field_id] = obj.value
        this.editForm[field_name] = obj.name
        
    },
    // 清空为0的数据
    set0Val(fieldArr) {
        for (const key in fieldArr) {
            this.editForm[fieldArr[key]] = this.editForm[fieldArr[key]] == '0'?'':this.editForm[fieldArr[key]];
        }
    },
    getDicData() {
        // // 级别
        // common.getDictData_tree({id: 3}).then( res => {
        //     this.leavelData = res.data.data
        // })
        // // 企业规模 单位规模
        // common.getDictData_tree({id: 'com_scale'}).then( res => {
        //     this.comScaleData = res.data.data
        // })
        // // 企业登记注册类型 
        // common.getDictData_tree({id: 'unit_reg_type'}).then( res => {
        //     this.unitRegData = res.data.data
        // })
        // 所属社区
        community.community.r({id: 47}).then( res => {
            this.loading = false;
            this.communityData = res.data.data
        })
    },
    fetchData() {
      //获取课程详情
      this.loading = true;
      port.detail.r(this.queryParam).then(res => {
        this.loading = false;
        if(res.data.status == '200') {
          this.editForm = res.data.data;
          this.groupTypeChange(this.editForm.type)
          this.set0Val(['community_id','sort'])
          if((res.data.data.lng == '' && res.data.data.lat == '') || +res.data.data.lng == 0 && +res.data.data.lat == 0) {
              return
          }
          let addr = [res.data.data.lng, res.data.data.lat]
          this.mapSet(addr)
          this.$set(this.editForm, 'zuobiao', addr.join(','))
        }
      });
    }
  }
}
</script>

<style scoped>
.el-form,
.demo-drawer__footer { padding: 0 20px; }
.el-form .map-content {height: 400px; margin-bottom: 20px;}
.el-form .map-content .el-form-item,
.el-form .map-content .el-form-item__label { height: 100%; line-height: 400px; }
.el-form .map-content .el-form-item__content { padding: 0; }
.el-form .map-content .map {width: 100%;height: 400px;overflow: hidden;position: relative;}
.btn_footer .el-form-item { margin: 0; }
.btn_footer .el-form-item__content { line-height: 70px;}
.demo-drawer__content >>> .el-form-item{min-height: 40px;}
</style>
