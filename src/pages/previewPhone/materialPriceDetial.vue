<template>
<div>
  <tab>
      <tab-item selected @on-item-click="onItemClick">本周</tab-item>
      <tab-item @on-item-click="onItemClick">本月</tab-item>
      <tab-item @on-item-click="onItemClick">本季</tab-item>
 </tab>
  <div style="position:relative;margin-bottom:15px;">
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
import api from "api/procCommand";


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
        firstKeys: "BeginDate,EndDate,InfoNM,Area",
        firstValues: "",
        procName: "Pr_CommonExecuteSql",
        procType: 0,
        secondKeys: "PricePublishChartDetail",
        secondOperates: "",
        secondValues: ""
      },
      outPutConf: {},
      dataModel: {},
      options: {
        title: {
          text: "历史价格走势图",
          subtext: ""
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          data: ["价格信息"]
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
            name: "当日价格",
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
          Util.getCurrentWeek('-')[0] +
          "$,$" +
          Util.getCurrentWeek('-')[1] +
          "$,$" +
          this.$route.params.name +
          "$,$" +
          this.$route.params.area +"$";
      } else if (index == 1) {
        this.orderModel.firstValues =
          "$" +
          Util.getCurrentMonth('-')[0] +
          "$,$" +
          Util.getCurrentMonth('-')[1] +
          "$,$" +
          this.$route.params.name +
          "$,$" +
          this.$route.params.area +"$";
      } else if (index == 2) {
        this.orderModel.firstValues =
          "$" +
          Util.getCurrentSeason('-')[0] +
          "$,$" +
          Util.getCurrentSeason('-')[1] +
          "$,$" +
          this.$route.params.name +
          "$,$" +
          this.$route.params.area +"$";
      }
      this._loadPage();
    },
    _loadPage() {
      let _this = this;
      let params=_this.orderModel
     api.requestProcCommand(params).then(data => {
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
        x.push(i.pubDate);
        sd.push(i.price);
      });
      _this.options.xAxis[0].data = x;
      _this.options.series[0].data = sd;
      _this.options.title.text='【'+_this.outParams.material.area+'】'+_this.outParams.material.infoName+'*'+_this.outParams.material.infoModel+'*'+_this.outParams.material.infoUnit+'(价格走势图)'
    }
  },
  created() {
    this.orderModel.firstValues =
      "$" +
      Util.getCurrentWeek('-')[0] +
      "$,$" +
      Util.getCurrentWeek('-')[1] +
      "$,$" +
      this.$route.params.name +
      "$,$" +
          this.$route.params.area +"$";
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


