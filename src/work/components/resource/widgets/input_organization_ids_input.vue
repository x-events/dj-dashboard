<template>
    <div class="el-form-item" :class="{'is-required': requiredvalue}">
        <div class="el-form-item__label" :style="{width: labelwidth+'px'}">{{labelname}}</div>
        <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
            <template v-if="disabled">
                <!-- {{choosen.map(e => e.name).join('、')}} -->
                <span v-for="(item, i) in choosen" :key="i"><span class="dib_bg" :title="item.name">{{item.name}}</span></span>
            </template>
            <template v-else>
                <div class="heightLayout flex-col">
                    <div class="flex-1 scrollcont">
                        <el-tag v-for="(item, i) in choosen" :key="'user'+i" size="medium" :closable="!disabled" type="info" @close="remove(i)">{{item.name}}</el-tag>
                    </div>
                    <div class="_actions">
                        <el-button size="mini" :disabled="disabled" @click="!disabled && (pickerDialog=true)">组织库选择</el-button>
                        <el-button size="mini" :disabled="disabled" @click="!disabled && (formDialog=true)">手动添加</el-button>
                    </div>
                </div>
            </template>
        </div>
        
    </div>
</template>

<script>
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
        /*
        [{name: "组织名", id:""}]
        */
        return []
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
        formDialog: false,
        choosen: []
      }
  },
  watch: {
    propvalue: {
      handler: function() {
        if(this.propvalue){
          this.choosen = this.propvalue
        }
      },
      deep: true
    },
    choosen: {
      handler: function(choosen){
        this.$emit('change', choosen.map(e => {
          return {
            id: e.id,
            name: e.name
          }
        }))
      },
      deep: true
    }
  },
  methods: {
    add: function(items){
      // 去重
      const oList = this.choosen;
      this.choosen = oList.concat(items.filter(m => {
        return oList.map(e => e.id).indexOf(m.id)===-1
      }));
    },
    remove: function(index){
      this.choosen.splice(index,1)
    }
  },
  created: function(){
    if(this.propvalue){
      this.choosen = this.propvalue
    }
    
  }
};
</script>

<style scoped>
.heightLayout{
  height: 126px;
  border: 1px solid rgba(220,226,231,1);
  border-radius: 6px;
}
.heightLayout .scrollcont{overflow: auto;padding:10px ;}
.heightLayout ._actions{
  padding: 0 10px;
  text-align:right;
}
.heightLayout .el-tag{margin:0 6px 6px 0;}

</style>
