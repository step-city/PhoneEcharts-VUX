<template>
<div >
  <meta charset="UTF-8"  name="viewport" content="width=device-width,user-scalable=no, initial-scale=1, shrink-to-fit=no, minimum-scale=0.5, maximum-scale=2.0,minimal-ui">
  <meta name="apple-mobile-web-app-capable" content="yes">
<div class="header">
    <div class="line" v-for="item in list" :key="item.id">
        <div class="label">{{item.label}}</div>
        <div class="value">{{item.value}}</div>
    </div>
  </div>
<div class="content">
    <div class="dataObject" v-for="(item,index) in items" :key="index">
         <div class="line" >
            <div class="label">供应商</div> <div class="value">{{item.supplierName}}</div>
         </div>
          <div class="line">
            <div class="label">数量</div> <div class="value">{{item.quantity}}</div>
         </div>
          <div class="line" >
            <div class="label">进料日期</div> <div class="value">{{item.makerDate}}</div>
         </div>
          <div class="line" >
            <div class="label">收料类型</div> <div class="value">{{item.datatype==1?'PDA进料':item.datatype==2?'磅单进料':'手工进料'}}</div>
         </div>
    </div>
</div>
  <div v-show="dataModel.length==0" class="v-charts-data-empty">
    暂无数据
  </div>
</div>
</template>
<script type="text/babel">
import fetch from "api/fetch";
import { dateFormat } from "vux";

export default {
  components: {},
  data() {
    return {
      orderModel: {
        firstKeys:
          "DataType,BeginDate,EndDate,InfoNM,ClassCode,OrgId,InfoName,InfoModel",
        firstValues: "",
        procName: "Report_OriginMaterialReceiveRegister",
        procType: 0,
        secondKeys: "",
        secondOperates: "",
        secondValues: ""
      },
      list: [],
      items: [],
      sysUrl: window.getClientObj().sysConf.baseUrl,
      htmlContent: '<p style="text-algin:center">加载中，请稍后...</p>',
      outPutConf: {},
      dataModel: {},
      access_token: "",
      tokenParam: {
        client_id: "C1BC4CCED8B544FC15268B8F29CB0386",
        client_secret: "8F3D3BF3E3EA2895CD7E8E6173385AC57A39C27870714B66",
        grant_type: "client_credentials"
      }
    };
  },
  computed: {},
  methods: {
    _loadPage() {
      let _this = this;
      fetch(
        {
          url: "/Token",
          method: "post",
          data: _this.tokenParam
        },
        {
          baseURL: this.sysUrl,
          authorization: "none",
          formatData: true
        }
      )
        .then(data => {
          this.access_token = "Bearer " + data.access_token;
          fetch(
            {
              url: "/api/services/app/sqlExecute/ExecuteSqlAndProcCommand",
              method: "post",
              data: this.orderModel
            },
            {
              baseURL: this.sysUrl,
              authorization: this.access_token,
              formatData: false
            }
          ).then(data => {
            if (data.success) {
              let mConfigs = data.result.items[0];
              _this.dataModel=mConfigs;
              _this.afterLoad(mConfigs);
            } else {
              this.$vux.toast.show({
                text: "失败！" + data.error.message
              });
            }
          });
        })
        .catch(err => {
          this.$vux.toast.show({
            text: "获取token异常!" + err
          });
        });
    },
    afterLoad(array) {
      let element = array[0];
      let _this = this;
      _this.list = [];
      _this.items = [];
      _this.list.push(
        { label: "材料名称", value: element.infoName },
        { label: "规格型号", value: element.infoModel },
        { label: "单位", value: element.infoUnit }
      );
        _this.items=array;
    }
  },
  created() {
    let EndDate = dateFormat(new Date(), "YYYY-MM-DD");
    this.orderModel.firstValues =
      "#0#,#1999-03-01#,#" +
      EndDate +
      "#,#" +
      this.$route.params.id +
      "#,#DISTINCTGANGCAI#,#" +
      this.$route.params.orgid +
      "#,##,##";
    this._loadPage();
  },
  mounted() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header {
    border: slategrey 1px solid;
    font-size:16px;
    font-weight:500;
    padding:5px;

}
.header .line{
    display: flex;
}
.header .line .label{
    text-align: left;
    width: 100px;
}
.header .line .value{
    text-align: right;
    flex:1
}

.content {
    border: slategrey 1px solid;
    font-size:15px;
    font-weight:500;
    padding:5px;
   
}
.content  .dataObject {
     border-bottom: rgb(96, 168, 124) 2px solid;
}
.content .dataObject .line{
     display: flex;
     
}
.content  .dataObject .line .label{
    text-align: left;
    width: 100px;
}
.content  .dataObject .line .value{
    text-align: right;
    flex:1;
    color: #b2b2b2;
}
.v-charts-data-empty {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.7);
  color: #888;
  font-size: 14px;
}
</style>


