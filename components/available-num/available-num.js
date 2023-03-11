// components/available-num/available-num.js
// import cache from "../../enum/cache";

const app = getApp();
Component({
  properties: {
    userInfo: {
      type: Object,
      value: {}
    },
    isLogin: Boolean,
  },
  data: {
    // availableNum: app.globalData.userInfo.available_num || 0,
    // isLogin: app.globalData.isLogin,
    // userInfo: wx.getStorageSync(cache.USER_INFO) || {},
    // isLogin: wx.getStorageSync(cache.TOKEN) || false,
  },
  methods: {
    // 看视频就免费领取次数 或者 购买会员
    async handleRedirect() {
      console.log(this.properties)
      if (!this.properties.isLogin) {
        await app.globalData.handleToLogin();
      }
      wx.navigateTo({
        url: "/pages/member/member",
      })
    },
  }
})
