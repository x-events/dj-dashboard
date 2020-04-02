<template>
  <div class="memberPickerList"
    :class="{'is-required': requiredvalue}">
    <!-- head -->
    <div class="memberPickerList_hd">
      <div class="_title">
        新增党员名册
      </div>
      <el-row>
        <el-col :span="disabled ? 8:6">
          党员数量：{{count}}
        </el-col>
        <el-col :span="disabled ? 8:6">
          新增党员：{{add_count}}
        </el-col>
        <el-col :span="disabled ? 8:6">
          转入党员：{{transfer_count}}
        </el-col>
        <el-col :span="6" class="_tr" v-if="!disabled">
          <el-button size="small" type="primary" @click="formDialog=true">新增党员</el-button>
          <el-button size="small" type="primary" @click="pickerDialog=true">转入党员</el-button>
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
        prop="card"
        label="身份证号">
      </el-table-column>
      <el-table-column
        label="出生日期">
        <template slot-scope="scope">
          {{formatDate(scope.row.birth_timestamp || scope.row.birth, true)}}
        </template>
      </el-table-column>
      <el-table-column
        v-if="!disabled"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="!scope.row.uid || scope.row.uid=='0'" type="text" @click="editIndex=scope.$index;editItem(scope.row)">编辑</el-button>
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
      type: Object,
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
        count: 0,
        add_count: 0,
        transfer_count: 0,
        editData: {},
        editIndex: null
      }
  },
  watch: {
    propvalue: {
      handler: function(propvalue){
        if(propvalue && Array.isArray(propvalue.list)){
          this.list = [].concat(propvalue.list)
          this.count = propvalue.count
          this.add_count = propvalue.add_count
          this.transfer_count = propvalue.transfer_count
        }
      },
      immediate: true
    },
    list: {
      handler: function(list){
        const add_count = list.filter(e => !e.uid).length;
        const transfer_count = list.length - add_count;
        this.count = list.length
        this.add_count = add_count
        this.transfer_count = transfer_count

        this.$emit('change', {
          count: this.count,
          add_count: this.add_count,
          transfer_count: this.transfer_count,
          list: list
        })
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
    pickMember: function(memberArray){
      //去重
      let listBack = [].concat(this.list);
      memberArray = memberArray.filter(m => {
        return listBack.map(e => e.uid).indexOf(m.uid)===-1
      })
      this.list=listBack.concat(memberArray)
    },
    addMember: function(memberObj){
      if(this.editIndex!==null){
        this.delItem(this.editIndex)
      }
      this.list.push(memberObj)
      this.editIndex = null
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
