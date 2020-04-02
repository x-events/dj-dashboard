<template>
    <el-row :gutter="20">
      <el-col :span="24">
        <div class="el-form-item" :class="{'is-required': requiredvalue}">
          <div class="el-form-item__label" :style="{width: labelwidth+'px'}">{{labelname}}</div>
          <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
              <template v-if="disabled">
                  {{choosen.short_name}}
              </template>
              <template v-else>
                  <el-input v-model="choosen.short_name" :placeholder="placeholder || ('请输入'+labelname)" :clearable="!disabled" @clear="choosen={}" @keyup.native="choosen.id=0">
                    <template v-if="!disabled" slot="append">
                      <div style="cursor:pointer" @click="pickerDialog=true">单位库选择</div>
                    </template>
                    
                  </el-input>
              </template>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="el-form-item"
          >
          <div class="el-form-item__label" :style="{width: labelwidth+'px'}">
            联系人
          </div>
          <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
            <div v-if="disabled" class="el">{{choosen.contact}}</div>
            <el-input v-else
              :placeholder="('请输入联系人')"
              :maxlength="255"
              v-model="choosen.contact" 
            ></el-input>
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="el-form-item"
          >
          <div class="el-form-item__label" :style="{width: labelwidth+'px'}">
            联系电话
          </div>
          <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
            <div v-if="disabled" class="el">{{choosen.contact_phone}}</div>
            <el-input v-else
              :placeholder="('请输入联系电话')"
              :maxlength="255"
              v-model="choosen.contact_phone" 
            ></el-input>
          </div>
        </div>
      </el-col>
      
    </el-row>
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
      type: Object,
      required: false,
      default: function(){
        /*
        {name: "组织名", id:""}
        */
        return {}
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
        choosen: {
          id: '0',
          short_name: '',
          contact: '',
          contact_phone: ''
        }
      }
  },
  watch: {
    propvalue: {
      handler: function(propvalue) {
        if(propvalue){
          this.choosen = propvalue
        }
      },
      deep: true,
      immediate: true
    },
    choosen: {
      handler: function(choosen){
        
        this.$emit('change', choosen)
      },
      deep: true
    }
  },
  methods: {
    
  },
  created: function(){
    this.$emit('change', this.choosen)
  }
};
</script>

<style scoped>

</style>
