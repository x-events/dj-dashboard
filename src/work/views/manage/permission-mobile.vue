<template>
  <div class="blockLayout flex-col" v-loading="loading">
    <div class="toolBar flex-row">
      <div class="flex-1">
        <el-radio-group v-model="queryParam.type">
          <el-radio-button v-for="(tab, i) in tabList" :label="tab.value" :key="'tab'+i">{{tab.label}}</el-radio-button>
        </el-radio-group>
      </div>
      <el-button
        v-has="permission.mobileSave"
        type="primary"
        icon="el-icon-check"
        @click="submit()"
      >保存</el-button>
    </div>
    <div class="flex-1 scrollbar">
      <el-checkbox-group v-model="checkList" class="permissions">
        <div class="parent" v-for="(item,index) in list" :key="'p'+index">
          <el-checkbox :label="item.id"
            @change="syncKeys($event, item.sub, true)"
          >{{item.name}}</el-checkbox>
          <div class="sub" v-for="(sub,si) in item.sub" :key="'sub'+si">
            <el-checkbox :label="sub.id"
              @change="syncKeys($event, sub.sub)"
            >{{sub.name}}</el-checkbox>
            <div class="s_sub" v-if="sub.sub">
              <el-checkbox v-for="(s_sub,ssi) in sub.sub" :key="'s_sub'+ssi"
              :label="s_sub.id"
              :disabled="sub.type==2"
              >{{s_sub.name}}</el-checkbox>
            </div>
          </div>
        </div>
      </el-checkbox-group>
    </div>

  </div>
</template>

<script>
import * as permission from '@/work/api/permission';

export default {
  data () {
    return {
      permission,
      loading: false,
      list: [],
      checkList: [],
      tabList: [{
        label: '工委',
        value: 'mobile_work'
      },{
        label: '党委',
        value: 'mobile_party'
      },{
        label: '支部',
        value: 'mobile_branch'
      }],
      queryParam: {
        type: 'mobile_work'  
      }
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
        case "mobile_work":
          result = 'mobile_work_checked'
          break;
        case "mobile_party":
          result = 'mobile_party_checked'
          break;
        case "mobile_branch":
          result = 'mobile_branch_checked'
          break;
        default:
          result = 'checked';
          break;
      }
      return result;
    }
  },
  methods: {
    setPush: function(target, list, deep){
      if(Array.isArray(target) && Array.isArray(list)){
        const subId = list.map(e => e.id);
        subId.forEach((e, i) => {
           if(target.indexOf(e) === -1){
             target.push(e);
             if(deep && Array.isArray(list[i].sub)){
               this.setPush(target, list[i].sub)
             }
           }
        })
        return target
      }
    },
    setDel: function(target, list, deep){
      if(Array.isArray(target) && Array.isArray(list)){
        const subId = list.map(e => e.id);
        subId.forEach((e, i) => {
          const targetIndex = target.indexOf(e);
          if(targetIndex!==-1){
            target.splice(targetIndex,1);
            if(deep && Array.isArray(list[i].sub)){
               this.setDel(target, list[i].sub)
             }
          }
        })
        return target;
      }
    },
    syncKeys: function(checked, sub, deep){
      if(checked){
        this.setPush(this.checkList, sub, deep)
      }else{
        this.setDel(this.checkList, sub, deep)
      }
    },
    submit: function(){
      this.loading = true;
      permission.mobileSave.r(Object.assign({}, this.queryParam, {
        rules: this.checkList
      })).then(() => {
        this.loading = false;
        this.fetchData();
      })
    },
    flatList: function(target, key){
      if(Array.isArray(target) && key){
        ([].concat(target)).forEach(e => {
          if(Array.isArray(e[key])){
            target = target.concat(this.flatList(e[key], key))
          }
        })
        return target;
      }
    },
    fetchData: function(){
      this.loading = true;
      permission.mobileList.r(this.queryParam).then(res => {
        this.loading = false;
        this.list = res.data.data;
        const flatList = this.flatList(res.data.data, 'sub');
        this.checkList = flatList.filter(e => e[this.checkedKey]==1).map(e => e.id)
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
</style>
