<template>
<div  class="print-responsive">
  <meta charset="UTF-8"  name="viewport" content="width=device-width,user-scalable=no, initial-scale=1, shrink-to-fit=no, minimum-scale=0.5, maximum-scale=2.0,minimal-ui">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <div v-if="options.series[0].data.length===0" v-html="htmlContent" class="content"></div>
  <div v-else style="position:relative;margin-top:25px;">
    <yl-echarts :options="options" ref="chartref" auto-resize :events="chartEvents">
    </yl-echarts>
  </div>
</div>
</template>
<script type="text/babel">
import fetch from "api/fetch";
import { inputModel } from "api/inputmodel";
import ECharts from "components/chart";
import "echarts/theme/dark";
import theme from "components/chart/theme.json";
ECharts.registerTheme("ovilia-green", theme);

export default {
  components: {
    "yl-echarts": ECharts
  },
  data() {
    return {
      htmlContent: '<p style="text-algin:center">加载中，请稍后...</p>',
      outPutConf: {},
      dataModel: {},
      access_token: "",
      mainInput: new inputModel(),
      tokenParam: {
        client_id: "C1BC4CCED8B544FC15268B8F29CB0386",
        client_secret: "8F3D3BF3E3EA2895CD7E8E6173385AC57A39C27870714B66",
        grant_type: "client_credentials"
      },
      options: {
        title: {
          show: true,
          text: "机楼料仓检测图(单位:方/立方米)"
        },
        tooltip: {},
        legend: {
          top: "5%",
          data: ["当前库存"]
        },
        xAxis: {
          data: [],
          axisTick: { show: true },
          axisLine: { show: true },
          axisLabel: {}
        },
        yAxis: {},
        grid: {},
        markLine: {},
        series: [
          {
            name: "当前库存",
            type: "pictorialBar",
            symbolClip: true,
            label: {},
            data: [],
            markLine: {},
            z: 10
          },
          {
            name: "满仓",
            type: "pictorialBar",
            itemStyle: {
              normal: {
                color: "#ccc"
              }
            },
            data: []
          }
        ]
      }
    };
  },
  methods: {
    _randerPage(params) {
      let _this = this;
      let mviewConf = this.outPutConf.mviewConf;
    },
    _loadPage() {
      let _this = this;
      let OrderId = this.$route.params.id;
      fetch(
        {
          url: "/Token",
          method: "post",
          data: _this.tokenParam
        },
        {
          baseURL: window.getClientObj().sysConf.positionUrl,
          authorization: "none",
          formatData: true
        }
      )
        .then(data => {
          this.access_token = "Bearer " + data.access_token;
          let inputArr = [{ key: "Id", op: "EQ", value: OrderId }];
          this.mainInput.addqueryConditionItem(inputArr);
          fetch(
            {
              url: "/api/services/app/singleTable43/getMainPageList",
              method: "post",
              data: this.mainInput.inputModel
            },
            {
              baseURL: window.getClientObj().sysConf.positionUrl,
              authorization: this.access_token,
              formatData: false
            }
          ).then(data => {
            if (data.success) {
              let mConfigs = data.result.data[0];

              if (_this.options.series[0].data.length === 0) {
                _this.afterLoad(mConfigs);
              }
              // this.outPutConf=JSON.parse(mConfigs.extensionOne,util.dealFunction).outPutConf;
              // this._loadData(OrderId);
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
    afterLoad(data) {
      let _this = this;
      _this.options.series[0].label = {};
      _this.options.series[0].markLine = {};
      _this.options.xAxis.data = [];
      _this.options.series[0].data = [];
      _this.options.series[1].data = [];
      _this.options.yAxis.max = 200;
      var symbols = ["image://static/back.svg", "image://static/front.svg"];
      var labelSetting = {
        normal: {
          show: true,
          position: "outside",
          textStyle: {
            fontSize: 12,
            fontFamily: "Arial"
          }
        }
      };
      var markLineSetting = {
        symbol: "none",
        lineStyle: {
          normal: {
            opacity: 0.3
          }
        },
        data: []
      };
      _this.options.series[0].label = labelSetting;
      _this.options.series[0].markLine = markLineSetting;
      var maxNum = 0;
      if (data.d_Col21 > maxNum) {
        maxNum = data.d_Col21;
      }
      _this.options.xAxis.data.push("[" + data.v_Col6 + "]-" + data.v_Col7);
      _this.options.series[0].data.push({
        value: data.d_Col20,
        symbol: symbols[1],
        symbolBoundingData: data.d_Col21
      });
      _this.options.series[1].data.push({
        value: data.d_Col21,
        symbol: symbols[0],
        symbolBoundingData: data.d_Col21
      });
      _this.options.yAxis.max = maxNum;
    }
  },
  created() {
    this._loadPage();
  },
  mounted() {
    let _this = this;
    this.chartEvents = {
      click: function(e) {
        let str = e.name.substring(e.name.indexOf("-") + 1);
        _this.$router.push({
          name: "图表查看",
          params: { name: str, token: _this.access_token }
        });
      }
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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
</style>


