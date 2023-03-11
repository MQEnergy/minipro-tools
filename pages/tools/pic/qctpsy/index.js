// pages/tools/pic/qctpsy/index.js
import APIConfig from '../../../../config/api'
import Tools from '../../../../model/tools'
import shareMess from '../../../../utils/shareMess'
import user from '../../../../behaviors/user'

const app = getApp();

Page({
  behaviors: [user],
  data: {
    src: '',
    toolName: 'qctpsy',
    isShow: true,
    fileUrl: '', // 处理前图片地址
    canvas: {
      width: wx.getSystemInfoSync().windowWidth,
      height: wx.getSystemInfoSync().windowHeight - 100 - getApp().data.navBarHeight,
    },
    screenRatio: getApp().data.screenRatio,
  },

  onLoad(options) {
    this.ctx = wx.createCameraContext();
    this.cropper = this.selectComponent(".cropper");
  },
  // 上传图片
  chooseImage(e) {
    wx.showLoading({
      title: '正在处理中',
      mask: true
    });
    const {fileUrl, tempUrl} = e.detail.url;
    console.log('fileUrl2', fileUrl);
    console.log('tempUrl2', tempUrl);
    this.setData({
      fileUrl,
      isShow: false
    })
    this.cropper.init(tempUrl)
    wx.hideLoading();
  },
 async handleSave() {
    if (!this.data.fileUrl) {
      wx.showToast({
        title: '请先上传图片',
        icon: 'none'
      })
      return false;
    }
    this.cropper.save()
  },
  async getPos(e) {
    console.log('e.detail.pos', e.detail.pos)
    const p = e.detail.pos
    // [{"left": 528, "top": 144, "width": 617, "height": 99}]
    const pos = [
      {
        left: parseInt(p.x),
        top: parseInt(p.y),
        width: parseInt(p.w),
        height: parseInt(p.h)
      }
    ]
    wx.showLoading({
      title: '正在处理中',
      mask: true
    });
    if (!this.data.isLogin) {
      await app.globalData.handleToLogin()
    }
    const res = await Tools.getPicUrl({
      url: this.data.fileUrl,
      tool_name: this.data.toolName,
      rectangle: JSON.stringify(pos)
    })
    // 获取可用次数（会员不扣次数不用请求）
    const userInfo = await app.globalData.getAvailableNum();
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
    }
    const resUrl = APIConfig.uploadUrl + res.data.data.result
    wx.hideLoading();
    wx.navigateTo({
      url: '/pages/tools/pic/qctpsy/result/result?url=' + resUrl,
    })
  },
  onReady() {
  },

  // onShow() {},  // 因为使用了behaviors

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    let code = this.data.toolName
    return shareMess('pic', code)
  }
})