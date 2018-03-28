<template>
  <div>
    <group-title>{{title}}</group-title>
    <grid :cols="3">
      <grid-item v-for="item in menuGrid" :key="item.id" :link="item.link" :label="item.label">
        <img slot="icon" :src="item.src">
      </grid-item>
    </grid>
  </div>
</template>

<script type="text/babel">
import { Grid, GridItem, GroupTitle } from "vux";

export default {
  components: {
    Grid,
    GridItem,
    GroupTitle
  },
  data() {
    return {
      title: "",
      menuGrid: {}
    };
  },
  methods: {},
  created() {
    let key = this.$route.params.tableName;
    this.title=key;
    switch (key) {
      case "预警信息":
        this.menuGrid = [
            {
              link: "/recieveWarning",
              label: "收料预警",
              src: require("../../assets/chartbar.png")
            },
            {
              link: "/deliveryWarning",
              label: "发料预警",
              src: require("../../assets/Monthpie.png")
            }
          ];
        break;
       case "收发信息":
        this.menuGrid =[

            // {
            //   link: "/rebarInfo",
            //   label: "钢筋发放信息",
            //   src: require("../../assets/number.png")
            // },
            {
              link: "/poundRecieve",
              label: "过磅收料",
              src: require("../../assets/details.png")
            },
            {
              link: "/PDARecieve",
              label: "PDA收料",
              src: require("../../assets/totalcount.png")
            }
          ];
        break;
     case "周转材料管理":
        this.menuGrid = [
             {
              link: "/turnoverMaterials",
              label: "周转材料管理",
              src: require("../../assets/monthcount.png")
            } 
          ];
        break;
         case "库存信息":
        this.menuGrid = [
            {
              link: "/inventoryInfo",
              label: "库存盘点",
              src: require("../../assets/nowdetial.png")
            }
          ];
        break;
         case "查询统计":
        this.menuGrid = [
            {
              link: "/recieveReport",
              label: "收料报表",
              src: require("../../assets/detail.png")
            },
            {
              link: "/deliveryReport",
              label: "发料统计",
              src: require("../../assets/monthcount.png")
            },
            {
              link: "/materialPhone",
              label: "材料价格走势",
              src: require("../../assets/prepared.png")
            }
          ];
        break;
         case "混凝土管理":
        this.menuGrid = [
            // {
            //   link: "/concreteInfo",
            //   label: "混凝土收发信息",
            //   src: require("../../assets/concrete.png")
            // },
             {
              link: "/stockInventory",
              label: "料位库存",
              src: require("../../assets/detail.png")
            },
            {
              link: "/concreteAnalysis",
              label: "混凝土节超分析",
              src: require("../../assets/detail.png")
            }
            // {
            //   link: "/materialAnalysis",
            //   label: "原材料节超分析",
            //   src: require("../../assets/prepared.png")
            // }
          ];
        break;
        case "钢筋核算":
        this.menuGrid = [
            {
              link: "/rebarAnalysis",
              label: "钢筋节超分析",
              src: require("../../assets/prepared.png")
            },
            {
              link: "/rebarCenter",
              label: "加工中心分析",
              src: require("../../assets/chartbar.png")
            }
          ];
        break;
        

      default:
        break;
    }
  },
  mounted() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
