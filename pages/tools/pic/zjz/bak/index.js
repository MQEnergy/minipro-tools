// pages/tools/pic/zjz/index.js
import Attachment from "../../../../../model/attachment";
import cache from "../../../../../enum/cache";

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFinished: false, // true:上传图片成功
    fileInfo: null,
    tempFile: null,
    isShow: false,
    isLogin: false,
    userInfo: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  afterRead(event) {
    const {file} = event.detail;
    console.log("file", file)
    // 当设置 mutiple 为 true 时, file 为数组格式，否则为对象格式
    wx.uploadFile({
      url: Attachment.getUploadUrl(), // 仅为示例，非真实的接口地址
      filePath: file.url,
      name: 'file',
      formData: {file_path: 'zjz'},
      success: (res) => {
        this.setData({
          tempFile: file.url
        })
        const {data} = JSON.parse(res.data);
        console.log('data', data);
        this.setData({
          fileInfo: data,
          isFinished: true
        })
      },
    });
  },
  handleDelete() {
    this.setData({
      tempFile: null,
      fileInfo: null,
      isFinished: false,
      isShow: true,
    })
  },
  handleOperate() {
    if (!this.data.isFinished) {
      wx.showToast({
        title: '请先上传图片',
        icon: 'none'
      })
      return false;
    }
    wx.navigateTo({
      url: '/pages/tools/pic/zjz/detail?url=' + this.data.fileInfo.file_path
    })
  },
  handleRedirect() {
    wx.showToast({
      title: 'tool'
    })
  },
  handleQuestion() {
    console.log('question')
    wx.showToast({
      title: 'question'
    })
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
    this.setData({
      isLogin: app.globalData.isLogin,
      userInfo: app.globalData.userInfo
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

  }
})