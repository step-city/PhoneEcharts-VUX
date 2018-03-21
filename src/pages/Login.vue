<template>
    <div>
        <x-dialog v-model="showScrollBox" :dialog-style="{'max-width': '95%',width: '98%'}">
            <group title="服务器配置">
                <x-input label-width="4em" title="标题:" type="text" v-model.trim="headTitle" text-align="right" placeholder="请输入登陆标题" is-type="text">
                </x-input>
                <x-input label-width="4em" title="服务器:" type="text" v-model.trim="baseURL" text-align="right" :show-clear="false" required placeholder="请输入服务器URL" is-type="text">
                </x-input>
            </group>
            <div class="weui-dialog__ft">
                <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_default" @click="_onCancel">取消</a>
                <a href="javascript:;" class="weui-dialog__btn weui-dialog__btn_primary" @click="_onConfirm">确定</a>
            </div>
        </x-dialog>
        <x-header :left-options="{showBack: false}" @on-click-more="onClickMore" :right-options="{showMore:true}" :title="headTitle" style="width:100%;position:absolute;left:0;top:0;"></x-header>
        <qrcode style="margin:8px 15px;" :value="qrURL" :size="smallSize" @click.native="showQrcode=true"></qrcode>
        <div style="text-align:center;margin-top:5px;">
            <img src="../assets/logo_img.png"/>
        </div>
        <group>
            <x-input ref="userName"  title="用户名" v-model.trim="loginForm.userName" required placeholder="请输入账号" type="text" :min="1" @on-enter="onFocus">
            </x-input>
        </group>
        <group>
            <x-input ref="passWord" title="密 码" :type="passwordType" required v-model.trim="inputPassWord" placeholder="请输入密码" is-type="password" :min="1" @on-enter="onEnter">
                <span slot="right" @click="passwordType=passwordType === 'password' ? 'text' : 'password'">{{passwordType === 'password' ? '明文' : '密文'}}</span>
            </x-input>
        </group>
        <div style="padding:15px;">
            <x-button  @click.native="_login" type="primary" :gradients="['#35495e', '#19D5FD']" text="登 录"></x-button>
        </div>
        <x-dialog v-model="showQrcode" hide-on-blur :dialog-style="{'max-width': '95%',width: '90%',height: '68%'}">
          <divider>大桥物资</divider>
          <qrcode style="margin-top:5px;" :value="qrURL" :size="largeSize"></qrcode>
        <div style="margin:10px;">
          <divider>扫一扫上面的二维码图案,登陆</divider>
        </div>
        </x-dialog>
    </div>
</template>
 
<script type="text/ecmascript-6">
import util from "common/util";
import { mapActions } from "vuex";
import api from "api/login";
import qs from "qs";

import {
  XDialog,
  XInput,
  Group,
  XButton,
  XHeader,
  cookie,
  Qrcode,
  Divider
} from "vux";
export default {
  components: {
    Qrcode,
    XDialog,
    XInput,
    XButton,
    Group,
    XHeader,
    Divider
  },
  data() {
    return {
      qrURL: "http://221.232.139.68:8082",
      // qrURL: "http://117.34.112.55:8089",
      smallSize: 30,
      largeSize: 230,
      passwordType: "password",
      headTitle: "大桥物资信息系统",
      baseURL: "",
      showScrollBox: false,
      showQrcode: false,
      inputPassWord: "aaa",
      loginForm: {
        userName: "wuyaoqi",
        passWord: "",
        grant_type: "password",
        ylClientId: "",
        appCode: "YLMMISV8.0",
        loginType: "0"
      }
    };
  },
  methods: {
    _onConfirm() {
      if (this.baseURL) {
        this.getUrlData(this.baseURL);
      }
      this.showScrollBox = false;
    },
    _onCancel() {
      this.showScrollBox = false;
    },
    onClickMore() {
      this.showScrollBox = true;
    },
    onFocus() {
      this.$refs.passWord.focus();
    },
    onEnter() {
      this._login();
    },
    ...mapActions(["setUserInfo", "getUrlData"]),
    _initlogin() {
      let newGuid = Math.random()
        .toString(36)
        .substring(3, 8);
      this.loginForm.ylClientId = newGuid;
    },
    _login() {
      util.resetLogin();
      let that = this;
      if (!that.loginForm.userName || !that.inputPassWord) {
        that.$vux.alert.show({
          title: "提 示",
          content: "用户名或密码不能为空!"
        });
        return;
      } else {
        this.loginForm.passWord = util.jsEncrypt(that.inputPassWord);
        let params = qs.stringify(that.loginForm);
        api
          .GetToken(params)
          .then(res => {
            if (res.error !== undefined) {
              if (res.error === "InvalidUserName") {
                that.$vux.alert.show("用户名输入有误！");
              } else if (res.error === "InvalidPassword") {
                that.$vux.alert.show("密码输入有误！");
              } else {
                that.$vux.alert.show({
                  title: "登录失败",
                  content: res.error
                });
              }
              this.inputPassWord = "";
            } else {
              if (res.access_token !== "") {
                util.setLogin(res.access_token);
                api.requestGetCurrentLoginInformations().then(response => {
                  if (response.success) {
                    that.setUserInfo(response.result); //记住登陆信息
                    this.$router.push({ path: "/home" });
                    that.$vux.toast.show({
                      text: "登录成功，欢迎您使用本系统",
                      type: "text",
                      position: "top",
                      width: "15em"
                    });
                  } else {
                    that.$vux.alert.show({
                      title: "获取信息失败",
                      content: response.error.message
                    });
                  }
                });
              } else {
                that.inputPassWord = "";
                this.$vux.toast.text("获取token失败!", "top");
              }
            }
          })
          .catch(function(err) {
            that.inputPassWord = "";
            that.$vux.alert.show("登录失败!", err);
          });
      }
    }
  },
  mounted() {
    this._initlogin();
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>