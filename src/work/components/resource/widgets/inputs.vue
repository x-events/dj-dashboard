<template>
  <div>
    <div class="el-form-item" v-for="(item, index) in list" :key="'inputs'+index" :class="{'is-required': requiredvalue}">
      <div class="el-form-item__label" :style="{width: labelwidth+'px'}">{{index===0 ? labelname : ''}}</div>
      <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
        <template v-if="disabled">
            <div class="el" :title="item.value">{{item.value}}</div>
        </template>
        <template v-else>
            <div class="flex-row">
                <div class="flex-1" style="margin-right:20px" >
                    <el-input :placeholder="placeholder || ('请输入'+labelname)" v-model="item.value" :maxlength="255" :readonly="disabled"></el-input>
                </div>
                <template v-if="!disabled">
                    <template v-if="index===0">
                        <el-button @click.prevent="list.push({value: ''})">添加</el-button>
                    </template>
                    <template v-else>
                        <el-button @click.prevent="list.splice(index, 1)">删除</el-button>
                    </template>
                </template>
            </div>
        </template>

      </div>
    </div>
  </div>
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
        [{value: ""}]
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
      list: [
        {
          value: ""
        }
      ]
    };
  },
  watch: {
    propvalue: {
      handler: function() {
        if (Array.isArray(this.propvalue)) {
          if (this.propvalue.length) {
            this.list = this.propvalue;
          } else {
            this.list = [
              {
                value: ""
              }
            ];
          }
        }
      },
      deep: true
    },
    list: {
      handler: function(list) {
        this.$emit("change", list);
      },
      deep: true
    }
  },
  methods: {},
  created: function() {
    if (Array.isArray(this.propvalue) && this.propvalue.length) {
      this.list = this.propvalue;
    }
  }
};
</script>

<style scoped>
</style>
