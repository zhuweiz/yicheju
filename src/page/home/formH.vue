<template>
  <div class="w-100 order flex-col">
    <div class="p-15" style="background:rgba(229,246,247,1);">
				<el-form :inline="true" class="demo-form-inline">
          <el-row>
					<el-col>
            <el-form-item label="供应商" class="m-b-0">
              <el-input
                v-model="search.name"
                placeholder="供应商名称"
                style="width:100%;"
              ></el-input>
            </el-form-item>
						<el-form-item label="月份" class="m-b-0">
            <el-date-picker
                v-model="search.month"
                type="month"
              >
              </el-date-picker>
						</el-form-item>
            <el-button type="success" icon="el-icon-search" @click="getList()">查找</el-button>
            <el-form-item label="" class="m-b-0 right m-r-20">
              <div class="left c-p c-9" @click="getExcel" style="width: 139px; height: 42px;line-height: 42px;background: url(../../../static/img/but1.png) no-repeat;background-size: 100% 100%;text-indent: 45px;">导出EXCEL</div>
              <!-- <div class="left c-p c-9" @click="printDeal" style="width: 106px; height: 42px;line-height: 42px;background: url(../../../static/img/but2.png) no-repeat;background-size: 100% 100%;text-indent: 50px;">打印</div> -->
          </el-form-item>
					</el-col>
          </el-row>
				</el-form>
		</div>
    <div style="width:100%;padding-top:15px;" class="orderTable" id="printBox">
      <el-table
        :data="tableData"
        :max-height="maxHeight"
        style="width: 100%"
      >
        <el-table-column label="编号" type="index"> </el-table-column>
        <el-table-column prop="partName" label="配件名称"> </el-table-column>
        <el-table-column prop="model" label="规格型号"> </el-table-column>
        <el-table-column prop="price" label="成交单价"> </el-table-column>
        <el-table-column prop="counts" label="数量"> </el-table-column>
        <el-table-column prop="" label="金额">
          <template slot-scope="scope">
            {{(scope.row.price * scope.row.counts).toFixed(2)}}
          </template>
        </el-table-column>
        <el-table-column prop="supplierName" label="供应商"> </el-table-column>
        <el-table-column prop="createdDate" label="采购时间"> </el-table-column>
        <el-table-column prop="billNumber" label="工单号"> </el-table-column>
        <el-table-column prop="carNo" label="车牌"> </el-table-column>
        <el-table-column prop="" label="记账状态">
          <template slot-scope="scope">
            <font color="#0D906E" v-if="scope.row.paymentStatus == 1">已记账</font>
            <font color="red" v-else>未记账</font>
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <span v-if="scope.row.paymentStatus == 1"><el-button size="mini" @click="cancelRow(scope.row)" type="danger">反记账</el-button></span>
            <span v-else><el-button size="mini" type="success" @click="editRow(scope.row, 1)">记账</el-button></span>
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
        >
        </el-pagination>
      </div>
    </div>

    <el-dialog title="记账" :visible.sync="payStatus" center width="30%" :modal="false">
      <el-form :model="payForm">
        <el-form-item label="付款日期" label-width="100px">
          <el-date-picker
            v-model="payForm.dates"
            type="datetime">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="应结" label-width="100px">
          ￥{{payForm.price * payForm.counts}}
        </el-form-item>
        <el-form-item label="付款金额" label-width="100px">
          <el-input v-model="payForm.totalAmount"></el-input>
        </el-form-item>
        <el-form-item label="备注" label-width="100px">
          <el-input v-model="payForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="payStatus = false">取 消</el-button>
        <el-button type="success" @click="payFormSubmit">提 交</el-button>
      </div>
    </el-dialog>
    
  </div>
</template>

<script>
import { getThirdPurOrder, paymentAccount, cancelPaymentAccount,excel } from "../../request/api.js";
import moment from "moment";
export default {
  name: "formH",
  data() {
    return {
      search: {
        month: moment(new Date()).format("YYYY-MM"),
      },
      tableData: [],
      maxHeight: undefined,
      pageLength: null,
      size: 10,
      page: 0,
      payStatus: false,
      payForm: {
        dates: new Date()
      },
      searchDate: ''
    };
  },
  created() {    
    this.getList()
  },
  mounted() {
    this.maxHeight = $(".tabBox").height() - 260 + "px";
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val - 1;
      this.getList()
    },
    getList() { 
      const data = {
        page: this.page,
        size: this.size,
        gid: localStorage.getItem('gid'),
        beginTime: moment(this.search.month).startOf('month').format("YYYY-MM-DD"),
        endTime: moment(this.search.month).endOf('month').format("YYYY-MM-DD")
      };
      getThirdPurOrder(data).then(res => {
        this.tableData = res.data.data
        this.pageLength = res.data.pageInfo.total
      });
    },
    editRow(row) {
      this.payForm = {
        dates: moment(new Date()),
        totalAmount: row.price * row.counts,
        ...row
      }
      this.payStatus = true
    },
    payFormSubmit(){
      const data = {
        "billId": this.payForm.id,
        "billType": 3,
        "idList": [],
        "paymentAmount": this.payForm.totalAmount,
        "paymentDate": moment(this.payForm.dates).format("YYYY-MM-DD HH:mm:ss"),
        "remark": this.payForm.remark,
        "beginDate": moment(this.searchDate).startOf('month').format("YYYY-MM-DD"),
        "endDate": moment(this.searchDate).endOf('month').format("YYYY-MM-DD")
      }
      paymentAccount(data).then(res => {
        if(res.data.code == 200){
          this.$message({
            type: 'success',
            message: '记账成功!'
          })
          this.payStatus = false
          this.getList()
        }
      })
    },
    cancelRow(){
      cancelPaymentAccount({id: this.payForm.id}).then(res => {
        if(res.data.code == 200){
          this.$message({
            type: 'success',
            message: '反记账成功!'
          })
          this.payStatus = false
          this.getList()
        }
      })
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
    		endTime:this.search.month+'-31',
    		startTime:this.search.month+'-01',
    		type:12 //配件采购供应商汇总
      }
    	excel(data,"其它配件账总报表").then(()=>{})
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
