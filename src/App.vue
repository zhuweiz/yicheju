<template>
  <div id="app">
    <div v-wechat-title="$route.meta.title"></div>
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>
<script>
export default {
  name: "App",
  provide() {
    //父组件中通过provide来提供变量，在子组件中通过inject来注入变量。
    return {
      reload: this.reload
    };
  },
  data() {
    return {
      isRouterAlive: true
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
    if (!token) {
      this.$router.push({
        name: "login"
      });
    }
  },
  mounted() {},
  methods: {
    reload() {
      this.isRouterAlive = false; //先关闭，
      this.$nextTick(function() {
        this.isRouterAlive = true; //再打开
      });
    }
  }
};
</script>

<style>
#app {
  border-top: 1px solid transparent;
}
.main {
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
