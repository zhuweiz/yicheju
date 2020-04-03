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

            <el-form-item label="" class="m-b-0 right m-r-20">
              <div class="left c-p c-9">
                <el-button
                  type="success"
                  icon="el-icon-refresh-right"
                  @click="getList()"
                  >刷新</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div style="width:100%;padding-top:15px;" class="orderTable" id="printBox">
      <el-table :data="tableData" :max-height="maxHeight" style="width: 100%">
        <el-table-column prop="allotNo" label="单号">
        </el-table-column>
        <el-table-column prop="total" label="配件数">
          <template slot-scope="scope">
            {{scope.row.partVOList.length}}
          </template>
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
          <!-- <template slot-scope="scope">
            {{userInfo.realName}}
          </template> -->
        </el-table-column>
        <el-table-column prop="remark" label="状态">
          <template slot-scope="scope">
            <font v-if="scope.row.status === 1">{{statusName[scope.row.status]}}</font>
            <font v-else color="red">{{statusName[scope.row.status]}}</font>
          </template>
        </el-table-column>
        <el-table-column prop="employeeName" label="操作" width="200" align="right">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 0" size="mini" type="danger" @click="cancelRow(scope.row)">接收</el-button>
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

    <el-dialog title="配件列表" :visible.sync="partStatus" width="70%" :modal="false" center>
      <div class="orderTable" style="margin-top:10px;">
        <el-table :data="partList" height="250">
          <el-table-column prop="id" label="序号"> </el-table-column>
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
import {  querySameGarageList, getPart, queryAllotList, createAllotOrder, acceptAllot, cancelAllot, queryAllotPartList } from "../../request/api.js"
import moment from "moment"
export default {
  name: "formG",
  data() {
    return {
      userInfo: JSON.parse(localStorage.getItem('userInfo')),
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
      outGid: '',
    };
  },
  created() {
    querySameGarageList({gid: localStorage.getItem('gid')}).then(res => {
      this.garageList = res.data.data
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
        inOrOut: 2
      }
      queryAllotList(data).then(res => {
        this.pageLength = res.data.pageInfo.total
        this.tableData = res.data.data
      })
    },
    allotFormSubmit(){
      if(this.allotFormList.length === 0) return this.$message({message: "请添加数据",type: "error"})
      if(!this.outGid) return this.$message({message: "请选择门店",type: "error"})

      const garage = this.garageList.find(v => v.id === this.outGid)
      const data = {
        outGarageName: garage.name,
        outGid: this.outGid,
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
      this.$confirm(`确认接收该单?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        acceptAllot({allotId: row.id}).then(res => {
          if(res.data.code == 200){
            this.$message({
              type: 'success',
              message: '接收成功!'
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
