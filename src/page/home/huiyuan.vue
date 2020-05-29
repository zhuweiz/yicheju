<template>
  <!-- <div class="w-100 order flex-col h-100 over-y-auto" style="padding-left: 30px;">
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
   
  </div>-->
  <div style="position: relative;height: 100%;">
    <div class="mian">
      <div class="hed">
        <div class="hed_a" @click="banli(1)">
          <div class="meg">
            <img src="../../assets/tuihuo.png" alt />
          </div>
          <div class="banli">会员卡办理</div>
        </div>
        <div class="hed_b">
          <span style="cursor: pointer;" @click="to">
            办理记录
            <i class="el-icon-caret-right"></i>
          </span>
        </div>
      </div>
      <div class="hed" @click="banli(2)">
        <div class="hed_a">
          <div class="meg">
            <img src="../../assets/tuihuo.png" alt />
          </div>
          <div class="banli">套餐卡办理</div>
        </div>
        <div class="hed_b">
          <span style="cursor: pointer;" @click="tob">
            办理记录
            <i class="el-icon-caret-right"></i>
          </span>
        </div>
      </div>
      <div class="hed" @click="banli(3)">
        <div class="hed_a">
          <div class="meg">
            <img src="../../assets/tuihuo.png" alt />
          </div>
          <div class="banli">储值卡办理</div>
        </div>
        <div class="hed_b">
          <span style="cursor: pointer;" @click="toc">
            办理记录
            <i class="el-icon-caret-right"></i>
          </span>
        </div>
      </div>
    </div>

    <el-dialog
      :title="title"
      :visible.sync="payStatusHY"
      center
      width="48%"
      class="huih"
      :modal="false"
    >
      <el-row class="boo">
        <el-col :span="8">
          <div class="huiyuan">车牌号码</div>
          <el-input class="huiyuan" v-model="huiyuan.carNo" placeholder="请输入"></el-input>
        </el-col>
        <el-col :span="8">
          <div class="huiyuan">客户姓名</div>
          <el-input class="huiyuan" v-model="huiyuan.customerName" placeholder="请输入"></el-input>
        </el-col>
        <el-col :span="8">
          <div class="huiyuan">手机号</div>
          <el-input class="huiyuan" v-model="huiyuan.phone" placeholder="请输入"></el-input>
        </el-col>
      </el-row>
      <el-row class="boo">
        <el-col :span="8" v-if="title == '会员卡办理'">
          <div class="huiyuan">会员等级</div>
          <el-select v-model="huiyuan.source" placeholder="请选择" style="width: 65%;">
            <el-option
              v-for="item in HYdjlist"
              :key="item.id"
              :label="item.gradeName"
              :value="item.gradeName"
              @click.native="dengji(item)"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="8" v-if="title == '套餐卡办理'">
          <div class="huiyuan">套餐名称</div>
          <el-select v-model="huiyuan.source" placeholder="请选择" style="width: 65%;">
            <el-option
              v-for="item in HYdjlist"
              :key="item.id"
              :label="item.comboName"
              :value="item.comboName"
              @click.native="dengji(item)"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="8" class v-if="title == '储蓄卡充值'">
          <div class="huiyuan">充值金额</div>
          <el-input class="huiyuan" v-model="huiyuan.balance" placeholder="请输入"></el-input>
        </el-col>
        <el-col :span="8" class v-if="title == '储蓄卡充值'">
          <div class="huiyuan">赠送金额</div>
          <el-input class="huiyuan" v-model="huiyuan.giftBalance" placeholder="请输入"></el-input>
        </el-col>
        <el-col :span="8" class="right">
          <div class="huiyuan">业务员</div>
          <el-input class="huiyuan" v-model="huiyuan.sellsMan" placeholder="请输入"></el-input>
        </el-col>
      </el-row>
      <el-row class="boo" v-if="title != '储蓄卡充值'&& title != '套餐卡办理'">
        <el-col :span="8">
          <div class="huiyuan">应&nbsp&nbsp&nbsp&nbsp 收：{{huiyuan.price}}</div>
        </el-col>
        <el-col :span="8">
          <div class="huiyuan">优&nbsp&nbsp&nbsp&nbsp&nbsp惠</div>
          <el-input class="huiyuan" v-model="huiyuan.disAmount" placeholder="请输入"></el-input>
        </el-col>
        <el-col :span="8" class="right">
          <div class="huiyuan">备&nbsp&nbsp&nbsp注</div>
          <el-input class="huiyuan" v-model="huiyuan.discountReason" placeholder="请输入"></el-input>
        </el-col>
      </el-row>
      <el-row class="boo" v-if="title != '储蓄卡充值'">
        <el-col :span="8">
          <div
            class="huiyuan"
          >实&nbsp&nbsp&nbsp&nbsp 收：{{huiyuan.price?huiyuan.price-huiyuan.disAmount:''}}</div>
        </el-col>
      </el-row>
      <el-row class="boo">
        <el-col :span="8">
          <div class="huiyuan">支付方式</div>
        </el-col>
        <el-col :span="8">
          <el-button type="info" size="mini" class="xuanze" plain @click="paymentDialog">请选择 ></el-button>
          <!-- <div class="huiyuan xuanze">请选择<i class="el-icon-arrow-right" style="margin-left: 10px;"></i></div> -->
        </el-col>
        <el-col :span="8">
          <div class="huiyuan">差额：{{payForm.difference}}</div>
        </el-col>
      </el-row>
      <el-row
        :gutter="20"
        style="border-bottom:1px solid #ccc;padding:10px 0px;"
        v-for="item in payForm.payTypeList"
        :key="item.type"
      >
        <el-col :span="12">
          <span style>{{item.name}}</span>
          <span style="color: #ff0000; margin-left: 40px;">{{item.billname}}</span>
        </el-col>
        <el-col :span="12">
          <el-input v-model="item.amount" @change="changeAmount">
            <template slot="append">元</template>
          </el-input>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="payStatusHY = false">取 消</el-button>
        <el-button type="success" @click="HYtijiao">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="请选择" :visible.sync="paymentVisible" center width="30%" append-to-body>
      <el-table
        ref="multipleTable"
        :data="paymentData"
        tooltip-effect="dark"
        :show-header="false"
        style="width: 100%"
        @selection-change="selectPayment"
        @select="onTableSelect"
      >
        <el-table-column prop="name" label></el-table-column>
        <el-table-column type="selection" width="50"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="paymentVisible = false">取 消</el-button>
        <el-button type="success" @click="zhifuQD">确 定</el-button>
      </div>
      <!-- 挂账 -->
      <!-- <el-dialog title="选择挂账客户" :visible.sync="GZVisibleL" center width="45%" append-to-body>
        <el-table :data="GZlist" :height="300" style="width: 100%">
          <el-table-column label="序号" type="index"></el-table-column>
          <el-table-column prop="name" label="姓名"></el-table-column>
          <el-table-column prop="phone" label="手机号码" width="120"></el-table-column>
          <el-table-column prop="count" label="以挂账笔数"></el-table-column>
          <el-table-column prop="totalAmount" label="以挂账金额"></el-table-column>
          <el-table-column prop="promiseUser" label="担保人" width="80"></el-table-column>
          <el-table-column type width="50">
            <template slot-scope="scope">
              <el-radio v-model="GZradio" :label="scope.row.id" @change="getList(scope.row)">&nbsp;</el-radio>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
          <el-button type="danger" @click="GZVisibleL = false">取 消</el-button>
          <el-button type="success" @click="QDguazhang">确 定</el-button>
        </div>
      </el-dialog>-->
    </el-dialog>
    <!-- <router-view /> -->
  </div>
