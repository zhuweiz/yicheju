<template>
  <div id="app">
		<div v-wechat-title="$route.meta.title"></div>
    <router-view></router-view>
  </div>
</template>
<script>

export default {
  name: "App",
  data() {
    return {
      // transitionName: null
    };
  },
  watch: {
    // $route(to, from) {
    //   this.transitionName = "animated fadeInLeft routTo";
    // }
  },
  created() {
    let token = sessionStorage.getItem("token");
    if(!token){
      this.$router.push({
        name: "login"
      })
    }
  },
  mounted() {}
};
</script>

<style>
	#app{border-top: 1px solid transparent;}
  .main{overflow-y: auto;overflow-x: hidden;}
</style>
