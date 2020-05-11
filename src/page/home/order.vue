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

            <!-- <div class="right miaa" @click="XinzengGD" v-if="orderNavActive == 0">
              <i class="el-icon-plus"></i>
              <span class="mis2">新增工单</span>
            </div>-->
            <div class="right miaa" @click="XinzengGD" v-if="orderNavActive == 0">
              <i class="el-icon-plus"></i>
              <span class="mis2">新增工单</span>
            </div>

            <el-form-item label class="m-b-0 right m-r-20" v-if="!show">
              <div class="left c-p c-9">
                <el-button type="success" icon="el-icon-refresh-right" @click="searchList()">刷新</el-button>
              </div>
            </el-form-item>
          </el-col>
        </el-form>
      </el-row>
    </div>

    <el-dialog
      title="新增工单"
      :visible.sync="XinzenVisible"
      center
      width="45%"
      :modal="false"
      @click="visible = false"
    >
      <div>
        <el-popover
          placement="bottom-start"
          :width="width"
          v-model="visible"
          trigger="manual"
          class="hhd"
        >
          <i @click="visible = false" class="el-icon-circle-close guanbi"></i>
          <el-table
            :data="list_car"
            :height="height"
            @row-click="onClickItem"
            @row-dblclick="onDblClickSelect"
          >
            <el-table-column type="index" label></el-table-column>
            <el-table-column property="ownerName" label="客户姓名"></el-table-column>
            <el-table-column property="carNo" label="车牌号"></el-table-column>
            <el-table-column property="phone" label="手机号码"></el-table-column>
          </el-table>
          <div slot="reference">
            <el-input placeholder="请输入内容" v-model="input3" @blur="handleBlur">
              <i slot="suffix" @click="visible = false" class="el-icon-arrow-down xialabiao"></i>
              <el-button
                slot="prepend"
                @click="shousuo_Car"
                style="width: 80px;border-radius: 0px"
              >搜 索</el-button>
            </el-input>
          </div>
        </el-popover>
      </div>

      <el-row class="csxian">
        <el-col :span="8">
          <div class="xinxi" style=" border-left:none">车牌</div>
          <span>{{Car_list.carNo}}</span>
        </el-col>
        <el-col :span="8">
          <div class="xinxi">姓名</div>
          <span>{{Car_list.ownerName}}</span>
        </el-col>
        <el-col :span="8">
          <div class="xinxi">手机</div>
          <span>{{Car_list.phone}}</span>
        </el-col>
      </el-row>
      <el-row class="csxian">
        <el-col :span="8">
          <div class="xinxi" style=" border-left:none">品牌车系</div>
          <span>{{Car_list.standard}}</span>
        </el-col>
        <el-col :span="8">
          <div class="xinxi">欠款</div>
          <span>{{Car_list.totalBills}}</span>
        </el-col>
        <el-col :span="8">
          <div class="xinxi">余额</div>
          <span>{{Car_list.balance}}</span>
        </el-col>
      </el-row>

      <el-row class="csxian">
        <el-col :span="8">
          <div class="xinxi" style=" border-left:none">保险到期</div>
          <span>{{Car_list.insuranceExpire}}</span>
        </el-col>
        <el-col :span="8">
          <div class="xinxi">保养到期</div>
          <span>{{Car_list.maintenanceExpire}}</span>
        </el-col>
        <el-col :span="8">
          <div class="xinxi">年检到期</div>
          <span>{{Car_list.yearExpire}}</span>
        </el-col>
      </el-row>
      <div class="redd">
        <el-table :data="Car_list.comboCustomerListVOS" height="220" border style="width: 100%">
          <el-table-column prop="comboName" label="已购套餐" width></el-table-column>
          <el-table-column prop="comboItemList" label="项目名称" width="130">
            <template slot-scope="scope">
              <div
                v-if="scope.row.comboItemList.length != 0"
              >{{scope.row.comboItemList[0].itemName}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="comboItemList" label="总次数" width="70">
            <template slot-scope="scope">
              <div
                v-if="scope.row.comboItemList.length != 0"
              >{{scope.row.comboItemList[0].totalTimes}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="comboItemList" label="剩余次数" width="80">
            <template slot-scope="scope">
              <div
                v-if="scope.row.comboItemList.length != 0"
              >{{scope.row.comboItemList[0].surplusTimes}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="endDate" label="到期时间" width="130">
            <template slot-scope="scope">
              <div>{{scope.row.endDate.substring(0,10)}}</div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="KaidanClick">开 单</el-button>
      </div>
    </el-dialog>

    <el-table
      :data="tableData"
      :max-height="maxHeight"
      style="width: 100%"
      ref="lists"
      id="printBox"
      @row-click="toOrderX2"
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
      <el-table-column label="询价配件" v-if="!show" width="120px">
        <template slot-scope="scope">{{scope.row.askPricePartAll}}</template>
      </el-table-column>
      <el-table-column label="数量" v-if="!show">
        <template slot-scope="scope">{{scope.row.askPriceCount}}</template>
      </el-table-column>
      <el-table-column label="服务项目" v-if="show">
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

      <el-table-column label="接车员" v-if="show">
        <template slot-scope="scope">{{scope.row.clerkOrder}}</template>
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
      <el-table-column label="操作" width="200" align="center">
        <template slot-scope="scope">
          <el-button v-if="!show" size="mini" plain @click.stop="editRow(scope.row)">商家报价</el-button>
          <el-button v-if="!show" size="mini" plain @click.stop="enquiry(scope.row)">询价</el-button>
          <!-- <el-button v-if="show" size="mini" plain @click.stop="toOrderX(scope.row)">查看</el-button> -->
          <!-- <template slot-scope="scope" v-if="show" > -->
          <div @click.stop v-if="show" style="display: inline-block;">
            <el-dropdown trigger="click" @command="handleCommand">
              <el-button plain size="mini">
                操作
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="send_work(scope.row)">会员办理</el-dropdown-item>
                <el-dropdown-item @click.native="add_parts(scope.row)">变更车牌</el-dropdown-item>
                <el-dropdown-item @click.native="edit_project(scope.row)">其它支出</el-dropdown-item>
                <el-dropdown-item @click.native="delete_project(scope.row)">预付款</el-dropdown-item>
                <el-dropdown-item @click.native="royalty(scope.row)">工单上锁</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <!-- </template> -->
          <!--  -->
          <el-button
            v-if="scope.row.settlementStatus == 1"
            type="success"
            size="mini"
            @click.stop="rollbackSettlement(scope.row)"
          >反结算</el-button>
          <el-button
            v-if="scope.row.settlementStatus != 1 && show"
            type="danger"
            style="display: inline-block;"
            size="mini"
            @click.stop="pay(scope.row)"
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
    <el-dialog title="询价配置" :visible.sync="configuration" width="65%" :modal="false" center>
      <div class="lux">
        <div class="sdx">
          车架号：
          <span class="phon">{{chejia_list.vin}}</span>
        </div>

        <div class="sdx">
          车架照片：
          <el-image
            class="min-width-60 cart-img cc_img"
            :src="chejia_list.vinPic"
            alt
            v-if="chejia_list.vinPic"
            :preview-src-list="chejia_list.vinPic.split(',')"
          ></el-image>
          <el-image
            class="min-width-60 cart-img cc_img"
            src="../../../static/img/chejia.png"
            :preview-src-list="chejia_list.vinPic"
            v-else
          ></el-image>
        </div>
      </div>
      <div class="configlist">
        <div class="left PJparts">
          <div class="lines" style="border-top: 1px solid #ebeef5; ">
            <div class="left pejx">配件</div>
            <div class="right" style="cursor:pointer" @click="Pjclick">
              选择
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
          <div class="outbox">
            <div class="outbox_c" v-if="systemRecoList2.length < 1">请选择您要询价的配件~</div>
            <div class="lines" v-for="(items,idx) in systemRecoList2" :key="'inte'+idx">
              <div class="left namepes">{{items.partName}}</div>
              <div class="right namedelet" style="cursor:pointer" @click="detparts(idx)">删除</div>
              <div class="right namelet">x{{items.partCount}}.0</div>
            </div>
          </div>
        </div>
        <div class="right PJparts2">
          <div class="lines" style="border-top: 1px solid #ebeef5; ">
            <div class="left pejx">
              供应商
              <span style="  font-size: 12px;color: #666;">(最多6家)</span>
            </div>
            <div class="left chek">
              <el-checkbox @change="isMyclck">我的商家优先</el-checkbox>
            </div>
            <div class="left xitong" style="cursor:pointer" @click="systemReco">系统推荐</div>
            <div class="right" @click="choose" style="cursor:pointer">
              选择
              <i class="el-icon-arrow-right"></i>
            </div>
          </div>
          <div class="outbox">
            <div class="outbox_c" v-if="systemRecoList.length < 1">请选择您要询价的汽配商~</div>
            <div class="lines2" v-for="(items,idx) in systemRecoList" :key="'inte'+idx">
              <div class="outlis">
                <div class="chengde">{{items.companyName}}</div>
                <div class="wode" v-if="items.gid == gid">我的</div>
              </div>
              <div class="outlis_a">
                <div class="chengde">{{items.manageRemark}}</div>
                <div class="namedelet sc" style="cursor:pointer" @click="detsupplier(idx)">删除</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" style="width:450px" @click="enquiryPull">询 价</el-button>
      </div>
      <!-- 内层选择配件询价弹窗 -->
      <el-dialog width="30%" center title="选择配件" :visible.sync="configuration_c" append-to-body>
        <div class="lulux">
          <el-checkbox class="lulu2" v-model="checkedAll" @change="checkAllHandle">全选</el-checkbox>
        </div>
        <div class="outbox_d">
          <div
            class="lines"
            v-for="(items,idx) in tableData2"
            :key="'inte'+idx"
            v-if="items.source == 1 && items.askPriceStatus != 1"
          >
            <div class="left namepes">{{items.partName}}</div>
            <el-checkbox-group
              class="right sdsd"
              style="margin-right: 5px;"
              v-model="items.checked"
            >
              <el-checkbox></el-checkbox>
            </el-checkbox-group>
            <div class="right namelet">x{{items.counts}}.0</div>
          </div>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button type="success" style="width:200px" @click="Clicktijiao">提 交</el-button>
        </div>
      </el-dialog>

      <!-- 内层供应商弹窗 -->
      <el-dialog width="35%" center title="选择供应商" :visible.sync="innerVisible" append-to-body>
        <div class="inputd">
          <el-input style="width: 250px;" class="left" placeholder="输入相关关键字" v-model="seekgysname">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
          <img
            class="left"
            style="width: 25px;height: 25px;margin-left: 50px;margin-top: 5px;"
            src="../../assets/saixuan.png"
            alt
          />
          <div class="qipeic left" style="cursor:pointer" @click="Town">汽配城</div>
          <el-button class="right" type="success" @click="seeksupplier">查 找</el-button>
        </div>
        <div class="outbox">
          <div class="lines2" v-for="(items,idx) in supplierlist" :key="'supp'+idx">
            <div class="outlis">
              <div class="chengde2">{{items.supplierName}}</div>
              <div class="phin">{{items.phone}}</div>
              <el-checkbox-group
                style="margin-left: 5px;"
                :min="1"
                :max="3"
                v-model="items.checked"
              >
                <el-checkbox @change="check(items)"></el-checkbox>
              </el-checkbox-group>
            </div>
            <div class="outlis_a">
              <div class="chengde">{{items.scope}}</div>
              <div class="wode" style="margin-bottom: 0px" v-if="items.gid == gid">我的</div>
            </div>
          </div>
        </div>

        <div slot="footer" class="dialog-footer">
          <el-button type="success" style="width:200px" @click="Clickinquiry">询 价</el-button>
        </div>
        <!-- //再内窗 -->
        <el-dialog
          style="padding-bottom: 20px;"
          width="20%"
          center
          :visible.sync="innerVisible2"
          append-to-body
        >
          <div style="overflow: hidden;">
            <div class="letzc">
              <div class="letz_b">汽配城</div>
              <div class="letz_b">地址</div>
            </div>
            <div class="outbox2">
              <div class="letz" v-for="(item,idx) in Townlist" :key="'i'+idx">
                <div @click="switTown(item.id)" :class="item.id==switchActive2?'letz_a_A':'letz_a'">
                  {{item.name}}
                  <img
                    v-if="item.id==switchActive2"
                    class="imgdagou"
                    src="../../assets/dagou.png"
                    alt
                  />
                </div>
                <div class="letz_b">{{item.locationTown}}</div>
              </div>
            </div>
          </div>
          <div style="overflow: hidden;margin-top: 10px;">
            <div class="right queding" @click="qipeicheng" style="cursor:pointer">确 定</div>
          </div>
        </el-dialog>
      </el-dialog>
    </el-dialog>

    <!--  -->
    <!-- 查看商家弹窗 -->
    <el-dialog title=" 商家报价" :visible.sync="editFormStatus" width="70%" center :modal="false">
      <el-form :inline="true" class="demo-form-inline">
        <el-row>
          <el-col style="margin-bottom: 5px;">
            <ul class="left orderUl" style="width:40%;">
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
            <div class="right" @click="editRow2">
              <img class="shaimg" src="../../assets/shaxin.png" alt />
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div class="tbode">
        <el-table
          :data="Noquotation"
          :max-height="360"
          style="width: 100%"
          ref="lists"
          id="printBox"
          v-if="switchActive == 2"
        >
          <el-table-column type="index" label="序号" width="80">
            <!-- <template slot-scope="scope">{{scope.row.index}}</template> -->
          </el-table-column>
          <el-table-column prop="name" label="供应商" width="200">
            <template slot-scope="scope">{{scope.row.companyName}}</template>
          </el-table-column>
          <el-table-column label="联系人" width="100">
            <template slot-scope="scope">{{scope.row.linkman}}</template>
          </el-table-column>
          <el-table-column label="联系电话" width="150">
            <template slot-scope="scope">{{scope.row.phone}}</template>
          </el-table-column>
          <el-table-column label="询价配件">
            <template slot-scope="scope">{{scope.row.askPart2}}等{{scope.row.sl}}个配件</template>
          </el-table-column>
          <el-table-column label="询价时间">
            <template slot-scope="scope">{{scope.row.createdTime}}</template>
          </el-table-column>
          <el-table-column label="询价状态" width="110px">
            <template slot-scope="scope">
              <em style="color:#FF6757" v-if="scope.row.status ==0">未报价</em>
              <em style="color:#FF6757" v-if="scope.row.status ==1">缺货取消</em>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="xuhao" v-if="switchActive != 2">
        <div class="xu1">序号</div>
        <div class="xu2" style="width:200px">供应商</div>
        <div class="xu8" v-if="switchActive == 1">数量</div>
        <div class="xu3" :style="{'width':switchActive == 1 ? '9%':''}">配件类型</div>
        <div class="xu4">单价</div>
        <div class="xu5" :style="{'width':switchActive == 1 ? '14%':''}">到货时间</div>
        <div class="xu6">保质期</div>
        <div class="xu7" :style="{'width':switchActive == 1 ? '20%':''}">备注</div>
      </div>
      <!-- 配件模式 -->
      <div
        class="huadong"
        v-if="switchActive == 0 "
        :style="{'height':PriceList != '' ? '470px':''}"
      >
        <div
          v-for="(item,indexff) in PriceList"
          :key="'item'+indexff"
          class="tbcd"
          v-if="item.askPricePartDOS != null"
        >
          <el-row>
            <div class="xuhao2" v-if="switchActive == 0">
              <el-col :span="8">
                <div class="pj">配件名称：{{item.partName}}</div>
              </el-col>
              <el-col :span="14">
                <div class="sl">数量：{{item.askPricePartDOS[0][0].partCount}}</div>
              </el-col>
            </div>
          </el-row>

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
                <div style="border-bottom: 1px solid #dcdfe6;">
                  <img
                    v-if="items[0].status == 0 ||items[0].status == 1"
                    class="gou"
                    src="../../assets/gou.png"
                    alt
                  />
                  {{items[0].partType==0 ?'原厂件':''}}
                </div>
                <div style="border-bottom: 1px solid #dcdfe6;">
                  <img
                    v-if="items[1].status == 0 ||items[1].status == 1"
                    class="gou"
                    src="../../assets/gou.png"
                    alt
                  />
                  {{items[1].partType==1 ?'品牌件':''}}
                </div>
                <div>
                  <img
                    v-if="items[2].status == 0 ||items[2].status == 1"
                    class="gou"
                    src="../../assets/gou.png"
                    alt
                  />
                  {{items[2].partType==2 ?'其它件':''}}
                </div>
              </td>
              <td class="td4">
                <div style="border-bottom: 1px solid #dcdfe6;" @click="yijia(items[0])">
                  <span
                    v-if="items[0].talkStatus ==1"
                    :style="{'color': (items[0].talkStatus == 1 ? '#0D906E':'')}"
                  >{{items[0].talkPrice ?'￥':''}}{{items[0].talkPrice}}</span>
                  <span v-if="items[0].talkStatus !=1">{{items[0].price ?'￥':''}}{{items[0].price}}</span>
                </div>
                <div style="border-bottom: 1px solid #dcdfe6;" @click="yijia(items[1])">
                  <span
                    v-if="items[1].talkStatus ==1"
                    :style="{'color': (items[1].talkStatus == 1 ? '#0D906E':'')}"
                  >{{items[1].talkPrice ?'￥':''}}{{items[1].talkPrice}}</span>
                  <span v-if="items[1].talkStatus !=1">{{items[1].price ?'￥':''}}{{items[1].price}}</span>
                </div>
                <div @click="yijia(items[2])">
                  <span
                    v-if="items[2].talkStatus ==1"
                    :style="{'color': (items[2].talkStatus == 1 ? '#0D906E':'')}"
                  >{{items[2].talkPrice ?'￥':''}}{{items[2].talkPrice}}</span>
                  <span v-if="items[2].talkStatus !=1">{{items[2].price ?'￥':''}}{{items[2].price}}</span>
                </div>
              </td>
              <td class="td5">
                <div style="border-bottom: 1px solid #dcdfe6;">{{items[0].price?items[0].arrivalTime:''}}</div>
                <div style="border-bottom: 1px solid #dcdfe6;">{{items[1].price?items[1].arrivalTime:''}}</div>
                <div>{{items[2].price?items[2].arrivalTime:''}}</div>
              </td>
              <td class="td6">
                <div style="border-bottom: 1px solid #dcdfe6;">{{items[0].price?items[0].qualityTime:''}}</div>
                <div style="border-bottom: 1px solid #dcdfe6;">{{items[1].price?items[1].qualityTime:''}}</div>
                <div>{{items[2].price?items[2].qualityTime:''}}</div>
              </td>
              <td class="td7">
                <div style="border-bottom: 1px solid #dcdfe6;">
                  <em>{{items[0].remark}}</em>
                  <!-- <em v-if="items[0].status == 0 ||items[0].status == 1">（已下单）</em> -->
                </div>
                <div style="border-bottom: 1px solid #dcdfe6;">
                  <em>{{items[1].remark}}</em>
                  <!-- <em v-if="items[1].status == 0 ||items[1].status == 1">（已下单）</em> -->
                </div>
                <div>
                  <em>{{items[2].remark}}</em>
                  <!-- <em v-if="items[2].status == 0 ||items[2].status == 1">（已下单）</em> -->
                </div>
              </td>
              <td class="td9 radio_ccid" style="width: 3%">
                <el-radio
                  v-for="(itemd,idxd) in items"
                  :key="'itemd'+idxd"
                  v-if="idxd<3"
                  v-model="items.number"
                  :label="itemd.id"
                  @change="getValue(itemd)"
                  style="border-bottom: 1px solid #dcdfe6;"
                >&nbsp;</el-radio>
                <!-- <el-checkbox v-model="itemd.number"
                style="border-bottom: 1px solid #dcdfe6;"
                 v-for="(itemd,idxd) in items"
                :key="'itemd'+idxd"
                 @change="getValue(itemd)"
                v-if="idxd<3">
                </el-checkbox>-->
              </td>
            </tr>
          </table>
        </div>
      </div>

      <!-- 商家模式-->
      <div class="huadong" v-show="switchActive == 1" :style="{'height':ceshi != '' ? '470px':''}">
        <div v-for="(itemst,indexlst) in ceshi" :key="'itemst'+indexlst" class="tbcd">
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
            <!-- <div class="right"> -->
              <el-button class="right" style="margin-top: 7px;" size="mini" type="danger" @click="TuihuiClick(itemst.askPricePartDOS)">退回重报</el-button>

            <!-- </div> -->
          </div>

          <table
            border="0"
            cellspacing="0"
            cellpadding="0"
            class="tbbd"
            v-for="(itemc,idxxx) in itemst.askPricePartDOS"
            :key="'itemc'+idxxx"
          >
            <tr>
              <td class="td1">{{idxxx+1}}</td>
              <td class="td2" style="  text-align: left;">
                <div v-if="switchActive == 1" style=" padding-left: 25px;">
                  <span>{{itemc[0].partName}}</span>
                </div>
              </td>
              <td class="td8" v-if="switchActive == 1">
                <div>{{itemc[0].partCount}}</div>
              </td>
              <td class="td3">
                <div style="border-bottom: 1px solid #dcdfe6;" v-if="itemc[0].partType==0">
                  <img
                    v-if="itemc[0].status == 0 ||itemc[0].status == 1"
                    class="gou"
                    src="../../assets/gou.png"
                    alt
                  />
                  原厂件
                </div>
                <div style="border-bottom: 1px solid #dcdfe6;" v-if="itemc[1].partType==1">
                  <img
                    v-if="itemc[1].status == 0 ||itemc[1].status == 1"
                    class="gou"
                    src="../../assets/gou.png"
                    alt
                  />
                  品牌件
                </div>
                <div v-if="itemc[2].partType==2">
                  <img
                    v-if="itemc[2].status == 0 ||itemc[2].status == 1"
                    class="gou"
                    src="../../assets/gou.png"
                    alt
                  />
                  其它件
                </div>
              </td>
              <td class="td4">
                <div
                  style="border-bottom: 1px solid #dcdfe6;"
                  v-if="itemc[0].partType==0"
                  @click="yijia(itemc[0])"
                >
                  <span
                    v-if="itemc[0].talkStatus ==1"
                    :style="{'color': (itemc[0].talkStatus == 1 ? '#0D906E':'')}"
                  >{{itemc[0].talkPrice ?'￥':''}}{{itemc[0].talkPrice}}</span>
                  <span v-if="itemc[0].talkStatus !=1">{{itemc[0].price ?'￥':''}}{{itemc[0].price}}</span>
                </div>
                <div
                  style="border-bottom: 1px solid #dcdfe6;"
                  v-if="itemc[1].partType==1"
                  @click="yijia(itemc[1])"
                >
                  <span
                    v-if="itemc[1].talkStatus ==1"
                    :style="{'color': (itemc[1].talkStatus == 1 ? '#0D906E':'')}"
                  >{{itemc[1].talkPrice ?'￥':''}}{{itemc[1].talkPrice}}</span>
                  <span v-if="itemc[1].talkStatus !=1">{{itemc[1].price ?'￥':''}}{{itemc[1].price}}</span>
                </div>
                <div v-if="itemc[2]" @click="yijia(itemc[2])">
                  <span
                    v-if="itemc[2].talkStatus ==1"
                    :style="{'color': (itemc[2].talkStatus == 1 ? '#0D906E':'')}"
                  >{{itemc[2].talkPrice ?'￥':''}}{{itemc[2].talkPrice}}</span>
                  <span v-if="itemc[2].talkStatus !=1">{{itemc[2].price ?'￥':''}}{{itemc[2].price}}</span>
                </div>
              </td>
              <td class="td5">
                <div style="border-bottom: 1px solid #dcdfe6;">{{itemc[0].price?itemc[0].arrivalTime:""}}</div>
                <div style="border-bottom: 1px solid #dcdfe6;">{{itemc[1].price?itemc[1].arrivalTime:""}}</div>
                <div>{{itemc[2].price?itemc[2].arrivalTime:""}}</div>
              </td>
              <td class="td6">
                <div style="border-bottom: 1px solid #dcdfe6;">{{itemc[0].price?itemc[0].qualityTime:""}}</div>
                <div style="border-bottom: 1px solid #dcdfe6;">{{itemc[1].price?itemc[1].qualityTime:""}}</div>
                <div>{{itemc[2].price?itemc[2].qualityTime:""}}</div>
              </td>
              <td class="td7" :style="{'width':switchActive == 1 ? '17%':''}">
                <div style="border-bottom: 1px solid #dcdfe6;">
                  <em>{{itemc[0].remark}}</em>
                </div>
                <div style="border-bottom: 1px solid #dcdfe6;">
                  <em>{{itemc[1].remark}}</em>
                </div>
                <div>
                  <em>{{itemc[2].remark}}</em>
                </div>
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
        </div>
        <!--  -->
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="editFormStatus = false">取 消</el-button>
        <el-button type="success" @click="dinghuodan" v-if="switchActive != 2">生成订货单</el-button>
      </div>
    </el-dialog>

    <!-- 预付款 -->
    <el-dialog :title="yufuName" :visible.sync="yufuVisible" center width="40%" :modal="false">
      <el-form :model="yufuForm">
        <el-row :gutter="20" style="border-bottom:1px solid #ccc;padding:10px 0px;">
          <el-col :span="19">金额：</el-col>
          <el-col :span="5" style="text-align:right;">
            <el-input v-if="!yufuForm.advanceMoney" v-model="yufu_amount" placeholder="请输入金额"></el-input>
            <span v-else>{{yufuForm.advanceMoney}}</span>
            <!-- {{yufuForm.advanceMoney?yufuForm.advanceMoney:'0'}} -->
          </el-col>
        </el-row>
        <el-row
          :gutter="20"
          style="border-bottom:1px solid #ccc;padding:10px 0px;border-left:5px solid #0d906e;margin-top:20px;"
        >
          <el-col :span="12">支付方式</el-col>
          <el-col :span="12" v-if="!yufuForm.advanceMoney">
            <!-- <el-button type="info" class="right" size="mini" plain @click="paymentDialog2">请选择 ></el-button> -->
            <el-select v-model="yufu_type" class="right" placeholder="请选择" style="width:120px">
              <el-option
                v-for="item in paymentData2"
                :key="item.type"
                :label="item.name"
                :value="item.type"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="12" v-if="yufuForm.advanceMoney" style="text-align: right;">
            <div v-if="yufuForm.payTypes.type == 0">现金</div>
            <div v-if="yufuForm.payTypes.type == 1">支付宝</div>
            <div v-if="yufuForm.payTypes.type == 2">微信</div>
            <div v-if="yufuForm.payTypes.type == 3">银行卡</div>
            <div v-if="yufuForm.payTypes.type == 4">直赔到店</div>
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
        <!-- <el-button type="success" @click="yufuVisible = false">取 消</el-button> -->
        <el-button
          type="danger"
          v-if="yufuForm.advanceMoney"
          @click="paySubmit2"
          style="width: 50%;"
        >退 款</el-button>
        <el-button
          type="success"
          v-if="!yufuForm.advanceMoney"
          @click="paySubmit2"
          style="width: 50%;"
        >保 存</el-button>
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
          <el-col :span="6">应收：￥{{payForm.amountReceivable}}</el-col>
          <el-col :span="6">
            预付：
            <font color="red" v-if="detailForm.advance">￥{{detailForm.advance}}</font>
          </el-col>
          <el-col :span="6">
            优惠：
            <font color="red">￥{{payForm.discountPrice}}</font>
          </el-col>
          <el-col :span="6">
            实收：
            <!-- payForm.amountActual 实收参数 -->
            <font color="red">￥{{payForm.amountReceivable - detailForm.advance}}</font>
          </el-col>
        </el-row>
        <el-row
          :gutter="20"
          style="border-bottom:1px solid #ccc;padding:10px 0px;border-left:5px solid #0d906e;margin-top:20px;"
        >
          <el-col :span="7">
            支付方式
            <font
              style="margin-left: 10px;"
              color="red"
              v-if="(payForm.amountReceivable - detailForm.advance) < 0"
            >退款</font>
          </el-col>
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
    <!-- 议价 -->
    <el-dialog
      :title="yijia_SP.yijia_name"
      :visible.sync="yijialist"
      center
      width="30%"
      :modal="false"
    >
      <el-row>
        <el-col :span="24">
          <div class="grid-content bg-purple-dark yipic">
            原价：
            <span style="color: rgba(255,62,42,1);
">{{yijia_SP.yijia_pic}}</span>
          </div>
        </el-col>
      </el-row>
      <el-form ref="form" :model="yijia_SP" label-width="80px">
        <el-form-item label="议价">
          <el-input v-model="yijia_SP.talkPrice"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="yijialist = false">取 消</el-button>
        <el-button type="success" @click="yijia_FS">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 议价 -->
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
  queryAllSupplierByGid,
  askPriceList,
  pcaskPriceList,
  pcpurOrder,
  systemReco,
  getAllPartTown,
  querySupplierByGid,
  askPricePull,
  unAskPriceList,
  talkPrice,
  queryAdvanceDetail,
  payOrderAdvance,
  refundOrderAdvance,
  findAllSellMan,
  saveBaseIno,
  carNoSearch,
  CSinit,
  checkOrderUnfinish,
  rollbackAskPrice
} from "../../request/api.js";
import moment from "moment";
import router from "../../router";
export default {
  name: "order",
  data() {
    return {
      checkedAll: false,
      radio: 3,
      configuration_c: false,
      max: [],
      yufuName: "",
      Townlist: [],
      isMy: false,
      oid: null,
      Noquotation: [], //未报价列表
      checked: [], //选择我的商家
      systemRecoList: [], //汽配商列表
      systemRecoList2: [], //配件列表
      tableData2: [], //配件清单
      seekgysname: "", //搜索供应商
      partList: [], //询价数据
      supplierlist: [], //供应商列表
      lensg: null,
      show: false,
      configuration: false, //询价弹窗
      innerVisible: false, //询价弹窗内层
      innerVisible2: false, //询价弹窗内层再内窗
      PjVisibleL: false, //询价配件弹窗
      radioID: [],
      ceshi: [],
      askPriceId: "",
      chejia_list: [],
      askPricePartIds: [],
      tableData: [],
      PriceList: [], //商家报价，商家模式
      showlist: true,
      editFormStatus: false,
      dispose: ["配件模式", "商家模式", "未报价"],
      orderList: ["在厂全部", "报价", "施工", "质检", "出厂", "历史"],
      orderNavActive: 0,
      switchActive: 0,
      switchActive2: 1,
      value1: "",
      yijialist: false, //议价弹窗
      yijia_SP: {
        talkPrice: ""
      },
      maxHeight: undefined,
      xunjialist: {},
      search: {
        time: [],
        times: [],
        text1: "",
        text2: "",
        text3: ""
      },
      pageLength: null,
      XinzenVisible: false,

      size: 10,
      page: 0,
      gid: localStorage.getItem("gid"),
      title: "蒙B99999",
      payVisible: false,
      payForm: {},
      discountVisible: false,
      discountForm: {},
      yufuVisible: false,
      yufuForm: {},
      paymentVisible: false,
      carNoname: "",
      yufu_type: "",
      yufu_amount: "",
      paymentData: [
        { type: 0, name: "现金" },
        { type: 1, name: "支付宝" },
        { type: 2, name: "微信" },
        { type: 3, name: "银行卡" },
        { type: 4, name: "直赔到店" },
        { type: 5, name: "挂帐" }
      ],
      paymentData2: [
        { type: 0, name: "现金" },
        { type: 1, name: "支付宝" },
        { type: 2, name: "微信" },
        { type: 3, name: "银行卡" },
        { type: 4, name: "直赔到店" }
      ],
      detailForm: {},

      values: "",
      input3: "",
      visible: false,
      width: 600,
      height: 300,
      Car_list: {},
      list_car: []
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
    //退回重报
    TuihuiClick(e){
      let data ={
        supplierId:e[0][0].supplierId,
        oid:this.oid
      }
            let tishi = e[0][0].supplierName+"的报价确定要退回重报价吗？";
      this.$confirm(tishi, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        rollbackAskPrice(data).then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "退回重报价成功!"
            });
            this.editRow()
            // this.editFormStatus = false;
          }
        });
      });
    },
    // 订单开单
    KaidanClick() {
      let res = /^(([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z](([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领][A-Z][A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳使领]))$/;
      var input = this.input3.toUpperCase(); //转大写
      if (res.test(input)) {
        // checkOrderUnfinish({ carNo: input }).then(res => {
        //   console.log(res.data)
        // });
        CSinit({ carNo: input }).then(res => {
          if (res.data.code == 200) {
            let data = {
              id: res.data.data.id,
              carNo: res.data.data.carNo
            };
            saveBaseIno(data).then(res => {
              if (res.data.code == 200) {
                this.$message({
                  type: "success",
                  message: "开单成功"
                });
                this.XinzenVisible = false;
                this.getOrderListInit();
              }
            });
          }
        });
      } else {
        return this.$message.error("车牌格式有误");
      }
      // this.visible = true;
    },
    handleBlur() {
      this.visible = false;
    },
    //点击搜索车牌
    shousuo_Car() {
      this.Car_list = {};
      if (this.input3 == "") {
        return this.$message.error("请输入车牌号");
      }
      carNoSearch({ carNo: this.input3 }).then(res => {
        if (res.data.code == 200) {
          this.list_car = res.data.data;
          console.log(res.data.data);
        }
      });
      this.visible = true;
    },
    onClickItem(row) {
      this.Car_list = row;
      this.input3 = row.carNo;
      this.visible = false;
    },
    onDblClickSelect(row) {
      // console.log(row);
      this.input3 = row.name;
      this.visible = false;
    },

    // 搜索

    // 新增工单
    XinzengGD() {
      this.input3=""
       this.Car_list = {}
      this.XinzenVisible = true;
    },

    //保存保险信息

    //监听图片上传成功
    handleSuccess(e) {
      // console.log(e.data);
      const picUrl = { picUrl: e.data };
      this.xinzen.orderPictures.push(picUrl);
    },
    //删除上传图片
    handleRemove(file, fileList) {
      const filepath = file.response.data;
      //从pictureList数组中找到对应得索引值
      const i = this.xinzen.orderPictures.findIndex(x => x.picUrl === filepath);
      //调用solice方法删除
      this.xinzen.orderPictures.splice(i, 1);
    },
    //预付款
    delete_project(row, index) {
      this.yufu_amount = ''
      this.yufu_type = ''
      this.payForm.payTypeList = [];
      this.oid = row.oid;
      queryAdvanceDetail({ oid: row.oid }).then(res => {
        if (res.data.code == 200) {
          this.yufuForm = res.data.data;
        }
      });
      this.yufuName = row.carNo + " 预付款";
      // amountReceivable: row.amountReceivable

      this.yufuVisible = true;
      // console.log(row);
    },
    handleCommand(command) {
      // console.log(command);
    },
    //全选
    checkAllHandle(e) {
      this.tableData2.forEach((item, i) => {
        this.tableData2[i].checked = e;
      });
    },

    //议价
    yijia(e) {
      var name = "";
      if (e.partType == 0) {
        name = "原厂件：";
      } else if (e.partType == 1) {
        name = "品牌件：";
      } else if (e.partType == 2) {
        name = "其它件：";
      }
      this.yijia_SP = {
        yijia_name: name + e.partName,
        yijia_pic: e.price,
        yijia_id: e.id
      };

      this.yijialist = true;
    },
    yijia_FS(e) {
      if (this.yijia_SP.talkPrice == undefined) {
        this.$message.error("请输入议价价格！");
        return;
      }
      let data = {
        askPricePartId: this.yijia_SP.yijia_id,
        status: 0,
        talkPrice: this.yijia_SP.talkPrice
      };
      talkPrice(data).then(res => {
        //
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "已发送议价!"
          });
          this.editRow2();
          this.yijialist = false;
        }
      });
    },
    check(e) {
      // console.log(e);
    },
    clickitem(itemd) {
      this.PriceList.map((c, i) => {
        c.askPricePartDOS.map((c, i) => {
          itemd === c.number ? (c.number = "") : (c.number = itemd);
        });
      });
    },
    Clickinquiry() {
      this.systemRecoList = [];
      var arr = this.supplierlist.filter(item => item.checked === true);
      if (arr.length > 6) {
        this.$message({
          showClose: true,
          message: "最多选择6家供应商~",
          type: "error"
        });
        return;
      }
      for (var i in this.supplierlist) {
        let list = {
          address: this.supplierlist[i].address,
          businessScope: this.supplierlist[i].businessScope,
          companyName: this.supplierlist[i].supplierName,
          gid: this.gid,
          id: this.supplierlist[i].id,
          manageRemark: this.supplierlist[i].scope,
          motorPartsTown: this.supplierlist[i].motorPartsTown,
          phone: this.supplierlist[i].phone,
          type: this.supplierlist[i].type
        };
        if (this.supplierlist[i].checked == true) {
          this.systemRecoList.push(list);
        }
      }
      this.innerVisible = false;
    },
    Clicktijiao() {
      this.systemRecoList2 = [];

      for (var i in this.tableData2) {
        let list = {
          partCount: this.tableData2[i].counts,
          partId: this.tableData2[i].partId,
          partName: this.tableData2[i].partName,
          partPicUrl: this.tableData2[i].imageUrl,
          remark: this.tableData2[i].partRemark,
          seq: 0
        };
        if (this.tableData2[i].checked == true) {
          this.systemRecoList2.push(list);
        }
      }
      this.configuration_c = false;
      // console.log(this.systemRecoList2);
    },
    //点击询价
    enquiry(row) {
      this.systemRecoList = [];
      this.systemRecoList2 = [];
      this.tableData2 = [];
      this.oid = row.oid;
      const data = {
        oid: this.oid
      };
      getOrderListX(data).then(res => {
        this.chejia_list = res.data.data;
        if (res.data.data.orderPictureList.length > 1) {
          this.xunjialist.carPicUrl = res.data.data.orderPictureList[0].picUrl;
        }
        this.xunjialist = {
          carModel: res.data.data.standard,
          carVin: res.data.data.vin,
          gid: res.data.data.gid,
          oid: res.data.data.oid,
          partTotalCount: res.data.data.partTotalCount,
          status: 0
        };
        var tableData1 = res.data.data.orderItemList;
        tableData1.forEach((item, index) => {
          item.orderPartList.forEach((items, indexs) => {
            this.tableData2.push(items);
            this.tableData2.map((c, i) => {
              this.$set(c, "checked", false);
            });
          });
        });
      });
      //  console.log(tableData1);
      this.configuration = true;
    },

    //确定选择汽配城
    qipeicheng() {
      const data = {
        gid: this.gid,
        isMy: this.isMy,
        partTownId: this.switchActive2,
        page: 0,
        size: 999
      };
      querySupplierByGid(data).then(res => {
        this.supplierlist = res.data.data;
        this.supplierlist.map((c, i) => {
          this.$set(c, "checked", false);
        });
      });
      this.innerVisible2 = false;
    },
    //点击选择配件
    Pjclick() {
      this.checkedAll = false;
      // this.tableData2 = [];
      // const data = {
      //   oid: this.oid
      // };
      // getOrderListX(data).then(res => {
      //   // console.log(res.data.data);
      //   if (res.data.data.orderPictureList.length > 1) {
      //     this.xunjialist.carPicUrl = res.data.data.orderPictureList[0].picUrl;
      //   }
      //   this.xunjialist = {
      //     carModel: res.data.data.standard,
      //     carVin: res.data.data.vin,
      //     gid: res.data.data.gid,
      //     oid: res.data.data.oid,
      //     partTotalCount: res.data.data.partTotalCount,
      //     status: 0
      //   };
      //   var tableData1 = res.data.data.orderItemList;
      //   tableData1.forEach((item, index) => {
      //     item.orderPartList.forEach((items, indexs) => {
      //       this.tableData2.push(items);
      //       this.tableData2.map((c, i) => {
      //         this.$set(c, "checked", false);
      //       });
      //     });
      //   });
      // });
      // console.log(this.tableData2);
      this.configuration_c = true;
    },
    //点击选择供应商
    choose() {
      const data = {
        gid: this.gid,
        isMy: this.isMy,
        page: 0,
        size: 999
      };
      querySupplierByGid(data).then(res => {
        this.supplierlist = res.data.data;
        this.supplierlist.map((c, i) => {
          this.$set(c, "checked", false);
        });
        // console.log(this.supplierlist);
      });

      this.innerVisible = true;
    },
    //搜索供应商名字查找
    seeksupplier() {
      const data = {
        gid: this.gid,
        page: 0,
        size: 999,
        standard: this.seekgysname
      };
      querySupplierByGid(data).then(res => {
        // console.log(res.data.data);
        this.supplierlist = res.data.data;
        this.supplierlist.map((c, i) => {
          this.$set(c, "checked", false);
        });
      });
    },
    //点击切换选择汽配商
    switTown(i) {
      // console.log(i);
      this.switchActive2 = i;
    },
    //点击单选框
    getValue(i) {
      // console.log(i);
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
      // console.log(data);
      let tishi = "确认生成订货单？";
      this.$confirm(tishi, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        pcpurOrder(data).then(res => {
          // console.log(res.data);
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
    //点击切换数据
    isMyclck() {
      this.isMy = !this.isMy;
    },
    //点击删除当前汽配城数据
    detsupplier(idx) {
      // this.systemRecoList.forEach(function(i, index) {
      this.systemRecoList.splice(idx, 1);
      // });
    },
    //点击删除当前配件列表数据
    detparts(idx) {
      // this.systemRecoList.forEach(function(i, index) {
      this.systemRecoList2.splice(idx, 1);
      // });
    },
    //发起询价
    enquiryPull() {
      var _this = this;
      if (this.chejia_list.vin == null && this.chejia_list.vinPic == null) {
        this.$message.error("请输入17位车架号或提供车架号图片再询价！");
        return;
      }
      if (_this.chejia_list.vinPic == null) {
        if (_this.chejia_list.vin.length < 17) {
          _this.$message.error("请设置17位数的车架号");
          return;
        }
      }

      if (this.systemRecoList2.length < 1) {
        this.$message.error("请选择您要询价的配件");
        return;
      } else if (this.systemRecoList.length < 1) {
        this.$message.error("请选择您要询价的供应商");
        return;
      }
      let data = {
        askPricePart4GarageDTOList: this.systemRecoList2,
        carModel: this.xunjialist.standard,
        carPicUrl: this.xunjialist.carPicUrl,
        carVin: this.xunjialist.vin,
        gid: this.xunjialist.gid,
        oid: this.xunjialist.oid,
        partTotalCount: this.systemRecoList2.length,
        status: this.xunjialist.status,
        supplierList: this.systemRecoList
      };
      askPricePull(data).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "询价成功!"
          });
          this.configuration = false;
        } else {
          // this.$message.error(res.data.message);
        }
      });
    },
    //系统推荐
    systemReco() {
      const data = {
        gid: this.gid,
        isMy: this.isMy,
        oid: this.oid
      };
      // console.log(data);
      systemReco(data).then(res => {
        console.log(res);
        if (res.data.code == 200) {
          this.systemRecoList = res.data.data;
        }
      });
      console.log(this.systemRecoList);
    },
    //汽配城
    Town() {
      getAllPartTown().then(res => {
        this.Townlist = res.data.data;
        // console.log(res.data.data);
      });
      this.innerVisible2 = true;
    },
    //查看商家报价
    editRow(row) {
      this.ceshi = [];
      // console.log(row);
      this.carNoname = row.carNo;
      this.oid = row.oid;
      var _this = this;
      let listArr = [];
      pcaskPriceList({ oid: row.oid }).then(res => {
        this.PriceList = res.data.data;
        // console.log(res.data.data);
        var result = [];
        this.PriceList.map((v, i) => {
          v.askPricePartDOS.map((c, i) => {
            var r = c.filter(function(s) {
              return s && s.trim();
            });
            // console.log(r);
            c.map((d, i) => {
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
          //  console.log(data);
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
        var shangjia_lis = [];
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
          var cddd = [];
          for (var i = 0; i < el.askPricePartDOS.length; i += 3) {
            cddd.push(el.askPricePartDOS.slice(i, i + 3));
          }
          shangjia_lis.push(cddd);
        });
        shangjia_lis.forEach(function(v, index) {
          v.map((j, i) => {
            _this.$set(j, "number2", 1);
            for (var i = 0; i < ceshi.length; i++) {
              //      console.log(v[0].supplierName)
              if (ceshi[i].supplierName == j[0].supplierName) {
                ceshi[i].askPricePartDOS.push(j);
                //   return;
              }
            }
          });
        });

        this.ceshi = ceshi;
        var result = [];
      });

      if (this.switchActive == 2) {
        unAskPriceList({ oid: this.oid }).then(res => {
          this.Noquotation = res.data.data;
          this.Noquotation.forEach(function(el, index) {
            var arr;
            arr = el.askPart.split("|");
            var sl = arr.length - 1;
            _this.$set(el, "askPart2", arr[0]);
            _this.$set(el, "sl", sl);
          });
        });
      }
      this.editFormStatus = true;
    },

    editRow2() {
      this.askPriceId = "";
      var _this = this;
      let listArr = [];
      pcaskPriceList({ oid: this.oid }).then(res => {
        this.PriceList = res.data.data;
        // console.log(res.data.data);
        var result = [];
        this.PriceList.map((v, i) => {
          v.askPricePartDOS.map((c, i) => {
            c.map((d, i) => {
              this.$set(d, "number", 0);
              if (d.supplierId == d.supplierId) {
                result.push(d);
              }
            });
          });
        });
      });
      this.shangjia();
    },

    //商家模式

    shangjia() {
      var _this = this;
      this.ceshi = [];
      askPriceList({ oid: this.oid }).then(res => {
        let listArr = [];
        // console.log(res.data.data);
        res.data.data.map((v, i) => {
          // console.log(v.askPricePartDOList);
          var data = v.askPricePartDOList;
          //  console.log(data);
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
        var shangjia_lis = [];
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
          var cddd = [];
          for (var i = 0; i < el.askPricePartDOS.length; i += 3) {
            cddd.push(el.askPricePartDOS.slice(i, i + 3));
          }
          shangjia_lis.push(cddd);
        });
        shangjia_lis.forEach(function(v, index) {
          v.map((j, i) => {
            _this.$set(j, "number2", 1);
            for (var i = 0; i < ceshi.length; i++) {
              //      console.log(v[0].supplierName)
              if (ceshi[i].supplierName == j[0].supplierName) {
                ceshi[i].askPricePartDOS.push(j);
                //   return;
              }
            }
          });
        });

        this.ceshi = ceshi;
        var result = [];
      });
      if (this.switchActive == 2) {
        unAskPriceList({ oid: this.oid }).then(res => {
          this.Noquotation = res.data.data;
          this.Noquotation.forEach(function(el, index) {
            var arr;
            arr = el.askPart.split("|");
            var sl = arr.length - 1;
            _this.$set(el, "askPart2", arr[0]);
            _this.$set(el, "sl", sl);
          });
        });
      }
    },

    //点击切换退还货
    switchOF(i) {
      // console.log(this.PriceList)
      var _this = this;
      this.switchActive = i;
      if (this.switchActive == 0) {
        this.showlist = true;
      } else if (this.switchActive == 1) {
        this.showlist = false;
      } else if (this.switchActive == 2) {
        unAskPriceList({ oid: this.oid }).then(res => {
          this.Noquotation = res.data.data;
          // console.log(res.data.data);
          this.Noquotation.forEach(function(el, index) {
            var arr;
            arr = el.askPart.split("|");
            var sl = arr.length - 1;
            _this.$set(el, "askPart2", arr[0]);
            _this.$set(el, "sl", sl);
          });
        });
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
      // console.log(item);
      localStorage.setItem("oid", item.oid);
      this.$router.push({
        path: "../home/orderX",
        query: { clerkOrder: item.clerkOrder }
        // name: '../home/orderX
      });
    },
    toOrderX2(row, event, column) {
      // console.log(row);
      localStorage.setItem("oid", row.oid);
      this.$router.push({
        path: "../home/orderX",
        query: { clerkOrder: row.clerkOrder }
        // name: '../home/orderX
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
//  console.log(this.detailForm);
          let receivableItemAmount = 0;
          let receivablePartAmount = 0;
          this.detailForm.orderItemList.forEach(v => {
            receivableItemAmount += v.standPrice * v.counts;
            v.orderPartList.forEach(k => {
              receivablePartAmount += k.price* k.counts;
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
           this.discountCalc();
          this.payVisible = true;
        }
        // console.log(this.payForm);
      });
    },
    //折扣计算
    discountCalc() {
      this.payForm.actualItemAmount = (
        parseFloat(this.payForm.receivableItemAmount) *
        parseFloat(this.payForm.discountItemRate / 10)
      ).toFixed(2);
      this.payForm.actualPartAmount = (
        // parseFloat(this.payForm.receivablePartAmount) *
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
    selectPayment2(event) {
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
    //结算工单
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

        if (
          sumPrice !=
          Math.abs(this.payForm.amountReceivable - this.detailForm.advance)
        ) {
          return this.$message({
            message: "结算金额不等于实收金额，请修改",
            type: "error"
          });
        }
      }

      const data = {
        ...this.payForm,
        discountItemRate: parseFloat(this.payForm.discountItemRate),
        discountPartRate: parseFloat(this.payForm.discountPartRate),
        advance: this.detailForm.advance
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
    //预付款保存
    paySubmit2() {
      var _this = this;
      if (!_this.yufuForm.advanceMoney) {
        // if (this.payForm.amountActual != 0) {
        if (this.yufu_amount == "") {
          return this.$message({
            message: "请输入金额",
            type: "error"
          });
        }
        if (this.yufu_amount == 0) {
          return this.$message({
            message: "输入金额必须大于0",
            type: "error"
          });
        }
        if (this.yufu_type == "") {
          return this.$message({
            message: "请选择支付方式",
            type: "error"
          });
        }
        // }

        const data = {
          oid: this.oid,
          payTypes: {
            amount: _this.yufu_amount,
            billerCustomerId: null,
            type: _this.yufu_type
          }
        };
        payOrderAdvance(data).then(res => {
          if (res.data.code == 200) {
            this.$message({
              type: "success",
              message: "保存成功!"
            });
            this.yufuVisible = false;
            this.payForm.payTypeList = [];
          }
        });
      } else {
        let data = {
          oid: _this.oid,
          payTypes: {
            amount: _this.yufuForm.payTypes.amount,
            billerCustomerId: null,
            type: _this.yufuForm.payTypes.type
          }
        };
        refundOrderAdvance(data).then(res => {
          if (res.data.code == 200) {
            _this.$message({
              type: "success",
              message: "退款成功!"
            });
            _this.yufuVisible = false;
            _this.payForm.payTypeList = [];
          }
        });
      }
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
  height: 50px;
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
  /* margin-top: 10px; */
  overflow: hidden;
  width: 100%;
  line-height: 40px;
  height: 40px;
  background: #f2f2f2;
  border: 1px solid #dcdfe6;
}
.tbcd table:nth-child(n + 1) {
  border-top: none;
}
table {
  width: 100%;
  border: 1px solid #dcdfe6;
}
.xuhao div {
  text-align: center;
  float: left;
}
.xuhao .xu1 {
  width: 4%;
}
.xuhao .xu2 {
  width: 15%;
}
.xuhao .xu3 {
  width: 10%;
}
.xuhao .xu4 {
  width: 10%;
}
.xuhao .xu5 {
  width: 15%;
}
.xuhao .xu6 {
  width: 15%;
}
.xuhao .xu7 {
  width: 25%;
}
.xuhao .xu8 {
  width: 10%;
}
.sdx{
  float: left;
}
.tbbd tr td {
  text-align: center;
}
.tbbd tr td div {
  height: 35px;
  line-height: 35px;
  position: relative;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.gou {
  position: absolute;
  top: 0;
  left: 0;
  margin-top: 8px;
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
  width: 155px;
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
  width: 4%;
}
tr .td2 {
  /* width: 15%; */

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-left: 1px solid #dcdfe6;
  border-right: 1px solid #dcdfe6;
}
tr .td2 div {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
tr .td3 {
  width: 10%;
  border-right: 1px solid #dcdfe6;
}
tr .td4 {
  width: 10%;
  border-right: 1px solid #dcdfe6;
  color: rgba(229, 99, 80, 1);
}
tr .td5 {
  width: 15%;
  border-right: 1px solid #dcdfe6;
}
tr .td6 {
  width: 15%;
  border-right: 1px solid #dcdfe6;
}
tr .td7 {
  width: 25%;
  border-right: 1px solid #dcdfe6;
}
tr .td8 {
  width: 10%;
  border-right: 1px solid #dcdfe6;
}
tr .td9 {
  width: 3%;
}
.el-radio {
  height: 35px;
  display: block;
  line-height: 35px;
  margin-right: 0px;
}
.el-checkbox {
  height: 35px;
  display: block;
  line-height: 35px;
  margin-right: 0px;
}
.xuhao2 {
  overflow: hidden;
  margin-top: 15px;
  width: 100%;
  line-height: 45px;
  height: 45px;
  background: #f2f2f2;
  border: 1px solid #dcdfe6;
  border-bottom: none;
}
.phon {
  display: inline-block;
  width: 150px;
  font-size: 13px;
}
.configlist {
  overflow: hidden;
}
.outlis {
  overflow: hidden;
  height: 34px;
  line-height: 34px;
  padding-top: 3px;
}
.chengde {
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.phin {
  color: #888;
  font-size: 13px;
}
.chengde2 {
  width: 72%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.chek {
  /* margin-left: 95px; */
  width: 25%;
  margin-top: 8px;
}
.cc_img {
  vertical-align: middle;
  height: 50px;
  width: 130px;
}
.lux {
  vertical-align: middle;
  margin-left: 25px;
  position: absolute;
  top: 0;
  left: 0;
  line-height: 80px;

  overflow: hidden;
}

/* .lulux {
  position: absolute;
  top: 0;
  right: 0;
  margin-top: 45px;

  overflow: hidden;
}
.lulu2 {
  font-weight: 500;
  float: right;
  margin-right: 10px;
} */
.cheken {
  margin-left: 10px;
}
.wode {
  height: 15px;
  line-height: 15px !important;
  font-size: 8px !important;
  padding: 0px 3px;
  background: #04b404;
  color: #fff;
  margin-bottom: 5px;
}
.qipeic {
  display: inline-block;
  line-height: 25px;
  margin-left: 9px;
  color: #333;
  margin-top: 5px;
}
.xitong {
  height: 24px;
  line-height: 24px;
  color: #0d906e;
  margin-left: 25px;
  text-align: center;
  border-radius: 7px;
  /* font-weight:bold; */
  font-size: 13px;
  margin-top: 13px;
  width: 65px;
  border: 1px solid #0d906e;
}
.outlis_a {
  height: 20px;
  line-height: 20px;
  color: #999;
}
.sc {
  padding: 0px 5px;
}
.outlis div {
  display: inline-block;
  line-height: 30px;
  overflow: hidden;
}
.outlis_a div {
  font-size: 12px;

  overflow: hidden;
  display: inline-block;
  line-height: 20px;
}
.xialabiao {
  margin-top: 12px;
}
.lines {
  /* border-top: 1px solid #ebeef5; */
  border-bottom: 1px solid #ebeef5;
  height: 50px;
  line-height: 50px;
}
.lines2 {
  border-bottom: 1px solid #ebeef5;
  height: 60px;
  line-height: 50px;
}
.pejx {
  height: 36px;
  width: 40%;
  padding-left: 10px;
  margin-top: 7px;
  line-height: 36px;
  border-left: 5px solid #74a496;
}
.namepes {
  padding-left: 15px;
}
.sdsd {
  margin-top: 8px;
}
.namedelet {
  padding-right: 5px;
  font-size: 12px;
  color: #ffa042;
}
.letz:nth-child(n + 3) {
  margin-top: 10px;
}
.letz {
  font-size: 13px;
}
/* 创建车牌 */
.csxian {
  border: 1px solid #dcdfe6;
  /* border-radius: 4px; */
  border-top: none;

  /* background: #f5f7fa; */
}
.xinxi {
  width: 81px;
  display: inline-block;
  text-align: center;
  background-color: transparent;
  border-left: 1px solid #dcdfe6;
  border-right: 1px solid #dcdfe6;
  color: #606266;
  height: 40px;
  line-height: 40px;
}

.letz_a_A {
  padding-left: 10px;
  width: 49%;
  height: 35px;
  line-height: 35px;
  background: #ffdcb9;
  border-radius: 5px;
  display: inline-block;
  position: relative;
}
.letz_a {
  padding-left: 10px;
  width: 49%;
  height: 35px;
  line-height: 35px;
  background: #f3f3fa;
  border-radius: 5px;
  display: inline-block;
  position: relative;
}
.imgdagou {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 15px;
  height: 12px;
}
.letz_b {
  line-height: 35px;
  width: 49%;
  height: 35px;
  display: inline-block;
}

.queding {
  line-height: 30px;
  text-align: center;
  width: 200px;
  height: 30px;
  border-radius: 15px 15px 15px 15px;
  background: #ff5809;
  color: #fff;
}

.BCc {
  margin-top: 5px;
}
.yipic {
  text-align: center;
  font-size: 16px;
  margin-bottom: 20px;
}
.namelet {
  font-size: 12px;
  margin-right: 15px;
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
}
.sl {
  display: inline-block;
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
/deep/.el-checkbox {
  font-size: 0px;
}
.miaa {
  margin-top: 5px;
  font-weight: 500;
  font-size: 16px;
  margin-right: 8px;
  cursor: pointer;
}
.outbox_d {
  border-top: 5px solid #ebeef5;
  width: 100%;
  height: 300px;
  overflow-y: auto;
}
.outbox_c {
  margin: auto;
  text-align: center;
  width: 100%;
  color: #999;
}
.outbox {
  width: 100%;
  height: 320px;
  overflow-y: auto;
}
.outbox2 {
  width: 100%;
  height: 250px;
  overflow-y: auto;
}
.huadong {
  /* height: 350px; */
  overflow-y: auto;
}
.inputd {
  padding-bottom: 10px;
  border-bottom: 5px solid #ebeef5;
  overflow: hidden;
}
/* .orderTable /deep/ table thead tr th {
  background: #f2f2f2 !important;
  color: #606266;
} */
.shaimg {
  width: 20px;
  height: 20px;
  /* right: ; */
  cursor: pointer;
  margin-right: 8px;
  margin-top: 1px;
}
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
.hhd {
  position: relative;
}
.guanbi {
  position: absolute;
  top: 0;
  right: 0;
  margin-right: 15px;
  margin-top: 15px;
  z-index: 99;
  cursor: pointer;
  /* float: right; */
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
<style>
.redd ::-webkit-scrollbar-thumb {
  background: #f5f7fa !important;
}
.redd table thead tr th {
  background: #f5f7fa !important;
  color: #606266;
  padding: 8px 0;
  /* color: #FF6757; */
}
</style>


