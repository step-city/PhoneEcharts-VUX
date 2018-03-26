<template>
<div  class="print-responsive">
  <meta charset="UTF-8"  name="viewport" content="width=device-width,user-scalable=no, initial-scale=1, shrink-to-fit=no, minimum-scale=0.5, maximum-scale=2.0,minimal-ui">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <tab>
      <tab-item selected @on-item-click="onItemClick">本周</tab-item>
      <tab-item @on-item-click="onItemClick">本月</tab-item>
      <tab-item @on-item-click="onItemClick">本季</tab-item>
 </tab>
  <!-- <div v-show="loading" v-html="htmlContent" class="content">
  </div> -->
  <div style="position:relative;margin-top:25px;">
    <yl-echarts :options="options" ref="chartref" auto-resize>
    </yl-echarts>
    <div v-show="dataModel.length==0" class="v-charts-data-empty">
    暂无数据
  </div>
  </div>
</div>
</template>
<script type="text/babel">
import fetch from "api/fetch";
import ECharts from "components/chart";
import { Tab, TabItem } from "vux";
import Util from "common/timepick";

export default {
  components: {
    "yl-echarts": ECharts,
    Tab,
    TabItem
  },
  data() {
    return {
      loading: false,
      orderModel: {
        firstKeys: "BeginDate,EndDate,V_Col7",
        firstValues: "",
        procName: "Pr_CommonExecuteSql",
        procType: 0,
        secondKeys: "HistoricalData",
        secondOperates: "",
        secondValues: ""
      },
      // htmlContent: '<p style="text-algin:center">加载中，请稍后...</p>',
      outPutConf: {},
      dataModel: {},
      access_token: "",
      tokenParam: {
        client_id: "C1BC4CCED8B544FC15268B8F29CB0386",
        client_secret: "8F3D3BF3E3EA2895CD7E8E6173385AC57A39C27870714B66",
        grant_type: "client_credentials"
      },
      options: {
        title: {
          text: "历史数据",
          subtext: ""
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["当前重量"]
        },
        toolbox: {
          show: true,
          feature: {
            dataView: {
              show: true,
              readOnly: false
            },
            magicType: {
              show: true,
              type: ["line"]
            },
            restore: { show: true },
            saveAsImage: {
              show: true
            }
          }
        },
        dataZoom: [
          {
            startValue: ""
          },
          {
            type: "inside"
          }
        ],
        calculable: true,
        xAxis: [
          {
            type: "category",
            data: []
          }
        ],
        yAxis: [
          {
            type: "value"
          }
        ],
        series: [
          {
            name: "当前时间",
            type: "line",
            barWidth: "50%",
            data: []
          }
        ]
      }
    };
  },
  methods: {
    onItemClick(index) {
      if (index == 0) {
        this.orderModel.firstValues =
          "$" +
          Util.getCurrentWeek()[0] +
          "$,$" +
          Util.getCurrentWeek()[1] +
          "$,$" +
          this.$route.params.name +
          "$";
      } else if (index == 1) {
        this.orderModel.firstValues =
          "$" +
          Util.getCurrentMonth()[0] +
          "$,$" +
          Util.getCurrentMonth()[1] +
          "$,$" +
          this.$route.params.name +
          "$";
      } else if (index == 2) {
        this.orderModel.firstValues =
          "$" +
          Util.getCurrentSeason()[0] +
          "$,$" +
          Util.getCurrentSeason()[1] +
          "$,$" +
          this.$route.params.name +
          "$";
      }
      this._loadPage();
    },
    _loadPage() {
      let _this = this;
      let authToken = this.$route.params.token;
      fetch(
        {
          url: "/api/services/app/sqlExecute/ExecuteSqlAndProcCommand",
          method: "post",
          data: this.orderModel
        },
        {
          baseURL: window.getClientObj().sysConf.positionUrl,
          authorization: authToken,
          formatData: false
        }
      ).then(data => {
        if (data.success) {
          let mConfigs = data.result.items[0];
          _this.dataModel = mConfigs;
          if (data.result.items.length > 0) {
            _this.afterLoad(mConfigs);
          }
        } else {
          this.$vux.toast.show({
            text: "失败！" + data.error.message
          });
        }
      });
    },
    afterLoad(data) {
      this.options.xAxis[0].data = [];
      this.options.series[0].data = [];
      let _this = this;
      let x = [];
      let sd = [];
      data.map(i => {
        x.push(i.v_Col9);
        sd.push(i.d_Col20);
      });
      _this.options.xAxis[0].data = x;
      _this.options.series[0].data = sd;
    }
  },
  created() {
    this.orderModel.firstValues =
      "$" +
      Util.getCurrentWeek()[0] +
      "$,$" +
      Util.getCurrentWeek()[1] +
      "$,$" +
      this.$route.params.name +
      "$";
    this._loadPage();
  },
  mounted() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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


