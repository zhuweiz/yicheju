<template>
	<div class="w-100" style="padding-left: 30px;">

		<div style="width: 860px;margin: 50px auto;">
			<el-card class="box-card">
				<h1 class="text-center f-22 p-tb-15" style="font-family:'黑体'">{{data.garageName}}结算单</h1>
			  <div class="text item p-tb-30">
					<el-row>
						<el-col :span="16">工单号：<em v-if="data.billNumber">{{data.billNumber}}</em><em v-else>暂无</em></el-col>
						<el-col :span="8">车牌：<em v-if="data.carNo">{{data.carNo}}</em><em v-else>暂无</em></el-col>
					</el-row>
					<el-row>
						<el-col :span="16">车架号：<em v-if="data.vin">{{data.vin}}</em><em v-else>暂无</em></el-col>
						<el-col :span="8">车型：<em v-if="data.standard">{{data.standard}}</em><em v-else>暂无</em></el-col>
					</el-row>
					<el-row>
						<el-col :span="16">客户姓名：<em v-if="data.customerName">{{data.customerName}}</em><em v-else>暂无</em></el-col>
						<el-col :span="8">客户手机号：<em v-if="data.phone">{{data.phone}}</em><em v-else>暂无</em></el-col>
					</el-row>
					<el-row>
						<el-col :span="16">里程：<em v-if="data.driveMiles">{{data.driveMiles}}</em><em v-else>暂无</em></el-col>
						<el-col :span="8">维修类别：</el-col>
					</el-row>
					<el-row>
						<el-col :span="16">进店日期：<em v-if="data.createdDate">{{data.createdDate}}</em><em v-else>暂无</em></el-col>
						<el-col :span="8">结算日期：<em v-if="data.settlementDate">{{data.settlementDate}}</em><em v-else>暂无</em></el-col>
					</el-row>
					<el-row>
						<el-col :span="16">地址：<em v-if="data.garageAddress">{{data.garageAddress}}</em><em v-else>暂无</em></el-col>
						<el-col :span="8">电话：<em v-if="data.garagePhone">{{data.garagePhone}}</em><em v-else>暂无</em></el-col>
					</el-row>
			</div>
			 <el-table
			      :data="tableData1"
			      style="width: 100%">
			      <el-table-column
			        label="序号"
			        type="index"
			        width="60">
			      </el-table-column>
			      <el-table-column
				  	width="170"
			        label="服务名称">
			        <template slot-scope="scope">
			        {{scope.row.itemName}}
			         </template>
			      </el-table-column>
			      <el-table-column
			        label="施工人员">
			        <template slot-scope="scope">
			        <em v-if="scope.row.workers">{{scope.row.workers}}</em>
			        <em v-else>暂无</em>
			         </template>
			      </el-table-column>
			      <el-table-column
			        label="单价">
			        <template slot-scope="scope">
			        {{scope.row.standPrice}}
			         </template>
			      </el-table-column>
			      <el-table-column
			        label="折扣">
			        <template slot-scope="scope">
			        <em v-if="data.discountItemRate"> {{data.discountItemRate }}</em>
			        <em v-else>暂无折扣</em>
			         </template>
			      </el-table-column>
			      <el-table-column
			        label="折扣后">
			        <template slot-scope="scope">
			        <em v-if="data.discountItemRate">{{(data.discountItemRate * scope.row.standPrice).toFixed(1)}}</em>
			        <em v-else>{{scope.row.standPrice}}</em>
			        </template>
			      </el-table-column>
			      <el-table-column
			        label="数量">
			         <template slot-scope="scope">
			        	{{scope.row.counts}}
			         </template>
			      </el-table-column>
			      <el-table-column
			        label="小计">
			        <template slot-scope="scope">
			        <em v-if="data.discountItemRate">{{(data.discountItemRate * scope.row.standPrice * scope.row.counts).toFixed(1)}}</em>
			        <em v-else>{{scope.row.standPrice * scope.row.counts}}</em>
			         </template>
			      </el-table-column>
			    </el-table><br />
			    <el-table
			      :data="tableData2"
			      style="width: 100%">
			      <el-table-column
			        label="序号"
			        type="index"
			        width="80">
			      </el-table-column>
			      <el-table-column
				  	width="170"
			        label="商品名称">
			        <template slot-scope="scope">
			        {{scope.row.partName}}
			         </template>
			      </el-table-column>
			      <el-table-column
			        label="单价">
			        <template slot-scope="scope">
			        {{scope.row.price}}
			         </template>
			      </el-table-column>
			      <el-table-column
			        label="折扣">
			        <template slot-scope="scope">
							<em v-if="data.discountPartRate"> {{data.discountPartRate}}</em>
			        <em v-else>暂无折扣</em>
			         </template>
			      </el-table-column>
			      <el-table-column
			        label="折后价">
			         <template slot-scope="scope">
			        <em v-if="data.discountPartRate">{{(data.discountItemRate * scope.row.price).toFixed(1)}}</em>
			        <em v-else>{{scope.row.price}}</em>
			        </template>
			      </el-table-column>
			      <el-table-column
			        label="数量">
			        <template slot-scope="scope">
			        {{scope.row.counts}}
			         </template>
			      </el-table-column>
			      <el-table-column
			        label="小计">
			         <template slot-scope="scope">
			        <em v-if="data.discountPartRate">{{(data.discountItemRate * scope.row.price * scope.row.counts).toFixed(1)}}</em>
			        <em v-else>{{scope.row.price * scope.row.counts}}</em>
			         </template>
			      </el-table-column>
						<el-table-column
			        label="备注">
			        <template slot-scope="scope">
			        {{scope.row.partRemark}}
			         </template>
			      </el-table-column>
			    </el-table>
			  <el-row class="p-t-30">
			  <!-- <div class="flex">
				<el-col>优惠：<em>{{zongshou - (zhekou+zhekou2)}}</em></el-col>
			  <el-col>实收：<em>{{zhekou+zhekou2}}</em></el-col>
			  </div> -->
			  <div class="flex just-bet">
				  <p class="w-100">工时费合计：￥{{zhekou ? zhekou.toFixed(1) : 0}}</p>
				  <p class="w-100">配件费合计：￥{{zhekou2 ? zhekou2.toFixed(1) : 0}}</p>
				  <p class="w-100">应收金额：￥{{data.amountReceivable}}</p>
				  <p class="w-100">结账方式：{{data.payType}}</p>
				  </div>
			  <div class="flex just-bet p-tb-5">
				  <p class="w-100">优惠金额：￥{{data.amountDiscount}}</p>
				  <p class="w-100">实收金额：￥{{data.amountActual}}</p>
				  <p class="w-100 flex">
				  <em>票据：</em>
				  <em class="block m-t-5 m-l-10" style="width:16px;height:16px;border:2px solid #000;"></em>
				  <em>&nbsp;收据</em>
				  <em class="block m-t-5 m-l-30" style="width:16px;height:16px;border:2px solid #000;"></em>
				  <em>&nbsp;发票</em>
				  </p>
				  <p class="w-100"></p>
				  </div>
			  <div class="p-tb-15"><p>备注：{{data.remark}}</p></div>
			  <p>{{data.pcPrintRemark}}</p>
			  <div class="flex just-end p-r-25 p-tb-20"><div>顾客签名：</div><p style="width:120px;border-bottom:2px solid #000;"></p></div>
			</el-row>
			</el-card>
		</div>

	</div>

