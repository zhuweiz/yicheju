<template>
 <div class="w-100 order flex-col h-100" style="overflow-x:hidden;">
    <el-row :gutter="20">
        <el-col :span="24" style="text-align:center;padding: 50px;">
          <el-image :src="qrcode" style="width:300px;height:300px;"></el-image>
        </el-col>
        <el-col :span="24" style="text-align:center;">
          <el-button type="success" @click="downhander">保存图片</el-button>
        </el-col>
    </el-row>
</div>
</template>

<script>
import { getQrCode } from "../../request/api.js";

export default {
  data() {
    return {
      qrcode: ''
    }
  },
  created() {
    getQrCode({gid: localStorage.getItem("gid")}).then(e => {
      this.qrcode = e.data.data.qrCodePic
    })
  },
  methods: {
    downhander(){
      this.downloadImg(this.qrcode,'pic')
      this.$message({
        message: '正在开始下载图片，如果浏览器无响应，请使用右键-图片另存为来保存图片',
        type: 'warning'
      })
    },
    downloadImg(imgsrc, name){
      var image = new Image();
      // 解决跨域 Canvas 污染问题
      image.setAttribute("crossOrigin", "anonymous");
      image.onload = function() {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext("2d");
        context.drawImage(image, 0, 0, image.width, image.height);
        var url = canvas.toDataURL(); //得到图片的base64编码数据
        console.log(url)

        var a = document.createElement("a"); // 生成一个a元素
        var event = new MouseEvent("click"); // 创建一个单击事件
        a.download = name || "photo"; // 设置图片名称
        a.href = url; // 将生成的URL设置为a.href属性
        a.dispatchEvent(event); // 触发a的单击事件
      };
      image.src = imgsrc;
    }
  }
};
</script>

<style scoped>
</style>