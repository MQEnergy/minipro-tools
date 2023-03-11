// pages/login/login.js
const app = getApp();

Page({
  data: {
  },
  onLoad(options) {},
  async handleLogin() {
    if (app.globalData.isLogin) {
      this.handleToHome();
      return;
    }
    await app.globalData.handleToLogin();
    this.handleToHome();
  },
  handleToHome() {
    wx.reLaunch({
      url: '/pages/index/index'
    })
  },
})