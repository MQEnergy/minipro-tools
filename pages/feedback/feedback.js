// pages/feedback/feedback.js
import My from '../../model/my'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    message: '',
  },

  onLoad(options) {
  },
  onChange(e) {
    this.setData({
      message: e.detail
    })
  },
  async handleSubmit() {
    if (!this.data.message) {
      wx.showToast({
        title: '开发不易，给点建议，谢谢~',
        icon: 'none'
      })
      return false;
    }
    await My.sendFeedback({
      content: this.data.message
    })
    wx.showToast({
      title: '提交成功',
      icon: 'success'
    })
    this.setData({
      message: ''
    })
  },

  onReady() {

  },

  onShow() {

  },

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