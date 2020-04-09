<template>
  <div class="w-100 order flex-col">
    <div class="p-15" style="background:rgba(229,246,247,1);">
      <el-row :gutter="10">
        <el-form :inline="true" class="demo-form-inline">
          <el-col>
            <el-form-item label="供应商" class="m-b-0">
              <el-input
                v-model="search.supplierName"
                placeholder="供应商名称"
                style="width:100%;"
              ></el-input>
            </el-form-item>
            <el-button
              type="success"
              icon="el-icon-search"
              @click="getList()"
              >查找</el-button>
              <el-form-item label="" class="m-b-0 right m-r-20">
                <div class="left c-p c-9" @click="getExcel" style="width: 139px; height: 42px;line-height: 42px;background: url(../../../static/img/but1.png) no-repeat;background-size: 100% 100%;text-indent: 45px;">导出EXCEL</div>
                <!-- <div class="left c-p c-9" @click="printDeal" style="width: 106px; height: 42px;line-height: 42px;background: url(../../../static/img/but2.png) no-repeat;background-size: 100% 100%;text-indent: 50px;">打印</div> -->
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>

    <div style="width:100%;padding-top:15px;" class="orderTable" id="printBox">
      <el-table :data="tableData" :max-height="500" style="width: 100%">
        <el-table-column v-for="(item, index) in headerStrList" :key="index" :label="item">
          <template slot-scope="scope">
            <span  v-show="index == 0">{{index + 1}}</span>
            <span  v-show="index == 1">{{scope.row.supplierName}}</span>
            <span  v-show="index == 2">{{scope.row.linkman}}</span>
            <span  v-show="index == 3">{{scope.row.phone}}</span>
            <span  v-show="index == 4">{{scope.row.currentMonthAmount}}</span>
            <span  v-show="index == 5">{{state[scope.row.currentMonthStatu]}}</span>
            <span  v-show="index == 6">{{scope.row.minusMonths1Amount}}</span>
            <span  v-show="index == 7">{{state[scope.row.minusMonths1Statu]}}</span>
            <span  v-show="index == 8">{{scope.row.minusMonths2Amount}}</span>
            <span  v-show="index == 9">{{state[scope.row.minusMonths2Statu]}}</span>
            <span  v-show="index == 10">{{scope.row.minusMonths3Amount}}</span>
            <span  v-show="index == 11">{{state[scope.row.minusMonths3Statu]}}</span>
            <div  v-show="index == 12">
              <el-button size="mini" @click="viewRow(scope.row)" type="success">查看</el-button>
            </div>
          </template>
        </el-table-column>
      
        <!-- <el-table-column prop="amount3" label="操作">
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="viewRow(scope.row)">查看</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <div class="p-tb-10 text-center">
        <el-pagination
          :hide-on-single-page="pageLength === 0"
          background
          layout="prev, pager, next"
          :page-size="size"
          @current-change="handleCurrentChange"
          :total="pageLength"
        >
        </el-pagination>
      </div>
    </div>

    <el-dialog title="配件月采购情况" :visible.sync="lists.status" width="70%" :modal="false" center>
      <el-form
					:inline="true"
					class="demo-form-inline"
				>
        <el-row>
          <el-col>
            <el-form-item
              label="供应商："
              class="m-b-0"
            >
              {{lists.info.supplierName}}
            </el-form-item>
            <el-form-item label="月份：" class="m-b-0">
              <el-date-picker
                v-model="lists.search.month"
                type="month"
                @change="getOrderList"
              >
              </el-date-picker>
						</el-form-item>
            <el-form-item
              label="合计笔数："
              class="m-b-0"
            >
             {{lists.data.totalCount}}
            </el-form-item>
            <el-form-item
              label="合计发生额："
              class="m-b-0"
            >
             ￥{{lists.data.totalAmount}}
            </el-form-item>
            <el-button
              type="danger"
              @click="allPay"
            >批量结款</el-button>
            <el-form-item
              label=""
              class="m-b-0 right m-r-20"
            >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="orderTable" style="margin-top:10px;">
        <el-table :data="lists.data.detailList" @selection-change="handleSelectionChange">
          <el-table-column type="index" label="编号"></el-table-column>
          <el-table-column prop="createdDate" label="日期"></el-table-column>
          <el-table-column prop="purOrderNo" label="工单号"></el-table-column>
          <el-table-column prop="partCount" label="配件数"></el-table-column>
          <el-table-column prop="totalAmount" label="金额"></el-table-column>
          <el-table-column prop="supplierRemark" label="备注"></el-table-column>
          <el-table-column prop="scope" label="操作">
            <template slot-scope="scope">
              <el-button size="mini" @click="viewInfo(scope.row)" type="success">详情</el-button>
              <span v-if="scope.row.paymentStatus == 1">
                <font color="red">已结款</font>
              </span>
               <span v-else>
                <el-button size="mini" @click="pay(scope.row)" type="danger">结款</el-button>
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            type="selection"
            width="55">
          </el-table-column> -->
        </el-table>
        <div class="p-tb-10 text-center">
          <el-pagination
            :hide-on-single-page="lists.pageLength === 0"
            background
            layout="prev, pager, next"
            :page-size="lists.size"
            @current-change="listsCurrentChange"
            :total="lists.pageLength"
          >
          </el-pagination>
        </div>
      </div>
			<div slot="footer" class="dialog-footer">
        <el-button @click="lists.status = false">退 出</el-button>
			</div>
		</el-dialog>

    <el-dialog :title="title" :visible.sync="payStatus" center width="30%" :modal="false">
      <el-form :model="payForm">
        <el-form-item label="付款日期" label-width="100px">
          <el-date-picker
            v-model="payForm.dates"
            type="datetime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="应结" label-width="100px">
          ￥{{payForm.totalAmount}}
        </el-form-item>
        <el-form-item label="付款金额" label-width="100px">
          <el-input v-model="payForm.prices"></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="100px">
          <el-input v-model="payForm.supplierRemark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="payStatus = false">取 消</el-button>
        <el-button type="success" @click="payFormSubmit">提 交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="配件订单详情" :visible.sync="info.status" width="70%" :modal="false" center>
      <el-form
					:inline="true"
					class="demo-form-inline"
				>
        <el-row>
          <el-col>
            <el-form-item
              label="供应商："
              class="m-b-0"
            >
              {{info.data.supplierName}}
            </el-form-item>
            <el-form-item label="日期：" class="m-b-0">
              {{info.data.sendTime}}
						</el-form-item>
            <el-form-item
              label="工单号："
              class="m-b-0"
            >
             {{info.data.billNumber}}
            </el-form-item>
            <el-form-item
              label="车牌："
              class="m-b-0"
            >
             {{info.data.carNo}}
            </el-form-item>
            <el-form-item
              label="配件数量："
              class="m-b-0"
            >
             {{info.data.partCount}}
            </el-form-item>
            <el-form-item
              label="金额："
              class="m-b-0"
            >
             <font color="red">￥{{info.data.totalAmount}}</font>
            </el-form-item>
            <el-form-item
              label="结款状态："
              class="m-b-0"
            >
             <font color="red">{{info.data.paymentStatus == 1 ? "已记账" : "未记账"}}</font>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="orderTable" style="margin-top:10px;">
        <el-table :data="info.data.askPricePartDOList">
          <el-table-column type="index" label="编号"></el-table-column>
          <el-table-column prop="partName" label="配件名称"></el-table-column>
          <el-table-column prop="model" label="规格型号"></el-table-column>
          <el-table-column prop="address" label="配件类别">
            <template slot-scope="scope">
              {{types[scope.row.partType]}}
            </template>
          </el-table-column>
          <el-table-column prop="price" label="成交单价"></el-table-column>
          <el-table-column prop="partCount" label="数量"></el-table-column>
          <el-table-column prop="phone" label="金额">
            <template slot-scope="scope">
              {{(scope.row.price * scope.row.partCount).toFixed(2)}}
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="备注"></el-table-column>
        </el-table>
        <div class="p-tb-10 text-center">
          <el-pagination
            :hide-on-single-page="info.pageLength === 0"
            background
            layout="prev, pager, next"
            :page-size="info.size"
            @current-change="infoCurrentChange"
            :total="info.pageLength"
          >
          </el-pagination>
        </div>
      </div>
			<div slot="footer" class="dialog-footer">
        <el-button @click="info.status = false">退 出</el-button>
			</div>
		</el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { getPurOrderSumReport, getPurOrderDetailReport, getPartPurOrderDetail, paymentAccount, batchPaymentAccount } from "../../request/api.js"
