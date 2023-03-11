// pages/tools/text/wbjc/index.js
import Tools from '../../../../model/tools'
import shareMess from '../../../../utils/shareMess'
import user from '../../../../behaviors/user'

const app = getApp();

Page({
  behaviors: [user],
  data: {
    message: '',
    toolName: 'wbjc'
  },
  onChange(e) {
    this.setData({
      message: e.detail
    })
  },
  handleDelete() {
    this.setData({
      message: '',
    })
  },
  handleClipboard() {
    if (this.data.message === '') {
      wx.getClipboardData({
        success: (res) => {
          this.setData({
            message: res.data.trim()
          })
        }
      });
    } else {
      this.setData({
        message: ''
      });
    }
  },
  async handleCheck() {
    if (!this.data.message) {
      return
    }
    wx.showLoading({
      title: '正在检查中',
      mask: true
    })
    const res = await Tools.getTextUrl({
      tool_name: this.data.toolName,
      text: this.data.message
    })
    // 获取可用次数（会员不扣次数不用请求）
    const userInfo = await app.globalData.getAvailableNum();
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
    }
    // const { result } = JSON.parse(res.data.data);
    let result = res.data.data.result
    wx.hideLoading();
    wx.navigateTo({
      url: '/pages/tools/text/wbjc/result/result?res=' + result,
    })
  },

  onLoad(options) {

  },

  onReady() {

  },

  // onShow() {},  // 因为使用了behaviors

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    let code = this.data.toolName
    return shareMess('text', code)
  }
})