</template>

<script>
import {
  queryBillerCustomerSum,
  HYdengji,
  TClist,
  addMember,
  TCsave,
  memberStoreSave
} from "../../request/api.js";
import moment from "moment";
export default {
  name: "huiyuan",
  data() {
    return {
      payStatusHY: false,
      payForm: {
        difference: 0,
        payTypeList: []
      },
      taocanLS: {},
      huiyuan: {
        gid: localStorage.getItem("gid"),
        carNo: "",
        price: "",
        star: "",
        disAmount: "",
        phone: "",
        source: "",
        customerName: "",
        sellsMan: "",
        balance: "",
        giftBalance: ""
      },
      JZlist: [],
      title: "",
      GZlist: [],
      HYdjlist: [], //会员等级列表
      GZradio: "",
      billerCustomerId: "", //挂账id
      billname: "", //挂账name
      paymentData: [
        { type: 0, name: "现金" },
        { type: 1, name: "支付宝" },
        { type: 2, name: "微信" },
        { type: 3, name: "银行卡" },
        { type: 4, name: "直赔到店" }
        // { type: 5, name: "挂帐" }
      ],
      orderNavActive: null,
      GZVisibleL: false, //选择支付
      paymentVisible: false,
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
    dengji(item) {
      if (this.title == "会员卡办理") {
        this.huiyuan.price = item.dues;
        this.huiyuan.star = item.grade;
      } else if (this.title == "套餐卡办理") {
        this.taocanLS = item;
        this.huiyuan.price = item.price;
      }
    },

    //提交会员订单
    HYtijiao() {
      let res = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
      var input = this.huiyuan.carNo.toUpperCase(); //转大写
      if (!res.test(input)) {
        return this.$message.error("车牌格式有误");
      } else if (this.huiyuan.customerName == "") {
        return this.$message.error("请输入客户姓名");
      } else if (this.huiyuan.phone == "") {
        return this.$message.error("请输入手机号码");
      }
      if (this.title == "会员卡办理") {
        if (this.huiyuan.source == "") {
          return this.$message.error("请先选择会员等级");
        }
      }
      if (this.title == "套餐卡办理") {
        if (this.huiyuan.source == "") {
          return this.$message.error("请先选择套餐");
        }
      }
      if (this.title == "储蓄卡充值") {
        if (this.huiyuan.balance == "") {
          return this.$message.error("请先输入充值金额");
        }
      }

      if (this.payForm.payTypeList.length < 1) {
        return this.$message({
          message: "请先选择支付方式",
          type: "error"
        });
      }
      const sumPrice = this.payForm.payTypeList.reduce(function(
        accumulator,
        currentValue
      ) {
        return accumulator + parseFloat(currentValue.amount);
      },
      0);
      if (this.title == "储蓄卡充值") {
        if (sumPrice != this.huiyuan.balance) {
          return this.$message({
            message: "结算金额不等于实收金额，请修改",
            type: "error"
          });
        }
      } else {
        if (sumPrice != this.huiyuan.price - this.huiyuan.disAmount) {
          return this.$message({
            message: "结算金额不等于实收金额，请修改",
            type: "error"
          });
        }
      }

      if (this.title == "会员卡办理") {
        let data = {
          actAmount: this.huiyuan.price - this.huiyuan.disAmount,
          carNo: this.huiyuan.carNo,
          customerName: this.huiyuan.customerName,
          disAmount: this.huiyuan.disAmount == "" ? 0 : this.huiyuan.disAmount,
          discountReason: this.huiyuan.discountReason,
          gid: this.huiyuan.gid,
          payTypes: this.payForm.payTypeList,
          phone: this.huiyuan.phone,
          price: this.huiyuan.price,
          sellsMan: this.huiyuan.sellsMan,
          star: this.huiyuan.star,
          taskTimes: []
        };
        console.log(data);
        addMember(data).then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "办理会员卡成功"
            });
            this.payStatusHY = false;
          }
        });
      } else if (this.title == "套餐卡办理") {
        var d = new Date();
        d.setMonth(d.getMonth() + this.taocanLS.validity);
        var validity = moment(d).format("YYYY-MM-DD");
        let data = {
          actAmount: this.huiyuan.price - this.huiyuan.disAmount,
          buyDate: moment(new Date()).format("YYYY-MM-DD"), //购买日期
          carNo: this.huiyuan.carNo, //车牌
          comboItems: this.taocanLS.comboItems, //套餐项目
          comboName: this.taocanLS.comboName, //套餐名称
          comboId: this.taocanLS.id, //套餐ID
          isLimitCarNo: this.taocanLS.isLimitCarNo, //是否限制车牌号
          gid: this.huiyuan.gid,
          payTypes: this.payForm.payTypeList,
          phone: this.huiyuan.phone,
          price: this.huiyuan.price,
          sellsMan: this.huiyuan.sellsMan,
          status: this.taocanLS.status, //上下架状态
          validity: validity
        };
        console.log(data);
        TCsave(data).then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "办理套餐卡成功"
            });
            this.payStatusHY = false;
          }
        });
      } else if (this.title == "储蓄卡充值") {
        let data = {
          balance: this.huiyuan.balance,
          bizType: 1,
          bizUser: this.huiyuan.sellsMan,
          carNo: this.huiyuan.carNo,
          id:0,
          gid: this.huiyuan.gid,
          customerName: this.huiyuan.customerName,
          giftBalance: this.huiyuan.giftBalance,
          // id: 0,
          payTypes: this.payForm.payTypeList,
          phone: this.huiyuan.phone
        };
        memberStoreSave(data).then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "储蓄卡充值成功"
            });
            this.payStatusHY = false;
          }
        });
      }
    },
    banli(e) {
      this.huiyuan.carNo = "";
      this.huiyuan.price = "";
      this.huiyuan.star = "";
      this.huiyuan.disAmount = "";
      this.huiyuan.phone = "";
      this.huiyuan.source = "";
      this.huiyuan.customerName = "";
      this.huiyuan.sellsMan = "";
      this.payForm.payTypeList = [];
      this.payForm.difference = 0;
      this.huiyuan.balance = "";
      this.huiyuan.giftBalance = "";
      if (e == 1) {
        this.title = "会员卡办理";
        HYdengji().then(res => {
          if (res.data.code == 200) {
            this.HYdjlist = res.data.data;
          }
        });
      } else if (e == 2) {
        this.title = "套餐卡办理";
        TClist({ status: 1 }).then(res => {
          if (res.data.code == 200) {
            this.HYdjlist = res.data.data;
          }
        });
      } else if (e == 3) {
        this.title = "储蓄卡充值";
      }

      this.payStatusHY = true;
    },
    to() {
      this.$router.push({ path: "../home/huiyuan_A" });
    },
    tob() {
      this.$router.push({ path: "../home/huiyuan_B" });
    },
    toc() {
      this.$router.push({ path: "../home/huiyuan_C" });
    },
    //选择支付
    selectPayment(event) {
      this.payForm.difference = 0;
      this.JZlist = event;
    },
    onTableSelect(rows, row) {
      let selected = rows.length && rows.indexOf(row) !== -1;
      if (row.type == 5 && selected == true) {
        queryBillerCustomerSum({ isDebt: 0 }).then(res => {
          if (res.data.code == 200) {
            console.log(res.data.data);
            this.GZlist = res.data.data;
          }
          this.GZVisibleL = true;
        });
      }
      console.log(selected); // true就是选中，0或者false是取消选中
    },
    //支付选择确定
    zhifuQD() {
      var ding = "0";
      this.JZlist.map(v => {
        console.log(v);
        if (v.type == 5) {
          console.log(v.billerCustomerId);
          if (v.billerCustomerId === undefined || v.billerCustomerId === "") {
            this.$message({ message: "请先选择挂账客户", type: "error" });
            ding = 1;
          }
        }
      });
      if (ding == 0) {
        this.payForm.payTypeList = this.JZlist.map(v => {
          this.$set(v, "amount", 0);
          return v;
        });
        this.paymentVisible = false;
      }
    },
    getList(row) {
      //  this.JZlist = event;
      this.billerCustomerId = row.id;
      this.billname = row.name;
    },
    //挂账
    QDguazhang() {
      for (var i in this.JZlist) {
        if (this.JZlist[i].type == 5) {
          this.JZlist[i].billerCustomerId = this.billerCustomerId;
          this.JZlist[i].billname = this.billname;
        }
      }
      this.GZVisibleL = false;
      console.log(this.JZlist);
    },
    //计算差额
    changeAmount() {
      const sumPrice = this.payForm.payTypeList.reduce(function(
        accumulator,
        currentValue
      ) {
        return accumulator + parseFloat(currentValue.amount);
      },
      0);
      if (this.title == "储蓄卡充值") {
        this.payForm.difference = parseFloat(this.huiyuan.balance)- sumPrice;
      } else {
        this.payForm.difference =
          parseFloat(this.huiyuan.price - this.huiyuan.disAmount) - sumPrice;
      }
    },
    paymentDialog() {
      this.paymentVisible = true;
    }
    //
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
.xuanze {
  margin-top: 7px;
}
.hed {
  display: inline-block;
  width: 180px;
  height: 180px;
  /* background: pink; */
}
.meg {
  /* overflow: hidden; */
  width: 80px;
  height: 80px;
  margin: auto;
}
.banli {
  margin-top: 35px;

  text-align: center;
}
.meg img {
  margin-top: 25px;
  text-align: center;
  width: 80px;
  height: 80px;
}
.hed_a {
  cursor: pointer;
  border-radius: 6px;
  width: 170px;
  height: 170px;
  background: #fff;
  box-shadow: 2px 2px 10px rgb(244, 244, 245);
  -moz-box-shadow: 2px 2px 10px rgb(244, 244, 245);
  -webkit-box-shadow: 2px 2px 10px rgb(244, 244, 245) 0;
}
.hed_b {
  text-align: center;
  font-weight: 600;
  line-height: 40px;
}
.hed:nth-child(n + 2) {
  margin-left: 80px;
}
.mian {
  left: 50%;
  position: absolute;
  top: 50%;
  width: 710px;
  height: 220px;
  margin-top: -110px;
  margin-left: -355px;
}
.huiyuan {
  /* width: 60px; */
  float: left;
  line-height: 40px;
}
.huih .el-input {
  margin-left: 10px;
  width: 65%;
  height: 40px;
}
.huih .el-select {
  margin-left: 10px;
}
.huih .el-col {
  margin-top: 7px;
}
.boo {
  border-bottom: 1px solid #dcdfe6;
  height: 55px;
  /* line-height: 50px; */
}
</style>