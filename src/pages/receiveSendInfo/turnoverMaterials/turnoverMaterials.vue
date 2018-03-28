<template>
  <div>
    <div class="search_Icon">
      <i class="icon-search-menu" @click="setFocus"></i>
    </div>
  <group  v-show="!coverShow">
    <selector placeholder="请选择项目部" title="项目部" :options="list" v-model="selectNode" @on-change="onChange"></selector>
  </group>
    <div class="wrappers" ref="wrapper" v-show="coverShow">
      <x-table class="tablelist" full-bordered>
        <thead>
          <tr class="tablelist-th">
            <th>类别名称</th>
            <th>收料数量</th>
            <th>发料数量</th>
            <th>结存数量</th>
          </tr>
        </thead>
        <tbody v-show="detail.length !== 0">
          <tr :class="{'vux-tap-active': true,'weui-cell_access': true}" v-for="(list,index) in detail" :key="index">
            <td v-text="list.tjClassName" :style="nameSize" @click="_clickName" class="tablelist-name"></td>
            <td v-text="list.recieveQuantity"></td>
            <td v-text="list.deliveryQuantity"></td>
            <td v-text="list.lopQuantity" ></td>
          </tr>
        </tbody>
      </x-table>
      <load-more style="margin-top:22%;" :show-loading="false" v-show="detail.length == 0" tip="暂无数据..." background-color="#fbf9fe"></load-more>
    </div>
  </div>
</template>
<script>
import { Selector, Group, XTable, LoadMore } from "vux";
import api from "api/procCommand";
import { mapGetters } from "vuex";
import BScroll from "better-scroll";
import { inputModel } from "api/inputmodel";


export default {
  components: {
    Selector, Group,
    XTable,
    LoadMore
  },
  data() {
    return {
      list: [],
      selectNode: "",
       nameSize:'',
      coverShow: true,
      mainInput: new inputModel(),
      detail: [],
      orderModel: {
        firstKeys: "OrgId",
        firstValues: "",
        procName: "Report_PhoneTurnoverMaterials",
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
    $route: "_fetchData"
  },
  methods: {
    onChange (val) {
     this.orderModel.firstValues = "#" + val + "#";
     this._fetchData();
     this.coverShow=true
    },
      fetchOrganize(){
    let _this=this
      _this.list=[]
  var inputArr=[ 
            {key:"NodeCode",op:"LIKEL",value:this.userInfo.user.orgCode},
            {key:"Category",op:"EQ",value:'项目经理部'},
            ]; 
            this.mainInput.addqueryConditionItem(inputArr);
         api.requestOrganize(this.mainInput.inputModel).then(data =>{
                            if(data.success){
                              let array=data.result;
                              for (let index = 0; index < array.length; index++) {
                                const element = array[index];
                                _this.list.push({key:element.id,value:element.shortName})
                              }
                                }}
         )
  },
        _clickName(){
      if (this.nameSize=='') {
      this.nameSize={'font-size':'4px'}
      }else{
         this.nameSize=''
      }
    },
    _initScroll() {
      this.scroll = new BScroll(this.$refs.wrapper, {
        click: true
      });
    },
    _fetchData() {
      var that = this;
       that.detail = [];
      let pars = that.orderModel;
      api.requestProcCommand(pars).then(
        response => {
           let array = response.result.items[0];
          for (let index = 0; index < array.length; index++) {
            const element = array[index];
            if (element.isLeaf) {
              that.detail.push(element);
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
    setFocus() {
      this.coverShow = !this.coverShow;
    }
  },
  created() {
    this.orderModel.firstValues = "#" + this.userInfo.user.manageOrgId + "#";
    this._fetchData();
  },
  mounted() {
    this.fetchOrganize()
    }
};
</script>

<style scoped lang="less">
@import "~src/tools/styles/variable.less";
</style>
