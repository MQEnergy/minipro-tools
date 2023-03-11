// pages/tools/pic/qctpsy/result/result.js
import download from '../../../../../utils/download'

Page({
  data: {
    fullUrl: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      fullUrl: options.url
    })
  },
  async handleDownload() {
    const link = this.data.fullUrl
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '「免费易用」全面的自媒体工具你值得拥有！',
      path: '/pages/tools/pic/qctpsy/index',
      imageUrl: "/images/share/share_pic.png",
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})