<template>
  <div class="w-100" style="padding-left: 30px;">
    <div style="width: 860px;margin: 0px auto;" v-if="show">
      <table
        width="100%"
        border="0"
        cellpadding="0"
        cellspacing="0"
        style="page-break-after:always"
      >
        <el-card class="box-card">
          <h1
            class="text-center f-22"
            style="font-family:'黑体';padding:5px 0px 10px 0px;"
          >{{data.garageName}}</h1>
          <h2 class="text-center f-22" style="font-family:'黑体'; padding-bottom: 10px;">结 算 单</h2>
          <el-row style="border:none">
            <el-col :span="16" style="padding-left: 12px;">
              单号：
              <em v-if="data.billNumber">{{data.billNumber}}</em>
              <em v-else>暂无</em>
            </el-col>
            <el-col :span="4">自编号：</el-col>

            <el-col :span="4">
              <em class="right" style="margin-right: 10px;">单位：元</em>
            </el-col>
          </el-row>
          <div class="thth">
            <div class="text item">
              <el-row>
                <el-col :span="10">
                  <div class="ta">客户姓名</div>
                  <em v-if="data.customerName">{{data.customerName}}</em>
                </el-col>
                <el-col :span="7">
                  <div class="ta_a">车 牌 号</div>
                  <em v-if="data.carNo">{{data.carNo}}</em>
                </el-col>
                <el-col :span="7">
                  <div class="ta_a">厂牌车型</div>
                  <em v-if="data.standard">{{data.standard}}</em>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="17">
                  <div class="ta">客户地址</div>
                  <em></em>
                </el-col>
                <el-col :span="7">
                  <div class="ta_a">维修类别</div>
                  <em></em>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="9">
                  <div class="ta">车 架 号</div>
                  <em v-if="data.vin">{{data.vin}}</em>
                </el-col>
                <el-col :span="8">
                  <div class="ta_a">发动机号</div>
                  <em v-if="data.engineNo">{{data.engineNo}}</em>
                </el-col>
                <el-col :span="7">
                  <div class="ta_a">购车日期</div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="9">
                  <div class="ta">联 系 人</div>
                  <em v-if="data.customerName">{{data.customerName}}</em>
                </el-col>
                <el-col :span="8">
                  <div class="ta_a">联系电话</div>
                  <em v-if="data.phone">{{data.phone}}</em>
                </el-col>
                <el-col :span="7">
                  <div class="ta_a">进厂里程</div>
                  <em v-if="data.driveMiles">{{data.driveMiles}}</em>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="9">
                  <div class="ta">接 车 人</div>
                  <em v-if="data.handler">{{data.handler}}</em>
                </el-col>
                <el-col :span="8">
                  <div class="ta_a">进厂时间</div>
                  <em v-if="data.createdDate">{{data.createdDate.substring(0,10)}}</em>
                </el-col>
                <el-col :span="7">
                  <div class="ta_a">出厂时间</div>
                  <em v-if="data.settlementDate">{{data.settlementDate.substring(0,10)}}</em>
                </el-col>
              </el-row>
            </div>
            <div class="hed">
              <div class="listboy left bded">
                <el-row class="hdesd">
                  <el-col class="lis" :span="12">维 修 项 目</el-col>
                  <el-col class="lis" :span="4">班 组</el-col>
                  <el-col class="lis" :span="4">工 时 费</el-col>
                  <el-col class="lis" style="border:none;" :span="4">折 后 价</el-col>
                </el-row>
                <el-row v-for="(item,idx) in tableData1" :key="'item'+idx">
                  <el-col
                    class="bord"
                    :span="12"
                    style=" padding-left: 5px; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
                  >{{item.itemName}}</el-col>
                  <el-col class="bord_p" :span="4">{{item.groupName}}</el-col>
                  <el-col class="bord_p" style="text-align: right; padding-right: 3px;" :span="4">
                    <em v-if="item.standPrice != 'zz'">{{item.standPrice}}.00</em>
                  </el-col>
                  <el-col
                    class="bord_p"
                    style="border:none; text-align: right; padding-right: 3px;"
                    :span="4"
                  >
                    <em v-if="item.standPrice != 'zz'">
                      <em
                        v-if="data.discountItemRate"
                      >{{((data.discountItemRate/10) * item.standPrice)}}.00</em>
                      <em v-else>{{item.standPrice}}.00</em>
                    </em>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12" style="border-right: 1px solid #333;">
                    <em style=" padding-left: 5px;">应收工时费：</em>
                    <em class="right rin" v-if="zonger">{{zonger}}.00</em>
                  </el-col>
                  <el-col :span="12">
                    <em style=" padding-left: 5px;">实收工时费：</em>
                    <em class="right rin" v-if="zhekou">{{zhekou ? zhekou : 0}}.00</em>
                  </el-col>
                </el-row>
              </div>
              <div class="listboy right">
                <el-row class="hdesd">
                  <div class="peijianhe" style=" border-bottom: 1px solid #333; ">
                    <el-col :span="24">更 换 配 件</el-col>
                  </div>
                  <div class="peijianhe">
                    <el-col class="bord_p" :span="12">配 件 名 称</el-col>
                    <el-col class="bord_p" :span="2">单位</el-col>
                    <el-col class="bord_p" :span="2">数量</el-col>
                    <el-col class="bord_p" :span="4">单 价</el-col>
                    <el-col class="bord_p" style="border:none;" :span="4">金 额</el-col>
                  </div>
                </el-row>
                <el-row v-for="(items,idx) in tableData2" :key="'items'+idx">
                  <el-col class="bord" style=" padding-left: 5px;" :span="12">{{items.partName}}</el-col>
                  <el-col class="bord_p" :span="2">{{items.unit}}</el-col>
                  <el-col class="bord_p" :span="2">{{items.counts}}</el-col>
                  <el-col class="bord_p" style="text-align: right; padding-right: 3px;" :span="4">
                    <em v-if="items.price != 'zz'">{{items.price}}.00</em>
                  </el-col>
                  <el-col
                    class="bord_p"
                    style="border:none; text-align: right; padding-right: 3px;"
                    :span="4"
                  >
                    <em v-if="items.price != 'zz'">
                      <em
                        v-if="data.discountPartRate"
                      >{{((data.discountItemRate/ 10) * (items.price*items.counts))}}.00</em>
                      <em v-else>{{items.price*items.counts}}.00</em>
                    </em>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12" style="border-right: 1px solid #333;">
                    <em style=" padding-left: 5px;">应收配件费：</em>
                    <em class="right rin" v-if="zonger2">{{zonger2}}.00</em>
                  </el-col>
                  <el-col :span="12">
                    <em style=" padding-left: 5px;">实收配件费：</em>
                    <em class="right rin" v-if="zhekou2">{{zhekou2 ? zhekou2 : 0}}.00</em>
                  </el-col>
                </el-row>
              </div>
            </div>
            <el-row style=" height: 30px;  line-height: 30px;">
              <el-col :span="6">
                <em class="pdng">合计应收：</em>
                <em class="right rind" v-if="data.amountReceivable">￥{{data.amountReceivable}}.00</em>
              </el-col>
              <el-col :span="6">
                <em class="pdng">优惠：</em>
                <em class="right rind" v-if="data.amountDiscount">￥{{data.amountDiscount}}.00</em>
              </el-col>
              <el-col :span="6">
                <em class="pdng">合计实收：</em>
                <em class="right rind" v-if="data.amountActual">￥{{data.amountActual}}.00</em>
              </el-col>
              <el-col :span="6">
                <em class="pdng">收款方式：</em>
                <em class="right rind">{{data.payType}}</em>
              </el-col>
            </el-row>
            <el-row class style="border:none">
              <div class="beizhu">
                <p style="margin-left: 5px;">备注：{{data.pcPrintRemark}}</p>
              </div>
              <p></p>
              <div class="flex p-r-25 qianshu">
                <div class="qian">顾客签署：</div>
                <p class="flex manyi">
                  <em>满意度：</em>
                  <em
                    class="block m-t-5 m-l-10"
                    style="width:16px;height:16px;border:2px solid #000;"
                  ></em>
                  <em style="height:16px;margin-top: 2px">&nbsp;好</em>
                  <em
                    class="block m-t-5 m-l-30"
                    style="width:16px;height:16px;border:2px solid #000;"
                  ></em>
                  <em style="height:16px;margin-top: 2px">&nbsp;一般</em>
                  <em
                    class="block m-t-5 m-l-30"
                    style="width:16px;height:16px;border:2px solid #000;"
                  ></em>
                  <em style="height:16px;margin-top: 2px">&nbsp;不好</em>
                </p>
              </div>
            </el-row>
          </div>
          <el-row style="border:none">
            <el-col :span="21">
              电话：
              <em>{{data.garagePhone}}</em>
            </el-col>
            <el-col :span="3">结算：</el-col>
          </el-row>
          <div>地址：{{data.garageAddress}}</div>
        </el-card>
      </table>
    </div>

    <div id="page1" style="width: 860px;margin: 0px auto;" v-if="!show">
      <table
        width="100%"
        border="0"
        cellpadding="0"
        cellspacing="0"
        style="page-break-after:always"
      >
        <el-card class="box-card">
          <h1
            class="text-center f-22"
            style="font-family:'黑体';padding:5px 0px 10px 0px;"
          >{{data.garageName}}</h1>
          <h2 class="text-center f-20" style="font-family:'黑体'; padding-bottom: 10px;">工 时 结 算 单</h2>
          <el-row style="border:none">
            <el-col :span="16" style="padding-left: 12px;">
              单号：
              <em v-if="data.billNumber">{{data.billNumber}}</em>
              <em v-else>暂无</em>
            </el-col>
            <el-col :span="4">自编号：</el-col>

            <el-col :span="4">
              <em class="right" style="margin-right: 10px;">单位：元</em>
            </el-col>
          </el-row>
          <div class="thth">
            <div class="text item">
              <el-row>
                <el-col :span="10">
                  <div class="ta">客户姓名</div>
                  <em v-if="data.customerName">{{data.customerName}}</em>
                </el-col>
                <el-col :span="7">
                  <div class="ta_a">车 牌 号</div>
                  <em v-if="data.carNo">{{data.carNo}}</em>
                </el-col>
                <el-col :span="7">
                  <div class="ta_a">厂牌车型</div>
                  <em v-if="data.standard">{{data.standard}}</em>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="17">
                  <div class="ta">客户地址</div>
                  <em></em>
                </el-col>
                <el-col :span="7">
                  <div class="ta_a">维修类别</div>
                  <em></em>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="9">
                  <div class="ta">车 架 号</div>
                  <em v-if="data.vin">{{data.vin}}</em>
                </el-col>
                <el-col :span="8">
                  <div class="ta_a">发动机号</div>
                  <em v-if="data.engineNo">{{data.engineNo}}</em>
                </el-col>
                <el-col :span="7">
                  <div class="ta_a">购车日期</div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="9">
                  <div class="ta">联 系 人</div>
                  <em v-if="data.customerName">{{data.customerName}}</em>
                </el-col>
                <el-col :span="8">
                  <div class="ta_a">联系电话</div>
                  <em v-if="data.phone">{{data.phone}}</em>
                </el-col>
                <el-col :span="7">
                  <div class="ta_a">进厂里程</div>
                  <em v-if="data.driveMiles">{{data.driveMiles}}</em>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="9">
                  <div class="ta">接 车 人</div>
                  <em v-if="data.handler">{{data.handler}}</em>
                </el-col>
                <el-col :span="8">
                  <div class="ta_a">进厂时间</div>
                  <em v-if="data.createdDate">{{data.createdDate.substring(0,10)}}</em>
                </el-col>
                <el-col :span="7">
                  <div class="ta_a">出厂时间</div>
                  <em v-if="data.settlementDate">{{data.settlementDate.substring(0,10)}}</em>
                </el-col>
              </el-row>
            </div>
            <div class="hed">
              <div class="listboy2 left bded2">
                <el-row class="hdesd">
                  <el-col class="lis" :span="12">维 修 项 目</el-col>
                  <el-col class="lis" :span="4">班 组</el-col>
                  <el-col class="lis" :span="4">工 时 费</el-col>
                  <el-col class="lis" style="border:none;" :span="4">折 后 价</el-col>
                </el-row>
                <el-row v-for="(item,idx) in tableData1" :key="'item'+idx">
                  <el-col
                    class="bord"
                    :span="12"
                    style=" padding-left: 5px; white-space: nowrap;overflow: hidden;text-overflow: ellipsis;"
                  >{{item.itemName}}</el-col>
                  <el-col class="bord_p" :span="4">{{item.groupName}}</el-col>
                  <el-col class="bord_p" style="text-align: right; padding-right: 3px;" :span="4">
                    <em v-if="item.standPrice != 'zz'">{{item.standPrice}}.00</em>
                  </el-col>
                  <el-col
                    class="bord_p"
                    style="border:none; text-align: right; padding-right: 3px;"
                    :span="4"
                  >
                    <em v-if="item.standPrice != 'zz'">
                      <em
                        v-if="data.discountItemRate"
                      >{{((data.discountItemRate/10) * item.standPrice)}}.00</em>
                      <em v-else>{{item.standPrice}}.00</em>
                    </em>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="12" style="border-right: 1px solid #333;">
                    <em style=" padding-left: 5px;">应收工时费：</em>
                    <em class="right rin" v-if="zonger">{{zonger}}.00</em>
                  </el-col>
                  <el-col :span="12">
                    <em style=" padding-left: 5px;">实收工时费：</em>
                    <em class="right rin" v-if="zhekou">{{zhekou ? zhekou : 0}}.00</em>
                  </el-col>
                </el-row>
              </div>
            </div>
            <el-row style=" height: 30px;  line-height: 30px;">
              <el-col :span="12">
                <em class="pdng">合计人民币：</em>
                <em class="rind" v-if="zhekou">{{zhekou ? zhekou : 0}}.00</em>
              </el-col>
              <!-- <el-col :span="12">
              <em class="pdng">收款方式：</em>
              <em class="right rind">{{data.payType}}</em>
              </el-col>-->
            </el-row>
            <el-row class style="border:none">
              <div class="beizhu">
                <p style="margin-left: 5px;">备注：{{data.pcPrintRemark}}</p>
              </div>
              <p></p>
              <div class="flex p-r-25 qianshu">
                <div class="qian">顾客签署：</div>
                <p class="flex manyi">
                  <em>满意度：</em>
                  <em
                    class="block m-t-5 m-l-10"
                    style="width:16px;height:16px;border:2px solid #000;"
                  ></em>
                  <em style="height:16px;margin-top: 2px">&nbsp;好</em>
                  <em
                    class="block m-t-5 m-l-30"
                    style="width:16px;height:16px;border:2px solid #000;"
                  ></em>
                  <em style="height:16px;margin-top: 2px">&nbsp;一般</em>
                  <em
                    class="block m-t-5 m-l-30"
                    style="width:16px;height:16px;border:2px solid #000;"
                  ></em>
                  <em style="height:16px;margin-top: 2px">&nbsp;不好</em>
                </p>
              </div>
            </el-row>
          </div>
          <el-row style="border:none">
            <el-col :span="21">
              电话：
              <em>{{data.garagePhone}}</em>
            </el-col>
            <el-col :span="3">结算：</el-col>
          </el-row>
          <div>地址：{{data.garageAddress}}</div>
        </el-card>
      </table>
    </div>

    <div id="page2" style="width: 860px;margin: 0px auto;" v-if="!show">
      <table width="100%" border="0" cellpadding="0" cellspacing="0" id="content">
        <el-card class="box-card">
          <h1
            class="text-center f-22"
            style="font-family:'黑体';padding:5px 0px 10px 0px;"
          >{{data.garageName}}</h1>
          <h2 class="text-center f-20" style="font-family:'黑体'; padding-bottom: 10px;">配 件 结 算 单</h2>
          <el-row style="border:none">
            <el-col :span="16" style="padding-left: 12px;">
              单号：
              <em v-if="data.billNumber">{{data.billNumber}}</em>
              <em v-else>暂无</em>
            </el-col>
            <el-col :span="4">自编号：</el-col>

            <el-col :span="4">
              <em class="right" style="margin-right: 10px;">单位：元</em>
            </el-col>
          </el-row>
          <div class="thth">
            <div class="text item">
              <el-row>
                <el-col :span="10">
                  <div class="ta">客户姓名</div>
                  <em v-if="data.customerName">{{data.customerName}}</em>
                </el-col>
                <el-col :span="7">
                  <div class="ta_a">车 牌 号</div>
                  <em v-if="data.carNo">{{data.carNo}}</em>
                </el-col>
                <el-col :span="7">
                  <div class="ta_a">厂牌车型</div>
                  <em v-if="data.standard">{{data.standard}}</em>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="17">
                  <div class="ta">客户地址</div>
                  <em></em>
                </el-col>
                <el-col :span="7">
                  <div class="ta_a">维修类别</div>
                  <em></em>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="9">
                  <div class="ta">车 架 号</div>
                  <em v-if="data.vin">{{data.vin}}</em>
                </el-col>
                <el-col :span="8">
                  <div class="ta_a">发动机号</div>
                  <em v-if="data.engineNo">{{data.engineNo}}</em>
                </el-col>
                <el-col :span="7">
                  <div class="ta_a">购车日期</div>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="9">
                  <div class="ta">联 系 人</div>
                  <em v-if="data.customerName">{{data.customerName}}</em>
                </el-col>
                <el-col :span="8">
                  <div class="ta_a">联系电话</div>
                  <em v-if="data.phone">{{data.phone}}</em>
                </el-col>
                <el-col :span="7">
                  <div class="ta_a">进厂里程</div>
                  <em v-if="data.driveMiles">{{data.driveMiles}}</em>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="9">
                  <div class="ta">接 车 人</div>
                  <em v-if="data.handler">{{data.handler}}</em>
                </el-col>
                <el-col :span="8">
                  <div class="ta_a">进厂时间</div>
                  <em v-if="data.createdDate">{{data.createdDate.substring(0,10)}}</em>
                </el-col>
                <el-col :span="7">
                  <div class="ta_a">出厂时间</div>
                  <em v-if="data.settlementDate">{{data.settlementDate.substring(0,10)}}</em>
                </el-col>
              </el-row>
            </div>
            <div class="hed">
              <div class="listboy2">
                <el-row class="hdesd">
                  <div class="peijianhe" style=" border-bottom: 1px solid #333; ">
                    <el-col :span="24">更 换 配 件</el-col>
                  </div>
                  <div class="peijianhe">
                    <el-col class="bord_p" :span="8">配 件 名 称</el-col>
                    <el-col class="bord_p" :span="2">单位</el-col>
                    <el-col class="bord_p" :span="2">数量</el-col>
                    <el-col class="bord_p" :span="4">单 价</el-col>
                    <el-col class="bord_p" :span="4">金 额</el-col>
                    <el-col class="bord_p" style="border:none;" :span="4">班 组</el-col>
                  </div>
                </el-row>
                <el-row v-for="(items,idx) in tableData2" :key="'items'+idx">
                  <el-col class="bord" style=" padding-left: 5px;" :span="8">{{items.partName}}</el-col>
                  <el-col class="bord_p" :span="2">{{items.unit}}</el-col>
                  <el-col class="bord_p" :span="2">{{items.counts}}</el-col>
                  <el-col class="bord_p" style="text-align: right; padding-right: 3px;" :span="4">
                    <em v-if="items.price != 'zz'">{{items.price}}.00</em>
                  </el-col>
                  <el-col class="bord_p" style=" text-align: right; padding-right: 3px;" :span="4">
                    <em v-if="items.price != 'zz'">
                      <em
                        v-if="data.discountPartRate"
                      >{{((data.discountItemRate/ 10) * (items.price*items.counts))}}.00</em>
                      <em v-else>{{items.price*items.counts}}.00</em>
                    </em>
                  </el-col>
                  <el-col class="bord_p" style="border:none;" :span="4">{{items.banzu}}</el-col>
                </el-row>
                <el-row>
                  <el-col :span="12" style="border-right: 1px solid #333;">
                    <em style=" padding-left: 5px;">应收配件费：</em>
                    <em class="right rin" v-if="zonger2">{{zonger2}}.00</em>
                  </el-col>
                  <el-col :span="12">
                    <em style=" padding-left: 5px;">实收配件费：</em>
                    <em class="right rin" v-if="zhekou2">{{zhekou2 ? zhekou2 : 0}}.00</em>
                  </el-col>
                </el-row>
              </div>
            </div>
            <el-row style=" height: 30px;  line-height: 30px;">
              <el-col :span="12">
                <em class="pdng">合计人民币：</em>
                <em class="rind" v-if="zhekou2">{{zhekou2 ? zhekou2 : 0}}.00</em>
              </el-col>
              <!-- <el-col :span="12">
              <em class="pdng">收款方式：</em>
              <em class="right rind">{{data.payType}}</em>
              </el-col>-->
            </el-row>
            <el-row class style="border:none">
              <div class="beizhu">
                <p style="margin-left: 5px;">备注：{{data.pcPrintRemark}}</p>
              </div>
              <p></p>
              <div class="flex p-r-25 qianshu">
                <div class="qian">顾客签署：</div>
                <p class="flex manyi">
                  <em>满意度：</em>
                  <em
                    class="block m-t-5 m-l-10"
                    style="width:16px;height:16px;border:2px solid #000;"
                  ></em>
                  <em style="height:16px;margin-top: 2px">&nbsp;好</em>
                  <em
                    class="block m-t-5 m-l-30"
                    style="width:16px;height:16px;border:2px solid #000;"
                  ></em>
                  <em style="height:16px;margin-top: 2px">&nbsp;一般</em>
                  <em
                    class="block m-t-5 m-l-30"
                    style="width:16px;height:16px;border:2px solid #000;"
                  ></em>
                  <em style="height:16px;margin-top: 2px">&nbsp;不好</em>
                </p>
              </div>
            </el-row>
          </div>
          <el-row style="border:none">
            <el-col :span="21">
              电话：
              <em>{{data.garagePhone}}</em>
            </el-col>
            <el-col :span="3">结算：</el-col>
          </el-row>
          <div>地址：{{data.garageAddress}}</div>
        </el-card>
      </table>
    </div>
  </div>
