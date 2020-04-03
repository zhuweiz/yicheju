<template>
	<div class="w-100" style="padding-left: 30px;">

		<div style="width: 860px;margin: 50px auto;">
			<el-card class="box-card">
				<h1 class="text-center f-22 p-tb-15">{{data.garageName}}保险定损估价单</h1>

                <div class="mains">
                    <div class="fl">
                        <div class="ware">
                            <li style="width:22%;">车牌</li>
                            <li style="width: 55%;border-left: 1px solid #000;border-right: 1px solid #000;">{{data.carNo}}</li>
                            <li style="width:22%;">车型</li>
                        </div>
                        <div class="list">
                            <li class="bold">维修项目</li>
                            <li class="bold">拆装</li>
                            <li v-for="item in partsList1" :key="item.id">{{item.itemName}}</li>
                            <li v-if="partsList1.length == 0"></li>
                            <li class="bold">钣金</li>
                            <li v-for="item in partsList2" :key="item.id">{{item.itemName}}</li>
                            <li v-if="partsList2.length == 0"></li>
                            <li class="bold">喷漆</li>
                            <li v-for="item in partsList3" :key="item.id">{{item.itemName}}</li>
                            <li v-if="partsList3.length == 0"></li>
                            <li class="bold">机修</li>
                            <li v-for="item in partsList4" :key="item.id">{{item.itemName}}</li>
                            <li v-if="partsList4.length == 0"></li>
                        </div>
                        <div class="autograph">
                            <p>保险公司</p>
                            <p>经办人</p>
                            <p>日期</p>
                        </div>
                    </div>
                    <div class="fr">
                        <div class="wares">
                            <li style="width: 34%;">{{data.standard}}</li>
                            <li style="width: 16%;border-left: 1px solid #000;border-right: 1px solid #000;">保险公司</li>
                            <li style="width: 35%;border-right: 1px solid #000;">{{data.insuranceInfoDO ? data.insuranceInfoDO.insureCompanyName : ''}}</li>
                            <li style="width: 15%;" class="bd">
                                <p style="border-bottom: 1px solid #000;">
                                    <input type="checkbox" :checked="data.insuranceInfoDO.type == 0" style="vertical-align: middle;">
                                    <label style="vertical-align: middle;">标的</label>
                                </p>
                                <p>
                                    <input type="checkbox" :checked="data.insuranceInfoDO.type == 1" style="vertical-align: middle;">
                                    <label style="vertical-align: middle;">三者</label>
                                </p>
                            </li>
                        </div>
                        <div class="list">
                            <li class="bold">更换零件</li>
                        </div>
                        <div class="fr_list">
                            <div>
                                <li style="width:69%;border-right:1px solid #000;">名称</li>
                                <li style="width:31%;border-right:1px solid #000;">金额</li>
                            </div>
                            <div>
                                <li style="width:69%;border-right:1px solid #000;">名称</li>
                                <li style="width:31%;border-right:1px solid #000;">金额</li>
                            </div>
                            <div v-for="(item, index) in arrList" :key="index">
                                <li style="width:69%;border-right:1px solid #000;">{{item ? item.itemName : ''}}</li>
                                <li style="width:31%;border-right:1px solid #000;">{{item ? item.price : ''}}</li>
                            </div>
                        </div>
                        <div class="autograph">
                            <p>修理方</p>
                            <p>经办人</p>
                            <p>日期</p>
                        </div>
                    </div>
                </div>
                <!-- <div class="text item p-tb-30">
                    <table border="1" id="table">
                        <tr>
                            <td width="10%" rowspan="2">车牌</td>
                            <td width="20%" rowspan="2">{{data.carNo}}</td>
                            <td width="10%" rowspan="2">车型</td>
                            <td width="20%" rowspan="2">{{data.standard}}</td>
                            <td width="10%" rowspan="2">保险公司</td>
                            <td width="20%" rowspan="2">{{data.insuranceInfoDO.insureCompanyName}}</td>
                            <td width="10%">
                                <input type="checkbox" :checked="data.insuranceInfoDO.type == 0" style="vertical-align:middle;"> 
                                <label style="vertical-align:middle;">标的</label>  
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <input type="checkbox" :checked="data.insuranceInfoDO.type == 1" style="vertical-align:middle;"> 
                                <label style="vertical-align:middle;">三者</label>  
                            </td>
                        </tr>
                        <tr>
                            <td colspan="3" class="title_bold">维修项目</td>
                            <td colspan="4" class="title_bold">更换零件</td>
                        </tr>
                        <tr>
                            <td colspan="3" style="font-weight:bold;">拆装</td>
                            <td>名称</td>
                            <td>金额</td>
                            <td>名称</td>
                            <td>金额</td>
                        </tr>
                        <!-- <tr>
                            <td colspan="3" style="padding:0;">
                                <table class="proj">
                                    <tr v-for="item in partsList1" :key="item.id">
                                        <td>{{item.itemName}}</td>
                                    </tr>
                                </table>
                            </td>
                            <td colspan="4" style="padding:0;border:none;">
                                <div class="lists">
                                    <div v-for="item in partsList5" :key="item.id">
                                        <p>{{item.itemName}} *{{item.counts}}</p>
                                        <p>{{item.price}}</p>
                                    </div>
                                </div>
                            </td>
                            
                        </tr> -->
                        <!--
                        <tr v-for="item in partsList1" :key="item.id">
                            <td colspan="3">{{item.itemName}}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr v-if="partsList1.length == 0">
                            <td colspan="3"></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colspan="3" style="font-weight:bold;">钣金</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr v-for="item in partsList2" :key="item.id">
                            <td colspan="3">{{item.itemName}}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr v-if="partsList2.length == 0">
                            <td colspan="3"></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colspan="3" style="font-weight:bold;">喷漆</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr v-for="item in partsList3" :key="item.id">
                            <td colspan="3">{{item.itemName}}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr v-if="partsList3.length == 0">
                            <td colspan="3"></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colspan="3" style="font-weight:bold;">机修</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr v-for="item in partsList4" :key="item.id">
                            <td colspan="3">{{item.itemName}}</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr v-if="partsList4.length == 0">
                            <td colspan="3"></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colspan="3" class="fl">保险公司</td>
                            <td colspan="4" class="fl" style="border-left:1px solid #000;">修理方</td>
                        </tr>
                        <tr>
                            <td colspan="3" class="fl">经办人</td>
                            <td colspan="4" class="fl" style="border-left:1px solid #000;">经办人</td>
                        </tr>
                        <tr>
                            <td colspan="3" class="fl">日期</td>
                            <td colspan="4" class="fl" style="border-left:1px solid #000;">日期</td>
                        </tr>
                    </table>
                </div> -->
			</el-card>
		</div>

	</div>

