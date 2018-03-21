<template>
  <div>
    <tab :line-width="2" v-model="index">
      <tab-item :selected="tags === item" v-for="item in taglist" :key="item.id" @click="tags = item">{{item}}</tab-item>
    </tab>
    <div v-if="index === 0" class="vux-1px-t">
      <swipeout class="vux-1px-tb">
        <swipeout-item transition-mode="follow">
          <div slot="right-menu">
            <swipeout-button @click.native="onButtonClick" type="primary">删除</swipeout-button>
            <swipeout-button @click.native="onButtonClick" type="warn">收藏</swipeout-button>
          </div>
          <div slot="content" class="demo-content vux-1px-t">
            JavaScript is the best language
          </div>
        </swipeout-item>
      </swipeout>
    </div>
    <div v-if="index === 1">
  
    </div>
    <div v-if="index === 2">
  
    </div>
  </div>
</template>

<style scope>
.demo-content {
  padding: 10px 10px;
}
</style>

<script>
import { Swipeout, SwipeoutItem, SwipeoutButton, XTable, Tab, TabItem } from 'vux'


const list = () => ['资讯', '问答', '博客']

export default {

  components: {
    Swipeout, SwipeoutItem, SwipeoutButton, Tab, TabItem, XTable
  },
  data() {
    return {
      tag: 'story',
      list: [],
      tags: '资讯',
      taglist: list(),
      index: 0,
    }
  },
  methods: {
    onButtonClick() {
      this.$vux.toast.show({
        text: '操作成功',
        type: "text",
        position: 'top',
        width: "15em"
      })
    }
  }
}
</script>
