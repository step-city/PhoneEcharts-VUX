<template>
  <div>
   <div class="wrappers" ref="wrapper">
    <x-table class="tablelist" full-bordered >
      <thead>
        <tr class="tablelist-th">
          <th>材料名称</th>
          <th>规格型号</th>
          <th>单位</th>
          <th>地区</th>
        </tr>
      </thead>
      <tbody v-if="arryList.length !== 0">
        <tr :class="{'vux-tap-active': true,'weui-cell_access': true}" v-for="(list,index) in arryList" :key="index">
          <td v-text="list.infoName" :style="nameSize" @click="_clickName" class="tablelist-name"></td>
          <td v-text="list.infoModel" class="tablelist-name"></td>
          <td v-text="list.infoUnit"></td>
          <td v-text="list.area" class="cell_right__ft" @click="_fetchDetail(list.infoNM,list.area)">
          </td>
        </tr>
      </tbody>
    </x-table>
         <load-more style="margin-top:22%;" :show-loading="false" v-show="arryList.length == 0" tip="暂无数据..." background-color="#fbf9fe"></load-more>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from "better-scroll";
import api from "api/procCommand";
import { inputModel } from "api/inputmodel";
import { XTable, XButton, Group, Selector, LoadMore } from "vux";

export default {
  components: {
    XTable,
    XButton,
    Group,
    Selector,
    LoadMore
  },
  data() {
    return {
      listSeach: [],
      selectNode: "",
      nameSize: "",
      arryList: [],
      list: [],
      supplierNM: "",
      mainInput: new inputModel(),
      orderModel: {
        firstKeys: "InfoName,InfoModel,Area",
        firstValues: "",
        procName: "Pr_CommonExecuteSql",
        procType: 0,
        secondKeys: "PricePublishChart",
        secondOperates: "",
        secondValues: ""
      }
    };
  },
  computed: {},
  methods: {
      _fetchDetail(infoNM,area){
          this.$router.push({
          name: "走势图表查看",
          params: { name: infoNM, area:area }
        });
      },
    _clickName() {
      if (this.nameSize == "") {
        this.nameSize = { "font-size": "4px" };
      } else {
        this.nameSize = "";
      }
    },
    _initScroll() {
      this.meunScroll = new BScroll(this.$refs.wrapper, {
        click: true
      });
    },
    fetchData() {
      var that = this;
      that.arryList = [];
      let pars = that.orderModel;
      api.requestProcCommand(pars).then(
        response => {
          let array = response.result.items[0];
          for (let index = 0; index < array.length; index++) {
            const element = array[index];
              that.arryList.push(element);
          }
          this.$nextTick(() => {
            this._initScroll();
          });
        },
        err => {
          console.log(err);
        }
      );
    }
  },
  created() {
    this.orderModel.firstValues ="$$,$$,$$";
    this.fetchData();
  },
  mounted() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@import "~src/tools/styles/variable.less";
.left-menu {
    position: absolute;
    height: 2rem;
    margin-top: 0.25rem;
    top: 0.25rem;
    left: 0.9rem;
    font-size: 14px;
    color:#ccc;
    background-size: 2rem;
    background-color: #35495e;
}
.left-arrows {
    position: absolute;
    width: 12px;
    height: 12px;
    border: 1px solid #ccc;
    border-width: 1px 0 0 1px;
    transform: rotate(315deg);
    top: 17px;
    left: 20px;
}
</style>
