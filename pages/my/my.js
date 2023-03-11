// pages/my/my.js
import cache from "../../enum/cache";

const app = getApp();

Page({
  data: {
    navbarTop: app.globalData.capshlebarData.navbarTop || '24',
    navHeight: app.globalData.capshlebarData.navbarTop || '32',
    userInfo: app.globalData.userInfo,
    isLogin: app.globalData.isLogin,
    memberInfo: app.globalData.memberInfo,
    settingList: [
      {
        id: '3',
        title: '分享给好友',
        icon: '/images/my/share.png',
        content: ''
      },
      {
        id: '4',
        title: '关注公众号',
        icon: '/images/my/guanzhu.png',
        content: '关注领福利'
      },
      {
        id: '5',
        title: '联系客服',
        icon: '/images/my/help.png',
        content: ''
      },
      {
        id: '6',
        title: '设置',
        icon: '/images/my/setting.png',
        content: ''
      }
    ],
  },
  onLoad(options) {
    this.initCapshlebar();
  },
  // 计算香胶囊的高度
  initCapshlebar() {
    let {navbarTop, navHeight} = app.globalData.capshlebarData;
    this.setData({
      navbarTop,
      navHeight
    });
  },
  /**
   * 点击登录
   * @returns {Promise<void>}
   */
  async handleToLogin() {
    if (this.data.isLogin) return
    const loginResp = await app.globalData.handleToLogin();
    this.setData({
      isLogin: loginResp.isLogin,
      userInfo: loginResp.userInfo,
      memberInfo: loginResp.memberInfo
    })
  },
  // 跳转到会员中心
  async handleMemberRedirect() {
    await this.handleToLogin()
    wx.navigateTo({
      url: "/pages/member/member"
    })
  },
  async handleRedirect(e) {
    const id = e.detail.id
    let url
    switch (id) {
      case '5':
        url = ''
        break;
      // case '5':
      //   url = '/pages/help/help'
      //   break;
      case '6':
        url = '/pages/setting/setting'
        break;
    }
    if (url) {
      wx.navigateTo({
        url
      })
    }
  },
  onShare() {
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    app.globalData.isLogin = wx.getStorageSync(cache.TOKEN) ? true : false;
    app.globalData.userInfo = wx.getStorageSync(cache.USER_INFO) || {};
    app.globalData.memberInfo = wx.getStorageSync(cache.MEMBER_INFO) || {};
    this.setData({
      isLogin: app.globalData.isLogin,
      userInfo: app.globalData.userInfo,
      memberInfo: app.globalData.memberInfo
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '「免费易用」全面的自媒体工具你值得拥有！',
      path: '/pages/index/index',
      imageUrl: '/images/share/share_main.png',
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})