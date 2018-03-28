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
            <th>类别名称</th>
            <th>计划总量</th>
            <th>本期申请</th>
            <th>本期发料</th>
            <th>本期节超</th>
          </tr>
        </thead>
        <tbody v-show="detail.length !== 0">
          <tr :class="{'vux-tap-active': true,'weui-cell_access': true}" v-for="(list,index) in detail" :key="index" 
            :style="{'background-color':list.jcbl>1?'red':''}">
            <td v-text="list.name" @click="_clickName" class="tablelist-name"></td>
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
          {name:'一级钢',quantity:'400',receiveQuantity:'343',jcblStr:'236',jc:''},
          {name:'二级钢',quantity:'542',receiveQuantity:'60',jcblStr:'50',jc:''},
          {name:'三级钢',quantity:'429',receiveQuantity:'326',jcblStr:'263',jc:''},
          {name:'钢筋HRB400',quantity:'98',receiveQuantity:'89',jcblStr:'80',jc:''},
          {name:'钢筋HPB300',quantity:'155',receiveQuantity:'110',jcblStr:'55',jc:''},
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
          {name:'一级钢',quantity:'316',receiveQuantity:'300',jcblStr:'258',jc:''},
          {name:'二级钢',quantity:'290',receiveQuantity:'260',jcblStr:'233',jc:''},
          {name:'三级钢',quantity:'289',receiveQuantity:'215',jcblStr:'199',jc:''},
          {name:'钢筋HRB400',quantity:'268',receiveQuantity:'159',jcblStr:'160',jc:''},
          {name:'钢筋HPB300',quantity:'110',receiveQuantity:'131',jcblStr:'60',jc:''},
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
