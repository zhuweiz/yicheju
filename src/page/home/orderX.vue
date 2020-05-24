<template>
  <div class="w-100">

    <!-- 新增工单 -->
    <el-dialog :title="xinzen.carNo + '服务单基本信息'" :visible.sync="XinzenVisible" center width="45%" :modal="false">
      <el-form :inline="true" class="demo-form-inline" ref="xinzen">
        <el-row class="bod">
          <el-col :span="9">
            <el-form-item label="业务来源:" class="m-b-0" prop="source">
              <el-select v-model="xinzen.source" placeholder="选填" style="width: 110px;">
                <el-option
                  v-for="item in yewuList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item label="业务员:" class="m-b-0" prop="sellsManId">
              <el-select v-model="xinzen.sellsMan" placeholder="选填" style="width: 110px;">
                <el-option
                  v-for="item in Yewuyuan"
                  :key="item.id"
                  :label="item.realName"
                  :value="item.realName"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="bod">
          <el-col :span="9">
            <el-form-item label="车主名:" class="m-b-0" prop="ownerName">
              <el-input v-model="xinzen.ownerName" placeholder="选填" style="width: 120px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="性 别:" class="m-b-0" prop="sex">
              <el-select v-model="xinzen.sex" placeholder="请选择" style="width: 110px;">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="手机号:" class="m-b-0" prop="phone">
              <el-input v-model="xinzen.phone" placeholder="选填" style="width: 110px;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="bod">
          <el-col :span="9">
            <el-form-item label="行车里程:" class="m-b-0" prop="driveMiles">
              <el-input v-model="xinzen.driveMiles" placeholder="选填" style="width: 120px;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="15">
            <el-form-item label="交车时间:" class="m-b-0" prop="completeTime">
              <el-date-picker
                v-model="xinzen.completeTime"
                clear-icon
                value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd HH:mm:ss"
                type="datetime"
                placeholder="选填"
              ></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row class="bod">
          <el-col :span="24">
            <el-form-item label="车主交代:" class="m-b-0" prop="remark">
              <el-input v-model="xinzen.remark" placeholder="选填" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="bod">
          <el-col :span="24">
            <el-form-item label="事项提醒:" class="m-b-0" prop="description">
              <el-input v-model="xinzen.description" placeholder="选填" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="bod">
          <el-col :span="12">
            <el-form-item label="事故车:" class="m-b-0" prop="radio">
              <el-radio class="left rid" v-model="Baoxian.radio" label="0">是</el-radio>
              <el-radio
                class="left rid"
                style="margin-left: 10px;"
                v-model="Baoxian.radio"
                label="1"
              >否</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="类型:" class="m-b-0" prop="radio2" >
              <el-radio class="left rid" v-model="Baoxian.radio2" :label="0">标的车</el-radio>
              <el-radio
                class="left rid"
                style="margin-left: 10px;"
                v-model="Baoxian.radio2"
                :label="1"
              >三者车</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row class="bod">
          <el-col :span="10">
            <el-form-item label="保险公司:" class="m-b-0" prop="description">
              <el-input  v-model="Baoxian.insureCompanyName" placeholder="选填" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
            <el-form-item label="保单号:" class="m-b-0" prop="description">
              <el-input v-model="Baoxian.insureBillNumber" placeholder="选填" style="width: 100%;"></el-input>
            </el-form-item>
          </el-col>
            <el-col :span="4">
            <el-button size="mini" style="margin-top: 7px;" class="right BCc" @click="BXbaocun">保存</el-button>
          </el-col>
        </el-row>

        <el-row class="bod" style="border:none">
          <el-col :span="24">
            <el-form-item label label-width="120px">
              <div class="yinye">外观留图（最多40张）</div>
              <div class="imggg" v-for="(item,index) in xinzen.orderPictureList" :key="index">
                <el-image 
            class="img_lis"
            :src="item.picUrl" 
            @click="viewPhoto(item.picUrl)">
  </el-image>
                <i class="el-icon-circle-close icode" @click="imgDLT(index)"></i>
                </div>
              <el-upload
              class="sadd"
                multiple
                show-file-list
                ref="uploadImg"
                action="/api/vehicle/file/uploadPicture"
                list-type="picture-card"
                :limit="40"
                :on-remove="handleRemove"
                :on-success="handleSuccess"
              >
              
              <!-- <el-button size="small" type="primary">点击上传</el-button> -->
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="Billing">提交保存</el-button>
      </div>
    </el-dialog>


    <div style="background:rgba(229,246,247,1);padding:0 20px;" >
      <el-row>
        <el-col :xs="24" :md="2"  style="padding:20px 0;width: 9%">
          <h2 class=" f-18" style="color: #0D906E;font-weight: normal;">
            |
            <span style="color:#606266;">{{data.carNo}}</span>
          </h2>
          <P class="bbu" @click="XinzengGD" ><img class="shezhi" src="../../../static/img/xiugai.png" alt=""></p>
        </el-col>
        <el-col :xs="24" :md="4" style="padding:20px 0;width: 14%;">
          <p>车 型：{{data.standard}}</p>
          <p style="margin-top: 25px;">工单号：{{data.billNumber}}</p>
          <!-- <p>客户全称：{{data.ownerName}}</p>
          <p>VIN：{{data.vin}}</p>
          <p>手机号：{{data.phone}}</p>-->
        </el-col>
        <el-col :xs="24" :md="3" style="padding:20px 0;width: 13.5%">
          <p>
            VIN：
            <span style="font-size: 13px;">{{data.vin}}</span>
          </p>
          <p style="margin-top: 25px;">接 车 员：{{clerkOrder}}</p>
          <!-- <p>客户来源：{{data.source}}</p>
          <p>业 务 员：{{data.sellsMan}}</p>
          <p>初定提车：{{data.completeTime}}</p>-->
        </el-col>
        <el-col :xs="24" :md="3" style="padding-left: 20px;margin-top: 20px;width: 10.5%;">
          <!-- v-if="data.insuranceInfoDO" -->
          <p>客户全称：{{data.ownerName}}</p>
          <p style="margin-top: 25px;">业 务 员：{{data.sellsMan}}</p>
          <!-- <p>保单号：{{data.insuranceInfoDO.insureBillNumber}}</p>
          <p>
            类 型：
            <em v-if="data.insuranceInfoDO.type === 0">标的车</em>
            <em v-if="data.insuranceInfoDO.type === 1">三者车</em>
          </p>
          <p>保险公司：{{data.insuranceInfoDO.insureCompanyName}}</p>-->
        </el-col>
        <el-col :xs="24" :md="4" style="padding-left: 20px;margin-top: 20px;width: 14%">
          <!-- v-if="data.insuranceInfoDO" -->
          <p>手 机 号：{{data.phone}}</p>
          <p style="margin-top: 25px;">客户来源：{{data.source}}</p>
          <!-- <p>保单号：{{data.insuranceInfoDO.insureBillNumber}}</p>
          <p>
            类 型：
            <em v-if="data.insuranceInfoDO.type === 0">标的车</em>
            <em v-if="data.insuranceInfoDO.type === 1">三者车</em>
          </p>
          <p>保险公司：{{data.insuranceInfoDO.insureCompanyName}}</p>-->
        </el-col>
        <el-col :xs="24" :md="2" style="padding-left: 20px;margin-top: 20px;position: relative; ">
          <p>
            套餐：
            <span
              class="su"
              style="display: inline-block;margin-top: 0px;line-height: 18px;height: 18px;background: rgb(13, 144, 110);    border-radius: 50px;"
            >{{taocanLength}}</span>
          </p>
          <p style="margin-top: 25px;">
            <span>车架照：</span>
            <el-image
              class="min-width-60 cart-img cc_img"
              :src="data.vinPic"
              alt
              v-if="data.vinPic"
              :preview-src-list="data.vinPic.split(',')"
            ></el-image>
            <el-image
              class="min-width-60 cart-img cc_img"
              src="../../../static/img/chejia.png"
              :preview-src-list="data.vinPic"
              v-else
            ></el-image>
          </p>
          <!-- <el-table
            v-if="this.taocanLength"
            :data="tableData3"
            max-height="120px"
            style="width: 100%"
          >
            <el-table-column :label="'套餐（'+ taocanLength +')'">
              <template slot-scope="scope">{{scope.row.comboName}}</template>
            </el-table-column>
            <el-table-column label="购买日期">
              <template slot-scope="scope">{{scope.row.startDate}}</template>
            </el-table-column>
            <el-table-column label="有效期至">
              <template slot-scope="scope">{{scope.row.endDate}}</template>
            </el-table-column>
          </el-table>-->

          <!-- <span v-else class="abs" style="top:20px;left: 20px; font-size: 16px;width: 100%;">
            套餐：
            <em class="radius" style="background: #0D906E;color: #fff;padding: 0 15px;">0</em>
            <em class="abs" style="top:40px;width:100px;font-size: 16px !important;">暂无套餐</em>
          </span>-->
        </el-col>
        <el-col
          :xs="24"
          :md="7"
          class="text-center rel taocanTable"
          style="font-size: 22px;color: #74A496;float:right;margin-top:15px;"
        >
          <span class="abs" style="top:5px;left: 20px; font-size: 16px;">外观留图</span>
          <span
            class="abs"
            style="top:25px;left: 20px; font-size: 13px;color:#666;"
          >（共{{srcList.length}}张）</span>
          <span class="abs" style="top:50px;left: 23px; font-size: 13px;color:#666;">
            <!-- <el-button
              size="mini"
              style="width: 65px;padding: 7px 0px;"
              @click="royaltyConfim(1, {price: data.amountReceivable})"
            >业务提成</el-button> -->
            <!-- <el-button size="mini" >车辆资料</el-button> -->
            <img src="../../../static/img/carS.png" alt="" class="carSZ" style="width: 60px;" @click="Carziliao">
          </span>
          <!-- <el-image 
								style="width: 100px; height: 100px"
								:src="url" 
								:preview-src-list="srcList">
								<div slot="error" class="image-slot">
									<i class="el-icon-picture-outline"></i>
								</div>
          </el-image>-->
          <el-carousel
            arrow="always"
            :autoplay="false"
            :loop="false"
            :initial-index="1"
            type="card"
            height="70px"
            style="width:80%;float:right;overflow: hidden"
          >
            <el-carousel-item v-for="item in srcList" :key="item">
              <el-image
                @click="viewPhoto(item)"
                style="width: 100px; height: 70px"
                :src="item"
                fit="fit"
              ></el-image>
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </div>
    <!-- 车辆资料 -->
    <el-dialog
      :title="CLzl_list.carNo + '车辆资料'"
      :visible.sync="CLVisible"
      center
      width="45%"
      :modal="false"
    >
      <el-row class="bodv hbz" style="width: 48%;">
        <el-col :span="24">
          门店名称：
          <span style="color: rgb(13, 144, 110);">{{CLzl_list.garageName}}</span>
        </el-col>
      </el-row>
      <el-form :inline="true" class="demo-form-inline dsds" ref="xinzen">
        <div class="CLzl left">
          <el-row class="bodv bodvg" style="  width: 100%;">
            <el-form-item label="车架号:" class="m-b-0" style="width: 70%;">
              <el-input
                v-model="CLzl_list.vin"
                placeholder="请输入"
                style="width: 100%;text-align: right;"
              ></el-input>
            </el-form-item>
             <span class="zzll">照片</span>
              <el-upload
              multiple
            class="avatar-uploader"
            action="/api/vehicle/file/uploadPicture"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
          >
           
            <img v-if="CLzl_list.vinPic" :src="CLzl_list.vinPic" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>

          </el-row>
          <el-row class="bodv">
            <el-form-item label="发动机号:" class="m-b-0" style="width: 100%;">
              <el-input
                v-model="CLzl_list.engineNo"
                placeholder="请输入"
                style="width: 160px; text-align:right; "
              ></el-input>
            </el-form-item>
          </el-row>
          <el-row class="bodv">
            <el-form-item label="车型:" class="m-b-0 cas" style="width: 100%;">
              <!-- <el-input v-model="CLzl_list.standard" placeholder="请输入" style="width: 160px;"></el-input> -->
              <el-cascader
              ref="cascaderAddr"
              @blur="handleAddressFun"
              clearable
               filterable
              v-model="CLzl_list.carSeriesId"
              @change="treeChan"
              :options="car_listname"
              :show-all-levels="false"
            ></el-cascader>
            </el-form-item>
          </el-row>
          <el-row class="bodv">
            <el-form-item label="行驶里程:" class="m-b-0" style="width: 100%;">
              <el-input v-model="CLzl_list.driveMiles" placeholder="请输入" style="width: 160px;"></el-input>
            </el-form-item>
          </el-row>
          <el-row class="bodv">
            <el-form-item label="建议保养时间:" class="m-b-0" style="width: 100%;">
              <el-date-picker
                style="width: 100%;"
                v-model="CLzl_list.suggestMaintenanceDate"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-row>
          <el-row class="bodv">
            <el-form-item label="建议保养里程:" class="m-b-0" style="width: 100%;">
              <el-input
                v-model="CLzl_list.suggestMaintenanceMiles"
                placeholder="请输入"
                style="width: 160px;"
              ></el-input>
            </el-form-item>
          </el-row>
        </div>

        <div class="CLzl right">
          <el-row class="bodv">
            <el-form-item label="投保公司:" class="m-b-0" style="width: 100%;">
              <el-input v-model="CLzl_list.insurance" placeholder="请输入" style="width: 160px;"></el-input>
            </el-form-item>
          </el-row>
          <el-row class="bodv">
            <el-form-item label="保险到期:" class="m-b-0" style="width: 100%;">
              <el-date-picker
                style="width: 100%;"
                v-model="CLzl_list.insuranceExpire"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-row>
          <el-row class="bodv">
            <el-form-item label="年审到期:" class="m-b-0" style="width: 100%;">
              <el-date-picker
                style="width: 100%;"
                v-model="CLzl_list.yearExpire"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </el-row>
          <el-row class="bodv" style="border: none;">
            <el-form-item label="备注:" class="m-b-0" style="width: 100%;">
              <!-- <el-input v-model="CLzl_list.remark" placeholder="请输入" style="width: 160px;"></el-input> -->
            </el-form-item>
            <textarea class="beizhu" v-model="CLzl_list.remark" placeholder="请输入备注" />
          </el-row>
        </div>
      </el-form>
      <el-row class="bodv liutu" style="border:none">
        <el-col :span="24">
          <div class="yinye">外观留图（最多40张）</div>
        <div class="imggg" v-for="(item,index) in CLzl_list.picturesList" :key="index">
                <el-image 
            class="img_lis"
            :src="item.picUrl" 
            @click="viewPhoto(item.picUrl)">
  </el-image>
                <i class="el-icon-circle-close icode" @click="imgDLT2(index)"></i>
                </div>
          <el-upload
            multiple
            show-file-list
            class="sadd"
            ref="uploadImg"
            action="/api/vehicle/file/uploadPicture"
            list-type="picture-card"
            :limit="40"
            :on-remove="handleRemove2"
            :on-success="handleSuccess2"
          >
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button type="success" @click="Carbaocun(CLzl_list)">保 存</el-button>
      </div>
    </el-dialog>
    <div class="p-10" style="border-bottom: 1px solid #EEEEEE;">
      <ul class="left orderUl" style="width: 400px;padding-top: 5px;">
        <li
          :class="index==orderNavActive?'active':''"
          v-for="(item,index) in orderList"
          :key="index"
          @click="orderTab(index)"
        >{{item}}</li>
        <div class="clear"></div>
      </ul>

      <div class="right m-r-20" v-if="orderNavActive == 0">
        <div
          class="left c-p c-9"
          style="width: 106px; height: 42px;line-height: 42px;background: url(../../../static/img/but2.png) no-repeat;background-size: 100% 100%;text-indent: 50px;"
          @click="toPrint()"
        >打印</div>
      </div>
      <div class="right m-r-20" v-if="orderNavActive == 1">
        <div
          class="left c-p c-9"
          style="width: 120px; height: 42px;line-height: 42px;background: url(../../../static/img/but2.png) no-repeat;background-size: 100% 100%;text-indent: 50px;"
          @click="toFilePrint()"
        >打印附件</div>
      </div>
      <div class="right m-r-20" v-if="orderNavActive == 2">
        <div
          class="left c-p c-9"
          style="width: 106px; height: 42px;line-height: 42px;background: url(../../../static/img/but2.png) no-repeat;background-size: 100% 100%;text-indent: 50px;"
          @click="toDamagePrint()"
        >打印</div>
      </div>
      <div class="right m-r-20">
        <div
          class="left c-p c-9"
          style="width: 146px; height: 42px;line-height: 42px;background: url(../../../static/img/but2.png) no-repeat;background-size: 100% 100%;text-indent: 60px;"
          @click="toOrderPrint()"
        >打印派工单</div>
      </div>
      <div
        class="right m-r-20"
        style="padding-top:3px;"
        v-if="orderNavActive == 0 && data.settlementStatus != 1"
      >
        <div class="left c-p c-9 info_btn" @click="saveWorkInfo">保存</div>
      </div>
      <div
        class="right m-r-20"
        style="padding-top:3px;"
        v-if="orderNavActive == 2 && data.settlementStatus != 1"
      >
        <div class="left c-p c-9 info_btn" @click="saveDamageInfo">保存</div>
      </div>
      <div
        class="right m-r-20"
        style="padding-top:3px;"
        v-if="orderNavActive == 2 && data.settlementStatus != 1"
      >
        <div class="left c-p c-9 info_btn" @click="copyInfo">复制到主单</div>
      </div>
      <div class="clear"></div>
    </div>

    <el-row :gutter="10" class="orderTable ded" v-if="orderNavActive == 0">
      <el-col :xs="24" :md="8">
        <h2
          class="f-18 p-tb-10"
          style="width: 130px;color: #0D906E;font-weight: normal;float:left;"
        >| 项目工时清单</h2>
        <div class="su" style="display: inline-block" v-if="tableData1">{{tableData1.length}}</div>
        <el-button
          type="text"
          icon="el-icon-plus"
          style="float:right;color:#000;"
          @click="addProjectDialog"
          v-if="data.settlementStatus != 1"
        >新增项目</el-button>
        <el-table :data="tableData1" :height="tableHeight" class="ddd" style="width: 100%">
          <el-table-column prop="date" label="序号" type="index" width="50"></el-table-column>
          <el-table-column label="操作" width="100">
            <template slot-scope="scope">
              <el-dropdown
                trigger="click"
                @command="handleCommand"
                v-if="data.settlementStatus != 1"
              >
                <el-button plain size="small">
                  操作
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item :command="{type: 'send_work', params: scope.row}">派工</el-dropdown-item>
                  <el-dropdown-item
                    :command="{type: 'add_parts', params: scope.row, index: scope.$index}"
                  >新增配件</el-dropdown-item>
                  <el-dropdown-item :command="{type: 'edit_project', params: scope.row}">编辑项目</el-dropdown-item>
                  <el-dropdown-item
                    :command="{type: 'delete_project', params: scope.row, index: scope.$index}"
                  >删除项目</el-dropdown-item>
                  <el-dropdown-item
                    :command="{type: 'royalty', params: scope.row, index: scope.$index}"
                  >提成设置</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <!-- <el-table-column label width="60">
            <template slot-scope="scope" v-if="scope.row.ciId">
              <el-tag type="danger" effect="dark">套餐</el-tag>
            </template>
          </el-table-column>-->
          <el-table-column prop="name" width="170" label="项目名称">
            <template slot-scope="scope">{{scope.row.itemName}}</template>
          </el-table-column>
          <el-table-column prop="standPrice" label="单价">
            <template slot-scope="scope">{{scope.row.standPrice}}</template>
          </el-table-column>
          <el-table-column prop="counts" label="数量">
            <template slot-scope="scope">{{scope.row.counts}}</template>
          </el-table-column>
          <!-- <el-table-column prop="percentage" label="提成">
            <template slot-scope="scope">{{scope.row.percentage}}</template>
          </el-table-column>-->
        </el-table>
      </el-col>
      <el-col :xs="24" :md="16">
        <h2
          class="f-18 p-tb-10"
          style="width: 100px;color: #0D906E;font-weight: normal;float:left;"
        >| 配件清单</h2>
        <div class="su" style="display: inline-block" v-if="tableData2">{{tableData2.length}}</div>
        <el-table :data="tableData2" :height="tableHeight" style="width: 100%">
          <el-table-column prop="date" label="序号" type="index" width="80"></el-table-column>
          <el-table-column align="center" label="操作" width="100">
            <template slot-scope="scope">
              <el-dropdown
                trigger="click"
                @command="handleCommand"
                v-if="data.settlementStatus != 1"
              >
                <el-button plain size="small">
                  操作
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item @click.native="royaltyConfim(3,scope.row)">提成</el-dropdown-item>
                  <el-dropdown-item @click.native="editParts(scope.row)">编辑配件</el-dropdown-item>
                  <el-dropdown-item @click.native="deleteParts(scope.row, scope.$index)">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
          <el-table-column prop="name" width="170" label="配件名称">
            <template slot-scope="scope">{{scope.row.partName}}</template>
          </el-table-column>
          <el-table-column prop="name" label="照片">
            <template slot-scope="scope">
              <el-button
                type="text"
                style="color:#0d906e;"
                @click="viewPhoto(scope.row.imageUrl)"
              >查看</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="来源">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.source == 0" type="danger">库存</el-tag>
              <el-tag v-if="scope.row.source == 1">询价</el-tag>
              <el-tag v-if="scope.row.source == 2" type="info">外购</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="address" label="规格型号">
            <template slot-scope="scope">{{scope.row.unit}}</template>
          </el-table-column>
          <el-table-column prop="address" label="数量">
            <template slot-scope="scope">{{scope.row.counts}}</template>
          </el-table-column>
          <el-table-column prop="address" label="进价">
            <template slot-scope="scope">{{scope.row.inPrice}}</template>
          </el-table-column>
          <el-table-column prop="address" label="售价">
            <template slot-scope="scope">{{scope.row.price}}</template>
          </el-table-column>
          <el-table-column prop="address" label="金额">
            <template slot-scope="scope">{{scope.row.price * scope.row.counts}}</template>
          </el-table-column>
          <el-table-column prop="itemName" label="项目名称"></el-table-column>
          <!-- <el-table-column prop="percentage" label="提成"></el-table-column> -->

          <!-- <template slot-scope="scope">
              <el-button
                size="small"
                plain
                @click="royaltyConfim(3,scope.row)"
                v-if="data.settlementStatus != 1"
              >提成</el-button>
              <el-button
                size="small"
                plain
                @click="editParts(scope.row)"
                v-if="data.settlementStatus != 1"
              >编辑</el-button>
              <el-button
                type="danger"
                size="small"
                @click="deleteParts(scope.row, scope.$index)"
                v-if="data.settlementStatus != 1"
              >删除</el-button>
          </template>-->
        </el-table>
      </el-col>
    </el-row>

    <el-row :gutter="10" class="orderTable" v-if="orderNavActive == 1">
      <el-col :xs="24" :md="8">
        <h2
          class="f-18 p-tb-10"
          style="width: 150px;color: #0D906E;font-weight: normal;float:left;"
        >| 项目工时清单</h2>
        <el-table :data="tableData4" :max-height="maxHeight" style="width: 100%">
          <el-table-column prop="date" label="序号" type="index" width="80"></el-table-column>
          <el-table-column prop="name" label="项目名称">
            <template slot-scope="scope">{{scope.row.item}}</template>
          </el-table-column>
          <el-table-column prop="address" label="金额">
            <template slot-scope="scope">{{scope.row.standPrice}}</template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :xs="24" :md="16">
        <h2
          class="f-18 p-tb-10"
          style="width: 150px;color: #0D906E;font-weight: normal;float:left;"
        >| 配件清单</h2>
        <el-table :data="tableData5" :max-height="maxHeight" style="width: 100%">
          <el-table-column prop="date" label="序号" type="index" width="80"></el-table-column>
          <el-table-column prop="name" label="配件名称">
            <template slot-scope="scope">{{scope.row.partName}}</template>
          </el-table-column>

          <el-table-column prop="address" label="数量">
            <template slot-scope="scope">{{scope.row.total}}</template>
          </el-table-column>
          <el-table-column prop="address" label="单价">
            <template slot-scope="scope">{{scope.row.sellPrice}}</template>
          </el-table-column>
          <el-table-column prop="address" label="金额">
            <template slot-scope="scope">{{scope.row.sellPrice * scope.row.total}}</template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>

    <el-row :gutter="10" class="orderTable" v-if="orderNavActive == 2">
      <el-col :xs="24" :md="8">
        <h2
          class="f-18 p-tb-10"
          style="width: 150px;color: #0D906E;font-weight: normal;float:left;"
        >| 项目清单</h2>
        <el-button
          type="text"
          icon="el-icon-plus"
          style="float:right;color:#000;"
          @click="addLossProjectDialog"
          v-if="data.settlementStatus != 1"
        >新增项目</el-button>
        <el-table :data="projectList1" :max-height="maxHeight" style="width: 100%">
          <el-table-column prop="date" label="序号" type="index" width="80"></el-table-column>
          <el-table-column prop="name" label="拆装">
            <template slot-scope="scope">{{scope.row.itemName}}</template>
          </el-table-column>
        </el-table>
        <el-table :data="projectList2" :max-height="maxHeight" style="width: 100%">
          <el-table-column prop="date" label="序号" type="index" width="80"></el-table-column>
          <el-table-column prop="name" label="钣金">
            <template slot-scope="scope">{{scope.row.itemName}}</template>
          </el-table-column>
        </el-table>
        <el-table :data="projectList3" :max-height="maxHeight" style="width: 100%">
          <el-table-column prop="date" label="序号" type="index" width="80"></el-table-column>
          <el-table-column prop="name" label="喷漆">
            <template slot-scope="scope">{{scope.row.itemName}}</template>
          </el-table-column>
        </el-table>
        <el-table :data="projectList4" :max-height="maxHeight" style="width: 100%">
          <el-table-column prop="date" label="序号" type="index" width="80"></el-table-column>
          <el-table-column prop="name" label="机修">
            <template slot-scope="scope">{{scope.row.itemName}}</template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :xs="24" :md="16">
        <h2
          class="f-18 p-tb-10"
          style="width: 150px;color: #0D906E;font-weight: normal;float:left;"
        >| 配件清单</h2>
        <el-button
          type="text"
          icon="el-icon-plus"
          style="float:right;color:#000;"
          @click="addLossPartsDialog"
          v-if="data.settlementStatus != 1"
        >新增配件</el-button>
        <el-table :data="partsList" :max-height="maxHeight" style="width: 100%">
          <el-table-column prop="date" label="序号" type="index" width="80"></el-table-column>
          <el-table-column prop="name" label="配件名称">
            <template slot-scope="scope">{{scope.row.itemName}}</template>
          </el-table-column>
          <el-table-column prop="address" label="数量">
            <template slot-scope="scope">{{scope.row.counts}}</template>
          </el-table-column>
          <el-table-column prop="address" label="单价">
            <template slot-scope="scope">{{scope.row.price}}</template>
          </el-table-column>
          <el-table-column prop="address" label="金额">
            <template slot-scope="scope">{{scope.row.price * scope.row.counts}}</template>
          </el-table-column>
          <!--<el-table-column
			        prop="address"
			        type="index"
			        label="项目序号">
          </el-table-column>-->
        </el-table>
      </el-col>
    </el-row>

    <p class="p-tb-20 orderXHeji">
      <em>项目：{{data.receivableItemAmount}}</em>
      <i>|</i>
      <em>配件：{{data.receivablePartAmount}}</em>
      <i>|</i>
      <em>工单合计：{{data.amountReceivable}}</em>
      <i>|</i>
      <em>折让：{{data.amountActual ? (data.amountReceivable - data.amountActual).toFixed(2) : 0}}</em>
      <i>|</i>
      <em>利润：{{lirun}}</em>
      <i>|</i>
      <em>提成：{{data.totalPercentage}}（业务：{{data.orderPercentage}} 工时：{{data.itemPercentage}} 配件：{{data.partPercentage}}）</em>
    </p>

    <el-dialog title="查看照片" :visible.sync="visible.photoVisible" width="30%" center :modal="false">
      <span>
        <el-image style="width: 100%;margin:0 auto; " :src="photoUrl" fit="fill"></el-image>
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="visible.photoVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <div class="addProject">
      <el-dialog
        title="添加项目"
        :visible.sync="visible.addProjectVisible"
        width="35%"
        center
        :modal="false"
        :show-close="false"
      >
        <span style="position:relative;top:-60px;right:-80%;">
          <el-button plain style="color:0d906e;" @click="selectMeal">套餐选择</el-button>
        </span>
        <div style="width:100%;position:relative;top:-44px;">
          <div class="lines">
            <!-- projectSearch -->
            <el-input
              v-model="createProjectForm.item"
              prefix-icon="el-icon-search"
              placeholder="请输入项目"
              style="width:78%;"
              @keyup.enter.native="createProject"
            ></el-input>
            <el-button type="danger" style="margin-left:10px;" @click="createProject">创建项目</el-button>
          </div>
          <div class="lines">
            <el-table
              ref="productTable"
              :data="projectList"
              tooltip-effect="dark"
              :show-header="false"
              style="width: 100%"
              :height="500"
              max-height="250"
              @selection-change="selectProject"
            >
              <el-table-column prop="item" label></el-table-column>
              <el-table-column prop="standPrice" label></el-table-column>
              <el-table-column type="selection" width="50"></el-table-column>
            </el-table>
          </div>

          <div class="lines">
            <h2>已选项目：{{selectProjectList.length}}个</h2>
            <el-table
              :data="selectProjectList"
              tooltip-effect="dark"
              :show-header="false"
              style="width: 100%"
              max-height="250"
            >
              <el-table-column prop="item" label></el-table-column>
              <el-table-column prop label="单价">
                <template slot-scope="scope">
                  单价
                  <el-input v-model="scope.row.standPrice" placeholder style="width: 60px;"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop label="单价">
                <template slot-scope="scope">
                  数量
                  <el-input v-model="scope.row.counts" placeholder style="width: 60px;"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop>
                <template slot-scope="scope">
                  <el-select v-model="scope.row.groupName">
                    <el-option
                      v-for="item in optionsname"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </template>
              </el-table-column>

              <el-table-column label="操作" width="50">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRow(scope.$index, scope.row)"
                    type="text"
                    size="small"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="visible.addProjectVisible = false">取 消</el-button>
          <el-button type="success" @click="addProjectSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <el-dialog title="选择套餐项目" :visible.sync="visible.mealVisible" center :modal="false">
      <el-table
        :data="tableData3[0] ? tableData3[0].comboItemList : []"
        @selection-change="selectMealProject"
      >
        <el-table-column label="名称">
          <template slot-scope="scope">{{ tableData3[0].comboName}}</template>
        </el-table-column>
        <el-table-column label="日期">
          <template slot-scope="scope">{{ tableData3[0].startDate}}</template>
        </el-table-column>
        <el-table-column label="有效期">
          <template slot-scope="scope">{{ tableData3[0].endDate}}</template>
        </el-table-column>
        <el-table-column property="itemName" label="项目名称"></el-table-column>
        <el-table-column property="totalTimes" label="包含次数"></el-table-column>
        <el-table-column property="surplusTimes" label="剩余次数"></el-table-column>
        <el-table-column type="selection" width="50"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="visible.mealVisible = false">取 消</el-button>
        <el-button type="success" @click="mealSubmit">提 交</el-button>
      </div>
    </el-dialog>

    <!-- <el-dialog title="创建新项目" :visible.sync="visible.createProjectVisible" center width="30%" :modal="false">
				<el-form :model="createProjectForm">
					<el-form-item label="项目名称" label-width="100px">
						<el-input v-model="createProjectForm.item"></el-input>
					</el-form-item>
					<el-form-item label="项目价格" label-width="100px">
						<el-input v-model.number="createProjectForm.standPrice"></el-input>
					</el-form-item>
				</el-form>
				<div slot="footer" class="dialog-footer">
					<el-button type="danger" @click="visible.createProjectVisible = false">取 消</el-button>
					<el-button type="success" @click="createProjectSubmit">提 交</el-button>
				</div>
    </el-dialog>-->

    <el-dialog title="派工" :visible.sync="visible.deliverVisible" center :modal="false" width="40%">
      <el-checkbox-group v-model="deliverCheck">
        <el-card
          class="box-card"
          style="margin-top:10px;"
          v-for="item in workList"
          :key="item.groupId"
        >
          <div slot="header" class="clearfix">
            <span>{{item.groupName}}</span>
          </div>
          <el-row :gutter="20">
            <el-col :span="6" v-for="v in item.data" :key="v.workerId">
              <el-checkbox :label="v">{{v.workerName+' '+v.taskCount+'个任务'}}</el-checkbox>
            </el-col>
          </el-row>
        </el-card>
      </el-checkbox-group>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="visible.deliverVisible = false">取 消</el-button>
        <el-button type="success" @click="deliverSubmit">提 交</el-button>
      </div>
    </el-dialog>

    <div class="addProject">
      <el-dialog
        title="添加配件"
        :visible.sync="visible.addPartsVisible"
        width="35%"
        center
        :modal="false"
        :show-close="false"
      >
        <!-- 批量添加 -->
        <el-dialog title="批量添加配件" :visible.sync="piliang" width="40%" center append-to-body>
          <div class="lulux">
            <el-button size="mini" class="jx" type="success" @click="jiexi">解析</el-button>
          </div>
          <div class="pilian">
            <el-input
              type="textarea"
              class="pilian"
              :rows="2"
              placeholder="请输入内容"
              v-model="textarea"
            ></el-input>
          </div>
          <el-row>
            <el-col :span="24" class="dll">
              <div class="flll">解析结果共：{{szpeijian.length}}个配件</div>
              <el-button size="mini" class="frrr" type="danger" @click="tijiaopeijian">批量添加</el-button>
            </el-col>
          </el-row>
          <el-row class="deng">
            <el-col :span="4" class="ddv" v-for="(item,index) in szpeijian" :key="'item'+index">
              <div class="grid-content bg-purple cs">{{item.partName}}</div>
            </el-col>
            <!-- <el-col :span="4" class="ddv">
              <div class="grid-content bg-purple-light">2</div>
            </el-col>
            <el-col :span="4" class="ddv">
              <div class="grid-content bg-purple">3</div>
            </el-col>
            <el-col :span="4" class="ddv">
              <div class="grid-content bg-purple-light">4</div>
            </el-col>
            <el-col :span="4" class="ddv">
              <div class="grid-content bg-purple">5</div>
            </el-col>
            <el-col :span="4" class="ddv">
              <div class="grid-content bg-purple-light">6</div>
            </el-col>-->
          </el-row>
        </el-dialog>

        <div class="lulu">
          <el-checkbox class="lulu2" v-model="checked" @change="kucun">从库存录入</el-checkbox>
        </div>
        <div style="width:100%;">
          <div class="lines">
            <!-- partSearch -->
            <el-input
              v-if="source == 0"
              v-model="createPartsForm.partName"
              prefix-icon="el-icon-search"
              placeholder="请输入配件"
              style="width:78%;"
            ></el-input>
            <el-input
              v-if="source == 1"
              v-model="createPartsForm.partName"
              prefix-icon="el-icon-search"
              placeholder="请输入配件"
              @keyup.enter.native="createParts"
              style="width:55%;"
            ></el-input>
            <el-button
              type="danger"
              style="margin-left:10px;"
              @click="createParts"
              v-if="source == 1"
            >创建配件</el-button>
            <el-button type="danger" style="margin-left:10px;" @click="piliang = true">批量添加</el-button>
          </div>
          <div class="lines xund">
            <el-table
              ref="partTable"
              :data="partList"
              tooltip-effect="dark"
              :show-header="false"
              style="width: 100%"
              max-height="250"
              :height="500"
              @selection-change="selectPart"
            >
              <el-table-column label>
                <template slot-scope="scope">{{ scope.row.partName }}</template>
              </el-table-column>
              <el-table-column label>
                <template slot-scope="scope">{{ scope.row.model }}</template>
              </el-table-column>
              <el-table-column prop="sellPrice" label>
                <template >
                  <el-tag type="danger" effect="dark" v-if="source == 0">库</el-tag>
                  <el-tag type="success" v-if="source == 1">询</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="sellPrice" label></el-table-column>
              <el-table-column type="selection" width="50"></el-table-column>
            </el-table>
          </div>

          <div class="lines">
            <h2 @click="ccd">已选配件：{{selectPartList.length}}个</h2>
            <el-table
              :data="selectPartList"
              tooltip-effect="dark"
              :show-header="false"
              style="width: 100%"
              max-height="250"
            >
              <el-table-column label>
                <template slot-scope="scope">{{ scope.row.partName }}</template>
              </el-table-column>
              <el-table-column prop label="单价">
                <template slot-scope="scope">
                  单价
                  <el-input v-model="scope.row.sellPrice" placeholder style="width: 60px;"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop label="单价">
                <template slot-scope="scope">
                  数量
                  <el-input v-model="scope.row.total" placeholder style="width: 60px;"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="50">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteRows(scope.$index, scope.row)"
                    type="text"
                    size="small"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="visible.addPartsVisible = false">取 消</el-button>
          <el-button type="success" @click="addPartsSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- <el-dialog
      title="创建新配件"
      :visible.sync="visible.createPartsVisible"
      center
      width="30%"
      :modal="false"
    >
      <el-form :model="createPartsForm">
        <el-form-item label="配件名称" label-width="100px">
          <el-input v-model="createPartsForm.partName"></el-input>
        </el-form-item>
        <el-form-item label="配件价格" label-width="100px">
          <el-input v-model.number="createPartsForm.sellPrice"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="visible.createPartsVisible = false">取 消</el-button>
        <el-button type="success" @click="createPartsSubmit">提 交</el-button>
      </div>
    </el-dialog>-->

    <el-dialog
      title="编辑项目"
      :visible.sync="visible.editProjectVisible"
      center
      width="30%"
      :modal="false"
    >
      <el-form :model="editProjectForm">
        <el-form-item label="项目" label-width="100px">{{editProjectForm.itemName}}</el-form-item>
        <el-form-item label="工时费" label-width="100px">
          <el-input v-model="editProjectForm.standPrice"></el-input>
        </el-form-item>
        <el-form-item label="项目数量" label-width="100px">
          <el-input v-model.number="editProjectForm.counts"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="visible.editProjectVisible = false">取 消</el-button>
        <el-button type="success" @click="editProjectSubmit">提 交</el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="编辑配件"
      :visible.sync="visible.editPartsVisible"
      center
      width="30%"
      :modal="false"
    >
      <el-form :model="editPartsForm">
        <el-form-item label="配件" label-width="100px">{{editPartsForm.partName}}</el-form-item>
        <el-form-item label="单价" label-width="100px">
          <el-input v-model="editPartsForm.price"></el-input>
        </el-form-item>
        <el-form-item label="数量" label-width="100px">
          <el-input v-model="editPartsForm.counts"></el-input>
        </el-form-item>
        <el-form-item label="工时费" label-width="100px">
          <el-input v-model="editPartsForm.timePrice"></el-input>
        </el-form-item>
        <el-form-item label="进价" label-width="100px">
          <el-input v-model="editPartsForm.inPrice"></el-input>
        </el-form-item>
        <el-form-item label="询价" label-width="100px">
          <el-radio-group v-model="editPartsForm.source" :disabled="editPartsForm.source == 0">
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="visible.editPartsVisible = false">取 消</el-button>
        <el-button type="success" @click="editPartsSubmit">提 交</el-button>
      </div>
    </el-dialog>

    <div class="addProject">
      <el-dialog
        title="添加项目"
        :visible.sync="visible.addLossProjectVisible"
        width="30%"
        center
        :modal="false"
        :show-close="false"
      >
        <div style="width:100%;">
          <div class="lines">
            <!-- lossProjectSearch -->
            <!-- createProjectForm.item -->
            <el-input
              v-model="lossProjectSearch"
              prefix-icon="el-icon-search"
              placeholder="请输入项目"
              style="width:78%;"
            ></el-input>
            <el-button type="danger" style="margin-left:10px;" @click="createProject">创建项目</el-button>
          </div>
          <div class="lines">
            <el-table
              ref="lossProductTable"
              :data="projectList"
              tooltip-effect="dark"
              :show-header="false"
              style="width: 100%"
              max-height="250"
              @selection-change="selectLossProject"
            >
              <el-table-column prop="item" label></el-table-column>
              <el-table-column prop="standPrice" label></el-table-column>
              <el-table-column type="selection" width="50"></el-table-column>
            </el-table>
          </div>

          <div class="lines">
            <h2>已选项目：{{selectLossProjectList.length}}个</h2>
            <el-table
              :data="selectLossProjectList"
              tooltip-effect="dark"
              :show-header="false"
              style="width: 100%"
              max-height="250"
            >
              <el-table-column prop="item" label></el-table-column>
              <el-table-column>
                <template slot-scope="scope">
                  <el-checkbox-group size="small" v-model="scope.row.itemType">
                    <el-checkbox-button
                      v-for="item in prefixItem"
                      :key="item.itemType"
                      :label="item"
                    >{{item.prefixItemName}}</el-checkbox-button>
                  </el-checkbox-group>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="50">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteLossProjectRow(scope.$index, scope.row)"
                    type="text"
                    size="small"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="visible.addLossProjectVisible = false">取 消</el-button>
          <el-button type="success" @click="addLossProjectSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <div class="addProject">
      <el-dialog
        title="添加配件"
        :visible.sync="visible.addLossPartsVisible"
        width="30%"
        center
        :modal="false"
        :show-close="false"
      >
        <div style="width:100%;">
          <div class="lines">
            <el-input
              v-model="lossPartSearch"
              prefix-icon="el-icon-search"
              placeholder="请输入配件"
              style="width:78%;"
            ></el-input>
            <el-button type="danger" style="margin-left:10px;" @click="createParts">创建配件</el-button>
          </div>
          <div class="lines">
            <el-table
              ref="lossPartTable"
              :data="partList"
              tooltip-effect="dark"
              :show-header="false"
              style="width: 100%"
              max-height="250"
              @selection-change="selectLossPart"
            >
              <el-table-column label>
                <template slot-scope="scope">{{ scope.row.partName }}</template>
              </el-table-column>
              <el-table-column prop="sellPrice" label></el-table-column>
              <el-table-column type="selection" width="50"></el-table-column>
            </el-table>
          </div>

          <div class="lines">
            <h2>已选配件：{{selectLossPartList.length}}个</h2>
            <el-table
              :data="selectLossPartList"
              tooltip-effect="dark"
              :show-header="false"
              style="width: 100%"
              max-height="250"
            >
              <el-table-column label>
                <template slot-scope="scope">{{ scope.row.partName }}</template>
              </el-table-column>
              <el-table-column label="操作" width="50">
                <template slot-scope="scope">
                  <el-button
                    @click.native.prevent="deleteLossPartRows(scope.$index, scope.row)"
                    type="text"
                    size="small"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="danger" @click="visible.addLossPartsVisible = false">取 消</el-button>
          <el-button type="success" @click="addLossPartsSubmit">确 定</el-button>
        </span>
      </el-dialog>
    </div>

    <el-dialog
      :title="data.carNo+royaltyInfo.royaltyName + '提成设置'"
      :visible.sync="visible.royaltyVisible"
      center
      width="30%"
      :modal="false"
    >
      <div class="royalty">
        <el-row :gutter="20">
          <el-col :span="5">{{royaltyInfo.name}}</el-col>
          <el-col :span="5" style="text-align:center;">
            <font color="red">￥{{royaltyInfo.price}}</font>
          </el-col>
          <el-col :span="9">
            <el-cascader
              v-model="royaltyInfo.percentageClassId"
              @change="treeChange"
              :options="treeData"
              :show-all-levels="false"
            ></el-cascader>
          </el-col>
          <el-col :span="5" style="text-align:right; cursor: pointer;">
            <div style="color:#0d906e" @click="addPercentage">添加员工</div>
          </el-col>
        </el-row>
      </div>
      <div class="royalty" v-for="(item, index) in royaltyForm.percentages" :key="index">
        <el-row :gutter="20">
          <el-col :span="12">{{item.employeeName}}</el-col>
          <el-col :span="12" style="text-align:right;cursor: pointer;">
            <div @click="deletePercentage(index)">
              <font color="red">删除</font>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="20" type="flex" justify="space-around" align="middle">
          <el-col :span="4">{{royaltyInfo.royaltyName}}提成</el-col>
          <el-col :span="10">
            <el-row type="flex" align="middle">
              <el-col :span="10">
                <el-radio v-model="item.percentageWay" :label="1">百分比</el-radio>
              </el-col>
              <el-col :span="14">
                <el-input v-model="item.percentagePoint">
                  <template slot="append">%</template>
                </el-input>
              </el-col>
            </el-row>
          </el-col>
          <el-col :span="10">
            <el-row type="flex" align="middle">
              <el-col :span="10">
                <el-radio v-model="item.percentageWay" :label="2">固定</el-radio>
              </el-col>
              <el-col :span="14">
                <el-input v-model="item.percentageAmout"></el-input>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="visible.royaltyVisible = false">取 消</el-button>
        <el-button type="success" @click="royaltySubmit">提 交</el-button>
      </div>
    </el-dialog>

    <el-dialog title="选择员工" :visible.sync="visible.userVisible" center :modal="false">
      <el-table :data="userData" @selection-change="selectUser">
        <el-table-column label="序号">
          <template slot-scope="scope">{{ scope.row.id }}</template>
        </el-table-column>
        <el-table-column label="姓名">
          <template slot-scope="scope">{{ scope.row.realName }}</template>
        </el-table-column>
        <el-table-column label="部门">
          <template
            slot-scope="scope"
          >{{ scope.row.groupDutyList ? scope.row.groupDutyList.groupName + scope.row.groupDutyList.dutyName : '' }}</template>
        </el-table-column>
        <el-table-column label="手机">
          <template slot-scope="scope">{{ scope.row.phone }}</template>
        </el-table-column>
        <el-table-column type="selection" width="55"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="danger" @click="visible.userVisible = false">取 消</el-button>
        <el-button type="success" @click="userSubmit">提 交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOrderListX,
  getDamageByOId,
  getProject,
  addProject,
  groupWorksInfo,
  getPart,
  addPart,
  saveWorkInfo,
  saveDamageInfo,
  getAttachmentSettlementedDetailByOId,
  findAllGroupByRole,
  addOrderPercentage,
  getOrderPercentages,
  pageListPC,
  queryPercentageClass,
  getItemPercentage,
  getPartPercentage,
  queryPercentageClassOne,
  getDetails,
  yewulist,
  findAllSellMan,
  saveBaseIno,
  Carupdate,
  Baoxiansave,
  XGcarupdatePart,
  findCarDataList
} from "../../request/api.js";
import moment from "moment";

