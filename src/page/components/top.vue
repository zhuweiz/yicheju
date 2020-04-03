<template>
	<header class="w-100 h-100 flex">
		<div class="" style="width: 402px;min-width: 402px;">
			<img src="../../../static/img/login.png" />
		</div>
    <div class="rel" style="height:95px;width:100%">
      <!-- <div class="abs text-center" style="width:141px;height:46px;line-height:46px;top:23px;left:-32px; background:url(../../../static/img/topselectBg.png) no-repeat;">快速切换</div> -->
      <div class="abs text-center b-0" style="width:59px;height:20px;left:15%; background:url(../../../static/img/carBg.png) no-repeat;"></div>
			<div class="right p-t-25 p-r-30">
        <a class="right white r-100 block iconfont icon-guanji text-center f-26 c-p" style="width:46px;height:46px;line-height:46px;color:#FF6161;" @click="toLogin()"></a>
        <a class="right white r-100 block iconfont icon-zhuye text-center f-26 m-r-15 c-p" style="width:46px;height:46px;line-height:46px;color:#0D906E;" @click="toHome()"></a>
        <div class="right m-r-50">
          <a class="left r-100 white block text-center f-26" style="width:46px;height:46px;"><img src="../../../static/img/userImg.png" width="100%" height="100%"></a>
          <div class="left p-lr-5">
          <p>{{phone}}</p>
          <p style="line-height: 16px;">欢迎您回来</p>
          </div>
        </div>
        
			 <el-dropdown @command="handleCommand" class="m-t-10 m-r-20">
		      <span class="el-dropdown-link c-white">
		        {{gname}}<i class="el-icon-arrow-down el-icon--right"></i>
		      </span>
		      <el-dropdown-menu slot="dropdown">
		        <el-dropdown-item v-for="(item,index) in factoryList" :key="index" icon="el-icon-office-building" :command="item">{{item.name}}</el-dropdown-item>
		      </el-dropdown-menu>
		    </el-dropdown>
		</div>
		</div>
		
		<div class="clear"></div>
	</header>
</template>

<script>
import { getWxc,tabUser } from "../../request/api.js";
export default {
  name: "top",
  data() {
    return {
      //name: localStorage.getItem("userNAME"),
      phone: localStorage.getItem("phone"),
      userid:"",
      gid:"",
      gname:"",
      factoryList:[]
    };
  },
  created() {
    if(!this.phone){
      this.toLogin()
    }
    const data = {
      phone:this.phone
    }
    getWxc(data).then((res)=>{
      localStorage.setItem("userInfo", JSON.stringify(res.data.data))
      localStorage.setItem("phone", res.data.data.phone)
      this.gid = localStorage.getItem("gid")
      if(!this.gid){
        localStorage.setItem("gid",res.data.data.gid)
        this.gid = res.data.data.gid
      }
      this.userid = res.data.data.id
      this.factoryList = res.data.data.allGarageList
      if(this.factoryList.length>0){
        let row = this.factoryList.find(v => v.id == localStorage.getItem("gid"))
        this.gname = row.name
      }
    })
  },
  mounted() {},
  methods: {
     handleCommand(command) {
        const data = {
          id:this.userid,
          gid:command.id
        }
        tabUser(data,{headers:{"Content-Type":"application/json"}}).then((res)=>{
          if(res.data.code === 200){
            this.gname = command.name
            this.gid = localStorage.setItem("gid",res.data.data.gid)
            this.$message({
              message: '已切换至' + this.gname,
              type: 'warning'
            });
            this.$router.push({path:"/"})
          }
        })
      },
    toHome() {
      this.$router.push({
        path: "/"
      });
    },
    toLogin() {
      sessionStorage.removeItem("token");
      this.$router.push({
        path: "/login/login"
      });
    }
  }
};
</script>
<style scoped>
	
</style>