</template>

<script>
import { getDamageByOId } from "../../request/api.js";
export default {
  name: "damagePrint",
  data() {
    return {
      data: {
          insuranceInfoDO: {
            insureCompanyName: '',
          }
      },
      projectList: [],
      partsList1: [],
      partsList2: [],
      partsList3: [],
      partsList4: [],
      partsList5: [],
      arrList: []
    };
  },
  created() {
    const data = {
      oid: localStorage.getItem("oid")
    };
    getDamageByOId(data).then(res => {
        this.data = res.data.data
        const projectList = this.data.orderDamageList
        
        if(projectList){
            this.partsList1 = projectList.filter(v => v.itemType == '1')
            this.partsList2 = projectList.filter(v => v.itemType == '2')
            this.partsList3 = projectList.filter(v => v.itemType == '3')
            this.partsList4 = projectList.filter(v => v.itemType == '4')
            this.partsList5 = projectList.filter(v => v.itemType == '5')
            
            const pl1 = this.partsList1.length > 0 ? this.partsList1.length : this.partsList1.length + 1;
            const pl2 = this.partsList2.length > 0 ? this.partsList2.length : this.partsList2.length + 1;
            const pl3 = this.partsList3.length > 0 ? this.partsList3.length : this.partsList3.length + 1;
            const pl4 = this.partsList4.length > 0 ? this.partsList4.length : this.partsList4.length + 1;
            
            let partLength = this.partsList5 ? this.partsList5.length : 0
            //3个大类占的空格
            const counts = (((pl1 + pl2 + pl3 + pl4) + 3) * 2) - partLength
            const arrList = new Array(counts)

            if(this.partsList5){
                this.partsList5.forEach(v => {
                    arrList.unshift(v)
                })
            }

            this.arrList = arrList

            setTimeout(function() {
                window.print()
            }, 500)
        }
	})
  },
  mounted() {},
  methods: {}
};
</script>
<style scoped>
table, tr, td{border-collapse: collapse;}
#table{width:100%;}
#table td{padding: 5px;text-align: center;border-color:#000;height: 33px;}
#table .fl{text-align: left;border: none;}
.title_bold{font-weight: bold;}
.proj{width:100%;}
.proj tr td{border-bottom: 1px solid #000;}
.proj tr:last-child td{border-bottom: none;}
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
    height: 60px;
    line-height: 60px;
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
.fr_list div{
    float:left;
    width: 50%;
}
.fr_list div:nth-of-type(even) li:nth-of-type(even){
    border-right: none !important;
}
</style>