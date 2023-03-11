// pages/tools/image/hbzpss/index.js
import APIConfig from '../../../../config/api'
import Tools from '../../../../model/tools'
import shareMess from '../../../../utils/shareMess'
import download from '../../../../utils/download'
import user from '../../../../behaviors/user'

const app = getApp();

Page({
  behaviors: [user],
  data: {
    toolName: 'hbzpss',
    fileUrl: '', // 处理前图片地址 如：/upload/tool/...
    colorUrl: '', // 处理后图片地址
    tempUrl: '', // 临时图片地址
  },
  onLoad(options) {
  },
  handleDelete() {
    this.setData({
      fileUrl: '',
      colorUrl: '',
      tempUrl: '',
    })
  },
  // 上传图片
  chooseImage(e) {
    const {fileUrl, tempUrl} = e.detail.url;
    this.setData({
      tempUrl,
      fileUrl
    })
  },
  // 开始处理
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
    const res = await Tools.getPicUrl({
      url: this.data.fileUrl,
      tool_name: this.data.toolName
    })
    const colorUrl = APIConfig.uploadUrl + res.data.data.result
    this.setData({
      colorUrl: colorUrl,
      tempUrl: colorUrl
    })
    wx.hideLoading();
    // 获取可用次数（会员不扣次数不用请求）
    const userInfo = await app.globalData.getAvailableNum();
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
    }
  },
  handleQuestion() {
    wx.showToast({
      icon: 'none',
      title: 'question'
    })
  },
  async handleDownload() {
    const link = this.data.colorUrl
    if (link == '') {
      wx.showToast({
        title: '下载链接不存在',
        icon: 'error'
      })
      return;
    }
    download(link)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    let code = this.data.toolName
    return shareMess('pic', code)
  }
})