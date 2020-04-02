<template>
  <div class="el-form-item"
    :class="{'is-required': requiredvalue}">
    <div class="el-form-item__label" :style="{width: labelwidth+'px'}">{{labelname}}</div>
    <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">

        <template v-if="disabled">
            <span v-for="(user, i) in user_list" :key="i"><span class="dib_bg" :title="user.name">{{user.name}}</span></span>
        </template>
        <template v-else>
            <div class="heightLayout">
                <div class="cont">
                    <el-tag
                        v-for="(user, i) in user_list"
                        :key="'user'+i"
                        size="medium"
                        :closable="!disabled"
                        type="info"
                        @close="remove(i)">
                        {{user.name}}
                    </el-tag>
                </div>
                <div class="_actions">
                    <el-button size="mini" :disabled="disabled" @click="!disabled && (pickerDialog=true)">党员库选择</el-button>
                </div>
            </div>
        </template>
      
    </div>

  </div>
</template>

<script>
import * as util from "@/common/assets/util";

export default {
  props: {
    labelname: {
      type: String,
      required: true,
      default: "请输入"
    },
    labelwidth: {
      type: Number,
      required: false,
      default: 80
    },
    propvalue: {
      type: Array,
      required: false,
      default: function() {
        /*
        [{
          id: 1,
          name: "name1"
        }]
        */
        return [];
      }
    },
    propdata: {
      type: Array,
      required: false,
      default: function() {
        return [];
      }
    },
    requiredvalue: {
      type: Boolean,
      required: false,
      default: false
    },
    placeholder: {
      type: String,
      required: false
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
      user_list: []
    };
  },
  watch: {
    propvalue: {
      handler: function(){
        if (Array.isArray(this.propvalue)) {
          if(this.propvalue.length && this.propvalue[0].name){
            this.user_list = [].concat(this.propvalue);
          }else{
            this.user_list = []
          }
        }
      },
      deep: true
    },
    user_list: {
      handler: function(user_list) {
        this.$emit("change", user_list.map(e => e.uid));
      },
      deep: true
    }
  },
  methods: {
    add: function(members){
      // 去重
      const oList = this.user_list;
      this.user_list = oList.concat(members.filter(m => {
        return oList.map(e => e.uid).indexOf(m.uid)===-1
      }));
    },
    remove: function(index){
      this.user_list.splice(index,1)
    }
  },
  created: function() {
    if (Array.isArray(this.propvalue)) {
      if(this.propvalue.length && this.propvalue[0].name){
        this.user_list = [].concat(this.propvalue);
      }else{
        this.user_list = []
      }
    }
    // 重置事件
    util.on('resetWidgets', () => {
      this.user_list = []
    })
  }
};
</script>

<style scoped>
.heightLayout{
  position: relative;
  padding-bottom: 40px;
  border: 1px solid rgba(220,226,231,1);
  border-radius: 6px;
}
.heightLayout .cont{overflow: auto;min-height:30px; padding:10px;
  box-sizing: border-box;}
.heightLayout ._actions{
  position: absolute;
  left:0;width:100%;
  bottom:0;
  padding: 6px;
  box-sizing: border-box;
  text-align:right;
}
.heightLayout .el-tag{margin:0 6px 6px 0;}


</style>