const unique = function(arr, name) {
  let hash = {};
  return arr.reduce(function(item, next) {
    hash[next[name]] ? "" : (hash[next[name]] = true && item.push(next));
    return item;
  }, []);
};
export default {
  name: "order",
  inject: ["reload"],
  data() {
    return {
      textarea: "",
      szpeijian: [],
      piliang: false,
      pjprice: [],
      treeData: [],
      tableData1: [],
      tableData2: [],
      tableHeight: window.innerHeight - 390,
      tableData3: [
        {
          comboItemList: []
        }
      ],
      taocanLength: null,
      tableData4: [],
      tableData5: [],
      data: "",
      valuename: "",
      optionsname: [
        {
          value: "钣金",
          label: "钣金"
        },
        {
          value: "机修",
          label: "机修"
        },
        {
          value: "喷漆",
          label: "喷漆"
        },
        {
          value: "美容",
          label: "美容"
        }
      ],
      projectList1: [],
      projectList2: [],
      projectList3: [],
      projectList4: [],
      partsList: [],
      orderList: ["主单", "附件", "定损单"],
      orderNavActive: 0,
      prefixItem: [
        {
          itemType: "1",
          prefixItemName: "拆装"
        },
        {
          itemType: "2",
          prefixItemName: "钣金"
        },
        {
          itemType: "3",
          prefixItemName: "喷漆"
        },
        {
          itemType: "4",
          prefixItemName: "机修"
        }
      ],
      value1: "",
      maxHeight: undefined,
      form: {
        name: ""
      },
      zonghe: null,
      lirun: "--",
      url: "",
      srcList: [],
      workList: [],

      visible: {
        photoVisible: false,
        addProjectVisible: false,
        mealVisible: false,
        createProjectVisible: false,
        deliverVisible: false,
        addPartsVisible: false,
        createPartsVisible: false,
        editProjectVisible: false,
        editPartsVisible: false,
        addLossProjectVisible: false,
        addLossPartsVisible: false,
        royaltyVisible: false,
        userVisible: false
      },
      photoUrl: "",
      // projectSearch: '',
      selectPartName: "",
      projectList: [],
      projectLists: [],
      selectProjectList: [],
      selected: [],
      XinzenVisible:false,
      // partSearch: "",
      partList: [],
      partLists: [],
      selectPartList: [],
      selected1: [],

      mealProjectList: {
        comboName: "",
        startDate: "",
        endDate: "",
        list: []
      },
      selectMealProjectList: [],
      createProjectForm: {
        item: "",
        standPrice: "0",
        counts: 1,
        isFactioryName: 1,
        groupId: 975,
        groupName: "备注"
      },
      createPartsForm: {
        partName: "",
        sellPrice: 0,
        total: 1
      },
      editProjectForm: {},
      editPartsForm: {},
      deliverCheck: [],
      itemDispatchId: "",
      itemDispatch: [],
      selectPartItemId: "",
      citemId: "",
      selectLossProjectList: [],
      selected2: [],
      lossProjectSearch: "",
      selectLossPartList: [],
      selected3: [],
      lossPartSearch: "",
      userData: [],
      checked: 0,
      source: 1, //询价 库存
      clerkOrder: "", //接待员
      selectedUser: [],
      royaltyForm: {
        oid: localStorage.getItem("oid"),
        sourceType: 1,
        sourceId: "",
        percentages: []
      },
      royaltyInfo: {
        royaltyName: "业务",
        percentage: {}
      },
      CLVisible: false,
      CLzl_list: {},
      yewuList: [],
      Yewuyuan: [],
      xinzen: {
        
        // carNo: "",
        // source: "",
        // sellsManId: "",
        // ownerName: "",
        // sex: "",
        // phone: "",
        // driveMiles: "",
        // completeTime: "",
        // remark: "",
        // description: "",
        // orderPictures: []
      },
      Baoxian: {
        radio: "1",
        radio2: 0,
        insureCompanyName:'',
        insureBillNumber:''
      },
         car_listname:[],
      options: [
        {
          value: "1",
          label: "男"
        },
        {
          value: "0",
          label: "女"
        }
      ],
    };
  },
  watch: {
    "createProjectForm.item": function() {
      this.projectList = this.projectLists.filter(
        data =>
          !this.createProjectForm.item ||
          data.item
            .toLowerCase()
            .includes(this.createProjectForm.item.toLowerCase())
      );
      // console.log(this.projectList)
      this.autoSelect(this.selectProjectList);
    },
    lossProjectSearch: function() {
      this.projectList = this.projectLists.filter(
        data =>
          !this.lossProjectSearch ||
          data.item.toLowerCase().includes(this.lossProjectSearch.toLowerCase())
      );
      this.autoLossSelect(this.selectLossProjectList);
    },
    "createPartsForm.partName": function() {
      this.partList = this.partLists.filter(
        data =>
          !this.createPartsForm.partName ||
          data.partName
            .toLowerCase()
            .includes(this.createPartsForm.partName.toLowerCase())
      );
      this.autoSelects(this.selectPartList);
    },
    lossPartSearch: function() {
      this.partList = this.partLists.filter(
        data =>
          !this.lossPartSearch ||
          data.partName
            .toLowerCase()
            .includes(this.lossPartSearch.toLowerCase())
      );
      this.autoLossPartSelect(this.selectLossPartList);
    }
  },
  created() {
    queryPercentageClass().then(res => {
      this.treeData = res.data.data.map(v => {
        v.value = v.id;
        v.label = v.className;
        if (v.children)
          v.children.forEach(k => {
            k.label = k.className;
            k.value = k.id;
          });
        return v;
      });
    });
    this.ccd();
  },
  mounted() {
    this.clerkOrder = this.$route.query.clerkOrder;
    // console.log(this.$route.query.clerkOrder)
    this.maxHeight = $(".tabBox").height() - 102 - 86 - 37 - 80 - 60 + "px";
  },
  methods: {
    // 车辆资料
    Carziliao() {
      findCarDataList().then(res => {
      this.car_listname = res.data.data.map(v => {
        v.value = v.brandId;
        v.label = v.brandName;
        
         v.children = v.carSeriesInfoList
        // if (v.carSeriesInfoList)
        v.children.forEach(k => {
            k.label = k.seriesName;
            k.value = k.seriesId;
          });
        return v;
      });
         console.log(this.car_listname)
    });
      getDetails({ carNo: this.data.carNo }).then(res => {
        this.CLzl_list = res.data.data;
        console.log(res.data.data)
        this.CLzl_list.url = JSON.parse(JSON.stringify(this.CLzl_list.picturesList))
      });
      this.CLVisible = true;
    },
    //保存车辆资料
    Carbaocun(row){
        row.picturesList = row.url
      console.log(row);
      Carupdate(row).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "保存成功"
          });
            this.ccd();
          this.CLVisible = false;
        }
           this.$refs.uploadImg.clearFiles();
          
      });
    },
    handleAvatarSuccess(e){
      this.CLzl_list.vinPic = e.data
    },
    //监听图片上传成功
    handleSuccess2(e) {
      // console.log(e.data);
      const picUrl = { 
        picUrl: e.data ,
        carNo:this.CLzl_list.carNo
      };
      this.CLzl_list.url.push(picUrl);
    },
    //删除上传图片
    handleRemove2(file, fileList) {
      const filepath = file.response.data;
      //从pictureList数组中找到对应得索引值
      const i = this.CLzl_list.url.findIndex(x => x.picUrl === filepath);
      //调用solice方法删除
      this.CLzl_list.url.splice(i, 1);
    },


  // 修改工单
     // 新增工单
         //监听图片上传成功
    handleSuccess(e) {
      // console.log(e.data);
      const picUrl = { picUrl: e.data };
      this.xinzen.url.push(picUrl);
    },
    //删除上传图片
    handleRemove(file, fileList) {
      const filepath = file.response.data;
      //从pictureList数组中找到对应得索引值
      const i = this.xinzen.url.findIndex(x => x.picUrl === filepath);
      //调用solice方法删除
      this.xinzen.url.splice(i, 1);
    },
    //点击删除渲染的图片
    imgDLT(idx){
      this.xinzen.orderPictureList.splice(idx,1)
      this.xinzen.url.splice(idx,1)
    },
     //点击删除渲染的图片
    imgDLT2(idx){
      // console.log(this.CLzl_list)
        // console.log( )
     
      this.CLzl_list.picturesList.splice(idx,1)
      this.CLzl_list.url.splice(idx,1)
    },
    XinzengGD() {
    this.xinzen.orderPictureList = []        
     const data = {
        oid: localStorage.getItem("oid")
      };
   getOrderListX(data).then(res => {
        this.xinzen = res.data.data;
        this.xinzen.url = JSON.parse(JSON.stringify(this.xinzen.orderPictureList))
        if(res.data.data.insuranceInfoDO){
          this.Baoxian.radio = '0'
           this.Baoxian.radio2 = res.data.data.insuranceInfoDO.type
           this.Baoxian.insureCompanyName =res.data.data.insuranceInfoDO.insureCompanyName
          this.Baoxian.insureBillNumber =res.data.data.insuranceInfoDO.insureBillNumber
        }else{
          this.Baoxian.radio = '1'
        }
        if(this.xinzen.sex == 0){
          this.xinzen.sex = '女'
        }else{
          this.xinzen.sex = '男'
        }
   })
      yewulist().then(res => {
        if (res.data.code == 200) {
          this.yewuList = res.data.data;
        }
      });
      findAllSellMan().then(res => {
        if (res.data.code == 200) {
          this.Yewuyuan = res.data.data;
        }
      });
      this.XinzenVisible = true;
    },
    //保存保险信息
    BXbaocun() {
      
      // this.$refs.xinzen.resetFields();
      let data ={
        carNo:this.xinzen.carNo,
        gid:this.xinzen.gid,
        // id:this.xinzen.oid,
        insureBillNumber:this.Baoxian.insureBillNumber,
        insureCompanyName:this.Baoxian.insureCompanyName,
        type:this.Baoxian.radio2,
      }
      // console.log(this.xinzen)
      if(this.xinzen.insuranceInfoDO){
      let data2 ={
        carNo:this.xinzen.carNo,
        gid:this.xinzen.gid,
        id:this.xinzen.insuranceInfoDO.id,
        insureBillNumber:this.Baoxian.insureBillNumber,
        insureCompanyName:this.Baoxian.insureCompanyName,
        type:this.Baoxian.radio2,
      }
        XGcarupdatePart(data2).then(res => {
          if(res.data.code == 200){
            this.$message({
              type: 'success',
              message: '修改保险信息成功!'
            })

          }
        })
      }else{
        Baoxiansave(data).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "保存保险信息成功!"
          });
        }
      });
      }
 

    },
    //订单资料保存
    Billing() {
      var xinzen =this.xinzen
      if(this.xinzen.sex == '女'){
          this.xinzen.sex = 0
        }else if(this.xinzen.sex == '男'){
          this.xinzen.sex = 1
        }
      let data ={
    	"advance": xinzen.advance,
      "appearance": xinzen.appearance,
      "carNo": xinzen.carNo,
      "completeTime": xinzen.completeTime,
      "createdBy": xinzen.createdBy,
      "description": xinzen.description,
      "driveMiles": xinzen.driveMiles,
      "gid": xinzen.gid,
      "id": localStorage.getItem("oid"),
      "isVoucher":xinzen.isVoucher,
      "oilRemain":xinzen.oilRemain,
      "orderPictures":xinzen.url,
      "ownerName": xinzen.ownerName,
      "phone": xinzen.phone,
      "picCount": xinzen.picCount,
      "remark": xinzen.remark,
      "sellsMan":xinzen.sellsMan,
      "sellsManId":xinzen.sellsManId,
      "sex": xinzen.sex,
      "signUrl": xinzen.signUrl,
      "source": xinzen.source
      }
      console.log(data);
      saveBaseIno(data).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "保存成功"
          });
          this.ccd();
          this.XinzenVisible = false;
        }
           this.$refs.uploadImg.clearFiles();
      });
    },





    // 解析
    clickjiexi() {
      this.visible.addPartsVisible = false;
      this.piliang = true;
    },
    //解析配件
    jiexi() {
      var _this = this;
      var peijian = this.textarea.trim().split(/\s+/);
      var gid = this.data.gid;
      var pj = [];
      if (peijian == "") {
        return this.$message({ message: "请先输入配件", type: "error" });
      }
      peijian.forEach(function(v, index) {
        pj.push({
          partName: v,
          gid: gid,
          isFactioryPartName: 1,
          sellPrice: 0,
          total: 1
        });
      });
      this.szpeijian = pj;
    },
    tijiaopeijian() {
      if (this.szpeijian.length == 0) {
        return this.$message({ message: "请先输入配件", type: "error" });
      }
      for (const i in this.szpeijian) {
        addPart(this.szpeijian[i]).then(e => {
          if (e.data.code == 200) {
            // this.$message({
            //   message: "创建成功",
            //   type: "success"
            // });
            this.selectPartList.push(e.data.data);
            this.selectPartList.forEach(v => {
              // console.log(v)
              let row = this.tableData2.find(
                k => k.id == v.id && k.itemId == this.selectPartItemId
              );
              if (row) {
                return this.$message({
                  message: `配件${row.partName}已存在`,
                  type: "error"
                });
              }
              v.counts = v.total;
              v.inPrice = v.exceeds;
              v.price = v.sellPrice;
              v.itemId = this.selectPartItemId;
              v.source = v.gid == -99 ? 1 : 0;
              v.partId = v.id;
              v.itemName = this.selectPartName;
              this.tableData2.push(v);
            });

            this.selectPartList = this.selected1 = [];
            this.textarea = "";
            this.piliang = false;
            this.visible.addPartsVisible = false;

            // this.getPart();
            // this.saveWorkInfo();
            // this.reload();
            // console.log(this.selectPartList);
          }
        });
      }

      this.$message({
        message: "添加成功",
        type: "success"
      });
      this.szpeijian = [];
    },
    //库存
    kucun(e) {
      if (e) {
        this.source = 0;
        pageListPC({
          garageId: localStorage.getItem("gid"),
          // itemId: this.citemId,
          source: 0
        }).then(res => {
          this.partList = this.partLists = res.data.data;
        });
      } else {
        this.source = 1;
        pageListPC({
          garageId: localStorage.getItem("gid"),
          // itemId: this.citemId,
          source: 1
        }).then(res => {
          this.partList = this.partLists = res.data.data;
        });
      }
    },
    ccd() {
      const data = {
        oid: localStorage.getItem("oid")
      };
      getOrderListX(data).then(res => {
        this.data = res.data.data;
        this.tableData1 = res.data.data.orderItemList;
          // console.log( res.data.data)

        if (this.tableData1) {
          this.tableData1.forEach((item, index) => {
            item.orderPartList.forEach((items, indexs) => {
              this.zonghe += parseInt(items.inPrice * items.counts);
              items.itemName = item.itemName;
              this.data.receivablePartAmount +=items.price* items.counts;
              this.tableData2.push(items);
              this.pjprice = items;
            });
            
          });
          this.lirun =
            this.data.amountActual -
            (this.data.amountActual - this.data.amountReceivable) -
            this.zonghe;
        }
        this.tableData3 = res.data.data.comboCustomerList;
        this.tableData3.forEach(i => {
          i.startDate = moment(i.startDate).format("YYYY-MM-DD");
          i.endDate = moment(i.startDate).format("YYYY-MM-DD");
        });
        this.taocanLength = this.tableData3.length;

        const imgList = this.data.orderPictureList;
        if (imgList.length > 0) {
          this.url = imgList[0].picUrl;
        }
        this.srcList = imgList.map(v => v.picUrl);
      });
    },
    getProject() {
      getProject().then(res => {
        this.projectList = this.projectLists = res.data.data;
      });
    },
    getPart() {
      pageListPC({
        garageId: localStorage.getItem("gid"),
        // itemId: this.citemId,
        source: this.source
      }).then(res => {
        this.partList = this.partLists = res.data.data;
      });
    },
    getAttachmentSettlementedDetailByOId() {
      getAttachmentSettlementedDetailByOId({
        oid: localStorage.getItem("oid")
      }).then(res => {
        const data = res.data.data;
        this.tableData4 = data.itemList;
        if (this.tableData4) {
          this.tableData4.forEach(v => {
            v.attachmentPartStoreDTOList.forEach(k => {
              this.tableData5.push(k);
            });
          });
        }
      });
    },
    getDamageByOId() {
      getDamageByOId({ oid: localStorage.getItem("oid") }).then(res => {
        const projectList = res.data.data.orderDamageList;
        if (projectList) {
          this.projectList1 = projectList.filter(v => v.itemType == "1");
          this.projectList2 = projectList.filter(v => v.itemType == "2");
          this.projectList3 = projectList.filter(v => v.itemType == "3");
          this.projectList4 = projectList.filter(v => v.itemType == "4");
          this.partsList = projectList.filter(v => v.itemType == "5");
        }
      });
    },
    orderTab(i) {
      if (i == 1) {
        this.getAttachmentSettlementedDetailByOId();
      } else if (i == 2) {
        this.getDamageByOId();
      }
      this.orderNavActive = i;
    },
    toPrint() {
      //    if (this.data.status != 6) {
      //      this.$message({
      //        message: "请先结算订单！",
      //        type: "error"
      //      });
      //      return;
      //    }
      // this.$router.push({
      //   path: "../home/print"
      //   // name: '../home/orderX
      // });

      let routeData = this.$router.resolve({
        path: "../home/print"
      });
      window.open(routeData.href, "_blank");
    },
    toDamagePrint() {
      let routeData = this.$router.resolve({
        path: "../home/damagePrint"
      });
      window.open(routeData.href, "_blank");
    },
    toFilePrint() {
      let routeData = this.$router.resolve({
        path: "../home/filePrint"
      });
      window.open(routeData.href, "_blank");
    },
    toOrderPrint() {
      let routeData = this.$router.resolve({
        path: "../home/orderPrint"
      });
      window.open(routeData.href, "_blank");
    },
    addProjectDialog() {
      if (this.selectProjectList.length == 0) this.getProject();
      this.visible.addProjectVisible = true;
    },
    addPartsDialog() {
      this.visible.addPartsVisible = true;
    },
    handleCommand(command) {
      if (command.type === "royalty") this.royaltyConfim(2, command.params);
      else this[command.type](command.params, command.index);
    },

    handleCommand2(command) {},
    send_work(row) {
      if (this.workList.length == 0) {
        groupWorksInfo({ gid: this.data.gid }).then(res => {
          const arr = res.data.data;
          var map = {},
            dest = [];
          for (var i = 0; i < arr.length; i++) {
            var ai = arr[i];
            if (ai.groupId != null) {
              if (!map[ai.groupName]) {
                dest.push({
                  groupId: ai.groupId,
                  groupName: ai.groupName,
                  data: [ai]
                });
                map[ai.groupName] = ai;
              } else {
                for (var j = 0; j < dest.length; j++) {
                  var dj = dest[j];
                  if (dj.groupName == ai.groupName) {
                    dj.data.push(ai);
                    break;
                  }
                }
              }
            }
          }

          this.itemDispatchId = row.id;
          this.workList = dest;
        });
      } else {
        this.itemDispatchId = row.id;
        this.deliverCheck = this.itemDispatch.filter(
          v => v.itemId == this.itemDispatchId
        );
      }

      this.visible.deliverVisible = true;
    },
    add_parts(params, index) {
      // console.log(params);
      this.citemId = params.itemId;
      if (this.selectPartList.length == 0) this.getPart();
      this.selectPartItemId = params.id;

      this.selectPartName = params.itemName;
      this.visible.addPartsVisible = true;
    },
    edit_project(row) {
      this.editProjectForm = row;
      this.visible.editProjectVisible = true;
    },
    editProjectSubmit() {
      this.editProjectForm.item = this.editProjectForm.itemName;
      this.visible.editProjectVisible = false;
      this.$message({
        message: "编辑成功",
        type: "success"
      });
    },
    delete_project(row, index) {
      this.$confirm(`确认删除项目${row.itemName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tableData2 = this.tableData2.filter(v => v.itemId != row.id);

          this.tableData1.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => console.log("已取消"));
    },
    deliverSubmit() {
      if (this.deliverCheck.length == 0) {
        return this.$message({ message: "请先选择派工人员", type: "error" });
      }
      this.deliverCheck.map(v => {
        const row = this.itemDispatch.find(
          s =>
            s.itemId == this.itemDispatchId &&
            s.groupId == v.groupId &&
            s.workerId == v.workerId
        );
        if (!row) {
          v.jobType = v.type;
          v.itemId = this.itemDispatchId;
          v.gid = this.data.gid;
          v.status = 0;
          v.oid = parseInt(localStorage.getItem("oid"));
          this.itemDispatch.push(v);
        }
      });

      this.deliverCheck = [];
      this.visible.deliverVisible = false;
    },
    viewPhoto(url) {
      this.photoUrl = url;
      this.visible.photoVisible = true;
    },
    selectProject(event) {
      event.map((c, i) => {
        this.$set(c, "counts", 1);
      });
      this.selected = event;
      this.selectProjectList = unique(
        this.selectProjectList.concat(this.selected),
        "id"
      );
      // console.log(event);
    },
    autoSelect(arr) {
      this.$nextTick(() => {
        if (this.projectList !== undefined && arr !== undefined) {
          this.projectList.forEach((v, i) => {
            arr.forEach((_v, _i) => {
              if (v.id === _v.id) {
                this.$refs.productTable.toggleRowSelection(v, true);
              }
            });
          });
        }
      });
    },
    autoSelects(arr) {
      this.$nextTick(() => {
        if (this.partList !== undefined && arr !== undefined) {
          this.partList.forEach((v, i) => {
            arr.forEach((_v, _i) => {
              if (v.id === _v.id) {
                this.$refs.partTable.toggleRowSelection(v, true);
              }
            });
          });
        }
      });
    },
    autoLossSelect(arr) {
      this.$nextTick(() => {
        if (this.projectList !== undefined && arr !== undefined) {
          this.projectList.forEach((v, i) => {
            arr.forEach((_v, _i) => {
              if (v.id === _v.id) {
                this.$refs.lossProductTable.toggleRowSelection(v, true);
              }
            });
          });
        }
      });
    },
    autoLossPartSelect(arr) {
      this.$nextTick(() => {
        if (this.partList !== undefined && arr !== undefined) {
          this.partList.forEach((v, i) => {
            arr.forEach((_v, _i) => {
              if (v.id === _v.id) {
                this.$refs.lossPartTable.toggleRowSelection(v, true);
              }
            });
          });
        }
      });
    },
    deleteRow(index, row) {
      this.selectProjectList.splice(index, 1);
      this.$refs.productTable.toggleRowSelection(row, false);
    },
    deleteRows(index, row) {
      this.selectPartList.splice(index, 1);
      this.$refs.partTable.toggleRowSelection(row, false);
    },

    //添加项目
    createProject() {
      if (this.createProjectForm.item == "") {
        this.$message.error("请输入项目名称");
        return;
      }
      const dto = {
        oid: localStorage.getItem("oid"),
        ...this.createProjectForm
      };
      // console.log(dto);

      addProject(dto).then(e => {
        if (e.data.code == 200) {
          this.$message({
            message: "创建成功",
            type: "success"
          });
          e.data.data["counts"] = "1";
          this.selectProjectList = this.selectProjectList.concat(e.data.data);
          this.getProject();
          this.createProjectForm.item = "";
        }
      });
      this.visible.createProjectVisible = true;
    },
    // 创建新项目
    // createProjectSubmit() {
    // const dto = {
    // 	oid: localStorage.getItem("oid"),
    // 	...this.createProjectForm
    // }
    // addProject(dto).then(e => {
    // 	if(e.data.code == 200){
    // 		this.visible.createProjectVisible = false
    // 		this.$message({
    //           message: "创建成功",
    //           type: "success"
    // 		})
    // 		this.getProject()
    // 	}
    // })
    // },
    //确定选择
    addProjectSubmit() {
      if (this.selectProjectList.length == 0) {
        return this.$message({ message: "请先选择项目", type: "error" });
      }
      // console.log(this.selectProjectList)
      this.selectProjectList.forEach(v => {
        if (this.tableData1 && this.tableData1.length > 0) {
          // let row = this.tableData1.find(k => k.id == v.id);
          let row = this.tableData1.find(k => k.id == v.id);
          if (row) {
            return this.$message({
              message: `项目${row.itemName}已存在`,
              type: "error"
            });
          }
        }
        v.itemName = v.item;
        if (!this.tableData1) this.tableData1 = [];
        this.tableData1.push(v);
        // const index = this.projectList.findIndex(s => s.id = v.id)
        // this.projectList.splice(index, 1)
      });
      // console.log(this.tableData1);
      this.selectProjectList = this.selected = [];
      this.createProjectForm.item = "";
      this.visible.addProjectVisible = false;
    },
    //确定添加配件
    addPartsSubmit() {
      if (this.selectPartList.length == 0) {
        return this.$message({ message: "请先选择配件", type: "error" });
      }
      // console.log(this.selectPartList)
      this.selectPartList.forEach(v => {
        // console.log(v)
        let row = this.tableData2.find(
          k => k.id == v.id && k.itemId == this.selectPartItemId
        );
        if (row) {
          return this.$message({
            message: `配件${row.partName}已存在`,
            type: "error"
          });
        }
        v.counts = v.total;
        v.inPrice = v.exceeds;
        v.price = v.sellPrice;
        v.itemId = this.selectPartItemId;
        v.source = v.gid == -99 ? 1 : 0;
        v.partId = v.id;
        v.itemName = this.selectPartName;
        this.tableData2.push(v);
      });
      this.selectPartList = this.selected1 = [];
      this.createPartsForm.partName = "";

      this.visible.addPartsVisible = false;
      this.saveWorkInfo();
      this.reload();
    },
    selectMealProject(event) {
      this.selectMealProjectList = event;
    },
    selectMeal() {
      this.visible.mealVisible = true;
      this.visible.addProjectVisible = false;
    },
    //创建新配件
    // createPartsSubmit() {
    //   const dto = {
    //     gid: this.data.gid,
    //     isFactioryPartName: 1,
    //     ...this.createPartsForm
    //   };
    //   addPart(dto).then(e => {
    //     if (e.data.code == 200) {
    //       this.$message({
    //         message: "创建成功",
    //         type: "success"
    //       });
    //       this.getPart();
    //     }
    //   });
    // },
    mealSubmit() {
      if (this.selectMealProjectList.length == 0) {
        return this.$message({ message: "请先选择套餐", type: "error" });
      }
      this.selectMealProjectList.forEach(v => {
        v.standPrice = v.perPrice;
        this.tableData1.push(v);
      });
      this.visible.mealVisible = false;
    },
    //直接创建配件啊
    createParts() {
      if (this.createPartsForm.partName == "") {
        this.$message.error("请输入配件名称");
        return;
      }
      const dto = {
        gid: this.data.gid,
        isFactioryPartName: 1,
        ...this.createPartsForm
      };
      addPart(dto).then(e => {
        if (e.data.code == 200) {
          this.$message({
            message: "创建成功",
            type: "success"
          });
          this.selectPartList = this.selectPartList.concat(e.data.data);
          this.getPart();
          this.createPartsForm.partName = "";
        }
      });
      // this.visible.createPartsVisible = true;
    },
    //编辑配件
    editParts(row) {
      this.editPartsForm = row;
      this.visible.editPartsVisible = true;
    },
    //编辑配件
    editPartsSubmit() {
      this.editPartsForm.exceeds = this.editPartsForm.inPrice;
      this.editPartsForm.sellPrice = this.editPartsForm.price;
      this.editPartsForm.total = this.editPartsForm.counts;
      this.$message({
        type: "success",
        message: "编辑成功!"
      });
      this.visible.editPartsVisible = false;
    },
    deleteParts(row, index) {
      this.$confirm(`确认删除配件${row.partName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.tableData2.splice(index, 1);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => console.log("已取消"));
    },
    selectPart(event) {
      this.selected1 = event;
      this.selectPartList = unique(
        this.selectPartList.concat(this.selected1),
        "id"
      );
    },
    addLossProjectDialog() {
      if (this.selectLossProjectList.length == 0) this.getProject();
      this.visible.addLossProjectVisible = true;
    },
    addLossPartsDialog() {
      if (this.selectLossPartList.length == 0) this.getPart();
      this.visible.addLossPartsVisible = true;
    },
    //保存主单
    saveWorkInfo() {
      this.data.receivableItemAmount = this.tableData1.reduce(function(
        accumulator,
        currentValue
      ) {
        return accumulator + parseFloat(currentValue.standPrice);
      },
      0);
      this.data.receivablePartAmount = this.tableData2.reduce(function(
        accumulator,
        currentValue
      ) {
        // console.log(accumulator)
        // console.log(currentValue)
        // console.log(currentValue.counts)
        return (
          accumulator + parseFloat(currentValue.price) * currentValue.counts
        );
        // return (accumulator + parseFloat(currentValue.price)) * currentValue.counts
      },
      0);

      this.data.amountReceivable =
        parseFloat(this.data.receivableItemAmount) +
        parseFloat(this.data.receivablePartAmount);
      let data = {
        oid: localStorage.getItem("oid"),
        gid: this.data.gid,
        receivableItemAmount: this.data.receivableItemAmount,
        receivablePartAmount: this.data.receivablePartAmount,
        amountReceivable: this.data.amountReceivable,
        orderItems: []
      };
      data.orderItems = this.tableData1.map(v => {
        v.isCombo = v.ciId ? 0 : 1;
        v.orderDispatchList = this.itemDispatch.filter(
          item => item.itemId == v.id
        );
        // v.itemDispatch = this.itemDispatch.filter(item => item.itemId == v.id)
        v.orderPartList = this.tableData2.filter(item => item.itemId == v.id);
        return v;
      });
      saveWorkInfo(data).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "保存成功!"
          });
        }
      });
      this.lirun =
        this.data.amountActual -
        (this.data.amountActual - this.data.amountReceivable) -
        this.zonghe;
    },
    selectLossProject(event) {
      event.forEach(v => {
        this.$set(v, "itemType", []);
      });
      this.selected2 = event;
      this.selectLossProjectList = unique(
        this.selectLossProjectList.concat(this.selected2),
        "id"
      );
    },
    deleteLossProjectRow(index, row) {
      this.selectLossProjectList.splice(index, 1);
      this.$refs.lossProductTable.toggleRowSelection(row, false);
    },
    //确定添加项目
    addLossProjectSubmit() {
      let arr = this.selectLossProjectList.map(v => {
        return v.itemType.map(k => {
          let is = {
            id: v.id,
            gid: v.gid,
            itemName: v.item,
            standPrice: v.standPrice
          };
          is.itemType = k.itemType;
          is.prefixItemName = k.prefixItemName;
          return is;
        });
      });
      arr = [].concat.apply([], arr);
      arr.forEach(v => {
        switch (v.itemType) {
          case "1":
            this.proJectPush("projectList1", v);
            break;
          case "2":
            this.proJectPush("projectList2", v);
            break;
          case "3":
            this.proJectPush("projectList3", v);
            break;
          case "4":
            this.proJectPush("projectList4", v);
            break;
        }
      });

      this.selectLossProjectList = this.selected2 = [];
      this.visible.addLossProjectVisible = false;
    },
    proJectPush(name, arr) {
      const row = this[name].find(
        v => v.itemType == arr.itemType && v.itemName == arr.itemName
      );
      if (row) {
        return this.$message({
          message: `${arr.prefixItemName}已包含项目${arr.itemName}`,
          type: "error"
        });
      }
      this[name].push(arr);
    },
    selectLossPart(event) {
      this.selected3 = event;
      this.selectLossPartList = unique(
        this.selectLossPartList.concat(this.selected3),
        "id"
      );
    },
    deleteLossPartRows(index, row) {
      this.selectLossPartList.splice(index, 1);
      this.$refs.lossPartTable.toggleRowSelection(row, false);
    },
    addLossPartsSubmit() {
      const arr = this.selectLossPartList.map(v => {
        let is = {
          id: v.id,
          gid: v.gid,
          itemName: v.partName,
          price: v.sellPrice,
          inPrice: v.exceeds,
          counts: v.total
        };
        is.itemType = 5;
        is.prefixItemName = "更换配件";
        return is;
      });

      arr.forEach(k => {
        const row = this.partsList.find(
          v => v.itemType == k.itemType && v.itemName == k.itemName
        );
        if (row) {
          return this.$message({
            message: `配件${k.itemName}已存在`,
            type: "error"
          });
        }
        this.partsList.push(k);
      });

      this.selectLossPartList = this.selected3 = [];
      this.visible.addLossPartsVisible = false;
    },
    saveDamageInfo() {
      let data = {
        oid: localStorage.getItem("oid"),
        gid: this.data.gid,
        orderDamageDTOList: []
      };
      data.orderDamageDTOList = data.orderDamageDTOList.concat(
        this.projectList1,
        this.projectList2,
        this.projectList3,
        this.projectList4,
        this.partsList
      );

      saveDamageInfo(data).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "保存成功!"
          });
        }
      });
    },
    copyInfo() {
      this.tableData1 = unique(
        this.tableData1.concat(
          this.projectList1,
          this.projectList2,
          this.projectList3,
          this.projectList4
        ),
        "itemName"
      );

      this.partsList.forEach(v => {
        v.partName = v.itemName;
        v.source = v.gid == -99 ? 1 : 0;
      });
      this.tableData2 = unique(
        this.tableData2.concat(this.partsList),
        "partName"
      );

      this.$message({
        type: "success",
        message: "复制成功!"
      });
    },
    royaltyConfim(type, info) {
      this.royaltyForm.sourceType = type;
      this.royaltyForm.sourceId = info.id;
      this.royaltyForm.percentages = [];
      getOrderPercentages({
        sourceType: type,
        sourceId: info.id || localStorage.getItem("oid")
      }).then(res => {
        this.royaltyForm.percentages = res.data.data;

        const typeName = ["业务", "工时", "配件"];
        const name = ["整单金额", "itemName", "partName"];

        const percentageClassId = info.percentageClassId
          ? info.percentageClassId
          : this.royaltyForm.percentages.length > 0
          ? this.royaltyForm.percentages[0].percentageClassId
          : "";
        this.royaltyInfo = {
          name: type == 1 ? name[0] : info[name[type - 1]],
          royaltyName: typeName[type - 1],
          price: type == 2 ? info.standPrice : info.price,
          percentageClassId: percentageClassId
        };
        if (info.percentageClassId) {
          queryPercentageClassOne({ id: percentageClassId }).then(res => {
            this.royaltyInfo.percentage = res.data.data;
          });
        }
        this.visible.royaltyVisible = true;
      });
    },
    royaltySubmit() {
      this.royaltyForm.percentages.forEach(v => {
        if (v.percentageWay == 1) {
          v.percentageAmout =
            (parseInt(v.percentagePoint) * this.royaltyInfo.price) / 100;
        }
      });

      this.royaltyForm.percentageClassId = this.royaltyInfo.percentage.id;
      // this.royaltyForm.percentageClassId = this.royaltyInfo.percentageClassId
      addOrderPercentage(this.royaltyForm).then(res => {
        if (res.data.code == 200) {
          this.$message({
            type: "success",
            message: "保存成功!"
          });
          this.visible.royaltyVisible = false;
        }
      });
    },
    deletePercentage(index) {
      this.royaltyForm.percentages.splice(index, 1);
    },
    addPercentage() {
      findAllGroupByRole().then(res => {
        const data = res.data.data.find(v => v.onJob == 1);
        this.userData = data.orgEmployeeDTOList;
        this.visible.userVisible = true;
      });
    },
    selectUser(event) {
      this.selectedUser = event.map(v => {
        return {
          employeeName: v.realName,
          employeeId: v.id,
          percentageWay: 1,
          ...v
        };
      });
    },
    userSubmit() {
      this.selectedUser.forEach(v => {
        const role = v.role.split(",").slice(-1)[0];
        const check = this.royaltyForm.percentages.find(
          k => k.employeeId == v.id
        );
        const percentage = this.royaltyInfo.percentage;
        if (percentage && percentage.percentageWay) {
          v.percentageWay = percentage.percentageWay;
          if (percentage.isByPosition == true) {
            switch (role) {
              case "4":
                v.percentagePoint = percentage.percentagePointYW;
                v.percentageAmout = percentage.percentageAmoutYW;
                break;
              case "3":
                v.percentagePoint = percentage.percentagePointSG;
                v.percentageAmout = percentage.percentageAmoutSG;
                break;
              case "2":
                v.percentagePoint = percentage.percentagePointCW;
                v.percentageAmout = percentage.percentageAmoutCW;
                break;
              case "1":
                v.percentagePoint = percentage.percentagePointJD;
                v.percentageAmout = percentage.percentageAmoutJD;
                break;
            }
          }
        }
        const info = JSON.parse(JSON.stringify(v));
        if (!check) this.royaltyForm.percentages.push(info);
      });
      this.visible.userVisible = false;
    },
    treeChange(event) {
      let id = event.slice(-1)[0];
      queryPercentageClassOne({ id: id }).then(res => {
        this.royaltyInfo.percentage = res.data.data;
      });
    },
     treeChan(event) {
       console.log(event)
      this.CLzl_list.carSeriesId= event.slice(-1)[0];
       console.log(this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels)
       this.CLzl_list.carBrand= this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels[0]
        this.CLzl_list.carSeriesName= this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels[1]
         this.CLzl_list.standard= this.$refs['cascaderAddr'].getCheckedNodes()[0].pathLabels[1]
    },

      handleAddressFun: function(item){
      console.log(this.$refs.cascaderAddr.getCheckedNodes())
		}
      

  }
};
</script>
<style scoped>
.bbu{
  margin-top: 7px;
}
.sadd{
  float: left;
  margin-left: 5px;
}
.shezhi{
   /* position: absolute; 
  bottom: 0;
  left: 0;  */
  width: 30px;
  height: 35px;
  /* float: right; */
  margin-left: 72px;
}
.bodv {
  /* margin-bottom: 5px; */
  border-bottom: 1px solid #dcdfe6;
}
.hbz {
  padding-bottom: 10px;
  /* line-height: 50px; */
}
.liutu {
  margin-top: 10px;
}
.beizhu {
  height: 60px;
  border: none;
  width: 100%;
  color: #606266;
  font-size: 14px;
}
.bodv /deep/ .el-input__inner {
  text-align: right;
  border: none;
  padding: 0px;
}
.bodv .cas /deep/ .el-input__inner {
  padding: 0px 30px;
}
.bodv /deep/ .el-input__prefix {
  display: none;
}
.bodv /deep/ .el-form-item__content {
  float: right;
}
.bodvg /deep/ .el-form-item__content {
 width: 70%;
}
.dsds {
  overflow: hidden;
}
.CLzl {
  width: 48%;
  /* height: 500px; */
}
.CLzl /deep/ .el-form--inline .el-form-item {
  width: 100%;
}
.shul {
  width: 50px;
  height: 30px;
  background: #067e5f;
  display: inline-block;
}
.avatar-uploader{
  float: right;
  line-height: 40px;
  width: 40px;
  height: 40px;
  background: #f2f2f2;
  text-align: center
}
.avatar-uploader img{
  width: 40px;
  height: 40px;
}
.carSZ{
  height: 30PX;
}
.zzll{
   line-height: 40px;
}
.orderUl li {
  float: left;
  padding: 4px 18px;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  transition: 0.5s;
  font-size: 16px;
}
.orderUl li:hover {
  background: rgba(0, 0, 0, 0.1);
  transition: 0.5s;
}
.orderUl li.active {
  background: #3ac29f;
  color: #fff;
}

