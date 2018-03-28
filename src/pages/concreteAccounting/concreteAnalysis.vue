<template>
  <div>
    <div class="search_Icon">
      <i class="icon-search-menu" @click="setFocus"></i>
    </div>
    <group>
    <selector v-show="!coverShow" placeholder="请选择项目部" title="项目部" :options="list" v-model="selectNode" @on-change="onChange"></selector>
  </group>
    <div class="wrappers" ref="wrapper" v-show="coverShow">
      <x-table class="tablelist" full-bordered>
        <thead>
          <tr class="tablelist-th">
            <th>材料名</th>
            <th>计划量</th>
            <th>申请量</th>
            <th>生产量</th>
            <th>节超量</th>
          </tr>
        </thead>
        <tbody v-show="detail.length !== 0">
          <tr :class="{'vux-tap-active': true,'weui-cell_access': true}" v-for="(list,index) in detail" :key="index" 
            :style="{'background-color':list.jcbl>1?'red':''}">
            <td v-text="list.name" :style="nameSize" @click="_clickName" class="tablelist-name"></td>
            <td v-text="list.quantity"></td>
            <td v-text="list.receiveQuantity"></td>
            <td v-text="list.jcblStr"></td>
            <td v-text="list.jc"></td>
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
import  {inputModel} from 'api/inputmodel';

export default {
  components: {
   Selector, Group,
    XTable,
    LoadMore
  },
  data() {
    return {
      nameSize:'',
      detail:[],
      selectNode:'',
      nameSize:'',
      isLink: true,
      coverShow: true,
      mainInput:new inputModel(),
      list: [],
      orderModel: {
        firstKeys: "OrgId",
        firstValues: "",
        procName: "Report_RecievePlanWarning",
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
       this.detail=[]
    let array=[
          {name:'C25',quantity:'400',receiveQuantity:'343',jc:'',jcblStr:'200'},
          {name:'C20',quantity:'542',receiveQuantity:'460',jc:'',jcblStr:'190'},
          {name:'C30',quantity:'429',receiveQuantity:'326',jc:'',jcblStr:'360'},
          {name:'C40',quantity:'98',receiveQuantity:'89',jc:'',jcblStr:'52'},
          {name:'C35',quantity:'155',receiveQuantity:'111',jc:'',jcblStr:'110'},
      ]
      for (let index = 0; index < array.length; index++) {
            let element = array[index];
            element.jc=element.receiveQuantity-element.jcblStr
              this.detail.push(element)
          }
     this.coverShow=true
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
       that.detail=[]
      let array=[
          {name:'C25',quantity:'316',receiveQuantity:'300',jc:'',jcblStr:'320'},
          {name:'C20',quantity:'290',receiveQuantity:'260',jc:'',jcblStr:'150'},
          {name:'C30',quantity:'289',receiveQuantity:'215',jc:'',jcblStr:'260'},
          {name:'C40',quantity:'268',receiveQuantity:'159',jc:'',jcblStr:'210'},
          {name:'C35',quantity:'420',receiveQuantity:'311',jc:'',jcblStr:'215'},
      ]
      for (let index = 0; index < array.length; index++) {
            let element = array[index];
            element.jc=element.receiveQuantity-element.jcblStr  
              that.detail.push(element)
          }

          this.$nextTick(() => {
            this._initScroll();
          });
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
