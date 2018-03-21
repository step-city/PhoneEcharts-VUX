<template>
  <div>
    <div class="search_Icon">
      <i class="icon-search-menu" v-on:click="showSearch"></i>
    </div>
    <div v-show="!coverShow">
      <group>
        <selector :options="list" placeholder="请选择供应商" v-model="supplierNM" @on-change="_onChange"></selector>
        <selector  placeholder="请选择项目部" title="项目部" :options="listSeach" v-model="selectNode" ></selector>
      </group>
       <x-button @click.native="_search" style="width:90%;line-height:2;margin-top:6px;" :gradients="['#1D62F0', '#19D5FD']" text="查 询"></x-button>
    </div>
   <div class="wrappers" ref="wrapper" v-show="coverShow">
    <x-table class="tablelist" full-bordered >
      <thead>
        <tr class="tablelist-th">
          <th>类别名称</th>
          <th>上月盘点</th>
          <th>收料</th>
          <th>发料</th>
          <th>实时库存</th>
        </tr>
      </thead>
      <tbody v-if="arryList.length !== 0">
        <tr :class="{'vux-tap-active': true,'weui-cell_access': true}" v-for="(list,index) in arryList" :key="index">
          <td v-text="list.tjClassName" :style="nameSize" @click="_clickName"></td>
          <td v-text="list.lastPanQuantity"></td>
          <td v-text="list.klReceiveQuantity"></td>
          <td v-text="list.klDeliveryQuantity"></td>
          <td v-text="list.kcQuantity"></td>
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
  import {
    inputModel
  } from "api/inputmodel";
  import {
      XTable,
      XButton,
      Group,
      Selector,
      LoadMore
  } from "vux";
  import {
    mapGetters
  } from "vuex";

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
        listSeach:[],
        selectNode: "",
         nameSize:'',
        arryList: [],
        coverShow: true,
        list: [],
        supplierNM: "",
        mainInput: new inputModel(),
        organizeModel: new inputModel(),
      orderModel: {
        firstKeys: "OrgId,O_Col46",
        firstValues: "",
        procName: "Report_PhonePDA",
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
    methods: {
          _clickName(){
      if (this.nameSize=='') {
      this.nameSize={'font-size':'4px'}
      }else{
         this.nameSize=''
      }
    },
      _initScroll() {
        this.meunScroll = new BScroll(this.$refs.wrapper, {
          click: true
        });
      },
      _search() {
        this.orderModel.firstValues = "#" + this.selectNode + "#,#"+this.supplierNM+'#';
        this.fetchData()
        this.coverShow=true
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
            if (element.isLeaf) {
              that.arryList.push(element);
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
      fetchOrganize() {
      let _this = this;
      _this.listSeach = [];
      var inputArr = [
        { key: "NodeCode", op: "LIKEL", value: this.userInfo.user.orgCode },
        { key: "Category", op: "EQ", value: "项目经理部" }
      ];
      this.organizeModel.addqueryConditionItem(inputArr);
      api.requestOrganize(this.organizeModel.inputModel).then(data => {
        if (data.success) {
          let array = data.result;
          for (let index = 0; index < array.length; index++) {
            const element = array[index];
            _this.listSeach.push({ key: element.id, value: element.shortName });
          }
        }
      });
    },
      fetchSupplier() {
        let _this = this;
        let inputArr = [{
          key: "OrgId",
          op: "EQ",
          value: this.userInfo.user.manageOrgId
        }];
        _this.mainInput.addqueryConditionItem(inputArr);
        _this.mainInput.inputModel.maxResultCount = 1000;
        _this.mainInput.inputModel.sorting = "SupplierName desc";
        api.fetchSupplier(_this.mainInput.inputModel).then(
          response => {
            if (response.success) {
              let data = response.result.data;
              for (var i = 0; i < data.length; i++) {
                _this.list.push({
                  key: data[i].id,
                  value: data[i].supplierName
                });
              }
            }
          },
          erro => {
            console.log("数据加载失败!", erro);
          }
        );
      },
      _onChange(val) {
        //key值，改变供应商
        this.supplierNM = val;
      },
      showSearch() {
        this.coverShow = !this.coverShow;
      }
    },
    created() {
      this.orderModel.firstValues = "#" + this.userInfo.user.manageOrgId + "#,#"+this.supplierNM+'#';
      this.fetchData();
    },
    mounted() {
      this.fetchSupplier();
      this.fetchOrganize();
    }
  };

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
  @import "~src/tools/styles/variable.less";

</style>
