<template>
<div  class="print-responsive">
  <meta charset="UTF-8"  name="viewport" content="width=device-width,user-scalable=no, initial-scale=1, shrink-to-fit=no, minimum-scale=0.5, maximum-scale=2.0,minimal-ui">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <div v-if="list==''" v-html="htmlContent" class="content"></div>
  <div v-else>
  <group  class="weui-cells vux-no-group-title">
  <cell v-for="item in list" :key="item.id" :title="item.label" :value="item.value"></cell>
</group>
 <card >
      <div slot="content" class="card-demo-flex card-demo-content01">
        <div class="vux-1px-r">
          <span>{{listbody.v_Col12}}</span>
          <br/>
          班组
        </div>
        <div class="vux-1px-r">
          <span>{{listbody.v_Col10}}</span>
          <br/>
         加工时间
        </div>
        <div class="vux-1px-r">
          <span>{{listbody.v_Col11}}</span>
          <br/>
          加工人
        </div>
      </div>
    </card>
    <card >
      <div slot="content" class="card-demo-flex card-demo-content01">
        <div class="vux-1px-r">
          <span>{{listbody.v_Col8}}</span>
            <br/>
          送检时间
        </div>
        <div class="vux-1px-r">
          <span>{{listbody.v_Col9}}</span>
          <br/>
         送检人
        </div>
        <div class="vux-1px-r">
          <span>{{listbody.v_Col14}}</span>
          <br/>
          送检结果
        </div>
      </div>
    </card>
    <div class="content-cell">
    <div class="dataObject" v-for="(item,index) in itemsList" :key="index">
         <div class="line" >
            <div class="label">材料名称</div> <div class="value">{{item.infoName}}</div>
         </div>
          <div class="line" >
            <div class="label">规格型号</div> <div class="value">{{item.infoModel}}</div>
         </div>
          <div class="line" >
            <div class="label">单位</div> <div class="value">{{item.infoUnit}}</div>
         </div>
          <div class="line" >
            <div class="label">钢筋编号</div> <div class="value">{{item.iV_Col6}}</div>
         </div>
          <div class="line" >
            <div class="label">根长(米)</div> <div class="value">{{item.iD_Col21}}</div>
         </div>
            <div class="line" >
            <div class="label">根数</div> <div class="value">{{item.iD_Col25}}</div>
         </div>
            <div class="line" >
            <div class="label">转换率(千克/米)</div> <div class="value">{{item.iD_Col23}}</div>
         </div>
            <div class="line" >
            <div class="label">数量</div> <div class="value">{{item.quantity+item.infoUnit}}</div>
         </div>
    </div>
    </div>
</div>
</div>
</template>
<script type="text/babel">
import fetch from "api/fetch";
import { inputModel } from "api/inputmodel";
import { Cell, Group, Card } from "vux";

export default {
  components: {
    Cell,
    Group, 
    Card
  },
  data() {
    return {
      list: [],
      listbody:{},
      itemsList:[],
      sysUrl: window.getClientObj().sysConf.baseUrl,
      htmlContent: '<p style="text-algin:center">加载中，请稍后...</p>',
      outPutConf: {},
      dataModel: {},
      access_token: "",
      mainInput: new inputModel(),
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
      let OrgId = this.$route.params.id;
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
          this.listbody={};
          let inputArr = [
            { key: "Id", op: "EQ", value: OrgId }
          ];
          this.mainInput.addqueryConditionItem(inputArr);
          this.mainInput.maxResultCount=10000;
          fetch(
            {
              url: "/api/services/app/singleTable10/getMainPageList",
              method: "post",
              data: this.mainInput.inputModel
            },
            {
              baseURL: this.sysUrl,
              authorization: this.access_token,
              formatData: false
            }
          ).then(data => {
            if (data.success) {
              let mConfigs = data.result.data[0];
              this.listbody=mConfigs;
              _this.afterLoad(mConfigs);
              _this.fetchItems(mConfigs.infoNM);
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
    fetchItems(params){
      let _this=this;
      this.itemsList=[]
      let inputArr = [
            { key: "OrderId", op: "EQ", value: params },
          ];
          this.mainInput.addqueryConditionItem(inputArr);
          this.mainInput.maxResultCount=10000;
          fetch(
            {
              url: "/api/services/app/table21Order/getItemPageList",
              method: "post",
              data: this.mainInput.inputModel
            },
            {
              baseURL: this.sysUrl,
              authorization: this.access_token,
              formatData: false
            }
          ).then(data => {
            if (data.success) {
              this.itemsList = data.result.data;
            } else {
              this.$vux.toast.show({
                text: "失败！" + data.error.message
              });
            }
          });
    },
    afterLoad(element) {
      let _this = this;
      _this.list = [];
      _this.list.push(
        { label: "材料名称", value: element.infoName },
        { label: "规格型号", value: element.infoModel },
        { label: "单位", value: element.infoUnit },
      );
    }
  },
  created() {
    this._loadPage();
  },
  mounted() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.print-responsive{
  position: absolute;
}
.content {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
}
.weui-cells {
  top:-12px;
  font-size: 10px;
}
.weui-cell{
  padding: 6px 12px;
  font-size: 14px;
}
.weui-cells:before{
    border-top: 1px solid #353535;
}
.weui-cells:after{
   border-bottom: 1px solid #353535;
}
.card-demo-flex {
  display: flex;
  border-bottom: 1px solid #353535;
}
.card-demo-content01 {
 margin-top: -2px;
}
.card-demo-flex > div {
  flex: 1;
  text-align: center;
  font-size: 14px;
}
.card-demo-flex span {
  color: #f74c31;
}
.content-cell {
    border:#353535 1px solid;
    font-size:14px;
    font-weight:500;
    padding:5px;
    margin-top: 3px;
   
}
.content-cell  .dataObject {
     border-bottom: rgb(96, 168, 124) 2px solid;
}
.content-cell .dataObject .line{
     display: flex;
}
.content-cell  .dataObject .line .label{
    text-align: left;
    width: 100px;
}
.content-cell  .dataObject .line .value{
    text-align: right;
    flex:1
}
</style>


