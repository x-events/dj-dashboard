<template>
  <div class="nodata flex-row align-center" :class="{ picholder: mode === 'pic' }">
    <div class="flex-1">
      <template v-if="mode === 'pic'">
        <img src="@/common/assets/img/nodata_new.png" />
      </template>
      <template v-else>
        <!-- <i class="el-icon-warning" :style="'color:'+color"></i> -->
        <div class="text" :style="'color:' + color">暂无数据</div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    color: {
      type: String,
      default: function() {
        return "#333";
      }
    },
    mode: {
      type: String,
      required: false
    }
  },
  data() {
    return {};
  }
};
</script>

<style scoped>
.nodata {
  text-align: center;
  padding: 15px 0;
  height: 100%;
  box-sizing: border-box;
  min-height: 10em;
}
.nodata [class^="el-icon-"] {
  font-size: 28px;
}
.nodata .text {
  font-size: 14px;
}

.picholder {
  padding-top: 5%;
  padding-bottom: 5%;
}
</style>
