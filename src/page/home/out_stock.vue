<template>
  <div class="w-100 order flex-col">
    <div class="p-15" style="background:rgba(229,246,247,1);">
      <el-row :gutter="10">
        <el-form :inline="true" class="demo-form-inline">
          <el-col>
            <el-form-item label="日期" class="m-b-0">
              <el-date-picker
                v-model="search.time"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                unlink-panels
                :picker-options="pickerOptions"
              >
              </el-date-picker>
            </el-form-item>
            <el-button
              type="success"
              icon="el-icon-search"
              @click="getList()"
              >查找</el-button>
            <el-button type="success"	icon="el-icon-plus" @click="addDig">调拨单</el-button>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div style="width:100%;padding-top:15px;" class="orderTable" id="printBox">
      <el-table :data="tableData" :max-height="maxHeight" style="width: 100%">
        <el-table-column prop="allotNo" label="单号">
        </el-table-column>
        <el-table-column prop="total" label="配件数">
        </el-table-column>
        <el-table-column prop="outGarageName" label="发出门店">
        </el-table-column>
        <el-table-column prop="createdDate" label="发起时间">
        </el-table-column>
        <el-table-column prop="enterGarageName" label="接收门店">
        </el-table-column>
        <el-table-column prop="enterDate" label="接收时间">
        </el-table-column>
        <el-table-column prop="enterOperateUser" label="接收人">
        </el-table-column>
        <el-table-column prop="remark" label="状态">
          <template slot-scope="scope">
            <font v-if="scope.row.status === 1">{{statusName[scope.row.status]}}</font>
            <font v-else color="red">{{statusName[scope.row.status]}}</font>
          </template>
        </el-table-column>
        <el-table-column prop="employeeName" label="操作" width="200" align="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 0" size="mini" type="danger" @click="cancelRow(scope.row)">撤销</el-button>
            <el-button size="mini" type="success" @click="viewParts(scope.row)">查看</el-button>
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

    <el-dialog title="调拨单" :visible.sync="allotStatus" width="70%" :modal="false" center>
      <el-form
					:inline="true"
					class="demo-form-inline"
				>
        <el-row>
          <el-col>
            <el-form-item
              label="名称"
              class="m-b-0"
            >
            <el-input style="width:160px;" v-model="partSearch.search"></el-input>
            </el-form-item>
            <el-form-item
              label="规格型号"
              class="m-b-0"
            >
            <el-input style="width:160px;" v-model="partSearch.model"></el-input>
            </el-form-item>
            <el-form-item
              label="编码"
              class="m-b-0"
            >
            <el-input style="width:160px;" v-model="partSearch.partNo"></el-input>
            </el-form-item>
            <el-button
              type="success"
              icon="el-icon-search"
              @click="getParts"
            >查找</el-button>
            <el-form-item
              label=""
              class="m-b-0 right m-r-20"
            >
            </el-form-item>
            <!-- <div style="float:right;">单号：234324234234</div> -->
          </el-col>
        </el-row>
      </el-form>
      <div class="orderTable" style="margin-top:10px;">
        <el-table :data="allotList" height="250">
          <el-table-column prop="id" label="序号"> </el-table-column>
          <el-table-column prop="partName" label="名称"></el-table-column>
          <el-table-column prop="model" label="规格型号"> </el-table-column>
          <el-table-column prop="unit" label="单位"> </el-table-column>
          <el-table-column prop="exceeds" label="进价"> </el-table-column>
          <el-table-column prop="sellPrice" label="售价"> </el-table-column>
          <el-table-column prop="total" label="库存"></el-table-column>
          <el-table-column prop="partNo" label="编码"> </el-table-column>
          <el-table-column prop="remark" label="操作" width="90" align="center">
            <template slot-scope="scope">
              <el-button v-show="scope.row.status == 1" type="text" style="color:#0d906e;" @click="addAllot(scope.row, scope.$index)">添加</el-button>
              <el-button v-show="scope.row.status == 2" type="text" style="color:red;">已添加</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="p-tb-10 text-center">
          <el-pagination
            :hide-on-single-page="partPageLength === 0"
            background
            layout="prev, pager, next"
            :page-size="partSize"
            @current-change="partNext"
            :total="partPageLength"
          >
          </el-pagination>
        </div>
      </div>
      <div class="orderTable" style="margin-top:10px;">
        <el-table :data="allotFormList" height="250">
          <el-table-column prop="id" label="序号"> </el-table-column>
          <el-table-column prop="partName" label="名称"></el-table-column>
          <el-table-column prop="model" label="规格型号"> </el-table-column>
          <el-table-column prop="unit" label="单位"> </el-table-column>
          <el-table-column prop="exceeds" label="进价"> </el-table-column>
          <el-table-column prop="sellPrice" label="售价"> </el-table-column>
          <el-table-column prop="total" label="库存"></el-table-column>
          <el-table-column prop="partNo" label="编码"> </el-table-column>
          <el-table-column property="address" label="调拨数" width="140" align="center">
            <template slot-scope="scope">
              <el-input-number size="mini" :min="1" v-model="scope.row.count"></el-input-number>
            </template>
          </el-table-column>
          </el-table-column>
          <el-table-column prop="remark" label="操作" width="90" align="center">
            <template slot-scope="scope">
              <el-button type="text" style="color:red;" @click="deleteAllot(scope.row, scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
			<div slot="footer" class="dialog-footer">
        <el-row :gutter="20">
          <el-col :span="10" style="text-align:left;">
            <label>接收门店：</label>
            <el-select v-model="enterGid" placeholder="请选择">
              <el-option v-for="item in garageList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-col>
          <el-col :span="14" style="text-align:left;">
            <el-button @click="allotStatus = false">取 消</el-button>
				    <el-button type="success" @click="allotFormSubmit">提 交</el-button>
          </el-col>
        </el-row>
			</div>
		</el-dialog>

    <el-dialog title="配件列表" :visible.sync="partStatus" width="70%" :modal="false" center>
      <div class="orderTable" style="margin-top:10px;">
        <el-table :data="partList" height="250">
          <el-table-column prop="id" type="index" label="序号"> </el-table-column>
          <el-table-column prop="partName" label="名称"></el-table-column>
          <el-table-column prop="model" label="规格型号"> </el-table-column>
          <el-table-column prop="unit" label="单位"> </el-table-column>
          <el-table-column prop="exceeds" label="进价"> </el-table-column>
          <el-table-column prop="sellPrice" label="售价"> </el-table-column>
          <el-table-column prop="total" label="库存"></el-table-column>
          <el-table-column prop="upperLimit" label="上限量"></el-table-column>
          <el-table-column prop="lowerLimit" label="下限量"> </el-table-column>
          <el-table-column prop="partNo" label="编码"> </el-table-column>
        </el-table>
      </div>
			<div slot="footer" class="dialog-footer">
        <el-button type="success" @click="partStatus = false">退 出</el-button>
			</div>
		</el-dialog>
  </div>
