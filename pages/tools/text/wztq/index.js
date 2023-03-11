import Tools from '../../../../model/tools'
import shareMess from '../../../../utils/shareMess'
import user from '../../../../behaviors/user'
import APIConfig from "../../../../config/api";

const app = getApp();

Page({
  behaviors: [user],
  data: {
    toolName: 'wztq',
    uploadType: 1,
    fileUrl: '', // 处理前图片地址
    wordList: [], // 处理后内容
    tempUrl: '', // 临时图片地址
  },
  onLoad(options) {
  },
  handleDelete() {
    this.setData({
      fileUrl: '',
      wordList: [],
      tempUrl: '',
    })
  },
  // 上传图片
  chooseImage(e) {
    const { fileUrl, tempUrl } = e.detail.url;
    this.setData({
      tempUrl,
      fileUrl
    })
  },
  // 一键识别
  async handleOperate() {
    if (!this.data.fileUrl) {
      wx.showToast({
        title: '请先上传图片',
        icon: 'none'
      })
      return false;
    }
    wx.showLoading({
      title: '正在处理中',
      mask: true
    });
    if (!this.data.isLogin) {
      await app.globalData.handleToLogin()
    }
    const res = await Tools.getTextUrl({
      url: APIConfig.uploadUrl + this.data.fileUrl,
      tool_name: this.data.toolName
    });
    // 获取可用次数（会员不扣次数不用请求）
    const userInfo = await app.globalData.getAvailableNum();
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
    }
    let result = JSON.parse(res.data.data.result)
    console.log("result", result)
    let words = result.words_result

    this.setData({
      wordList: words,
    })
    wx.hideLoading();
  },
  handleQuestion() {
    wx.showToast({
      icon: 'none',
      title: 'question'
    })
  },
  handleCopy(e) {
    let temp = e.currentTarget.dataset.temp
    wx.setClipboardData({
      data: temp,
      success: (res) => {
        wx.getClipboardData({
          success: (res) => {
            wx.showToast({
              title: '复制成功',
            })
          }
        });
      }
    })
  },
  handleDownload(e) {
    let temp = e.currentTarget.dataset.temp
    let words = temp.map(item => {
      return item.words
    })
    wx.setClipboardData({
      data: words.join('\n'),
      success: (res) => {
        wx.getClipboardData({
          success: (res) => {
            wx.showToast({
              title: '复制成功',
            })
          }
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  // onShow() {},  // 因为使用了behaviors

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
    let code = this.data.toolName
    return shareMess('text', code)
  }
})