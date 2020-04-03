<template>
  <div class="w-100 order flex-col h-100 over-y-auto" style="padding-left: 30px;">
    <div class="p-tb-30">
      <el-dropdown
        class="left f-18"
        style="width: 150px;color: #0D906E;padding-top:12px;font-weight: normal;"
        placement="bottom-start"
      >
        <span class="el-dropdown-link">
          | {{statementname}}
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            :command="item.name"
            @click.native="financialclick(item.name,item.link)"
            v-for="(item,index) in statementList"
            :key="index"
          >{{item.name}}</el-dropdown-item>
          <!-- <el-dropdown-item command="手工记账">手工记账</el-dropdown-item> -->
          <!-- <el-dropdown-item command="手工记账">手工记账</el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>

      <!-- <h2 class="left f-18" style="width: 150px;color: #0D906E;padding-top:12px;font-weight: normal;">| 财务报表</h2> -->
      <ul class="left orderUl" style="width:80%;padding-top: 5px;">
        <li
          :class="index==orderNavActive?'active':''"
          v-for="(item,index) in orderList"
          :key="index"
          @click="orderTab(index,item.link)"
        >{{item.name}}</li>
      </ul>
      <div class="clear"></div>
    </div>
    <router-view />
  </div>
</template>
<script>
export default {
  name: "formPageB",
  data() {
    return {
      orderList: [
        { name: "企业日常", link: "../home/formPageB" },
        { name: "员工薪资", link: "../home/formPageB_B" },
      ],
      statementList: [
        { name: "财务报表", link: "../home/formPage" },
        { name: "手工记账", link: "../home/formPageB" }
   
      ],
      statementname: "手工记账",
      orderNavActive: null,
      maxHeight: undefined
    };
  },
  created() {},
  mounted() {
    if (this.$route.path == "/home/formPageB") {
      this.orderNavActive = 0;
    } else if (this.$route.path == "/home/formPageB_B") {
      this.orderNavActive = 1;
    }
  },
  methods: {
    orderTab(i, link) {
      this.orderNavActive = i;
      this.$router.push({ path: link });
    },
    financialclick(name, link) {
      // console.log(name)
      if (link == link) {
        this.statementname = name;
      }
      this.$router.push({ path: link });
    }
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