export default {
  name: "formG",
  data() {
    return {
      types: ['原厂', '品牌', '其他'],
      state: ['未结款', '部分结款', '已结款'],
      search: {
        supplierName: ""
      },
      headerStrList: [],
      tableData: [],
      maxHeight: undefined,
      pageLength: null,
      size: 10,
      page: 0,
      lists: {
        info: {},
        data: {},
        status: false,
        search: {
          name: '',
          month: moment(new Date()).format("YYYY-MM"),
        },
        page: 0,
        pageLength: 0,
        size: 10
      },
      selectedList: [],
      title: '月结款',
      payStatus: false,
      payForm: {
        dates: new Date()
      },
      info: {
        data: [],
        status: false,
        page: 0,
        pageLength: 0,
        size: 10
      },
      infos: {},
      searchDate: ''
    };
  },
  created() {
    this.getList()
  },
  mounted() {
    this.maxHeight = $(".tabBox").height() - 235 + "px";
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val - 1;
      this.getList()
    },
    getList() {
      const data = {
        supplierName: this.search.supplierName,
        page: this.page,
        size: this.size
      }
      getPurOrderSumReport(data).then(res => {
        let headerStrList = res.data.data.headerStrList
        console.log(res)
        headerStrList.unshift('序号')
        headerStrList.push('操作')
        this.headerStrList = headerStrList
        this.tableData = res.data.data.dataVOList
        
      })
    },
    handleSelectionChange(event) {
      this.selectedList = event
    },
    viewRow(row){
      this.lists.status = true
      this.lists.info = row
      this.getOrderList()
    },
    getOrderList(event) {
      this.searchDate = event
      const data = {
        page: this.lists.page,
        size: this.lists.size,
        supplierId: this.lists.info.supplierId,
        beginDate: moment(event).startOf('month').format("YYYY-MM-DD"),
        endDate: moment(event).endOf('month').format("YYYY-MM-DD")
      }
      getPurOrderDetailReport(data).then(res => {
        this.lists.data = res.data.data[0]
        this.lists.pageLength = res.data.pageInfo.total
      })
    },
    viewInfo(row) {
      this.info.status = true
      this.infos = row
      this.getInfo()
    },
    pay(row){
      this.title = '订单结款'
      this.payForm = {
        dates: moment(new Date()),
        ...row
      }
      this.payStatus = true
    },
    allPay(){
      this.title = '月结款'
      this.payStatus = true
      this.payForm = {
        dates: moment(new Date()),
        totalAmount: this.lists.data.paymentAmount
      }
    },
    payFormSubmit(){
      if(this.title == '订单结款'){
        const data = {
          "billId": this.payForm.purOrderId,
          "billType": 1,
          "idList": [],
          "paymentAmount": this.payForm.prices,
          "paymentDate": moment(this.payForm.dates).format("YYYY-MM-DD HH:mm:ss"),
          "remark": this.payForm.supplierRemark,
          "beginDate": moment(this.searchDate).startOf('month').format("YYYY-MM-DD"),
          "endDate": moment(this.searchDate).endOf('month').format("YYYY-MM-DD")
        }
        paymentAccount(data).then(res => {
          if(res.data.code == 200){
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
            this.getOrderList()
            this.payStatus = false
          }
        })
      }else{
        const data = {
          "billId": '',
          "billType": 1,
          "idList": [],
          "paymentAmount": this.payForm.prices,
          "paymentDate": moment(this.payForm.dates).format("YYYY-MM-DD HH:mm:ss"),
          "remark": this.payForm.supplierRemark,
          "supplierId": this.lists.info.supplierId,
          "beginDate": moment(this.searchDate).startOf('month').format("YYYY-MM-DD"),
          "endDate": moment(this.searchDate).endOf('month').format("YYYY-MM-DD")
        }
        batchPaymentAccount(data).then(res => {
          if(res.data.code == 200){
            this.$message({
              type: 'success',
              message: '批量结款成功!'
            })
            this.getOrderList()
            this.payStatus = false
          }
        })
      }
    },
    listsCurrentChange(val) {
      this.lists.page = val - 1
      this.getOrderList()
    },
    getInfo() {
      getPartPurOrderDetail({partPurOrderId: this.infos.id}).then(res => {
        this.info.data = res.data.data
      })
    },
    infoCurrentChange(val) {
      this.lists.page = val - 1
      this.getInfo()
    },
    printDeal(){
    	var printBox = document.getElementById('printBox');
            var newContent =printBox.innerHTML;
            var oldContent = document.body.innerHTML;
            document.body.innerHTML = newContent;
            window.print();
            window.location.reload();
            document.body.innerHTML = oldContent;
    },
    getExcel(){
	    if(this.tableData.length < 1){
        this.$message({
          message: "暂无可导出的数据！",
          type: "warning"
        });
        return
      }
    	const data = {
    		endTime:this.search.time[1],
    		startTime:this.search.time[0],
    		type:4 //配件采购明细
      }
    	excel(data,"配件采购明细报表").then(()=>{})
    }
  }
};
</script>
<style scoped>
.navActive em:hover {
		color: #3AC29F;
		transition: .5s;
	}
	
	.navActive em.active {
		color: #3AC29F;
	}

</style>
