<template>
  <div class="memberPickerList"
    :class="{'is-required': requiredvalue}">
    <!-- head -->
    <div class="memberPickerList_hd">
      <div class="_title">
        负责人信息
      </div>
      <el-row v-if="!disabled">
        <el-col :span="24" class="_tr">
          <el-button size="small" type="primary" @click="pickerDialog=true">党员库选择</el-button>
          <el-button size="small" type="primary" @click="formDialog=true">手动添加</el-button>
        </el-col>
      </el-row>
    </div>
    <!-- list -->
    <el-table
      :data="list"
      style="width: 100%">
      <el-table-column
        label="姓名">
        <template slot-scope="scope">
          {{scope.row.realname || scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column
        label="性别"
        width="180">
        <template slot-scope="scope">
          {{scope.row.sex=='0' ? '男' : '女'}}
        </template>
      </el-table-column>
      
      <el-table-column
        label="出生日期">
        <template slot-scope="scope">
          {{formatDate(scope.row.birth_timestamp || scope.row.birth, true)}}
        </template>
      </el-table-column>
      <el-table-column
        label="是否党员"
        width="180"
        align="center"
        >
        <template slot-scope="scope">
          {{scope.row.isMember=='0' ? '否' : '是'}}
        </template>
      </el-table-column>
      <el-table-column
        label="添加方式"
        width="180">
        <template slot-scope="scope">
          {{!scope.row.uid || scope.row.uid=='0' ? '手动添加' : '党员库选择'}}
        </template>
      </el-table-column>
      <el-table-column
        v-if="!disabled"
        label="操作">
        <template slot-scope="scope">
          <!-- <el-button v-if="!scope.row.uid || scope.row.uid=='0'" type="text" @click="editIndex=scope.$index;editItem(scope.row)">编辑</el-button> -->
          <el-button type="text" @click="delItem(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    
  </div>
</template>

<script>
import * as util from "@/common/assets/util";

//编辑标记
let editIndex = null;

export default {
  props: {
    labelname: {
      type: String,
      required: true,
      default: '请输入'
    },
    labelwidth: {
      type: Number,
      required: false,
      default: 80
    },
    propvalue: {
      type: Array,
      required: false,
      default: function(){
        return {
          list: []
        }
      }
    },
    propdata: {
      type: Array,
      required: false,
      default: function(){
        return []
      }
    },
    requiredvalue: {
      type: Boolean,
      required: false,
      default: false
    },
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  data() {
      return {
        pickerDialog: false,
        formDialog: false,
        list: [],
        editData: {},
        editIndex: null
      }
  },
  watch: {
    propvalue: {
      handler: function(propvalue){
        if(propvalue && Array.isArray(propvalue)){
          this.list = [].concat(propvalue.map(e => {
            e.name = e.leader_name;
            e.sex = e.leader_sex;
            e.birth = e.leader_birth;
            e.isMember = e.leader_is_party;

            return e
          }))
          
        }
      },
      immediate: true
    },
    list: {
      handler: function(list){
        const result = list.map(e => {
          return {
            "uid": e.uid || '0',
            "leader_name": e.name,
            "leader_sex": e.sex,
            "leader_birth": e.birth_timestamp || e.birth,
            "leader_is_party": e.isMember
          }
        })
        this.$emit('change', result)
      },
      deep: true
    }
    
  },
  methods: {
    editItem: function(item){
      this.editData = item;
      this.formDialog = true;
    },
    delItem: function(index){
      this.list.splice(index,1)
    }, 
    pickMember: function(member){

      this.list=[member]
    },
    addMember: function(memberObj){
      this.list = [memberObj]
    },
    formatDate: util.formatDate
  },
  created: function(){
    
    // 重置事件
    util.on('resetWidgets', () => {
      this.list = []
    })
  }
};
</script>

<style scoped>
.memberPickerList{padding-left: 120px;margin:25px 0;}
.memberPickerList_hd{ border: 1px solid rgba(222,227,232,1); border-radius: 6px;margin-bottom:15px;}
.memberPickerList_hd ._title{text-align: center;font-size:16px;height: 3em; line-height: 3em;background: linear-gradient(0deg,rgba(255,255,255,1),rgba(232,236,246,1));
border-bottom: 1px solid rgba(222,227,232,1); }
.memberPickerList_hd ._tr{text-align: right;}
.memberPickerList_hd .el-col{padding: 10px;}

</style>