</template>

<script>
import { print } from "../../request/api.js";
export default {
  name: "print",
  data() {
    return {
      data: "",
      tableData1: [],
      tableData2: [],
      
      zongshou:null,
	  zhekou:null,
	  zhekou2:null,
	  youhui:null,
	  
	//   工时费合计
	 gongshi:null,
    };
  },
  created() {
    const data = {
      oid: localStorage.getItem("oid")
    };
    print(data).then(res => {
	  this.data = res.data.data;
	  
      this.tableData1 = res.data.data.orderItemList;
    //    console.log(this.data)
      this.tableData1.forEach((item, index) => {
      	
      	this.zongshou += parseInt(item.standPrice);
        if(this.data.discountItemRate){
					this.zhekou += parseFloat((this.data.discountItemRate * item.standPrice * item.counts).toFixed(1) )
        }else{
        	this.zhekou += item.standPrice
		}
	  
	
        item.orderPartList.forEach((items, indexs) => {
			
		  this.tableData2.push(items);
		//   console.log(items)
		  this.zongshou+=items.price
			console.log(items)
			console.log(this.data)
          if(this.data.discountPartRate){
			  this.zhekou2 += parseFloat((this.data.discountPartRate * items.price * items.counts).toFixed(1))
          }else{
          	this.zhekou2 += items.price * items.counts
		  }
          
        });
		// console.log(this.zhekou2)
      });
//    console.log(this.zongshou)
//    console.log(this.zhekou)
      
      
      setTimeout(function() {
        window.print();
      }, 500);
	});
		
  },
  mounted() {},
  methods: {}
};
</script>
<style>
body {font-family: '黑体';color:#000;}
</style>
<style scoped>
.w-100 /deep/ .el-table, .w-100 /deep/ .el-table__empty-text, .w-100 /deep/ em, .w-100 /deep/ .el-table th>.cell, .w-100 /deep/ .el-card{color:#000 !important;}
.el-table{border: 1px solid #dedede;}
.el-table thead tr th{background-color:#fff !important;color: #666;font-weight: 500;}
</style>