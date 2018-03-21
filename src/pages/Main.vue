<template>
  <div>
    <x-dialog v-model="showScrollBox" class="dialog-demo">
      <group title="转化角色">
        <selector :options="lists" title="*角色:" v-model="value3" @on-change="_onChange"></selector>
        <selector :options="rangeList" title="*范围:" v-model="rangeValue" @on-change="_changeRange"></selector>
      </group>
            <div class="weui-dialog__ft">
                <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default" @click="showScrollBox=false">取消</a>
                <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" @click="_onConfirm">确定</a>
            </div>
    </x-dialog>
    <tabbar class="vux-demo-tabbar" icon-class="vux-center">
      <tabbar-item link="/newsList">
        <img slot="icon" src="../assets/applay.png" style="position:relative;top: -2px;">
        <span slot="label">微应用</span> 
      </tabbar-item>
      <tabbar-item link="/home" selected>
        <img slot="icon" src="../assets/home.png" style="position:relative;top: -2px;">
        <span slot="label">工作台</span>
      </tabbar-item>
      <tabbar-item @on-item-click="showScrollBox =!showScrollBox">
        <img slot="icon" src="../assets/user.png" style="position:relative;top: -2px;">
        <span slot="label">转化角色</span>
      </tabbar-item>
    </tabbar>
  </div>
</template>

<script>
import { Selector, XDialog, Group, Tabbar, TabbarItem } from "vux";
import { mapGetters, mapActions } from "vuex";
import api from "api/login";
import util from "common/util";

export default {
  components: {
    Group,
    XDialog,
    Selector,
    Tabbar,
    TabbarItem
  },
  data() {
    return {
      formModel: {
        roleId: "",
        orgId: ""
      },
      value3: "",
      lists: [],
      showScrollBox: false,
      rangeList: [],
      rangeValue: ""
    };
  },
  methods: {
    ...mapActions(["setUserInfo", "setRangeInfo"]),
    _onConfirm() {
      let _this = this;
      let params = {};
      params = this.formModel;
      api.requestUpdateCurrentUserInfo(params).then(res => {
        if (res.success) {
          api.requestGetCurrentLoginInformations().then(res => {
            if (res.success) {
              _this.setUserInfo(res.result); //记住登陆信息
              _this.$vux.toast.show({
                text: "转换角色成功",
                time: 1000
              });
            }
          });
        } else {
          _this.$vux.alert.show({
            title: "角色转化失败",
            content: res.error.details
          });
        }
      });
      _this.showScrollBox = false;
    },
    //转化角色
    _onChange(val) {
      for (var i = 0; i < this.lists.length; i++) {
        if (this.lists[i].key == val) {
          this.value3 = this.lists[i].key;
        }
      }
    },
    _changeRange(val) {
      for (var i = 0; i < this.rangeList.length; i++) {
        if (this.rangeList[i].key == val) {
          this.rangeValue = this.rangeList[i].key;
        }
      }
    }
  },
  mounted() {
    var data = this.userInfo;
    if (data) {
      for (var i = 0; i < data.userRoles.length; i++) {
        this.lists.push({
          key: data.userRoles[i].id,
          value: data.userRoles[i].text
        });
      }
      for (let index = 0; index < data.userDataRanges.length; index++) {
        this.rangeList.push({
          key: data.userDataRanges[index].id,
          value: data.userDataRanges[index].text
        });
      }
      // this.setRangeInfo(this.rangeList)
      this.rangeValue = data.user.manageOrgId;
      this.value3 = data.user.roleId;
    }
  },
  computed: {
    ...mapGetters(["userInfo"])
  },
  watch: {
    value3(val) {
      this.formModel.roleId = val;
    },
    rangeValue(val) {
      this.formModel.orgId = val;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.vux-demo-tabbar {
  position: fixed;
}
</style>
