<template>
  <div class="blockLayout flex-col" v-loading="loading">
    <div class="toolBar flex-row">
      <div class="flex-1">
        <el-radio-group v-model="queryParam.type">
          <el-radio-button v-for="(tab, i) in tabList" :label="tab.value" :key="'tab'+i">{{tab.label}}</el-radio-button>
        </el-radio-group>
      </div>
      <el-button
        v-has="permission.webSave"
        type="primary"
        icon="el-icon-check"
        @click="submit()"
      >保存</el-button>
    </div>
    <div class="flex-1 scrollbar">
      <div class="permissions">
        <div class="parent" v-for="(item,index) in list" :key="'p'+index">
          <div class="toolBar ">
            <el-button type="primary" plain @click="edit(index)">编辑权限</el-button>
          </div>
          <template v-if="item[checkedKey]==1">
            <h3>{{item.name}}</h3>
          
            <div class="sub" v-for="(sub,si) in item.sub" :key="'sub'+si">
              <template v-if="sub[checkedKey]==1">
                <h4>{{sub.name}}</h4>
              
                <div class="s_sub" v-if="sub.sub">
                  <el-tag v-if="s_sub[checkedKey]==1" type="info" class="mytag" v-for="(s_sub,ssi) in sub.sub" :key="'s_sub'+ssi">
                    {{s_sub.name}}
                  </el-tag>
                </div>
              </template>
            </div>
          </template>
          
        </div>
      </div>
      
    </div>

    <el-dialog
      title="编辑权限"
      :visible.sync="dialogVisible"
      width="960px"
      @closed="handleClose"
      >
      <div class="permissions" v-if="currentData && currentData.id">
        <div class="parent">
          <el-checkbox v-model="currentData[checkedKey]"
            :true-label="1"
            :false-label="0"
            @change="syncKeys($event, currentData.sub, true)"
          >{{currentData.name}}</el-checkbox>
          <div class="sub" v-for="(sub,si) in currentData.sub" :key="'sub'+si">
            <el-checkbox v-model="sub[checkedKey]"
              :true-label="1"
              :false-label="0"
              @change="syncKeys($event, sub.sub)"
            >{{sub.name}}</el-checkbox>
            <div class="s_sub" v-if="sub.sub">
              <el-checkbox v-for="(s_sub,ssi) in sub.sub" :key="'s_sub'+ssi"
               v-model="s_sub[checkedKey]"
               :true-label="1"
              :false-label="0"
              :disabled="sub.type==2"
              >{{s_sub.name}}</el-checkbox>
            </div>
          </div>
        </div>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="applyChange">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as util from '@/common/assets/util';

import * as permission from '@/work/api/permission';

export default {
  data () {
    return {
      permission,
      loading: false,
      dialogVisible: false,
      list: [],
      tabList: [{
        label: '工委',
        value: 'work'
      },{
        label: '党委',
        value: 'party'
      },{
        label: '支部',
        value: 'branch'
      }],
      queryParam: {
        type: 'work'        // work:工委；party:党委；branch:支部
      },
      currentData: {},
      currentIndex: 0
    }
  },
  watch: {
    queryParam: {
      handler: function(){
        this.fetchData()
      },
      deep: true
    }
  },
  computed: {
    checkedKey: function(){
      let result;
      switch (this.queryParam.type) {
        case "work":
          result = 'work_checked'
          break;
        case "party":
          result = 'party_checked'
          break;
        case "branch":
          result = 'branch_checked'
          break;
        default:
          result = 'checked';
          break;
      }
      return result;
    },
    checkList: function(){
      const flatList = function(target, key){
        if(Array.isArray(target) && key){
          ([].concat(target)).forEach(e => {
            if(Array.isArray(e[key])){
              target = target.concat(flatList(e[key], key))
            }
          })
          return target;
        }
      }
      const flatArr = flatList(this.list, 'sub');
      return flatArr.filter(e => e[this.checkedKey]==1).map(e => e.id)
    }
  },
  methods: {
    setPush: function(list, deep){
      if(Array.isArray(list)){
        list.forEach((e, i) => {
           if(e[this.checkedKey]!==1){
             e[this.checkedKey] = 1
             if(deep && Array.isArray(list[i].sub)){
               this.setPush(list[i].sub)
             }
           }
        })
      }
    },
    setDel: function(list, deep){
      if(Array.isArray(list)){
        list.forEach((e, i) => {
          if(e[this.checkedKey]!==0){
            e[this.checkedKey] = 0
            if(deep && Array.isArray(list[i].sub)){
               this.setDel(list[i].sub)
             }
          }
        })
      }
    },
    syncKeys: function(checked, sub, deep){
      if(checked){
        this.setPush(sub, deep)
      }else{
        this.setDel(sub, deep)
      }
      
    },
    applyChange() {
      this.$set(this.list, this.currentIndex, this.currentData);
      this.handleClose()
    },
    edit(index) {
      if(index!==null){
        this.currentIndex = index;
        this.currentData = util.deepcopy(this.list[index]);
        this.dialogVisible = true;
      }
    },
    handleClose() {
      this.currentIndex = null;
      this.currentData = {};
      this.dialogVisible = false;
    },
    submit: function(){
      this.loading = true;
      permission.webSave.r(Object.assign({}, this.queryParam, {
        rules: this.checkList
      })).then(() => {
        this.loading = false;
        this.fetchData();
      })
    },
    
    fetchData: function(){
      this.loading = true;
      permission.webList.r(this.queryParam).then(res => {
        this.loading = false;
        this.list = res.data.data;
        
      })
    }
  },
  created: function(){
    this.fetchData()
  }
}
</script>

<style scoped>
.permissions >>> .parent{margin-bottom: 20px;border:1px solid #dedede;padding: 10px;}
.permissions >>> .sub{padding-left: 24px;margin-bottom: 14px;}
.permissions >>> .s_sub{padding-left:24px;}
.mytag{margin:0 5px 5px 0;}
</style>
