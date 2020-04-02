<template>
  <div class="memberPickerList"
    :class="{'is-required': requiredvalue}">
    <!-- head -->
    <div class="_money_hd">
      <div class="_money_title">
        党员名册
      </div>
      <el-row>
        <el-col :span="6">
          党员数量：{{list.length}}
        </el-col>
        <el-col :span="6">
          已缴纳人数：{{list.filter(e => e.status).length}}
        </el-col>
        <el-col :span="6">
          应收金额：{{totalMoney}}
        </el-col>
        <el-col :span="6" class="_tr">
          已收金额：{{gotMoney}}
        </el-col>
      </el-row>
    </div>
    <!-- list -->
    <el-table
      :data="list"
      style="width: 100%">
      <el-table-column
        prop="realname"
        label="党员">
      </el-table-column>
      <el-table-column
        prop="dues"
        label="应缴党费（元）">
      </el-table-column>
      <el-table-column
        label="已缴纳">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.status" :disabled="disabled"></el-checkbox>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import * as util from "@/common/assets/util";

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
        return []
      }
    },
    propdata: {
      type: String,
      required: false
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
    },
    ext_props: {
      type: Object,
      required: false,
      default: function(){
        return {
          input_month: ''
        }
      }
    }
  },
  data() {
      return {
        pickerDialog: false,
        formDialog: false,
        list: [],
        value: [],
        totalMoney: 0
      }
  },
  computed: {
    gotMoney: function(){
      let all = 0;
      this.list.filter(e => e.status).forEach(e => {
        all += e.dues
      })
      return all
    }
  },
  watch: {
    ext_props: {
      handler: function(){
        
      },
      deep: true,
      immediate: true
    },
    propvalue: function(){
      this.value = [].concat(this.propvalue)
    },
    value: {
      handler: function(){
        this.list = this.list.map(member => {
          if(this.value.indexOf(member.uid)!=-1){
            member.status = true;
          }else{
            member.status = false;
          }
          return member
        })
      },
      deep: true
    },
    list: {
      handler: function(){
        const result = {
          uids: this.list.filter(e => e.status).map(e => e.uid),
          list: this.list
        }
        this.$emit('change', result)
      },
      deep: true
    }
  },
  methods: {
    
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
.memberPickerList ._money_hd{ border: 1px solid rgba(222,227,232,1); border-radius: 6px;margin-bottom:15px;}
.memberPickerList ._money_hd ._money_title{text-align: center;font-size:16px;height: 3em; line-height: 3em;background: linear-gradient(0deg,rgba(255,255,255,1),rgba(232,236,246,1));
border-bottom: 1px solid rgba(222,227,232,1); }
.memberPickerList ._money_hd ._tr{text-align: right;}
.memberPickerList ._money_hd .el-col{padding: 10px;}

</style>
