<template>
  <div id="app" style="height:100%;">
    <div v-transfer-dom>
      <loading :show="isLoading" position="absolute" text="加载中..."></loading>
    </div>
    <div v-transfer-dom>
      <actionsheet :menus="menus" theme="android" v-model="showMenus" @on-click-menu-menu3="_click"></actionsheet>
    </div>
    <drawer width="200px;" :show.sync="drawerVisibility" :show-mode="showModeValue" :placement="showPlacementValue" :drawer-style="{'background-color':'#35495e', width: '200px'}">
      <!-- drawer content -->
      <div slot="drawer">
        <div class="y_nav_h" v-if="userInfo">
          <img style="display:inline-block;float:left;margin-left:5px;" src="./assets/user.png"/>
          <span style="display:inline-block;color:white;font-size:14px;">{{userInfo.user.realName}}</span>
          <br/>
          <x-button mini :gradients="['#1D62F0', '#19D5FD']" @click.native="_click" style="border-radius:99px;margin:18px 1px;font-size:14px;">安全退出</x-button>
        </div>
        <group title="菜单" style="margin-top:20px;">
          <cell title="系统设置" link="/systemConfig" value="" @click.native="drawerVisibility = false">
          </cell>
          <cell title="客服" value="029-88227793" @click.native="drawerVisibility = false">
          </cell>
          <cell title="关于易龙"  @click.native="drawerVisibility = false">
          </cell>
          <cell title="二维码">
            <qrcode value="http://www.yearrow.com" :size="num" type="img" class="qcode" fg-color="#000000" @click.native="onClick"></qrcode>
          </cell>
        </group> 
      </div>
      <!-- main content -->
      <view-box ref="viewBox" body-padding-top="46px" body-padding-bottom="55px">
        <x-header slot="header" :transition="headerTransition" style="width:100%;position:absolute;left:0;top:0;" :right-options="rightOptions" :left-options="leftOptions" @on-click-more="onClickMore" :title="title">
          <span v-if="showDrawer" slot="overwrite-left" @click="drawerVisibility = !drawerVisibility">
            <x-icon type="navicon" size="35" style="fill:#fff;position:relative;top:-8px;left:-3px;"></x-icon>
          </span>
        </x-header>
          <transition :name="viewTransition" :css="!!direction">
            <router-view transition-mode="out-in" class="router-view"></router-view>
          </transition>
        <Maintabar v-if="this.$route.path !== '/login'" slot="bottom"></Maintabar>
      </view-box>
    </drawer>
  </div>
</template>
  
<script type="text/ecmascript-6">
import util from "common/util";
import { mapState, mapGetters } from "vuex";
import {
  XButton,
  Qrcode,
  Drawer,
  ViewBox,
  Loading,
  TransferDom,
  Group,
  Cell,
  XHeader,
  Actionsheet
} from "vux";
import Maintabar from "./pages/Main.vue";

export default {
  directives: {
    TransferDom
  },
  name: "App",
  components: {
    XButton,
    Qrcode,
    Drawer,
    ViewBox,
    Loading,
    TransferDom,
    Group,
    Cell,
    XHeader,
    Actionsheet,
    Maintabar
  },
  data() {
    return {
      num: 19,
      drawerVisibility: false, //侧边栏
      showModeValue: "overlay",
      showPlacementValue: "left",
      menus: {
        menu3: "注销登录"
      },
      showMenus: false,
      show: true //header右菜单
    };
  },
  methods: {
    onClick() {
      if (this.num === 19) {
        this.num = 70;
      } else {
        this.num = 19;
      }
    },
    onClickMore() {
      this.showMenus = true;
    },
    _click() {
      let that = this;
      util.resetLogin();
      that.$router.replace("/login");
      setTimeout(() => {
        that.$vux.toast.show({
          text: "退出登录成功"
        });
      }, 200);
      that.drawerVisibility = false;
    }
  },
  computed: {
    ...mapGetters(["userInfo"]),
    showDrawer() {
      if (this.$route.meta.requireMenue) return true;
    },
    ...mapState({
      isLoading: state => state.vux.isLoading,
      direction: state => state.vux.direction
    }),
    headerTransition() {
      if (!this.direction) return "";
      return this.direction === "forward"
        ? "vux-header-fade-in-right"
        : "vux-header-fade-in-left";
    },
    title() {
      if (this.$route.meta.requireMenue) {
        this.show = true;
      } else {
        this.show = false;
      }
      if (this.$route.meta.children) {
        return this.$route.params.tableName;
      } else {
        return this.$route.name;
      }
    },
    leftOptions() {
      return {
        showBack: !this.$route.meta.requireMenue
      };
    },
    rightOptions() {
      return {
        showMore: this.show
      };
    },
    viewTransition() {
      if (!this.direction) return "";
      return "vux-pop-" + (this.direction === "forward" ? "in" : "out");
    }
  },
  mounted() {}
};
</script>

<style lang="less">
@import "~vux/src/styles/reset.less";
@import "~vux/src/styles/1px.less";

body {
  background-color: #fbf9fe;
}

html,
body {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}

.vux-pop-out-enter-active,
.vux-pop-out-leave-active,
.vux-pop-in-enter-active,
.vux-pop-in-leave-active {
  will-change: transform;
  transition: all 500ms;
  height: 100%;
  top: 46px;
  position: absolute;
  backface-visibility: hidden;
  perspective: 1000;
}
.vux-pop-out-enter {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}
.vux-pop-out-leave-active {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.vux-pop-in-enter {
  opacity: 0;
  transform: translate3d(100%, 0, 0);
}
.vux-pop-in-leave-active {
  opacity: 0;
  transform: translate3d(-100%, 0, 0);
}

.y_nav_h {
  width: 200px;
  margin: 0 auto;
  text-align: center;
  padding-top: 25px;
  position: relative;
  padding-bottom: 3px;
  border-bottom: 1px solid #000;
  img {
    width: 60px;
    height: 60px;
    margin-left: -5px;
    vertical-align: middle;
  }
}

.router-view {
  width: 100%;
  top: 46px;
}
</style>
