// 保存到相册
const app = getApp();

export default function download(link) {
  wx.showModal({
    title: '注意',
    content: '本产品不保存任何上传的内容 \r\n 请及时下载，过期不候。',
    showCancel: false,
    success: async (res) => {
      if (res.confirm) {
        wx.showLoading({
          title: '正在保存中',
          mask: true
        })
        await app.globalData.getUserSetting(app.globalData.handleDownload, 'png', link)
      } else if (res.cancel) {
        console.log('用户点击取消')
      }
    }
  })
}