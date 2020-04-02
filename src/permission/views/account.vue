<template>
  <account-list />
</template>

<script>

export default {
  components: {
    'account-list': (resolve) => require(['../components/account-list.vue'], resolve),
  },
  data() {
    return {
    };
  },
  methods: {
  },
  created: function() {
  }
};
</script>

<style scoped>
</style>
