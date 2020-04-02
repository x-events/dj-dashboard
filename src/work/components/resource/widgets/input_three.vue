<template>
  <div class="input_three">
    <el-divider ></el-divider>
    <div class="three_title">
      党建资源情况
    </div>
    <nodata v-if="disabled && resource[0].value==''" />
    <div v-else class="el-form-item" v-for="(item, index) in resource" :key="'resource'+index" :class="{'is-required': requiredvalue}"
      style="margin-left:160px">
      <div class="el-form-item__label" :style="{width: labelwidth+'px', paddingLeft: '20px'}">
        <el-select v-model="item.type" :disabled="disabled">
          <el-option label="选择资源类型" value="0"></el-option>
          <el-option
            v-for="item in resourceOptions"
            :key="'partyremark'+item.id"
            :label="item.value"
            :value="item.id"
          ></el-option>
        </el-select>
      </div>
      <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
          <div v-if="disabled" class="el" :title="item.value">{{item.value}}</div>
          <div v-else class="flex-row">
              <div class="flex-1" style="margin-right:20px" >
                  <el-input type="textarea" :placeholder="placeholder || ('请输入')" v-model="item.value" :readonly="disabled"></el-input>
              </div>
              <el-button v-if="index===0" @click.prevent="resource.push({type: '0', value: ''})">添加</el-button>
              <el-button v-else @click.prevent="resource.splice(index, 1)">删除</el-button>
          </div>
      </div>
    </div>
    
    <el-divider ></el-divider>
    <div class="three_title">
      党建需求情况
    </div>
    <nodata v-if="disabled && requires[0].value==''" />
    <div v-else class="el-form-item" v-for="(item, index) in requires" :key="'requires'+index" :class="{'is-required': requiredvalue}">
      <div class="el-form-item__label" :style="{width: labelwidth+'px'}">{{index+1}} </div>
      <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
          <div v-if="disabled" class="el" :title="item.value">{{item.value}}</div>

          <div v-else class="flex-row">
              <div class="flex-1" style="margin-right:20px" >
                  <el-input type="textarea" :placeholder="placeholder || ('请输入')" v-model="item.value" :readonly="disabled"></el-input>
              </div>

              <el-button v-if="index===0" @click.prevent="requires.push({value: ''})">添加</el-button>
              <el-button v-else @click.prevent="requires.splice(index, 1)">删除</el-button>
          </div>

      </div>
    </div>
    
    <el-divider ></el-divider>
    <div class="three_title">
      党建问题情况
    </div>
    <nodata v-if="disabled && question[0].value==''" />
    <div v-else class="el-form-item" v-for="(item, index) in question" :key="'question'+index" :class="{'is-required': requiredvalue}">
      <div class="el-form-item__label" :style="{width: labelwidth+'px'}">{{index+1}} </div>
      <div class="el-form-item__content" :style="{marginLeft: labelwidth+'px'}">
        <div v-if="disabled" class="el" :title="item.value">{{item.value}}</div>

        <div v-else class="flex-row">
            <div class="flex-1" style="margin-right:20px" >
                <el-input type="textarea" :placeholder="placeholder || ('请输入')" v-model="item.value" :readonly="disabled"></el-input>
            </div>
            <el-button v-if="index===0" @click.prevent="question.push({value: ''})">添加</el-button>
            <el-button v-else @click.prevent="question.splice(index, 1)">删除</el-button>
        </div>
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
      type: Object,
      required: false,
      default: function() {
        /*
        [{value: ""}]
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
      resource: [
        {
          type: '0',
          value: ""
        }
      ],
      requires: [
        {
          value: ""
        }
      ],
      question: [
        {
          value: ""
        }
      ],
      resourceOptions: []
    }
  },
  watch: {
    propvalue: {
      handler: function(propvalue) {
        if( propvalue.resource){
          this.resource = propvalue.resource;
        }else{
          this.resource = [
            {
              type: '0',
              value: ""
            }
          ]
        }

        if( propvalue.requires){
          this.requires = propvalue.requires;
        }else{
          this.requires = [
            {
              value: ""
            }
          ];
        }
        
        if( propvalue.question){
          this.question = propvalue.question;
        }else{
          this.question = [
            {
              value: ""
            }
          ];
        }
          
      },
      deep: true,
      immediate: true
    },
    resource: {
      handler: function() {
        this.submit();
      },
      deep: true
    },
    requires: {
      handler: function() {
        this.submit();
      },
      deep: true
    },
    question: {
      handler: function() {
        this.submit();
      },
      deep: true
    }
  },
  methods: {
    submit: function(){
      //filter
      let resource = this.resource.map(e => {
        e.value = e.value.trim();
        return e;
      }).filter((e,i) => {
        return e.value!=''
      })
      if(!resource.length){
        resource = [
            {
              type: '0',
              value: ""
            }
          ]
      }

      let requires = this.requires.map(e => {
        e.value = e.value.trim();
        return e;
      }).filter((e,i) => {
        return e.value!=''
      })
      if(!requires.length){
        requires = [
            {
              value: ""
            }
          ]
      }
      
      let question = this.question.map(e => {
        e.value = e.value.trim();
        return e;
      }).filter((e,i) => {
        return e.value!=''
      })
      if(!question.length){
        question = [
            {
              value: ""
            }
          ]
      }

      this.$emit("change", {
        resource,
        requires,
        question
      });
    }
  },
  created: function() {
    
  }
};
</script>

<style scoped>
.input_three >>> .el-form-item__label{color:#999;}

.three_title{
  position: relative;
  color:#333;
  margin-left: 180px;
  padding-left: 20px;
  margin-bottom: 10px;
}
.three_title:after{
  position: absolute;
  content: "";
  left:0;
  top:50%;
  height:1.2em;
  width:4px;
  border-radius: 2px;
  background:#187cd6;
  margin-top: -.6em;
}
</style>
