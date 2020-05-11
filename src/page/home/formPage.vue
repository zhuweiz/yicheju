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
  name: "formPage",
  data() {
    return {
      orderList: [
        { name: "月报总表", link: "../home/formPage" },
        { name: "分项日报表", link: "../home/formB" },
        { name: "挂帐报表", link: "../home/formC" },
        { name: "收支方式", link: "../home/formD" },
        { name: "收入流水", link: "../home/formE" },
        { name: "支出流水", link: "../home/formF" },
        { name: "库存配件账", link: "../home/formL" },
        { name: "询价配件账", link: "../home/formG" },
        { name: "其他配件帐", link: "../home/formH" },
        { name: "固定资产", link: "../home/formI" },
        { name: "提成报表", link: "../home/formJ" },
        { name: "提成审核", link: "../home/formK" }
      ],
      statementList: [
        { name: "财务报表", link: "../home/formPage" },
        { name: "手工记账", link: "../home/formPageB" }
      ],
      statementname: "财务报表",
      orderNavActive: null,
      maxHeight: undefined
    };
  },
  created() {},
  mounted() {
    if (this.$route.path == "/home/formPage") {
      this.orderNavActive = 0;
    } else if (this.$route.path == "/home/formB") {
      this.orderNavActive = 1;
    } else if (this.$route.path == "/home/formC") {
      this.orderNavActive = 2;
    } else if (this.$route.path == "/home/formD") {
      this.orderNavActive = 3;
    } else if (this.$route.path == "/home/formE") {
      this.orderNavActive = 4;
    } else if (this.$route.path == "/home/formF") {
      this.orderNavActive = 5;
    } else if (this.$route.path == "/home/formL") {
      this.orderNavActive = 6;
    } else if (this.$route.path == "/home/formG") {
      this.orderNavActive = 7;
    } else if (this.$route.path == "/home/formH") {
      this.orderNavActive = 8;
    } else if (this.$route.path == "/home/formI") {
      this.orderNavActive = 9;
    } else if (this.$route.path == "/home/formJ") {
      this.orderNavActive = 10;
    } else if (this.$route.path == "/home/formK") {
      this.orderNavActive = 11;
    }
  },
  methods: {
    orderTab(i, link) {
      this.orderNavActive = i;
      this.$router.push({ path: link });
    },
    financialclick(name,link) {
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


