<template>
  <router-view />
</template>

<script>
export default {
  watch: {
    $route(new_val){
      //console.log(new_val,'$route');
      
    }
  },
}
</script>