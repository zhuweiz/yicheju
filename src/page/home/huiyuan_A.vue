<template>
  <div class="w-100 order flex-col h-100 over-y-auto" style="padding-left: 30px;">
    <div class="p-tb-30" style="overflow: hidden;">
      <div
        class="left f-18"
        style="width: 150px;color: #0D906E;padding-top:12px;font-weight: normal;"
      >
        <span class="el-dropdown-link">| 会员卡办卡记录</span>
      </div>
    </div>
    <div class="w-100 order flex-col">
      <div class="p-15" style="background:rgba(229,246,247,1);">
        <el-form :inline="true" class="demo-form-inline">
          <el-row>
            <el-col>
              <el-form-item label class="m-b-0">
                <el-input v-model="search.name" placeholder="请输入关键字" style="width:100%;"></el-input>
              </el-form-item>
              <el-button type="success" icon="el-icon-search" @click="getList()">查找</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- <div style="width:100%;padding-top:15px;" class="orderTable" id="printBox">
      <el-table :data="tableData" :max-height="500" style="width: 100%">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column prop="customerName" label="客户姓名"></el-table-column>
        <el-table-column prop="phone" label="手机号码"></el-table-column>
        <el-table-column prop label="会员等级" width>
          <template slot-scope="scope">
            <el-rate v-model="scope.row.grade" disabled></el-rate>
          </template>
        </el-table-column>
        <el-table-column prop="comboCount" label="已购套餐"></el-table-column>
        <el-table-column prop="balanceAmount" label="储值卡余额"></el-table-column>
        <el-table-column prop="carNos" label="绑定车辆"></el-table-column>
        <el-table-column prop label="操作">
          <template slot-scope="scope">
            <el-dropdown trigger="click" @command="handleCommand">
              <el-button plain size="mini">
                操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="send_work(scope.row)">修改客户信息</el-dropdown-item>
                <el-dropdown-item @click.native="add_parts(scope.row)">查看套餐</el-dropdown-item>
                <el-dropdown-item @click.native="edit_project(scope.row)">查看车辆信息</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <div class="p-tb-10 text-center">
        <el-pagination
          :hide-on-single-page="pageLength === 0"
          background
          layout="prev, pager, next"
          :page-size="size"
          @current-change="handleCurrentChange"
          :total="pageLength"
        ></el-pagination>
      </div>-->
      <!-- </div> -->
    </div>
  </div>
</template>

<script>
import moment from "moment";
export default {
  name: "huiyuan_A",
  data() {
    return {
      search: {
        month: moment(new Date()).format("YYYY-MM")
      },
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
</style>