.orderTable {
  padding-bottom: 60px;
}
.orderXHeji {
  color: #067e5f;
  position: fixed;
  bottom: 0;
  margin-bottom: 20px;
  background: #fff;
  width: 100%;
}
.su {
  margin-top: 12px;
  border-radius: 7px 7px 7px 7px;
  color: #fff;
  width: 35px;
  font-size: 16px;
  line-height: 20px;
  height: 20px;
  background: #3ac29f;
  text-align: center;
}
.orderXHeji em {
  margin: 0 15px;
}
.orderXHeji i {
  color: #a8cec3;
}

.el-button.is-active,
.el-button.is-plain:active {
  color: #0d906e;
  border-color: #0d906e;
}
.el-button.is-plain:focus,
.el-button.is-plain:hover {
  color: #0d906e;
  border-color: #0d906e;
}
.el-dropdown-menu__item:focus,
.el-dropdown-menu__item:not(.is-disabled):hover {
  color: #0d906e;
  background-color: #e5f6f7;
}

.lines {
  border-bottom: 1px solid #ccc;
  padding: 10px 0px;
}
.lines span {
  float: left;
  display: block;
}
.lines .el-checkbox-group {
  font-size: 13px;
}
.lines h2 {
  color: red;
  border-bottom: 1px solid #ccc;
  text-indent: 10px;
}
.addProject /deep/ .el-dialog__header {
  padding-bottom: 20px;
  border-bottom: 1px solid #ccc;
}
.addProject /deep/ .el-dialog__body {
  padding: 5px;
}
.el-checkbox-group {
  font-size: 13px;
}
.royalty {
  border-bottom: 1px solid #ccc;
  padding: 10px;
}
.royalty /deep/ .el-input-group__append {
  padding: 0 10px;
}
.lulu {
  position: absolute;
  top: 0;
  right: 0;
  margin-top: 40px;

  overflow: hidden;
}
.lulux {
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
  /* margin-bottom: 10px; */
}
.dll {
  margin-top: 10px;
}
.flll {
  float: left;
}
.frrr {
  float: right;
}
.ddv {
  border: 1px solid #666;
  border-top: none;
  border-left: none;
}
.jx {
  margin-right: 25px;
}
.deng {
  border: 1px solid #666;

  margin-top: 5px;
  min-height: 350px;
}
.cs {
  margin-left: 3px;
  min-height: 25px;
}
.cc_img {
  width: 80px;
  height: 40px;
  top: 0;
  margin-top: 40px;
  position: absolute;
}

