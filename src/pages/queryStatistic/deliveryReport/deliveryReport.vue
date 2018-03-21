<template>
    <div>
       <x-button mini plain type="primary" style="display: block;float:right;margin:-38px 2px 1px;" @click.native="_onConfirm">{{titleName}}</x-button>
        <flexbox>
                <flexbox-item>
                    <x-button v-show="show" mini type="primary" :gradients="['#1D62F0', '#19D5FD']" @click.native="changeType">切换图表类型</x-button>
                </flexbox-item>
            </flexbox>
            <div v-show="!show" class="wrappers" ref="wrapper">
                  <x-table class="tablelist" full-bordered> 
                    <thead>
                        <tr class="tablelist-th">
                            <th >类名称</th>
                            <th>计划总量</th>
                            <th >本月发料</th>
                            <th >开累发料</th>
                            <th >待发数量</th>
                        </tr>
                    </thead>
                    <tbody v-if="itemsModel.length !== 0">
                         <tr :class="{'vux-tap-active': true,'weui-cell_access': true}" v-for="(list,index) in itemsModel" :key="index"
            :style="{'background-color':list.jcbl>1?'red':''}">
                            <td v-text="list.tjClassName" :style="nameSize" @click="_clickName"></td>
                            <td v-text="list.planQuantity"></td>
                            <td v-text="list.currMonReceiveQuantity"></td>
                            <td v-text="list.klReceiveQuantity"></td>
                            <td v-text="list.weishouQuantity"></td>
                        </tr>
                    </tbody>
                </x-table>
                <load-more style="margin-top:22%;" :show-loading="false" v-show="itemsModel.length == 0"  tip="暂无数据..." background-color="#fbf9fe"></load-more>
            </div>
        <ve-chart v-show="show" :data="chartData" :settings="chartSettings" tooltip-visible legend-visible></ve-chart>
    </div>
</template>  
<script>
import { XButton, Flexbox, FlexboxItem, XSwitch, XTable, LoadMore } from "vux";
import api from "api/procCommand";
import { mapGetters } from "vuex";
import BScroll from "better-scroll";

export default {
  components: {
    XButton,
    Flexbox,
    FlexboxItem,
    XSwitch,
    XTable,
    LoadMore
  },
  data() {
    return {
      titleName: "报表",
      nameSize: "",
      itemsModel: [],
      show: true,
      switchType: false,
      typeArr: ["histogram", "pie", "line"],
      index: 0,
      chartSettings: {},
      chartData: {
        columns: ["类别", "计划金额", "发料金额"],
        rows: []
      },
      orderModel: {
        firstKeys: "OrgId",
        firstValues: "",
        procName: "Report_DeliveryTimeQuantumQuery",
        procType: 0,
        secondKeys: "",
        secondOperates: "",
        secondValues: ""
      }
    };
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  watch: {
    $route: "_initEchart"
  },
  methods: {
    _clickName() {
      if (this.nameSize == "") {
        this.nameSize = { "font-size": "4px" };
      } else {
        this.nameSize = "";
      }
    },
    _initScroll() {
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true
      });
    },
    _initEchart() {
      var that = this;
      that.itemsModel = [];
      that.chartData.rows = [];
      let pars = that.orderModel;
      api.requestProcCommand(pars).then(
        response => {
          let array = response.result.items[0];
          for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if (element.isLeaf) {
              var obj = {
                类别: element.tjClassName,
                计划金额: element.planSum,
                发料金额: element.klReceiveSum,
                本月值: element.currMonReceiveSum
              };
              that.chartData.rows.push(obj);
              that.index = 0;
              that.chartSettings = { type: that.typeArr[that.index] };

              that.itemsModel.push(element);
            }
          }
          this.$nextTick(() => {
            this._initScroll();
          });
        },
        err => {
          console.log(err);
        }
      );
    },
    _onConfirm() {
      if (this.titleName == "报表") {
        this.titleName = "图表";
        this.show = false;
      } else {
        this.titleName = "报表";
        this.show = true;
      }
    },
    changeType: function() {
      this.index++;
      if (this.index >= this.typeArr.length) {
        this.index = 0;
      }
      this.chartSettings = { type: this.typeArr[this.index] };
    }
  },
  created() {
    this.orderModel.firstValues = "#" + this.userInfo.user.manageOrgId + "#";
    this._initEchart();
  },
  mounted() {}
};
</script> 

<style scoped lang="less">
@import "~src/tools/styles/variable.less";
</style>