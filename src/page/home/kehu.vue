<template>
  <div class="w-100 order flex-col h-100 over-y-auto" style="padding-left: 30px;">
    <div class="p-tb-30">
      <div
        class="left f-18"
        style="width: 150px;color: #0D906E;padding-top:12px;font-weight: normal;"
      >
          <span class="el-dropdown-link">| 客户</span>
      </div>
      <ul class="left orderUl" style="width:80%;padding-top: 5px;">

      </ul>
      <div class="clear"></div>
    </div>
    <router-view />
  </div>
</template>

<script>
export default {
  name: "kehu",
  data() {
    return {
      orderNavActive: null,
      maxHeight: undefined
    };
  },
  created() {},
  mounted() {
    // if (this.$route.path == "/home/kehu") {
    //   this.orderNavActive = 0;
    // }
  },
  methods: {
    // orderTab(i, link) {
    //   this.orderNavActive = i;
    //   this.$router.push({ path: link });
    // }
  }
};
</script>
<style scoped>
.orderUl li {
  float: left;
  padding: 4px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  transition: 0.5s;
  font-size: 16px;
}

.orderUl li:hover {
  background: rgba(0, 0, 0, 0.1);
  transition: 0.5s;
}

.orderUl li.active {
  background: #3ac29f;
  color: #fff;
}
</style>
