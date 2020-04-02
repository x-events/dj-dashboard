<template>
  <div class="el-form-item"
    :class="{'is-required': requiredvalue}">
    <div class="el-form-item__label" :style="{width: labelwidth+'px'}">{{labelname}}</div>
    <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
      <template v-if="disabled">
        {{input && formatDate(input)}}
      </template>
      <template v-else>
        <el-date-picker 
        v-model="input" 
        :placeholder="placeholder || ('请输入'+labelname)"
        type="datetimerange" 
        @change="handleChange" 
        :readonly="disabled"></el-date-picker>
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
        [timestamp, timestamp]
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
      input: ""
    };
  },
  watch: {
    propvalue: {
      handler: function(propvalue){
        if (Array.isArray(propvalue)) {
          this.input = propvalue.length === 2 ? propvalue.map(e => new Date(parseInt(e) * 1000)) : '';
        }
      },
      deep: true
    }
  },
  methods: {
    handleChange: function(value) {
      if (Array.isArray(value) && value.length === 2) {
        let time = value.map(e => Math.floor(e.getTime() / 1000));
        this.$emit("change", time);
      }else{
        this.$emit("change", []);
      }
    }
  },
  created: function() {
    if (Array.isArray(this.propvalue) && this.propvalue.length === 2) {
      this.input = this.propvalue.map(e => new Date(parseInt(e) * 1000));
    }
  }
};
</script>

<style scoped>
</style>
