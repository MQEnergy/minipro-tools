// pages/setting/setting.js
import My from '../../model/my'
import cache from '../../enum/cache'
import store from "../../utils/store";
const app = getApp();

Page({
  data: {
    aboutList: [
      {
        id: '11',
        title: '隐私政策',
        icon: '/images/my/private.png',
        content: ''
      },
      {
        id: '22',
        title: '用户协议',
        icon: '/images/my/agreement.png',
        content: ''
      },
      {
        id: '33',
        title: '关于我们',
        icon: '/images/my/about.png',
        content: ''
      }
    ],
    feedBackList: [
      {
        id: '44',
        title: '建议反馈',
        icon: '/images/my/feedback.png',
        content: ''
      }
    ],
    show: false,
    actions: [
      {
        name: '退出',
        color: '#ee0a24'
      }
    ],
    isLogin: false
  },

  onLoad(options) {
  },
  /**
   * 点击授权登录
   * @returns {Promise<void>}
   */
  async handleToAuthLogin() {
    if (this.data.isLogin) return
    const loginResp = await app.globalData.handleToLogin();
    this.setData({
      isLogin: loginResp.isLogin,
    })
  },
  async handleItem(e) {
    const id = e.detail.id
    let url
    switch (id) {
      case '11':
        url = '/pages/my-private/my-private'
        break;
      case '22':
        url = '/pages/my-agreement/my-agreement'
        break;
      case '33':
        url = '/pages/my-about/my-about'
        break;
      case '44':
        await this.handleToAuthLogin()
        url = '/pages/feedback/feedback'
        break;
    }
    if (url) {
      wx.navigateTo({
        url
      })
    }
  },
  handleClose() {
    this.setData({
      show: false
    });
  },
  handleConfirm() {
    this.setData({show: true});
  },
  async handleLogout() {
    await My.authLogout()
    store.clearItem(cache.TOKEN)
    store.clearItem(cache.USER_INFO)
    store.clearItem(cache.MEMBER_INFO)
    this.setData({show: false});
    wx.navigateBack()
  },
  onReady() {
  },

  onShow() {
    app.globalData.isLogin = wx.getStorageSync(cache.TOKEN) ? true : false;
    this.setData({
      isLogin: app.globalData.isLogin
    })
  },

  onHide() {
  },

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

  }
})