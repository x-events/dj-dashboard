<template>
  <tree :nodes="nodes" :setting="setting" @onClick="onClick" @onCreated="$emit('onCreated',$event)" />
</template>

<script>
import tree from "vue-giant-tree";

export default {
  props: {
    data: {
      type: Array,
      default: ()=> {
        return []
      }
    },
    fieldObj: {
        type: Object,
        default:() => {
            return {
                name: 'name',
                id: 'value',
                pid: 'pid'
            }
        }
    },
  },
	components: {
    tree
  },
  data() {
    return {
      nodes: this.data,
      setting: {
        data: {
          key: {
            name: this.fieldObj.name
          },
          simpleData: {
            enable: true,
            idKey: this.fieldObj.id,
            pIdKey: this.fieldObj.pid,
            // rootPId: 0
          }
        }
      }
    }
  },
  watch: {
    data: {
      handler() {
        this.nodes = this.data;
      },
      immediate: true
    }
  },
  methods: {
    onClick(dom,no,data) {
      this.$emit('click',data);
    },
  },
}
</script>

<style scoped>

</style>