</template>

<script>
import {  getWxc, querySameGarageList, getPart, queryAllotList, createAllotOrder, acceptAllot, cancelAllot, queryAllotPartList } from "../../request/api.js"
import moment from "moment"
export default {
  name: "formG",
  data() {
    return {
      statusName: ['待接收', '已接收', '已撤销'],
      search: {
        time: [
          moment(new Date()).format("YYYY-MM-DD"),
          moment(new Date()).format("YYYY-MM-DD")
        ]
      },
      pickerOptions: {
        onPick: ({ maxDate, minDate }) => {
          this.selectDate = minDate.getTime();
          if (maxDate) {
            this.selectDate = "";
          }
        },
        disabledDate: time => {
          if (this.selectDate !== "") {
            const one = 30 * 24 * 3600 * 1000;
            const minTime = this.selectDate - one;
            const maxTime = this.selectDate + one;
            return time.getTime() < minTime || time.getTime() > maxTime;
          }
        },
        shortcuts: [{
            text: '今日',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '本月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * (Number(moment(new Date()).format("D")) - 1));
              picker.$emit('pick', [start, end]);
            }
          }]
      },
      tableData: [],
      maxHeight: undefined,
      pageLength: null,
      size: 10,
      page: 0,
      allotStatus: false,
      partSearch: {
        search: '',
        model: '',
        partNo: '',
        garageId: localStorage.getItem('gid')
      },
      partSize: 10,
      partPage: 0,
      allotList: [],
      partPageLength: null,
      allotFormList: [],
      partStatus: false,
      partList: [],
      garageList: [],
      enterGid: '',
      outGarageName: ''
    };
  },
  created() {
    const data = {
      phone: localStorage.getItem("phone")
    }
    getWxc(data).then((res)=>{
      let factoryList = res.data.data.allGarageList
      if(factoryList.length>0){
        factoryList.forEach((item)=>{
          if(item.id == localStorage.getItem('gid')){
            this.outGarageName = item.name
          }
        })
      }
    })
    
    querySameGarageList({gid: localStorage.getItem('gid')}).then(res => {
      this.garageList = res.data.data.filter(v => v.id !== parseInt(localStorage.getItem('gid')))
    })
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
        endDate: moment(this.search.time[1]).format("YYYY-MM-DD"),
        beginDate: moment(this.search.time[0]).format("YYYY-MM-DD"),
        size: this.size,
        page: this.page,
        gid: localStorage.getItem('gid'),
        inOrOut: 1
      }
      queryAllotList(data).then(res => {
        this.pageLength = res.data.pageInfo.total;
        this.tableData = res.data.data
      })
    },
    allotFormSubmit(){
      if(this.allotFormList.length === 0) return this.$message({message: "请添加数据",type: "error"})
      if(!this.enterGid) return this.$message({message: "请选择门店",type: "error"})

      const garage = this.garageList.find(v => v.id === this.enterGid)
      const data = {
        enterGarageName: garage.name,
        enterGid: this.enterGid,
        outGid: localStorage.getItem('gid'),
        outGarageName: this.outGarageName,
        partList: this.allotFormList.map(v => {
          return {
            partId: v.id,
            ...v
          }
        })
      }

      createAllotOrder(data).then(res => {
        if(res.data.code == 200){
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
          this.getList()
          this.allotStatus = false
          this.allotFormList = []
        }
      })
    },
    addAllot(row, index){
      let check = this.allotFormList.findIndex(v => v.id === row.id)
      if(check != -1) {
        this.allotList[index].status = 2
        return
      }
      this.allotFormList.push(row)
      this.allotList[index].status = 2
    },
    deleteAllot(row, index){
      this.allotFormList.splice(index, 1)
      let indexs = this.allotList.findIndex(v => v.id === row.id)
      this.allotList[indexs].status = 1
    },
    addDig(){
      this.allotStatus = true
      this.getParts()
    },
    partNext(val) {
      this.partPage = val - 1;
      this.getParts()
    },
    getParts() {
      const data = {
        page: this.partPage,
        size: this.partSize,
        ...this.partSearch
      }
      getPart(data).then(res => {
        this.partPageLength = res.data.pageInfo.total
        this.allotList = res.data.data.map(v => {
          return {
            count: 1,
            status: 1,
            ...v
          }
        })
      })
    },
    cancelRow(row){
      this.$confirm(`确认撤销该单?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelAllot({allotId: row.id}).then(res => {
          if(res.data.code == 200){
            this.$message({
              type: 'success',
              message: '撤销成功!'
            })
            this.getList()
          }
        })
      })
    },
    viewParts(row){
      this.partStatus = true
      queryAllotPartList({allotId: row.id, inOrOut: 1}).then(res => {
        this.partList = res.data.data
      })
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
