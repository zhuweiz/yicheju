<template>
	<div class="w-100" style="padding-left: 30px;">

		<div style="width: 860px;margin: 50px auto;">
			<el-card class="box-card">
				<h1 class="text-center f-22 p-tb-15">{{data.garageName}}附件工单</h1>
          <div class="mains" style="border-bottom: none;">
            <div class="fl">
                <div class="ware">
                    <li style="width:22%;">车牌</li>
                    <li style="width: 55%;border-left: 1px solid #000;border-right: 1px solid #000;">{{data.carNo}}</li>
                    <li style="width:22%;">车型</li>
                </div>
                <div class="list">
                    <li class="bold">维修项目</li>
                    <li class="bold">名称</li>
                    <div v-for="(item, index) in list" :key="index">
                      <li class="bold" style="text-align:left;text-indent: 10px;">{{item.item}}</li>
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
                      <li style="width:50%;border-right:1px solid #000;text-align:left;text-indent: 10px;" v-for="(item, index) in arrList" :key="index">{{item ? item.partName : ''}} {{item ? '*'+item.total : ''}}</li>
                    </div>
                </div>
            </div>
        </div>
        <div class="autograph">
            <p style="font-weight:bold;float:left;">接待：{{data.serviceMan}}</p>
            <p style="font-weight:bold;float:left;padding-left:20px;">业务：{{data.sellsMan}}</p>
        </div>
			</el-card>
		</div>

	</div>

</template>

<script>
import { getAttachmentSettlementedDetailByOId } from "../../request/api.js";
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
    getAttachmentSettlementedDetailByOId(data).then(res => {
      this.data = res.data.data
      this.list = this.data.itemList
      if(this.list){
        this.list.forEach(v => {
            v.attachmentPartStoreDTOList.forEach(k => {
                this.partList.push(k)
            })
        })
     }
      let leng = this.list.length

      let partLength = this.partList ? this.partList.length : 0
      //一行2格
      const arrList = new Array(leng*2 - this.partList.length)

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