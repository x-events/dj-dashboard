<template>
  <div class="el-form-item" :class="{'is-required': requiredvalue}">
    <div class="el-form-item__label" :style="{width: labelwidth+'px'}">{{labelname}}</div>
    <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
      <upload-image
        onefile
        :propvalue="propvalue"
        :disabled="disabled"
        @change="$emit('change', $event.id || '')"
      >
      </upload-image>
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
      type: Object,
      required: false,
      default: function() {
        /*
        {name: "food.jpeg", url:"..."}
        */
        return {};
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
    "upload-image": resolve => require(["../upload_image"], resolve)
  },
  data() {
    return {
      
    };
  },
  watch: {
    propvalue: {
      handler: function(propvalue) {
        
      },
      deep: true
    }
  },
  methods: {
    
  },
  created: function() {
    
  }
};
</script>

<style scoped>

</style>
