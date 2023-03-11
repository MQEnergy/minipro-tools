import cache from '../enum/cache'

const app = getApp()

export default Behavior({
  data: {
    isLogin: false,
    userInfo: {}
  },
  methods: {
    onShow() {
      app.globalData.isLogin = wx.getStorageSync(cache.TOKEN) ? true : false;
      app.globalData.userInfo = wx.getStorageSync(cache.USER_INFO) || {};
      this.setData({
        isLogin: app.globalData.isLogin,
        userInfo: app.globalData.userInfo
      })
    }
  }
})