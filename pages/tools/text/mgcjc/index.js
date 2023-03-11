// pages/tools/text/mgcjc/index.js
import Tools from '../../../../model/tools'
import user from "../../../../behaviors/user";
import shareMess from '../../../../utils/shareMess'

Page({
  behaviors: [user],
  data: {
    message: '',
    toolName: 'mgcjc'
  },
  onLoad(options) {

  },
  onChange(e) {
    this.setData({
      message: e.detail
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
    if(!this.data.message) {
      wx.showModal({
        title: '温馨提示',
        content: '内容不能为空'
      })
      return
    }
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
    let result = res.data.data.result
    if(!result) {
      wx.showModal({
        title: '提示',
        content: '恭喜你，文案未发现敏感词',
        showCancel: false
      })
    }
  },
  onReady() {},
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    let code = this.data.toolName
    return shareMess('text', code)
  }
})