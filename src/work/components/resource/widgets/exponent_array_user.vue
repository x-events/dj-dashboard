<template>
  <div>
    <el-row v-for="(item, index) in list" :key="'inputs'+index" :gutter="20">
      <el-col :span="12">
        <div class="el-form-item" :class="{'is-required': requiredvalue}">
          <div class="el-form-item__label" :style="{width: labelwidth+'px'}">{{index===0 ? labelname : ''}}</div>
          <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
              <template v-if="disabled">
                <div class="el" :title="checkValue(item.value,options)">{{checkValue(item.value,options)}}</div>
              </template>
              <template v-else>
                  <el-cascader :options="options" :props="{label:'text'}" v-model="item.value" change-on-select :show-all-levels="false" :disabled="disabled" :class="{'textOnly':disabled == true}" :placeholder="disabled? '':'请选择'"></el-cascader>
              </template>
            
          </div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="el-form-item flex-row">
          <template v-if="disabled">
            <div class="el flex-1" :title="item.content">{{item.content}}</div>
          </template>
          <template v-else>
            <el-input placeholder="请输入" v-model="item.content" class="flex-1" :maxlength="255" style="margin-right:20px" :readonly="disabled"></el-input>
          </template>
          <template v-if="!disabled">
            <template v-if="index===0">
              <el-button @click.prevent="list.push({value: [],content:''})">添加</el-button>
            </template>
            <template v-else>
              <el-button @click.prevent="list.splice(index, 1)">删除</el-button>
            </template>
          </template>
        </div>
      </el-col>
      <el-col :span="24">
        <input_user_ids_input :labelwidth="labelwidth" labelname="讲授人" :disabled="disabled" :propvalue="item.user_ids" nowatch @change="item.user_ids=$event"/>
      </el-col>
    </el-row>
    
  </div>
  <!-- @change="item.user_ids=$event" -->
</template>

<script>
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
        [{value: 1, content: 1, user_ids: [{uid: 1, name: 1}]}]
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
    disabled: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  components: {
    "input_user_ids_input": resolve => require(["./input_user_ids_input"], resolve)
  },
  data() {
    return {
      list: [
        {
          value: [],
          content: '',
          user_ids: []
        }
      ]
    };
  },
  watch: {
    propvalue: {
      handler: function() {
        if (Array.isArray(this.propvalue)) {
          if (this.propvalue.length) {
            this.list = this.propvalue.map(e => {
              return {
                value: [e.value],
                content: e.content,
                user_ids: e.user_ids
              }
            });
          } else {
            this.list = [
              {
                value: [],
                content: '',
                user_ids: []
              }
            ];
          }
        }
      },
      deep: true,
      immediate: true
    },
    list: {
      handler: function(list) {
        const submitData = list.map(e => {
          return {
            value: e.value[e.value.length-1] || '',
            content: e.content,
            user_ids: e.user_ids
          }
        })
        this.$emit("change", submitData);
      },
      deep: true
    }
  },
  methods: {
    checkValue(value,data){
        let text = '';
        data.forEach(e => {
            if(value == e.value){
                text = e.text
            }
        });
        return text
    }
  },
  created: function() {
    if(Array.isArray(this.propdata) && this.propdata.length){
      this.options = this.propdata
    }
    
  }
};
</script>

<style scoped>

</style>
