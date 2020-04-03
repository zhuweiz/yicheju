<template>
	<div class="w-100" style="padding-left: 30px;">

		<div style="width: 860px;margin: 50px auto;">
			<el-card class="box-card">
				<h1 class="text-center f-22 p-tb-15">{{data.garageName}}派工单</h1>
            <div class="head">
                <div style="float:left"></div>
            </div>
            <el-row :gutter="20">
                <el-col :span="12">接待：{{data.serviceMan}}  业务：{{data.sellsMan}}   交车时间：{{data.completeTime}}</el-col>
                <el-col :span="12" style="text-align:right;">制单：{{data.creator}} 日期：{{data.bizDate}}</el-col>
            </el-row>
          <div class="mains" style="border-bottom: none;">
            <div class="fl">
                <div class="ware">
                    <li style="width:22%;">车牌</li>
                    <li style="width: 55%;border-left: 1px solid #000;border-right: 1px solid #000;">{{data.carNo}}</li>
                    <li style="width:22%;">车型</li>
                </div>
                <div class="list">
                    <li class="bold">维修项目</li>
                    <div v-for="(item, index) in list" :key="index">
                      <li class="bold" style="text-align:left;text-indent: 10px;">{{item.groupName}}</li>
                      <li v-for="v in item.itemDataVOList" :key="v.itemId">{{v.itemName}} {{v.quantity ? '*'+v.quantity : ''}}</li>
                    </div>
                </div>
            </div>
            <div class="fr">
                <div class="wares">
                    <li style="width: 49%;">{{data.standard}}</li>
                    <li style="width: 15%;border-left: 1px solid #000;border-right: 1px solid #000;">日期</li>
                    <li style="width: 36%;">{{data.bizDate}}</li>
                </div>
                <div class="list">
                    <li class="bold">更换零件</li>
                </div>
                <div class="fr_list">
                    <div>
                      <li style="width:50%;border-right:1px solid #000;">名称</li>
                      <li style="width:50%;">名称</li>
                      <li style="width:50%;border-right:1px solid #000;text-align:left;text-indent: 10px;" v-for="(item, index) in arrList" :key="index">{{item ? item.partName : ''}} {{item ? '*'+item.quantity : ''}}</li>
                    </div>
                </div>
            </div>
        </div>
        <div class="autograph">
            <p style="font-weight:bold;float:left;">接待：{{data.serviceMan}}</p>
            <p style="font-weight:bold;float:left;padding-left:20px;">业务：{{data.sellsMan}}</p>
        </div>
          <!-- <div class="text item p-tb-30">
              <table id="table" border="1">
                  <tr>
                      <td width="10%">车牌</td>
                      <td width="20%">{{data.carNo}}</td>
                      <td width="10%">车型</td>
                      <td width="30%">{{data.standard}}</td>
                      <td width="10%">日期</td>
                      <td width="20%">{{data.bizDate}}</td>
                  </tr>
                  <tr>
                      <td colspan="3" class="title_bold">维修项目</td>
                      <td colspan="3" class="title_bold">更换零件</td>
                  </tr>
                  <div v-for="(item, index) in list" :key="index" style="display: table-row-group;">
                      <tr>
                          <td colspan="3" style="text-align:left;font-weight:bold;">{{item.groupName}}</td>
                          <td v-if="index == 0">名称</td>
                          <td v-if="index == 0" colspan="2">名称</td>
                          <td v-if="index > 0"></td>
                          <td v-if="index > 0" colspan="2"></td>
                      </tr>
                      <tr v-for="v in item.itemDataVOList" :key="v.itemId">
                          <td colspan="3" style="vertical-align: middle;">{{v.itemName}}</td>
                          <td colspan="3" style="padding:0;border:none;">
                              <div class="lists">
                                  <div v-for="data in v.partDataVOList" :key="data.id">
                                      <p>{{data.partName}} *{{data.quantity}}</p>
                                  </div>
                                  <div>
                                      <p>3434</p>
                                  </div>
                                  <div v-if="v.type == 0">
                                      <p></p>
                                  </div>
                              </div>
                          </td>
                      </tr>
                  </div>

                  <tr class="noborder">
                      <td class="fl">接待：</td>
                      <td class="fl">{{data.serviceMan}}</td>
                      <td class="fl">业务：</td>
                      <td class="fl" colspan="6">{{data.sellsMan}}</td>
                  </tr>
              </table>
          </div> -->
			</el-card>
		</div>

	</div>

</template>

<script>
import { getDispatchByOId } from "../../request/api.js";
export default {
  name: "orderPrint",
  data() {
    return {
      data: "",
      list: [],
      partList: [],
      arrList: []
    };
  },
  created() {
    const data = {
      oid: localStorage.getItem("oid")
    };
    getDispatchByOId(data).then(res => {
      this.data = res.data.data
      this.list = this.data.dispatchItemList
      this.partList = this.data.partList || []
      let leng = this.list.length
      this.list.forEach(v => {
        leng+=v.itemDataVOList.length
      });

      let arrList = []

      let partLength = this.partList ? this.partList.length : 0
      if(leng != 0){
        arrList = new Array()
      }else{
        arrList = new Array(2 - partLength)
      }
      
      if(this.partList){
        this.partList.forEach(v => {
            arrList.unshift(v)
        })
      }
      this.arrList = arrList
       setTimeout(function() {
         window.print();
       }, 500);
    });
  },
  mounted() {},
  methods: {}
};
</script>
<style scoped>
#table{width:100%;border-collapse: collapse;}
#table tr{border-left:1px solid #000;border-bottom:1px solid #000;}
#table td{padding: 5px;text-align: center;border-color:#000;height: 33px;border-top:1px solid #000;border-right:1px solid #000;}
#table .fl{text-align: left;border: none;font-weight:bold;}
#table .noborder{border:none;}
.title_bold{font-weight: bold;}
.lists{display: flex;flex-wrap: wrap;}
.lists div{display: flex; float: left;align-items: center;border-right: 1px solid #000;}
.lists div:nth-of-type(odd){width: 50.2%;}
.lists div:nth-of-type(even){width: 49.8%;}
.lists div p{float:left;text-align: center;height: 100%;padding: 5px;display: flex;align-items: center;justify-content: center;}
.mains{
    width: 820px;
    overflow:hidden;
    border: 1px solid #000;
    margin-top: 20px;
}
.fl{
    width: 330px;
    border-right: 1px solid #000;
    display: table-cell;
}
.fr{
    display: table-cell;
    width: 489px;
    vertical-align: top;
}
li{
    list-style: none;
}
.ware, .wares{
    overflow:hidden;
}
.ware li, .wares li{
    float: left;
    text-align: center;
    height: 39px;
    line-height: 39px;
}
.list li{
    border-top: 1px solid #000;
    text-align:center;
    height: 39px;
    line-height: 39px;
}
.list li.bold{
    font-weight: bold;
}
.autograph{
    border-top: 1px solid #000;
    padding-left: 10px;
}
.autograph p{
    text-align:left;
    padding: 10px 0px;
}
.bd p{
    margin:0;
    height: 30px;
    line-height: 30px;
    text-align: left;
    padding-left: 10px;
}
.fr_list{
    overflow: hidden;
}
.fr_list li{
    float:left;
    text-align: center;
    height: 39px;
    line-height: 38px;
    border-top: 1px solid #000;
}
.fr_list li:nth-of-type(even){
    border-right: none !important;
}
</style>