</template>

<script>
import { print, getPrintType } from "../../request/api.js";
export default {
  name: "print",
  data() {
    return {
      data: "",
      show: true,
      tableData1: [],
      tableData2: [],
      dayin:null,
      zongshou: null,
      zhekou: null,
      zhekou2: null,
      youhui: null,
      zonger: null,
      zonger2: null,
      //   工时费合计
      gongshi: null
    };
  },
  created() {
    getPrintType().then(res => {
      this.dayin = res.data.data
      if (res.data.data == 2) {
        this.show = false;
      }
    });

    const data = {
      oid: localStorage.getItem("oid")
    };
    print(data).then(res => {
      this.data = res.data.data;

      this.tableData1 = res.data.data.orderItemList;

      this.tableData1.forEach((item, index) => {
        this.zongshou += parseInt(item.standPrice);
        this.zonger += parseFloat(item.standPrice * item.counts);
        if (this.data.discountItemRate) {
          this.zhekou += parseFloat(
            (
              (this.data.discountItemRate / 10) *
              item.standPrice *
              item.counts
            ).toFixed(1)
          );
        } else {
          this.zhekou += item.standPrice;
        }
        console.log(item);
        item.orderPartList.forEach((items, indexs) => {
          items.banzu = item.groupName;
          this.tableData2.push(items);
          console.log(this.tableData2);
          this.zongshou += items.price;
          this.zonger2 += parseFloat(items.price * items.counts);
          console.log(items);
          console.log(this.data);
          if (this.data.discountPartRate) {
            this.zhekou2 += parseFloat(
              (
                (this.data.discountPartRate / 10) *
                items.price *
                items.counts
              ).toFixed(1)
            );
          } else {
            this.zhekou2 += items.price * items.counts;
          }
        });
        // console.log(this.zhekou2)
      });
      if (this.dayin != "2") {
        if (this.tableData1.length > this.tableData2.length) {
          var num2 = this.tableData1.length - this.tableData2.length;
          for (var i = 0; i < num2; i++) {
            var c = {
              price: "zz"
            };
            this.tableData2.push(c);
          }
          console.log(this.tableData2);
        } else {
          var num = this.tableData2.length - this.tableData1.length;
          for (var i = 0; i < num; i++) {
            var c = {
              activityPartId: null,
              carNo: "",
              comboCustomerId: null,
              counts: null,
              gid: null,
              groupId: null,
              groupName: null,
              id: null,
              isCombo: null,
              itemId: null,
              itemName: null,
              oid: null,
              orderDispatchList: null,
              orderPartList: null,
              percentage: null,
              percentageClassId: null,
              percentageClassName: null,
              standPrice: "zz",
              workStatus: null,
              workers: null
            };
            this.tableData1.push(c);
          }
        }
      }

      setTimeout(function() {
        // window.print();
        this.print();
      }, 500);
    });
  },
  mounted() {},
  methods: {
    Print() {
      var printStr =
        "<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8'></head><body >";
      var content = "";
      var str = document.getElementById("page1").innerHTML; //获取需要打印的页面元素 ，page1元素设置样式page-break-after:always，意思是从下一行开始分割。
      content = content + str;
      str = document.getElementById("page2").innerHTML; //获取需要打印的页面元素
      content = content + str;
      printStr = printStr + content + "</body></html>";
      var pwin = window.open("Print.htm", "print"); //如果是本地测试，需要先新建Print.htm，如果是在域中使用，则不需要
      pwin.document.write(printStr);
      pwin.document.close(); //这句很重要，没有就无法实现
      pwin.print();
    }
  }
};
</script>
<style>
body {
  font-family: "黑体";
  color: #000;
}
</style>
<style scoped>
.w-100 /deep/ .el-table,
.w-100 /deep/ .el-table__empty-text,
.w-100 /deep/ em,
.w-100 /deep/ .el-table th > .cell,
.w-100 /deep/ .el-card {
  color: #000 !important;
}
.el-table {
  border: 1px solid #dedede;
}
.el-table thead tr th {
  background-color: #fff !important;
  color: #666;
  font-weight: 500;
}
.thth {
  border: 2px solid #333;
}
.el-row {
  border-bottom: 1px solid #333;
}
.ta {
  text-align: center;
  width: 100px;
  display: inline-block;
  border-right: 1px solid #333;
  padding: 0px 8px;
}
.ta_a {
  text-align: center;
  width: 100px;
  display: inline-block;
  border-right: 1px solid #333;
  border-left: 1px solid #333;
  padding: 0px 8px;
}
.ta_b {
  text-align: center;
  width: 100px;
  display: inline-block;
  border-right: 1px solid #333;
  padding: 0px 8px;
}
.hed {
  overflow: hidden;
}
.hdesd {
  height: 50px;
}
.listboy {
  width: 50%;
  overflow: hidden;
}
.listboy2 {
  width: 100%;
  overflow: hidden;
}
.peijianhe {
  height: 25px;
  text-align: center;
}
.bord {
  border-right: 1px solid #333;
}
.bord2 {
  border-right: 1px solid #333;
  border-right: none;
}
.bord_p {
  border-right: 1px solid #333;
  text-align: center;
}
.lis {
  text-align: center;
  height: 50px;
  line-height: 50px;
  border-right: 1px solid #333;
  display: inline-block;
  /* padding: 0px 8px; */
}
.bded {
  border-right: 1px solid #333;
}
.rin {
  margin-right: 6px;
}
.rind {
  margin-right: 6px;
}
.qianshu {
  margin-left: 60px;
}
.pdng {
  padding-left: 5px;
}
.beizhu {
  height: 60px;
}
.manyi {
  margin-left: 300px;
}
.qian {
  font-weight: bold;
}
.el-col {
  min-height: 25px;
}
</style>