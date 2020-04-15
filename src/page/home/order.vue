<template>
  <div class="w-100 orderTable" style="padding-left: 30px;">
    <div class="p-tb-30">
      <h2
        class="left f-18"
        style="width: 150px;color: #0D906E;padding-top: 3px;font-weight: normal;"
      >| 服务记录列表</h2>
      <ul class="left orderUl" style="width: 550px;padding-top: 5px;">
        <li
          :class="index==orderNavActive?'active':''"
          v-for="(item,index) in orderList"
          :key="index"
          @click="orderTab(index)"
        >{{item}}</li>
      </ul>
      <div class="right m-r-20">
        <div
          class="left c-p c-9"
          @click="getExcel"
          style="width: 139px; height: 42px;line-height: 42px;background: url(../../../static/img/but1.png) no-repeat;background-size: 100% 100%;text-indent: 45px;"
        >导出EXCEL</div>
        <!-- <div class="left c-p c-9" @click="printDeal" style="width: 106px; height: 42px;line-height: 42px;background: url(../../../static/img/but2.png) no-repeat;background-size: 100% 100%;text-indent: 50px;">打印</div> -->
      </div>
      <div class="clear"></div>
    </div>
    <div class="p-20" style="background:rgba(229,246,247,1);">
      <el-row :gutter="10">
        <el-form :inline="true" class="demo-form-inline">
          <el-col>
            <el-form-item label="车牌" class="m-b-0">
              <el-input v-model="search.text1" placeholder="车牌/品牌" style="width: 160px;"></el-input>
            </el-form-item>
            <el-form-item label="姓名" class="m-b-0">
              <el-input v-model="search.text2" placeholder="姓名/单位" style="width: 160px;"></el-input>
            </el-form-item>
            <el-form-item label="手机" class="m-b-0">
              <el-input v-model="search.text3" placeholder="手机号/客户来源" style="width: 160px;"></el-input>
            </el-form-item>
            <el-form-item label="进店日期" class="m-b-0" v-if="orderNavActive == 5">
              <el-date-picker
                v-model="search.time"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                unlink-panels
              ></el-date-picker>
            </el-form-item>
            <el-form-item label="结算日期" class="m-b-0" v-if="orderNavActive == 5">
              <el-date-picker
                v-model="search.times"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                unlink-panels
              ></el-date-picker>
            </el-form-item>
            <el-button type="success" icon="el-icon-search" @click="searchList()">查找</el-button>
          </el-col>
        </el-form>
      </el-row>
    </div>
    <el-table
      :data="tableData"
      :max-height="maxHeight"
      style="width: 100%"
      ref="lists"
      id="printBox"
    >
      <el-table-column prop="date" label="编号" width="160">
        <template slot-scope="scope">{{scope.row.billNumber}}</template>
      </el-table-column>
      <el-table-column prop="name" label="车牌" width="140">
        <template slot-scope="scope">{{scope.row.carNo}}</template>
      </el-table-column>
      <el-table-column label="车型">
        <template slot-scope="scope">{{scope.row.carBrand}}</template>
      </el-table-column>
      <el-table-column label="车主">
        <template slot-scope="scope">{{scope.row.ownerName}}</template>
      </el-table-column>
      <el-table-column width="120px" label="电话">
        <template slot-scope="scope">{{scope.row.phone}}</template>
      </el-table-column>
      <el-table-column label="接车时间" width="110px">
        <template slot-scope="scope">{{scope.row.createdDate}}</template>
      </el-table-column>
      <el-table-column label="服务项目">
        <template slot-scope="scope">
          <span
            v-if="scope.row.orderItemList && scope.row.orderItemList.length >= 2 && scope.row.shows == 0"
            @click="showMore(scope.$index)"
          >{{scope.row.orderItemList[0].itemName}}...</span>
          <span
            v-if="scope.row.orderItemList && scope.row.orderItemList.length < 2 && scope.row.shows == 0"
            @click="showMore(scope.$index)"
          >{{scope.row.orderItemList[0].itemName}}</span>
          <!-- {{scope.row.orderItemList}} -->
          <div v-if="scope.row.shows == 1">
            <p v-for="(item,indexs) in scope.row.orderItemList" :key="indexs">{{item.itemName}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="接车员">
        <template slot-scope="scope">{{scope.row.clerkOrder}}</template>
      </el-table-column>
      <el-table-column label="询价数量" v-if="!show">
        <template slot-scope="scope">{{scope.row.askSupplierCount}}</template>
      </el-table-column>
      <el-table-column label="应收金额" v-if="show">
        <template slot-scope="scope">{{scope.row.amountReceivable}}</template>
      </el-table-column>
      <el-table-column label="实收金额" v-if="show">
        <template slot-scope="scope">
          <font
            color="red"
            v-if="scope.row.amountActual && scope.row.amountActual < scope.row.amountReceivable"
          >{{scope.row.amountActual}}</font>
          <font v-else>{{scope.row.amountActual}}</font>
        </template>
      </el-table-column>
      <el-table-column label="目前状态" v-if="show">
        <template slot-scope="scope">
          <em v-if="scope.row.status === 1">报价</em>
          <em v-if="scope.row.status === 2">施工</em>
          <em v-if="scope.row.status === 3">施工完成</em>
          <em v-if="scope.row.status === 4">质检</em>
          <em v-if="scope.row.status === 5">质检完成</em>
          <em v-if="scope.row.status === 6">出厂</em>
        </template>
      </el-table-column>
      <el-table-column label="业务员" v-if="show">
        <template slot-scope="scope">{{scope.row.sellsMan}}</template>
      </el-table-column>
      <el-table-column label="进度" v-if="!show" width="330" align="center">
        <template slot-scope="scope">
          <div class="jindu">
            <div class="yuan_a">
              <div
                class="yuan"
                :style="{'background' : scope.row.priceStatus >= 1 ? '#3AC29F' : '#f56c6c'}"
              >{{scope.row.askSupplierCount}}</div>
              <span class="span">采购询价</span>
            </div>
            <div class="yuan_a">
              <div
                class="yuan"
                :style="{'background' : scope.row.priceStatus >= 2 ? '#3AC29F' : '#f56c6c'}"
              >{{scope.row.askedSupplierCount}}</div>
              <span class="span">商家报价</span>
            </div>
            <div class="yuan_a">
              <div
                class="yuan"
                :style="{'background' : scope.row.priceStatus >= 3 ? '#3AC29F' : '#f56c6c'}"
              >{{scope.row.orderSupplierCount}}</div>
              <span class="span">下订单</span>
            </div>
            <div class="yuan_a">
              <div
                class="yuan"
                :style="{'background' : scope.row.priceStatus >= 4 ? '#3AC29F' : '#f56c6c'}"
              ></div>
              <span class="span">商家发货</span>
            </div>
            <div class="yuan_a">
              <div
                class="yuan"
                :style="{'background' : scope.row.priceStatus >= 5  ? '#3AC29F' : '#f56c6c'}"
              ></div>
              <span class="span">确认收货</span>
            </div>
            <div class="yuan_a">
              <div
                class="yuan"
                :style="{'background' : scope.row.priceStatus >= 6 ? '#3AC29F' : '#f56c6c'}"
              >{{scope.row.isSign}}</div>
              <span class="span">客户签名</span>
            </div>
            <div class="xian"></div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <el-button v-if="!show" size="mini" plain @click="editRow(scope.row)">商家报价</el-button>
          <el-button v-if="!show" size="mini" plain @click="enquiry()">询价</el-button>
          <el-button v-if="show" size="mini" plain @click="toOrderX(scope.row)">查看</el-button>
          <el-button
            v-if="scope.row.settlementStatus == 1"
            type="success"
            size="mini"
            @click="rollbackSettlement(scope.row)"
          >反结算</el-button>
          <el-button
            v-if="scope.row.settlementStatus != 1 && show"
            type="danger"
            size="mini"
            @click="pay(scope.row)"
          >结算</el-button>
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
    </div>
    <!-- 询价弹出框 -->
    <el-dialog
      title="询价配置"
      :visible.sync="configuration"
      width="70%"
      :modal="false"
      center
      :before-close="handleClose"
    >
    <div class="configlist">
      <div class="left PJparts">
        <div class="lines">
            <div class="left">配件</div>
            <div class="right">选择</div>
        </div>
        <el-table
          ref="partTable"
          :data="partList"
          tooltip-effect="dark"
          :show-header="false"
          style="width: 100%"
          max-height="250"
          @selection-change="selectPart"
        >
          <el-table-column label>
            <template slot-scope="scope">{{ scope.row.partName }}</template>
          </el-table-column>
          <el-table-column type="selection" width="50"></el-table-column>
        </el-table>
      </div>
      <div class="right PJparts2">
            <div class="lines">
            <div class="left">配件</div>
            <div class="right">选择</div>
        </div>
        <el-table
          ref="partTable"
          :data="partList"
          tooltip-effect="dark"
          :show-header="false"
          style="width: 100%"
          max-height="250"
          @selection-change="selectPart"
        >
          <el-table-column label>
            <template slot-scope="scope">{{ scope.row.partName }}</template>
          </el-table-column>
          <el-table-column type="selection" width="50"></el-table-column>
        </el-table>
      </div>
    </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="configuration = false">取 消</el-button>
        <el-button type="primary" @click="configuration = false">确 定</el-button>
      </div>
    </el-dialog>

    <!--  -->
    <!-- 查看商家弹窗 -->
    <el-dialog title="商家报价" :visible.sync="editFormStatus" width="70%" center :modal="false">
      <el-form :inline="true" class="demo-form-inline">
        <el-row>
          <el-col>
            <ul class="left orderUl" style="width:45%;">
              <li
                :class="indexfl==switchActive?'active':''"
                v-for="(item,indexfl) in dispose"
                :key="'inf'+indexfl"
                @click="switchOF(indexfl)"
              >{{item}}</li>
            </ul>
            <div class="left orlist" v-if="PriceList != ''">
              <div>车牌：{{PriceList[0].carNo}}</div>
              <div>工单号：{{PriceList[0].billNumber}}</div>
              <div>询价日期：{{PriceList[0].askPriceTime}}</div>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div class="xuhao">
        <div class="xu1">序号</div>
        <div class="xu2" :style="{'width':switchActive == 1 ? '140px':''}">供应商</div>
        <div class="xu8" v-if="switchActive == 1">数量</div>
        <div class="xu3" :style="{'width':switchActive == 1 ? '90px':''}">配件类型</div>
        <div class="xu4" :style="{'width':switchActive == 1 ? '85px':''}">单价</div>
        <div class="xu5" :style="{'width':switchActive == 1 ? '140px':''}">到货时间</div>
        <div class="xu6" :style="{'width':switchActive == 1 ? '145px':''}">保质期</div>
        <div class="xu7" :style="{'width':switchActive == 1 ? '195px':''}">备注</div>
      </div>
      <div v-for="(item,indexff) in PriceList" :key="'item'+indexff" v-show="showlist">
        <div class="xuhao2" v-if="switchActive == 0">
          <div class="pj">配件名称：{{item.partName}}</div>
          <div class="sl">数量：{{item.askPricePartDOS[0][0].partCount}}</div>
        </div>
        <table
          border="0"
          cellspacing="0"
          cellpadding="0"
          class="tbbd"
          v-for="(items,idx) in item.askPricePartDOS"
          :key="'items'+idx"
        >
          <tr>
            <td class="td1">{{idx+1}}</td>
            <td class="td2" style="  text-align: left;">
              <div v-if="switchActive == 0">
                <img src="../../assets/supplier.png" alt />
                <span>{{items[0].supplierName}}</span>
              </div>
              <div v-if="switchActive == 0">
                <img src="../../assets/phone.png" alt />
                <span>{{items[1].supplierPhone}}</span>
              </div>
              <div v-if="switchActive == 0">
                <img src="../../assets/dizi.png" alt />
                <span>{{items[2].address}}</span>
              </div>
              <div v-if="switchActive == 1" style=" margin-left: 25px;">
                <span>{{items[2].partName}}</span>
              </div>
            </td>
            <td class="td8" v-if="switchActive == 1">
              <div>{{items[0].partCount}}</div>
            </td>
            <td class="td3">
              <div style="border-bottom: 1px solid #dcdfe6;">{{items[0].partType==0 ?'原厂件':''}}</div>
              <div style="border-bottom: 1px solid #dcdfe6;">{{items[1].partType==1 ?'品牌件':''}}</div>
              <div>{{items[2].partType==2 ?'其它件':''}}</div>
            </td>
            <td class="td4">
              <div style="border-bottom: 1px solid #dcdfe6;">￥{{items[0].price}}</div>
              <div style="border-bottom: 1px solid #dcdfe6;">￥{{items[1].price}}</div>
              <div>￥{{items[2].price}}</div>
            </td>
            <td class="td5">
              <div style="border-bottom: 1px solid #dcdfe6;">{{items[0].arrivalTime}}</div>
              <div style="border-bottom: 1px solid #dcdfe6;">{{items[1].arrivalTime}}</div>
              <div>{{items[2].arrivalTime}}</div>
            </td>
            <td class="td6">
              <div style="border-bottom: 1px solid #dcdfe6;">{{items[0].qualityTime}}</div>
              <div style="border-bottom: 1px solid #dcdfe6;">{{items[1].qualityTime}}</div>
              <div>{{items[2].qualityTime}}</div>
            </td>
            <td class="td7">
              <div style="border-bottom: 1px solid #dcdfe6;">{{items[0].remark}}</div>
              <div style="border-bottom: 1px solid #dcdfe6;">{{items[1].remark}}</div>
              <div>{{items[2].remark}}</div>
            </td>
            <td class="td9 radio_ccid">
              <el-radio
                v-for="(itemd,idxd) in items"
                :key="'itemd'+idxd"
                v-if="idxd<3"
                v-model="items.number"
                :label="itemd.id"
                @change="getValue(itemd)"
                style="border-bottom: 1px solid #dcdfe6;"
              >&nbsp;</el-radio>
            </td>
          </tr>
        </table>
      </div>
      <!-- 222 -->
      <div v-for="(itemst,indexlst) in ceshi" :key="'itemst'+indexlst" v-show="!showlist">
        <div class="xuhao2">
          <div class="pei1 pei" style="width: 240px;">
            <img src="../../assets/supplier.png" alt />
            <span>{{itemst.supplierName}}</span>
          </div>
          <div class="pei2 pei">
            <img src="../../assets/phone.png" alt />
            <span>{{itemst.supplierPhone}}</span>
          </div>
          <div class="pei3 pei">
            <img src="../../assets/dizi.png" alt />
            <span>{{itemst.address}}</span>
          </div>
        </div>

        <table
          border="0"
          cellspacing="0"
          cellpadding="0"
          class="tbbd"
          v-for="(itemc,idxxx) in itemst.askPricePartDOS"
          :key="'itemc'+idxxx"
          v-if="idxxx<lensg"
        >
          <tr>
            <td class="td1">{{idxxx+1}}</td>
            <td class="td2" style="  text-align: left;">
              <div v-if="switchActive == 1" style=" margin-left: 25px;">
                <span>{{itemc[0].partName}}</span>
              </div>
            </td>
            <td class="td8" v-if="switchActive == 1">
              <div>{{itemc[0].partCount}}</div>
            </td>
            <td class="td3">
              <div style="border-bottom: 1px solid #dcdfe6;" v-if="itemc[0].partType==0">原厂件</div>
              <div style="border-bottom: 1px solid #dcdfe6;" v-if="itemc[1].partType==1">品牌件</div>
              <div v-if="itemc[2].partType==2">其它件</div>
            </td>
            <td class="td4">
              <div
                style="border-bottom: 1px solid #dcdfe6;"
                v-if="itemc[0].partType==0"
              >￥{{itemc[0].price}}</div>
              <div
                style="border-bottom: 1px solid #dcdfe6;"
                v-if="itemc[1].partType==1"
              >￥{{itemc[1].price}}</div>
              <div v-if="itemc[2]">￥{{itemc[2].price}}</div>
            </td>
            <td class="td5">
              <div style="border-bottom: 1px solid #dcdfe6;">{{itemc[0].arrivalTime}}</div>
              <div style="border-bottom: 1px solid #dcdfe6;">{{itemc[1].arrivalTime}}</div>
              <div>{{itemc[2].arrivalTime}}</div>
            </td>
            <td class="td6">
              <div style="border-bottom: 1px solid #dcdfe6;">{{itemc[0].qualityTime}}</div>
              <div style="border-bottom: 1px solid #dcdfe6;">{{itemc[1].qualityTime}}</div>
              <div>{{itemc[2].qualityTime}}</div>
            </td>
            <td class="td7">
              <div style="border-bottom: 1px solid #dcdfe6;">{{itemc[0].remark}}</div>
              <div style="border-bottom: 1px solid #dcdfe6;">{{itemc[1].remark}}</div>
              <div>{{itemc[2].remark}}</div>
            </td>
            <td class="td9 radio_ccid">
              <el-radio
                v-for="(itemf,idxb) in itemc"
                :key="'itemf'+idxb"
                v-model="itemc.purNumber"
                v-if="idxb<3"
                :label="itemf.id"
                @change="getValue2(itemf)"
                style="border-bottom: 1px solid #dcdfe6;"
              >&nbsp;</el-radio>
            </td>
          </tr>
        </table>
        <!--  -->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="editFormStatus = false">取 消</el-button>
        <el-button type="success" @click="dinghuodan">生成订货单</el-button>
      </div>
    </el-dialog>
    <!--  -->

    <el-dialog :title="payForm.carNo" :visible.sync="payVisible" center width="40%" :modal="false">
      <el-form :model="payForm">
        <el-row :gutter="20" style="border-bottom:1px solid #ccc;padding:10px 0px;">
          <el-col :span="7">客户名称：{{detailForm.ownerName}}</el-col>
          <el-col :span="7">电话：{{detailForm.phone}}</el-col>
          <el-col :span="7">
            <div style="float:left;">会员等级：</div>
            <el-rate v-model="detailForm.star" disabled></el-rate>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="border-bottom:1px solid #ccc;padding:10px 0px;">
          <el-col :span="3">备注：{{detailForm.remark}}</el-col>
          <el-col :span="21"></el-col>
        </el-row>
        <el-row
          :gutter="20"
          style="border-bottom:1px solid #ccc;padding:10px 0px;border-left:5px solid #0d906e;margin-top:10px;"
        >
          <el-col :span="24">
            项目：折扣（{{payForm.discountItemRate}}） ￥{{payForm.actualItemAmount}}
            <del>￥{{payForm.receivableItemAmount}}</del>
          </el-col>
        </el-row>
        <el-row
          :gutter="20"
          style="border-bottom:1px solid #ccc;padding:10px 0px;border-left:5px solid #0d906e;margin-top:10px;"
        >
          <el-col :span="22">
            配件：折扣（{{payForm.discountPartRate}}） ￥{{payForm.actualPartAmount}}
            <del>￥{{payForm.receivablePartAmount}}</del>
          </el-col>
          <el-col :span="2">
            <el-button type="success" size="mini" @click="discountDialog">减免</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20" style="border-bottom:1px solid #ccc;padding:10px 0px;">
          <el-col :span="7">应收：￥{{payForm.amountReceivable}}</el-col>
          <el-col :span="7">
            优惠：
            <font color="red">￥{{payForm.discountPrice}}</font>
          </el-col>
          <el-col :span="7">
            实收：
            <font color="red">￥{{payForm.amountActual}}</font>
          </el-col>
        </el-row>
        <el-row
          :gutter="20"
          style="border-bottom:1px solid #ccc;padding:10px 0px;border-left:5px solid #0d906e;margin-top:20px;"
        >
          <el-col :span="7">支付方式</el-col>
          <el-col :span="7">差额：￥{{payForm.difference}}</el-col>
          <el-col :span="7">
            <el-button type="info" size="mini" plain @click="paymentDialog">请选择 ></el-button>
          </el-col>
        </el-row>
        <el-row
          :gutter="20"
          style="border-bottom:1px solid #ccc;padding:10px 0px;"
          v-for="item in payForm.payTypeList"
          :key="item.type"
        >
          <el-col :span="12">{{item.name}}</el-col>
          <el-col :span="12">
            <el-input v-model="item.amount" @change="changeAmount">
              <template slot="append">元</template>
            </el-input>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="payVisible = false">取 消</el-button>
        <el-button type="danger" @click="paySubmit">结 算</el-button>
      </div>
    </el-dialog>

    <el-dialog title="折扣设置" :visible.sync="discountVisible" center width="30%" :modal="false">
      <el-form :model="payForm">
        <el-form-item label="工时折扣" label-width="100px">
          <el-input
            v-model="payForm.discountItemRate"
            placeholder="如：9折请输入9"
            @change="discountCalc"
          >
            <template slot="append">折</template>
          </el-input>
        </el-form-item>
        <el-form-item label="配件折扣" label-width="100px">
          <el-input
            v-model="payForm.discountPartRate"
            placeholder="如：9折请输入9"
            @change="discountCalc"
          >
            <template slot="append">折</template>
          </el-input>
        </el-form-item>
        <el-form-item label="实收" label-width="100px">
          <el-input v-model="payForm.amountActual" @change="allCalc(1)">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="减免" label-width="100px">
          <el-input v-model="payForm.discountPrice" @change="allCalc(2)">
            <template slot="append">元</template>
          </el-input>
        </el-form-item>
        <el-form-item label="理由" label-width="100px">
          <el-input v-model="payForm.discountReason" @change="discountCalc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="discountVisible = false">取 消</el-button>
        <el-button type="success" @click="discountVisible = false">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="请选择" :visible.sync="paymentVisible" center width="30%" :modal="false">
      <el-table
        ref="multipleTable"
        :data="paymentData"
        tooltip-effect="dark"
        :show-header="false"
        style="width: 100%"
        @selection-change="selectPayment"
      >
        <el-table-column prop="name" label></el-table-column>
        <el-table-column type="selection" width="50"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="paymentVisible = false">取 消</el-button>
        <el-button type="success" @click="paymentVisible = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOrderList,
  getOrderList2,
  excel,
  getOrderListX,
  settlement,
  rollbackSettlement,
  getGrade,
  askPriceList,
  pcaskPriceList,
  pcpurOrder
} from "../../request/api.js";
import moment from "moment";
export default {
  name: "order",
  data() {
    return {
      radio: 3,
      lensg: null,
      show: false,
      configuration: false, //询价弹窗
      radioID: [],
      ceshi: [],
      askPriceId: "",
      askPricePartIds: [],
      tableData: [],
      PriceList: [], //商家报价，商家模式
      showlist: true,
      editFormStatus: false,
      dispose: ["配件模式", "商家模式"],
      orderList: ["在厂全部", "报价", "施工", "质检", "出厂", "历史"],
      orderNavActive: 0,
      switchActive: 0,
      value1: "",
      maxHeight: undefined,
      search: {
        time: [],
        times: [],
        text1: "",
        text2: "",
        text3: ""
      },
      pageLength: null,
      size: 10,
      page: 0,
      title: "蒙B99999",
      payVisible: false,
      payForm: {},
      discountVisible: false,
      discountForm: {},
      paymentVisible: false,
      paymentData: [
        { type: 0, name: "现金" },
        { type: 1, name: "支付宝" },
        { type: 2, name: "微信" },
        { type: 3, name: "银行卡" },
        { type: 4, name: "支票" },
        { type: 5, name: "挂帐" }
      ],
      detailForm: {}
    };
  },
  created() {
    this.getOrderListInit();
  },
  mounted() {
    this.maxHeight = $(".tabBox").height() - 230;
    this.show = true;
  },
  methods: {
    //点击询价
    enquiry() {
      this.configuration = true;
    },
    //点击单选框
    getValue(i) {
      console.log(i);
      this.askPriceId = i.askPriceId;
    },
    getValue2(i) {
      // console.log(i);
      this.askPriceId = i.askPriceId;
    },
    dinghuodan() {
      var askPricePartIds = [];
      if (this.switchActive == 0) {
        askPricePartIds = [];
        this.PriceList.map((v, i) => {
          v.askPricePartDOS.map((c, i) => {
            askPricePartIds.push(c.number);
          });
        });
      } else if (this.switchActive == 1) {
        askPricePartIds = [];
        this.ceshi.map((v, i) => {
          v.askPricePartDOS.map((c, i) => {
            // console.log(c);
            askPricePartIds.push(c.purNumber);
          });
        });
      }

      askPricePartIds = askPricePartIds.filter(item => item);
      let data = {
        askPriceId: this.askPriceId,
        askPricePartIds: askPricePartIds
      };
      console.log(data);
      let tishi = "确认生成订货单？";
      this.$confirm(tishi, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        pcpurOrder(data).then(res => {
          console.log(res.data);
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "下单成功!"
            });
            this.editFormStatus = false;
            this.getOrderListInit();
          } else {
            // this.$message.error(res.data.message);
          }
        });
      });
      console.log(askPricePartIds);
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    //查看商家
    editRow(row) {
      // console.log(row);
      var _this = this;
      let listArr = [];
      pcaskPriceList({ oid: row.oid }).then(res => {
        this.PriceList = res.data.data;
        var result = [];
        this.PriceList.map((v, i) => {
          v.askPricePartDOS.map((c, i) => {
            c.map((d, i) => {
              // console.log(d);
              this.$set(d, "number", 0);
              if (d.supplierId == d.supplierId) {
                result.push(d);
              }
            });
          });
        });
      });

      askPriceList({ oid: row.oid }).then(res => {
        let listArr = [];
        // console.log(res.data.data);
        res.data.data.map((v, i) => {
          // console.log(v.askPricePartDOList);
          var data = v.askPricePartDOList;
          data.forEach(function(el, index) {
            for (var i = 0; i < listArr.length; i++) {
              if (listArr[i].supplierName == el.supplierName) {
                listArr[i].askPricePartDOS.push(el);
                return;
              }
            }
            // 第一次对比没有参照，放入参照
            listArr.push({
              supplierName: el.supplierName,
              supplierPhone: el.supplierPhone,
              address: el.address,
              askPriceTime: el.askPriceTime,
              billNumber: el.billNumber,
              carNo: el.carNo,
              partId: el.partId,
              partName: el.partName,
              partTotalCount: el.partTotalCount,
              unPricedCount: el.unPricedCount,
              askPricePartDOS: [el]
            });
          });
        });
        var ceshi = [];
        var cddd = [];
        listArr.map((el, i) => {
          var res = el.askPricePartDOS;
          ceshi.push({
            supplierName: el.supplierName,
            supplierPhone: el.supplierPhone,
            address: el.address,
            askPriceTime: el.askPriceTime,
            billNumber: el.billNumber,
            carNo: el.carNo,
            partId: el.partId,
            partName: el.partName,
            partTotalCount: el.partTotalCount,
            unPricedCount: el.unPricedCount,
            askPricePartDOS: []
          });

          for (var i = 0; i < res.length; i += 3) {
            cddd.push(res.slice(i, i + 3));
          }

          cddd.forEach(function(v, index) {
            _this.$set(v, "number2", 1);

            for (var i = 0; i < ceshi.length; i++) {
              // console.log(ceshi[i].supplierName)
              //      console.log(v[0].supplierName)
              if (ceshi[i].supplierName == v[0].supplierName) {
                ceshi[i].askPricePartDOS.push(v);
                //   return;
              }
            }
          });
        });
        // console.log(cddd);
        if (cddd.length > 1) {
          this.lensg = cddd.length / 2;
        } else {
          this.lensg = 1;
        }
        console.log(ceshi);
        this.ceshi = ceshi;
        var result = [];
      });

      this.editFormStatus = true;
    },
    //点击切换退还货
    switchOF(i) {
      this.switchActive = i;
      if (this.switchActive == 0) {
        this.showlist = true;
      } else if (this.switchActive == 1) {
        this.showlist = false;
      }
    },
    getOrderListInit() {
      let nowTime = moment(new Date()).format("YYYY-MM-DD");
      const data = {
        endDate: this.search.time ? this.search.time[1] : "",
        startDate: this.search.time ? this.search.time[0] : "",
        leaveStartDate: this.search.times ? this.search.times[0] : "",
        leaveEndDate: this.search.times ? this.search.times[1] : "",
        carNo: this.search.text1,
        ownerName: this.search.text2,
        phone: this.search.text3,
        page: this.page,
        size: this.size,
        status: this.orderNavActive
      };
      this.getOrderList2(data);
    },
    handleCurrentChange(val) {
      this.page = val - 1;
      const data = {
        endDate: this.search.time ? this.search.time[1] : "",
        startDate: this.search.time ? this.search.time[0] : "",
        leaveStartDate: this.search.times ? this.search.times[0] : "",
        leaveEndDate: this.search.times ? this.search.times[1] : "",
        carNo: this.search.text1,
        ownerName: this.search.text2,
        phone: this.search.text3,
        page: this.page,
        size: this.size,
        status: this.orderNavActive
      };
      if (data.status === 4) {
        data.status = 6;
      }
      if (data.status === 3) {
        data.status = 4;
      }
      if (data.status === 5) {
        data.status = -1;
      }
      this.getOrderList2(data);
    },
    orderTab(i) {
      if (i == 1) {
        this.show = false;
      } else {
        this.show = true;
      }
      let nowTime = moment(new Date()).format("YYYY-MM-DD");
      this.orderNavActive = i;

      if (this.search.time) {
        this.search.time.forEach((i, index) => {
          this.search.time[index] = moment(i).format("YYYY-MM-DD");
        });
      }
      if (this.search.times) {
        this.search.times.forEach((i, index) => {
          this.search.times[index] = moment(i).format("YYYY-MM-DD");
        });
      }

      const data = {
        endDate: this.search.time ? this.search.time[1] : "",
        startDate: this.search.time ? this.search.time[0] : "",
        leaveStartDate: this.search.times ? this.search.times[0] : "",
        leaveEndDate: this.search.times ? this.search.times[1] : "",
        carNo: this.search.text1,
        ownerName: this.search.text2,
        phone: this.search.text3,
        page: this.page,
        size: this.size,
        status: this.orderNavActive
      };
      if (data.status === 4) {
        data.status = 6;
      }
      if (data.status === 3) {
        data.status = 4;
      }
      if (data.status === 5) {
        data.status = -1;
      }
      this.getOrderList2(data);
    },
    toOrderX(item) {
      localStorage.setItem("oid", item.oid);
      this.$router.push({
        path: "../home/orderX"
      });
    },
    getOrderList2(data) {
      getOrderList2(data).then(res => {
        this.pageLength = res.data.data.totalElements;
        this.tableData = res.data.data.content.map(v => {
          v.createdDate = moment(v.createdDate).format("YYYY-MM-DD");
          v.shows = 0;
          return v;
        });

        // console.log(this.tableData);
      });
    },
    searchList() {
      if (this.search.time) {
        this.search.time.forEach((i, index) => {
          this.search.time[index] = moment(i).format("YYYY-MM-DD");
        });
      }
      if (this.search.times) {
        this.search.times.forEach((i, index) => {
          this.search.times[index] = moment(i).format("YYYY-MM-DD");
        });
      }

      const data = {
        endDate: this.search.time ? this.search.time[1] : "",
        startDate: this.search.time ? this.search.time[0] : "",
        leaveStartDate: this.search.times ? this.search.times[0] : "",
        leaveEndDate: this.search.times ? this.search.times[1] : "",
        carNo: this.search.text1,
        ownerName: this.search.text2,
        phone: this.search.text3,
        page: this.page,
        size: this.size,
        status: this.orderNavActive
      };
      if (data.status === 4) {
        data.status = 6;
      }
      if (data.status === 3) {
        data.status = 4;
      }
      if (data.status === 5) {
        data.status = -1;
      }
      this.getOrderList2(data);
    },

    printDeal() {
      var printBox = document.getElementById("printBox");
      var newContent = printBox.innerHTML;
      var oldContent = document.body.innerHTML;
      document.body.innerHTML = newContent;
      window.print();
      window.location.reload();
      document.body.innerHTML = oldContent;
    },
    getExcel() {
      if (this.tableData.length < 1) {
        this.$message({
          message: "暂无可导出的数据！",
          type: "warning"
        });
        return;
      }
      const data = {
        endTime: this.search.time[1],
        startTime: this.search.time[0],
        type: 9 //工单列表
      };
      excel(data, "工单报表").then(() => {});
    },
    pay(row) {
      getOrderListX({ oid: row.oid }).then(res => {
        if (res.data.code == 200) {
          this.detailForm = res.data.data;
          this.detailForm.carNo = row.carNo;

          let receivableItemAmount = 0;
          let receivablePartAmount = 0;
          this.detailForm.orderItemList.forEach(v => {
            receivableItemAmount += v.standPrice;
            v.orderPartList.forEach(k => {
              receivablePartAmount += k.price;
            });
          });

          this.payForm = {
            oid: row.oid,
            gid: row.gid,
            carNo: row.carNo,
            customerId: this.detailForm.customerId,
            customerName: this.detailForm.ownerName,
            phone: this.detailForm.phone,
            receivableItemAmount: receivableItemAmount,
            receivablePartAmount: receivablePartAmount,
            discountItemRate: 10,
            discountPartRate: 10,
            actualItemAmount: this.detailForm.receivableItemAmount || 0,
            actualPartAmount: this.detailForm.receivablePartAmount || 0,
            discountReason: "",
            amountDiscount: 0,
            amountReceivable: Math.floor(this.detailForm.amountReceivable) || 0,
            amountActual:
              Math.floor(this.detailForm.amountActual) ||
              Math.floor(this.detailForm.amountReceivable) ||
              0,
            payTypeList: [],
            difference: 0,
            discountPrice: 0
          };
          //获取会员星级，折扣计算
          getGrade({ customerId: this.detailForm.customerId }).then(res => {
            if (res.data.code == 200) {
              const data = res.data.data;
              this.detailForm.star = data.star;
              if (data.gradeTypeDO) {
                this.payForm.discountItemRate = data.gradeTypeDO.workDiscount;
                this.payForm.discountPartRate = data.gradeTypeDO.partDiscount;
                this.discountCalc();
              }
            }
          });
          this.payVisible = true;
        }
      });
    },
    //折扣计算
    discountCalc() {
      this.payForm.actualItemAmount = (
        parseFloat(this.payForm.receivableItemAmount) *
        parseFloat(this.payForm.discountItemRate / 10)
      ).toFixed(2);
      this.payForm.actualPartAmount = (
        parseFloat(this.payForm.receivablePartAmount) *
        parseFloat(this.payForm.discountPartRate / 10)
      ).toFixed(2);
      const projectDiscount =
        parseFloat(this.payForm.receivableItemAmount) -
        parseFloat(this.payForm.actualItemAmount);
      const partDiscount =
        parseFloat(this.payForm.receivablePartAmount) -
        parseFloat(this.payForm.actualPartAmount);

      //总优惠价格
      this.payForm.amountDiscount = Math.floor(
        parseFloat(projectDiscount) + parseFloat(partDiscount)
      );
      this.payForm.discountPrice = this.payForm.amountDiscount;
      this.payForm.amountActual = Math.floor(
        parseFloat(this.payForm.amountReceivable) -
          parseFloat(this.payForm.amountDiscount)
      );
    },
    allCalc(type) {
      if (type == 1) {
        this.payForm.discountPrice = Math.floor(
          parseFloat(this.payForm.amountReceivable) -
            parseFloat(this.payForm.amountActual)
        );
      } else {
        this.payForm.amountActual = Math.floor(
          parseFloat(this.payForm.amountReceivable) -
            parseFloat(this.payForm.discountPrice)
        );
      }
    },
    selectPayment(event) {
      this.payForm.difference = 0;
      this.payForm.payTypeList = event.map(v => {
        this.$set(v, "amount", 0);
        return v;
      });
    },
    changeAmount() {
      const sumPrice = this.payForm.payTypeList.reduce(function(
        accumulator,
        currentValue
      ) {
        return accumulator + parseFloat(currentValue.amount);
      },
      0);

      this.payForm.difference =
        parseFloat(this.payForm.amountActual) - sumPrice;
    },
    paySubmit() {
      if (this.payForm.amountActual != 0) {
        if (this.payForm.payTypeList.length < 1) {
          return this.$message({ message: "请先选择支付方式", type: "error" });
        }

        const sumPrice = this.payForm.payTypeList.reduce(function(
          accumulator,
          currentValue
        ) {
          return accumulator + parseFloat(currentValue.amount);
        },
        0);
        if (sumPrice != this.payForm.amountActual) {
          return this.$message({
            message: "结算金额不等于实收金额，请修改",
            type: "error"
          });
        }
      }

      const data = {
        ...this.payForm,
        discountItemRate: parseFloat(this.payForm.discountItemRate),
        discountPartRate: parseFloat(this.payForm.discountPartRate)
      };
      settlement(data).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "结算成功!"
          });
          this.payVisible = false;
          this.searchList();
        }
      });
    },
    rollbackSettlement(row) {
      this.$confirm(`确认车牌为${row.carNo}的工单反结算?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          rollbackSettlement({ oid: row.oid }).then(res => {
            if (res.data.code == 200) {
              this.$message({
                type: "success",
                message: "反结算成功!"
              });
              this.searchList();
            }
          });
        })
        .catch(() => console.log("已取消"));
    },
    discountDialog() {
      this.discountVisible = true;
    },
    paymentDialog() {
      this.paymentVisible = true;
    },
    showMore(index) {
      this.$set(this.tableData[index], "shows", 1);
    }
  }
};
</script>
<style scoped>
.orderUl li {
  float: left;
  padding: 0px 10px;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
  transition: 0.5s;
  font-size: 16px;
}
.jindu {
  position: relative;
  width: 100%;
  height: 34px;
  /* background: pink; */
}
.orlist div {
  display: inline-block;
}
.orlist div:nth-child(2) {
  margin-left: 20px;
}
.orlist div:nth-child(3) {
  margin-left: 20px;
}

.xuhao {
  margin-top: 10px;
  width: 100%;
  line-height: 40px;
  height: 40px;
  background: #f2f2f2;
  border: 1px solid #dcdfe6;
}
table {
  width: 100%;
  border: 1px solid #dcdfe6;
}
.xuhao div {
  text-align: center;
}
.xuhao .xu1 {
  width: 45px;
}
.xuhao .xu2 {
  width: 150px;
}
.xuhao .xu3 {
  width: 105px;
}
.xuhao .xu4 {
  width: 110px;
}
.xuhao .xu5 {
  width: 135px;
}
.xuhao .xu6 {
  width: 160px;
}
.xuhao .xu7 {
  width: 210px;
}
.xuhao .xu8 {
  width: 85px;
}

.tbbd tr td {
  text-align: center;
}
.tbbd tr td div {
  height: 35px;
  line-height: 35px;
}
.tbbd tr td img {
  margin-left: 5px;
  width: 18px;
  height: 18px;
  vertical-align: middle;
}
.pei {
  margin-top: 5px;
  display: inline-block;
}
.pei1 {
  margin-left: 15px;
}
.pei2 {
  width: 125px;
}
.pei3 {
  margin-left: 100px;
}
.pei img {
  width: 22px;
  height: 22px;
}
tr td span {
  vertical-align: middle;
}
tr .td1 {
  width: 25px;
}
tr .td2 {
  width: 95px;
  border-left: 1px solid #dcdfe6;
  border-right: 1px solid #dcdfe6;
}
tr .td3 {
  width: 55px;
  border-right: 1px solid #dcdfe6;
}
tr .td4 {
  width: 55px;
  border-right: 1px solid #dcdfe6;
}
tr .td5 {
  width: 90px;
  border-right: 1px solid #dcdfe6;
}
tr .td6 {
  width: 80px;
  border-right: 1px solid #dcdfe6;
}
tr .td7 {
  width: 130px;
  border-right: 1px solid #dcdfe6;
}
tr .td8 {
  width: 50px;
  border-right: 1px solid #dcdfe6;
}
tr .td9 {
  width: 20px;
}
.el-radio {
  height: 35px;
  display: block;
  line-height: 35px;
  margin-right: 0px;
}
.xuhao2 {
  margin-top: 15px;
  width: 100%;
  line-height: 45px;
  height: 45px;
  background: #f2f2f2;
  border: 1px solid #dcdfe6;
  border-bottom: none;
}
.configlist{
  overflow: hidden;
}
.lines{
  border-top: 1px solid #909399;
  border-bottom: 1px solid #909399;
  height: 50px;
}
.PJparts {
  width: 45%;
}
.PJparts2 {
  width: 45%;
}
.pj {
  margin-left: 10px;
  display: inline-block;
  width: 250px;
}
.sl {
  display: inline-block;
  width: 200px;
}
.xuhao div {
  display: inline-block;
}
.xian {
  height: 4px;
  width: 80%;
  background: #4f4f4f;
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 15px;
  margin-left: 20px;
  z-index: 1;
}

th {
  /* width: 100%; */
  line-height: 45px;
  height: 45px;
  background: #f2f2f2;
  border: 1px solid #dcdfe6;
}
.yuan_a {
  margin: auto;
  text-align: center;
  float: left;
  position: relative;
  width: 50px;
  z-index: 9;
}
/* .orderTable /deep/ table thead tr th {
  background: #f2f2f2 !important;
  color: #606266;
} */
.peijian {
  line-height: 45px;
  height: 45px;
  background: #f2f2f2;
  border: 1px solid #dcdfe6;
  margin-top: 15px;
}
.peijian div {
  display: inline-block;
}
.yuan {
  margin: auto;
  /* position: absolute;
  top: 0;
  left: 0; */
  margin-top: 2px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #f56c6c;
  color: #fff;
  line-height: 30px;
}
.span {
  color: #000;
  font-size: 11px;
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


