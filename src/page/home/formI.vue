<template>
  <div class="w-100 order flex-col">
    <div
      style="height: 60px;line-height: 60px;background:rgba(229,246,247,1);padding-left:15px;padding-right:15px;color:#0D906E;"
    >
      <em>固定资产明细</em>
      <div class="m-b-0 right m-r-20 m-t-10">
        <div class="left c-p c-9" @click="getExcel" style="width: 139px; height: 42px;line-height: 42px;background: url(../../../static/img/but1.png) no-repeat;background-size: 100% 100%;text-indent: 45px;">导出EXCEL</div>
        <!-- <div class="left c-p c-9" @click="printDeal" style="width: 106px; height: 42px;line-height: 42px;background: url(../../../static/img/but2.png) no-repeat;background-size: 100% 100%;text-indent: 50px;">打印</div> -->
    </div>
    </div>
    <div style="width:100%;padding-top:15px;" class="orderTable" id="printBox">
      <el-table :data="tableData" :max-height="maxHeight" style="width: 100%">
        <el-table-column type="index" width="60">
          <template slot-scope="scope">
            {{scope.row.index}}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="资产名称"> </el-table-column>
        <el-table-column prop="model" label="型号"> </el-table-column>
        <el-table-column prop="name" label="数量">
          <template slot-scope="scope">
            {{ scope.row.count }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="单价（元）">
          <template slot-scope="scope">
            {{ scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="name" label="金额（元）">
          <template slot-scope="scope">
            {{ scope.row.count * scope.row.price }}
          </template>
        </el-table-column>
        <el-table-column prop="receiveTime" label="入账日期"> </el-table-column>
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
  </div>
</template>

<script>
import { form9,excel } from "../../request/api.js";
import moment from "moment";
export default {
  name: "formI",
  data() {
    return {
      tableData: [],
      maxHeight: undefined,
      pageLength: null,
      size: 10,
      page: 0
    };
  },
  created() {
    let nowTime = moment(new Date()).format("YYYY-MM-DD");
    const data = {
      endTime: nowTime,
      startTime: nowTime,
      page: this.page,
      size: this.size
    };
    this.getList();
  },
  mounted() {
    this.maxHeight = $(".tabBox").height() - 290 + "px";
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val - 1;
      if (
        this.search.time !== undefined &&
        this.search.time !== null &&
        this.search.time.length > 0
      ) {
        const data = {
          endTime: this.search.time[1],
          startTime: this.search.time[0],
          page: this.page,
          size: this.size
        };
        this.getList(data);
      } else {
        this.$message({
          message: "请先选择查询日期！",
          type: "warning"
        });
      }
    },
    getList() {
      form9().then(res => {
        this.pageLength = res.data.data.totalElements;
        if (res.data.data.content.length > 0) {
          this.tableData = res.data.data.content;
          this.tableData.forEach((item,index) => {
            item.index = (index + 1) + (this.page) * 10
            if(item.receiveTime){item.receiveTime = moment(item.receiveTime).format("YYYY/MM/DD")}
          });
         this.tableData[this.tableData.length-1].index = "合计:"
        }
      });
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
    		type:7 //固定资产
      }
    	excel(data,"固定资产报表").then(()=>{})
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
