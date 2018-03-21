<template>
  <div>
    <swiper :list="list" :min-moving-distance="20" style="width:100%;margin:0 auto;" height="180px" loop auto dots-position="center"></swiper>
    <group>
      <cell title="公告:">
        <marquee>
          <marquee-item v-for="item in report" :key="item.id" v-text="item.name"></marquee-item>
        </marquee>
      </cell>
    </group>
    <grid :cols="3">
      <grid-item v-for="item in homeTitle" :key="item.id" :link="'/homepage/'+item.title" :label="item.title" @on-item-click="onItemClick(item.title)">
        <img slot="icon" :src="item.src">
      </grid-item>
    </grid>
  </div>
</template>

<script type="text/babel">
import {
  Cell,
  Group,
  Grid,
  GridItem,
  GroupTitle,
  SwiperItem,
  Swiper,
  Marquee,
  MarqueeItem
} from "vux";

const baseList = [
  {
    img: require("../assets/logo_left.jpg"),
    title: "预警信息"
  },
  {
    img: require("../assets/logo_center.jpg"),
    title: "收发信息"
  },
  {
    img: require("../assets/logo_right.jpg"),
    title: "混凝土核算"
  }
];
const urlList = baseList.map((item, index) => ({
  img: item.img,
  title: `${item.title}`
}));

export default {
  components: {
    Cell,
    Group,
    Grid,
    GridItem,
    GroupTitle,
    SwiperItem,
    Swiper,
    Marquee,
    MarqueeItem
  },
  data() {
    return {
      homeTitle: [
        { title: "查询统计", src: require("../assets/daycount.png") },
        { title: "预警信息", src: require("../assets/number.png")},
        { title: "收发信息", src: require("../assets/applay.png") },
        { title: "周转材料管理", src: require("../assets/totalcount.png") },
        { title: "库存信息", src: require("../assets/totalcount.png") },
        { title: "混凝土管理", src: require("../assets/PDA.png") },
        { title: "钢筋核算", src: require("../assets/prepared.png") }
      ],
      report: [
        { name: "实现与物资管理信息系统数据交互" },
        { name: "规范业务流程，提升物资管理水平" },
        { name: "为领导层精细化管理提供辅助决策" }
      ],
      list: urlList
    };
  },
  methods: {
    onItemClick(val) {  
     
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