.bod {
  margin-bottom: 7px;
  border-bottom: 1px solid #dcdfe6;
}
.sdx {
  float: left;

}
.bod /deep/ .el-input__inner {
  border: none;
  padding: 0px;
}
.bod /deep/ .el-input__prefix {
  display: none;
}
.rid {
  vertical-align: middle;
  margin-top: 13px;
}
.imggg{
  position: relative;
    float: left;
}
.img_lis{
  width: 80px;
  height: 80px;

}
.imggg:nth-child(n+1){
  margin-left: 5px;
}
.icode{
  position: absolute;
  top: 0;
  right: 0;
  color: #fff;
  cursor:pointer
}
</style>


<style>
.taocanTable .el-table tr td {
  background: #e5f6f7;
}
.taocanTable .el-table tr th {
  background: #e5f6f7;
}
.taocanTable .el-table div.el-table__empty-block {
  background: #e5f6f7;
}
/deep/ .el-table td {
  padding: 5px 0;
}
.main /deep/ .el-carousel__arrow {
  background-color: rgba(31, 45, 61, 0.11);
}
.main /deep/ .el-carousel__arrow:hover {
  background-color: #606266;
}
.bodv .el-form-item__content {
  margin-left: 0 !important;
}
.bodv .el-upload-list__item-actions {
  width: 80px;
  height: 80px;
}
.bodv .el-upload-list--picture-card .el-upload-list__item-thumbnail {
  width: 80px;
  height: 80px;
}
.bodv .el-upload-list__item {
  width: 80px;
  height: 80px;
}
.bodv .el-dialog--center .el-dialog__body {
  padding: 5px 25px 30px;
}
.bodv .el-input__inner {
  height: 35px;
}
.bodv .el-form-item {
  /* margin-bottom: 10px; */
}
.bodv .el-upload--picture-card {
  width: 80px;
  height: 80px;
  line-height: 80px;
}
.bod .el-form-item__content {
  margin-left: 0 !important;
}
.bod .el-upload-list__item-actions {
  width: 80px;
  height: 80px;
}
.bod .el-upload-list--picture-card .el-upload-list__item-thumbnail {
  width: 80px;
  height: 80px;
}
.bod .el-upload-list__item {
  width: 80px;
  height: 80px;
}
.bod .el-dialog--center .el-dialog__body {
  padding: 5px 25px 30px;
}
.bod .el-input__inner {
  height: 35px;
}
.bod .el-form-item {
  margin-bottom: 10px;
}
.bod .el-upload--picture-card {
  width: 80px;
  height: 80px;
  line-height: 80px;
}
</style>