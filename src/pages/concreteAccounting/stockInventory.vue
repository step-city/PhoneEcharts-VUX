<template>
    <div>
    <group >
      <selector v-model="selectStation" title="拌和站：" name="district" :options="lists" @on-change="_onChange"></selector>
      <selector v-model="selectValue" title="生产线：" name="district" :options="list" @on-change="onChange"></selector>
    </group>
    <div style="position:relative;margin-top:5px;">
    <yl-echarts :options="options" ref="chartref" auto-resize>
    </yl-echarts>
    </div>
    </div>
</template>  
<script>
import fetch from "api/fetch";
import qs from "qs";

import "v-charts/lib/style.css";
import { Selector, Group } from "vux";
import api from "api/procCommand";
import { mapGetters } from "vuex";
import ECharts from "components/chart";
import "echarts/theme/dark";
import theme from "components/chart/theme.json";
ECharts.registerTheme("ovilia-green", theme);

export default {
  components: {
    "yl-echarts": ECharts,
    Selector,
    Group
  },
  data() {
    return {
      selectStation:'',
      lists:[],
      token: "",
      loginForm1: {
        client_id: "C1BC4CCED8B544FC15268B8F29CB0386",
        client_secret: "8F3D3BF3E3EA2895CD7E8E6173385AC57A39C27870714B66",
        grant_type: "client_credentials"
      },
      dataModel: [],
      selectValue: "",
      list: [{ key: "Z1", value: "一号线" }, { key: "Z2", value: "二号线" }],
      options: {
        tooltip: {},
        legend: {
          data: ["当前库存", "最低库存量", "最高库存量"]
        },
        xAxis: {
          data: [],
          axisTick: { show: true },
          axisLine: { show: true },
          axisLabel: {
            interval: 0,
            rotate: 40
          }
        },
        yAxis: {
          max: 200,
          min: 0,
          offset: 0,
          splitLine: { show: false }
        },
        grid: {
          top: "23%",
          containLabel: true,
          left: 10,
          right: 10
        },
        markLine: {
          z: -100
        },
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
          },
          {
            name: "最低库存量",
            type: "line",
            data: [],
            z: 100
          },
          {
            name: "最高库存量",
            type: "line",
            data: [],
            z: 100
          }
        ]
      },
      orderModel: {
        firstKeys: "OrgId",
        firstValues: "",
        procName: "Pr_CommonExecuteSql",
        procType: 0,
        secondKeys: "LWMonitoring",
        secondOperates: "",
        secondValues: ""
      }
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  methods: {
    _fetchRange(param){
      var _this = this;
      fetch(
        {
          url: "/api/services/app/organize/GetOrganizeTreeList",
          method: "post",
          data:param
        },
        {
          baseURL: "http://1.195.30.81:8989",
          authorization: 'Bearer 0-YYdUiT0V06r2pKcLwl23ebgXHy8rLxU7NgZWa9bRauEmbRq-Rgi3z8tKPs2r0TH4QIfDBM5tGQAgIlLmXGrLWxshAocSs5XDlrmCxweViLuW8WLPN0PpLCNx-rU0SuspFhx-06XbhdqKw-mngJOppxoRmGblYGorZ3-5wet6X91o5dCPWDvdOkyYZ6QGtUwl3MHEzx-ZObj3vzcIuF3gQ6DHob9VLz-xHFN5FezlP3c6EJRd_K5Zk2RKCZNn2-M8y_nZhvKgt4NpbAlGXmG8b1QNZm01G3feoiv-LfvNKBzgtDf7LOAL6eJ3bN5nxEaGqpsPC0oPfHbLBRuf_ZANiUGH7RPZqQRJ7YhwN_Ot-61WFKHdc8DBqGpMEYz-1p5m9H6YAH5tdKqa4BZhk3BrD6d07yeFkJTCFU6izzMQ1d64KOtaZmRd4PhWDnH5oF-6dlmQ-hd48qibe3l-2o8EAbCdUzdJfq3NwFKkmvlUZAuZ2R5OoxFF-s1J72psvAXrrY_2c5CYe7GHJfN_7R0W6xvtw0tcfQBx0aIHacOPQ',
          formatData: false
        }
      ).then(data => {
          if (data.success) {
          this.lists.push({
          key: data.result[0].id,
          value: data.result[0].text
        });
          this.selectStation=data.result[0].id
          this.orderModel.firstValues ="$" + data.result[0].id + "$";
          this._initEchart();
          }
        },
        err => {
          console.log(err);
        }
      );
    },
    _onChange(val){
        this.orderModel.firstValues ="$" + val + "$";
        this._initEchart()
    },
    onChange(val) {
      this.afterLoad(val);
    },
    afterLoad(option) {
      let _this = this;
      _this.options.series[0].label = {};
      _this.options.series[0].markLine = {};
      _this.options.xAxis.data = [];
      _this.options.series[0].data = [];
      _this.options.series[1].data = [];
      _this.options.series[2].data = [];
      _this.options.series[3].data = [];
      _this.options.yAxis.max = 200;
      var symbols = ["image://static/back.svg", "image://static/front.svg"];
      var labelSetting = {
        normal: {
          show: true,
          position: "outside",
          offset: [0, -50],
          formatter: function(param) {
            return param.value;
          },
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
      _this.dataModel.map(function(data) {
        if (data.v_Col8 == option) {
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
          _this.options.series[2].data.push(data.d_Col22);
          _this.options.series[3].data.push(data.d_Col23);
        }
      });
      _this.options.yAxis.max = maxNum;
    },
    _fetchToken() {
      let params = this.loginForm1;
      fetch(
        {
          url: "/Token",
          method: "post",
          data: params
        },
        {
          baseURL: "http://1.195.30.81:8989",
          authorization: "none",
          formatData: true
        }
      ).then(data => {
        if (data.token_type == "bearer") {
          this.token ="Bearer " + data.access_token;
          this._fetchRange()
        } else {
          this.$vux.toast.show({
            text: "获取token失败",
            time: 1000
          });
        }
      });
    },
    _initEchart() {
      var _this = this;
      _this.dataModel = [];
      let params = _this.orderModel;
      fetch(
        {
          url: "/api/services/app/sqlExecute/ExecuteSqlAndProcCommand",
          method: "post",
          data: params
        },
        {
          baseURL: "http://1.195.30.81:8989",
          authorization: _this.token,
          formatData: false
        }
      ).then(
        data => {
          if (data.success) {
            if (data.result.resultType === 0) {
              _this.dataModel = data.result.items[0];
              if (_this.options.series[0].data.length === 0) {
                _this.afterLoad(_this.selectValue);
              }
            }
          }
        },
        err => {
          console.log(err);
        }
      );
    }
  },
  created() {
    this._fetchToken();
    this.selectValue = "Z1";
  },
  mounted() {

  }
};
</script> 

<style scoped>
.echarts {
  width: auto;
  height: 450px;
}
</style>