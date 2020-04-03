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
              @click="init()"
              >查找</el-button>
            <el-button type="success"	@click="supplierDig" icon="el-icon-plus">订货</el-button>
            <el-button type="success" @click="partOrder">自动统计</el-button>
            <el-form-item label="" class="m-b-0 right m-r-20">
              <div class="left c-p c-9">
                <el-button
                  type="success"
                  icon="el-icon-refresh-right"
                  @click="init()"
                  >刷新</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <div style="width:100%;padding-top:15px;" class="orderTable" id="printBox">
      <el-table :data="tableData" :height="maxHeight" style="width: 100%">
        <el-table-column type="index" label="序号" width="90">
        </el-table-column>
        <el-table-column prop="orderNo" label="单号" width="160">
        </el-table-column>
        <el-table-column prop="logisticName" label="承运商">
        </el-table-column>
        <el-table-column prop="logisticNo" label="运单号">
        </el-table-column>
        <el-table-column prop="garageRemark" label="我方备注">
        </el-table-column>
        <el-table-column prop="supplierRemark" label="供应商备注">
        </el-table-column>
        <el-table-column prop="price" label="发起方">
          <template slot-scope="scope">
            <div v-if="scope.row.promoterType != null">{{scope.row.promoterType === 1 ? scope.row.garageName : scope.row.supplierName}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="createdDate" label="发起时间" width="110">
        </el-table-column>
        <el-table-column prop="updateDate" label="最近修改时间" width="110">
        </el-table-column>
        <el-table-column prop="statusName" label="修改方">
          <template slot-scope="scope">
            <div v-if="scope.row.updaterType != null">{{scope.row.updaterType === 1 ? scope.row.garageName : scope.row.supplierName}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="garageName" label="接收门店">
          <template slot-scope="scope">
            <div v-if="scope.row.status == 2">{{scope.row.garageName}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="acceptDate" label="接收时间" width="110">
        </el-table-column>
        <el-table-column prop="remark" label="状态">
          <template slot-scope="scope">
            <font v-if="scope.row.status == 2">{{status_name[scope.row.status - 1]}}</font>
            <font v-else color="red">{{status_name[scope.row.status - 1]}}</font>
          </template>
        </el-table-column>
        <el-table-column prop="employeeName" label="操作" width="250" align="center">
          <template slot-scope="scope">
            <el-button size="mini" v-if="scope.row.status != 3" @click="editRow(scope.row)">编辑</el-button>
            <el-button v-if="scope.row.status == 1" size="mini" type="success" @click="confirmRow(scope.row)">确认收货</el-button>
            <el-button size="mini" v-if="scope.row.status != 3" type="danger" @click="cancelRow(scope.row)">取消</el-button>
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

    <el-dialog title="选择配件商" :visible.sync="businessStatus" width="70%" :modal="false" center>
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
            <el-input v-model="businessSearch.supplierName"></el-input>
            </el-form-item>
            <el-button
              type="success"
              icon="el-icon-search"
              @click="getSupplier"
            >查找</el-button>
            <el-form-item
              label=""
              class="m-b-0 right m-r-20"
            >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="orderTable" style="margin-top:10px;">
        <el-table :data="businessList" highlight-current-row @current-change="selectedBusiness">
          <el-table-column type="index" label="编号"></el-table-column>
          <el-table-column prop="supplierName" label="配件商名称">
            <template slot-scope="scope">
              <el-tag type="danger" effect="dark" v-if="gid == scope.row.gid">我的</el-tag>
              {{scope.row.supplierName}}
            </template>
          </el-table-column>
          <el-table-column prop="type" label="类型"></el-table-column>
          <el-table-column prop="address" label="地址"></el-table-column>
          <el-table-column prop="phone" label="手机号码"></el-table-column>
          <el-table-column prop="scope" label="经营范围"></el-table-column>
        </el-table>
        <div class="p-tb-10 text-center">
          <el-pagination
            :hide-on-single-page="businessQuery.pageLength === 0"
            background
            layout="prev, pager, next"
            :page-size="businessQuery.size"
            @current-change="businessCurrentChange"
            :total="businessQuery.pageLength"
          >
          </el-pagination>
        </div>
      </div>
			<div slot="footer" class="dialog-footer">
        <el-button @click="businessStatus = false">取 消</el-button>
        <el-button type="success" @click="businessSubmit">提 交</el-button>
			</div>
		</el-dialog>

    <el-dialog title="订货单" :visible.sync="orderStatus" width="70%" :modal="false" center>
      <el-form
					:inline="true"
					class="demo-form-inline"
				>
        <el-row>
          <el-col>
            <el-form-item
              label="供应商"
              class="m-b-0"
            >
             {{selectBusiness.supplierName}}
            </el-form-item>
            <el-form-item
              label="单号"
              class="m-b-0"
            >
             {{addForm.orderNo}}
            </el-form-item>
            <el-form-item
              label=""
              class="m-b-0 right m-r-20"
            >
            <el-button type="success" icon="el-icon-plus" @click="partsDig">添加</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="orderTable" style="margin-top:10px;">
        <el-table :data="orderList">
          <el-table-column prop="partName" label="名称"></el-table-column>
          <el-table-column prop="model" label="规格型号"> </el-table-column>
          <el-table-column prop="unit" label="单位"> </el-table-column>
          <el-table-column prop="amount" label="售价"> </el-table-column>
          <el-table-column prop="total" label="库存"></el-table-column>
          <el-table-column prop="partNo" label="编码"> </el-table-column>
          <el-table-column property="address" label="数量" width="140" align="center">
            <template slot-scope="scope">
              <el-input-number size="mini" :min="1" v-model="scope.row.partCount"></el-input-number>
            </template>
          </el-table-column>
          </el-table-column>
          <el-table-column prop="remark" label="操作" width="90" align="center">
            <template slot-scope="scope">
              <el-button type="text" style="color:red;" @click="deleteOrder(scope.row, scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
			<div slot="footer" class="dialog-footer">
        <el-button @click="orderStatus = false">取 消</el-button>
        <el-button type="success" @click="orderSubmit">提 交</el-button>
			</div>
		</el-dialog>

    <el-dialog :title="selectBusiness.supplierName" :visible.sync="busPartStatus" width="70%" :modal="false" center>
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
            <el-input v-model="partsSearch.partName"></el-input>
            </el-form-item>
            <el-form-item
              label="编码"
              class="m-b-0"
            >
            <el-input v-model="partsSearch.partNo"></el-input>
            </el-form-item>
            <el-button
              type="success"
              icon="el-icon-search"
              @click="getParts(1)"
            >查找</el-button>
            <el-form-item
              label=""
              class="m-b-0 right m-r-20"
            >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="orderTable" style="margin-top:10px;">
        <el-table :data="busPartList">
          <el-table-column prop="partName" label="名称"></el-table-column>
          <el-table-column prop="model" label="规格型号"> </el-table-column>
          <el-table-column prop="unit" label="单位"> </el-table-column>
          <el-table-column prop="sellPrice" label="售价"> </el-table-column>
          <el-table-column prop="total" label="库存"></el-table-column>
          <el-table-column prop="partNo" label="编码"> </el-table-column>
          <el-table-column prop="remark" label="操作" width="90" align="center">
            <template slot-scope="scope">
              <el-button v-show="scope.row.status == 1" type="text" style="color:#0d906e;" @click="addParts(scope.row, scope.$index)">添加</el-button>
              <el-button v-show="scope.row.status == 2" type="text" style="color:red;">已添加</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="p-tb-10 text-center">
          <el-pagination
            :hide-on-single-page="partsQuery.pageLength === 0"
            background
            layout="prev, pager, next"
            :page-size="partsQuery.size"
            @current-change="partsCurrentChange"
            :total="partsQuery.pageLength"
          >
          </el-pagination>
        </div>
      </div>
			<div slot="footer" class="dialog-footer">
        <el-button @click="busPartStatus = false">退 出</el-button>
			</div>
		</el-dialog>

    <el-dialog title="统计列表" :visible.sync="statisticStatus" width="70%" :modal="false" center>
      <div v-for="(item, index) in statisticList" :key="index" style="margin-top: 10px;">
        <el-form
            :inline="true"
            class="demo-form-inline"
          >
          <el-row>
            <el-col>
              <el-form-item
                label="供应商"
                class="m-b-0"
              >
              {{item.supplierName}}
              </el-form-item>
              <el-button
                size="small"
                type="success"
                @clcik="generateOrder(item)"
              >生成订单</el-button>
              <el-form-item
                label=""
                class="m-b-0 right m-r-20"
              >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div class="orderTable" style="margin-top:10px;">
          <el-table :data="item.partList" height="250">
            <el-table-column type="index" label="序号"></el-table-column>
            <el-table-column property="partName" label="名称"></el-table-column>
            <el-table-column property="model" label="规格型号"></el-table-column>
            <el-table-column property="unit" label="单位"></el-table-column>
            <el-table-column property="exceeds" label="进价"></el-table-column>
            <el-table-column property="sellPrice" label="售价"></el-table-column>
            <el-table-column property="total" label="库存"></el-table-column>
            <el-table-column property="upperLimit" label="上限"></el-table-column>
            <el-table-column property="supplierName" label="供应商"></el-table-column>
            <el-table-column property="sourceNo" label="编码源"></el-table-column>
            <el-table-column property="partNo" label="编码"></el-table-column>
            <el-table-column property="quantity" label="数量"></el-table-column>
          </el-table>
        </div>
      </div>
			<div slot="footer" class="dialog-footer">
        <el-button @click="statisticStatus = false">取 消</el-button>
        <el-button type="success" @click="statisticSubmit">提 交</el-button>
			</div>
		</el-dialog>

    <el-dialog title="编辑订货单" :visible.sync="editFormStatus" width="70%" center :modal="false">
      <el-form
					:inline="true"
					class="demo-form-inline"
				>
        <el-row>
          <el-col>
            <el-form-item
              label="发往门店"
              class="m-b-0"
            >
              <el-select v-model="editForm.gid" placeholder="请选择" :disabled="true">
                <el-option
                  v-for="item in store"
                  :key="item.value"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label="物流公司"
              class="m-b-0"
            >
            <el-input style="width:160px;" v-model="editForm.logisticName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item
              label="运单号"
              class="m-b-0"
            >
            <el-input style="width:160px;" v-model="editForm.logisticNo" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item
              label="备注"
              class="m-b-0"
            >
            <el-input style="width:160px;" v-model="editForm.garageRemark"></el-input>
            </el-form-item>
            <el-button
              type="success"
              icon="el-icon-plus"
              @click="storeDig"
            >配件</el-button>
            <el-form-item
              label=""
              class="m-b-0 right m-r-20"
            >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
			<el-table :data="editForm.partList">
        <el-table-column type="index" label="编号"></el-table-column>
        <el-table-column property="partNo" label="编码"></el-table-column>
        <el-table-column property="partName" label="名称"></el-table-column>
        <el-table-column property="model" label="规格型号"></el-table-column>
        <el-table-column property="fitCar" label="适用车型"></el-table-column>
        <el-table-column property="total" label="库存量"></el-table-column>
        <el-table-column property="distributionCount" label="铺货量"></el-table-column>
        <el-table-column property="price" label="单价"></el-table-column>
        <el-table-column property="amount" label="金额"></el-table-column>
        <el-table-column property="partCount" label="发货量"></el-table-column>
        <el-table-column prop="remark" label="操作" width="90" align="center">
          <template slot-scope="scope">
            <el-button
            size="mini"
            @click="editPartDig(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
			<div slot="footer" class="dialog-footer">
				<el-button @click="editFormStatus = false">取 消</el-button>
				<el-button type="success" @click="editFormSubmit">提 交</el-button>
			</div>
		</el-dialog>

     <el-dialog title="编辑" :visible.sync="partStatus" center width="30%" :modal="false">
      <el-form :model="editPartsForm">
        <el-form-item label="配件编码" label-width="100px">
          {{editPartsForm.partNo}}
        </el-form-item>
        <el-form-item label="配件名称" label-width="100px">
          {{editPartsForm.partName}}
        </el-form-item>
        <el-form-item label="规格型号" label-width="100px">
          {{editPartsForm.model}}
        </el-form-item>
        <el-form-item label="适用车型" label-width="100px">
          {{editPartsForm.fitCar}}
        </el-form-item>
        <el-form-item label="单价" label-width="100px">
          {{editPartsForm.price}}
        </el-form-item>
        <el-form-item label="铺货量" label-width="100px">
          {{editPartsForm.distributionCount}}
        </el-form-item>
        <el-form-item label="发货量" label-width="100px">
          <el-input v-model="editPartsForm.partCount"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="partStatus = false">取 消</el-button>
        <el-button type="success" @click="editPartsFormSubmit">提 交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="库存" :visible.sync="storeStatus" width="60%" center :modal="false">
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
            <el-input style="width:160px;" v-model="storeSearch.partName"></el-input>
            </el-form-item>
            <el-form-item
              label="编码"
              class="m-b-0"
            >
            <el-input style="width:160px;" v-model="storeSearch.partNo"></el-input>
            </el-form-item>
            <el-button
              type="success"
              icon="el-icon-search"
              @click="getStores"
            >查找</el-button>
            <el-form-item
              label=""
              class="m-b-0 right m-r-20"
            >
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-table :data="storeList">
        <el-table-column prop="partName" label="名称"></el-table-column>
        <el-table-column prop="model" label="规格型号"> </el-table-column>
        <el-table-column prop="unit" label="单位"> </el-table-column>
        <el-table-column prop="sellPrice" label="售价"> </el-table-column>
        <el-table-column prop="total" label="库存"></el-table-column>
        <el-table-column prop="partNo" label="编码"> </el-table-column>
        <el-table-column prop="remark" label="操作" width="90" align="center">
          <template slot-scope="scope">
            <el-button v-show="scope.row.status == 1" type="text" style="color:#0d906e;" @click="addStore(scope.row, scope.$index)">添加</el-button>
            <el-button v-show="scope.row.status == 2" type="text" style="color:red;">已添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="p-tb-10 text-center">
        <el-pagination
          :hide-on-single-page="storeQuery.pageLength === 0"
          background
          layout="prev, pager, next"
          :page-size="storeQuery.size"
          @current-change="storeCurrentChange"
          :total="storeQuery.pageLength"
        >
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="storeStatus = false">退 出</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { queryGaragePurOrder, getGarageListBySupplier, garageAddPart, createPurOrder, updatePurOrder, getPurOrder, queryAllSupplierByGid, getPart, cancelPurOrder, querySameGarageList, querySupplierPart, addSupplierPart, sumForPartOrder, acceptPurOrderPart } from "../../request/api.js"
import moment from "moment";
export default {
  name: "formG",
  data() {
    return {
      status_name: ['待接收', '已接收', '已取消'],
      gid: localStorage.getItem('gid'),
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
      store: [],
      storeSearch: {
        partName: '',
        partNo: '',
      },
      maxHeight: undefined,
      pageLength: null,
      size: 10,
      page: 0,
      orderStatus: false,
      orderList: [],
      businessSearch: {
        supplierName: '',
        gid: localStorage.getItem('gid')
      },
      businessQuery: {
        page: 0,
        size: 10,
        pageLength: null
      },
      businessStatus: false,
      businessList: [],
      selectBusiness: {
        supplierName: ''
      },
      partsSearch: {
        partName: '',
        partNo: '',
        supplierId: ''
      },
      partsQuery: {
        page: 0,
        size: 10,
        pageLength: null
      },
      busPartStatus: false,
      busPartList: [],
      statisticStatus: false,
      statisticList: [],
      editFormStatus: false,
      orderPartList: [],
      editForm: {},
      storeStatus: false,
      storeList: [],
      storeQuery: {
        page: 0,
        size: 10,
        pageLength: null
      },
      partStatus: false,
      editPartsForm: {},
      addForm: {}
    };
  },
  created() {
    querySameGarageList({gid: localStorage.getItem('gid')}).then(res => {
      this.store = res.data.data
    })
    this.init()
  },
  mounted() {
    this.maxHeight = $(".tabBox").height() - 235 + "px";
  },
  methods: {
    handleCurrentChange(val) {
      this.page = val - 1
      this.init()
    },
    init() {
      if (this.search.time) {
        this.search.time.forEach((i, index) => {
          this.search.time[index] = moment(i).format("YYYY-MM-DD")
        });
      } else {
        this.$message({
          message: "请选择查询日期！",
          type: "warning"
        });
        return false
      }
      const data = {
        page: this.page,
        size: this.size,
        endDate: this.search.time[1],
        beginDate: this.search.time[0],
        gid: localStorage.getItem('gid'),
        type: 1
      }
      queryGaragePurOrder(data).then(res => {
        this.pageLength = res.data.pageInfo.total
        this.tableData = res.data.data
      })
    },
    editRow(row){
      getPurOrder({purOrderId: row.id}).then(res => {
        this.editForm = res.data.data
      })
      this.editFormStatus = true
      this.storeSearch.supplierId = row.supplierId
    },
    confirmRow(row){
      this.$confirm(`确认收货?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        acceptPurOrderPart({purOrderId: row.id}).then(res => {
          if(res.data.code == 200){
            this.$message({
              type: 'success',
              message: '确认收货成功!'
            })
            this.init()
          }
        })
      })
    },
    cancelRow(row){
      this.$confirm(`确认取消?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        cancelPurOrder({purOrderId: row.id}).then(res => {
          if(res.data.code == 200){
            this.$message({
              type: 'success',
              message: '取消成功!'
            })
            this.init()
          }
        })
      })
    },
    businessSubmit(){
      if(!this.selectBusiness.id) return this.$message({type: 'error',message: '请先选择配件商!'})

      const data = {
        gid: this.gid,
        promoterType: 1, 
        supplierId: this.selectBusiness.id,
        supplierName: this.selectBusiness.supplierName
      }
      createPurOrder(data).then(res => {
        this.addForm = res.data.data
        this.orderList = res.data.data.partList
      })
      this.partsSearch.supplierId = this.selectBusiness.id
      this.businessStatus = false
      this.orderStatus = true
    },
    orderSubmit() {
      if(this.orderList.length === 0) return this.$message({type: 'error',message: '请先添加配件!'})

      this.addForm.partList = this.orderList.map(v => {
        v.amount = parseFloat(v.price).toFixed(2) * parseFloat(v.partCount).toFixed(2)
        return v
      })
      this.addForm.updaterType = 0
      updatePurOrder(this.addForm).then(res => {
        if(res.data.code == 200){
          this.$message({
            type: 'success',
            message: '提交成功!'
          })
          this.orderStatus = false
          this.init()
        }
      })
    },
    addParts(row, index){
      // let check = this.orderList.findIndex(v => v.partName === row.partName)
      // if(check != -1) {
      //   this.busPartList[index].status = 2
      //   return
      // }
      const data = {
        price: row.sellPrice,
        distributionCount: '',
        fitCar: row.fitCar,
        gid: this.gid,
        model: row.model,
        partCount: 1,
        partName: row.partName,
        partNo: row.partNo,
        amount: row.sellPrice,
        total: row.total,
      }
      this.orderList.push(data)
      this.busPartList[index].status = 2
    },
    deleteOrder(row, index){
      this.orderList.splice(index, 1)
      let indexs = this.busPartList.findIndex(v => v.partName === row.partName)
      this.busPartList[indexs].status = 1
    },
    statisticSubmit() {
      
    },
    editFormSubmit() {
      updatePurOrder(this.editForm).then(res => {
        if(res.data.code == 200){
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.init()
          this.editFormStatus = false
        }
      })
    },
    supplierDig() {
      this.businessStatus = true
      this.getSupplier()
    },
    getSupplier(){
      const data = {
        ...this.businessSearch,
        page: this.businessQuery.page,
        size: this.businessQuery.size,
      }
      queryAllSupplierByGid(this.businessSearch).then(res => {
        this.businessList = res.data.data
        this.businessQuery.pageLength = res.data.pageInfo.total
      })
    },
    businessCurrentChange(val) {
      this.businessQuery.page = val - 1
      this.getSupplier()
    },
    selectedBusiness(val){
      this.selectBusiness = val
    },
    partsDig() {
      this.busPartStatus = true
      this.getParts()
    },
    getParts(type) {
      const data = {
        page: this.partsQuery.page,
        size: this.partsQuery.size,
        ...this.partsSearch
      }
      if(this.orderList.length === 0 || type === 1){
        querySupplierPart(data).then(res => {
          this.partsQuery.pageLength = res.data.pageInfo.total
          this.busPartList = res.data.data.map(v => {
            return {
              status: 1,
              ...v
            }
          })
        })
      }
    },
    partsCurrentChange(val) {
      this.partsQuery.page = val - 1
      this.getParts()
    },
    generateOrder(row) {
      console.log(row);
    },
    storeDig(){
      this.storeStatus = true
      this.getStores()
    },
    getStores(){
      const data = {
        page: this.storeQuery.page,
        size: this.storeQuery.size,
        ...this.storeSearch
      }
      if(this.orderPartList.length === 0 || type === 1){
        querySupplierPart(data).then(res => {
          this.storeQuery.pageLength = res.data.pageInfo.total
          this.storeList = res.data.data.map(v => {
            return {
              status: 1,
              ...v
            }
          })
        })
      }
    },
    storeCurrentChange(val) {
      this.storeQuery.page = val - 1
      this.getStores()
    },
    addStore(row, index){
      const data = {
        purOrderId: this.editForm.id,
        gid: this.gid,
        supplierId: this.editForm.supplierId,
        price: row.sellPrice,
        amount: row.sellPrice,
        partCount: 1,
        ...row
      }
      this.editForm.partList.push(data)
      this.storeList[index].status = 2
      // garageAddPart(data).then(res => {
      //   if(res.data.code == 200){
      //     this.$message({
      //       type: 'success',
      //       message: '添加成功!'
      //     })
      //     this.getStores()
      //   }
      // })
    },
    editPartDig(row){
      this.partStatus = true
      this.editPartsForm = row
    },
    editPartsFormSubmit() {
      this.partStatus = false
    },
    partOrder(){
      this.statisticStatus = true
      sumForPartOrder().then(res => {
        this.statisticList = res.data.data
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
