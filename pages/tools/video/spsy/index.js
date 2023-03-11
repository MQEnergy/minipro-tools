// pages/tools/video/spsy/index.js
import Tools from "../../../../model/tools";
import Dialog from '@vant/weapp/dialog/dialog';
import user from "../../../../behaviors/user";
import shareMess from "../../../../utils/shareMess";

const app = getApp();

Page({
  behaviors: [user],
  data: {
    toolName: 'spsy',
    value: '',
    videoUrl: '', // 结果视频地址
    originUrl: '', // 原视频地址
    videoType: '', // 视频类型
    downloadList: [], // 下载视频列表
    videoContext: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  // 输入框
  onChange(event) {
    this.setData({
      value: event.detail.trim()
    })
  },
  handleDelete() {
    this.setData({
      value: ''
    })
  },
  // 问题弹框
  handleQuestion() {
    wx.showToast({
      title: 'question',
      icon: 'none'
    })
  },
  // 操作剪切板
  handleClipboard() {
    if (this.data.value === '') {
      wx.getClipboardData({
        success: (res) => {
          this.setData({
            value: res.data.trim()
          })
        }
      });
    } else {
      this.setData({
        value: ''
      });
    }
  },
  // 操作解析视频
  async handleOperate() {
    if (this.data.value === '') {
      return false;
    }
    Dialog.confirm({
      title: '说明',
      message: '祛水映功能由一拍完全免费提供，不收取任何费用，不进行任何商业性目的使用。\n\n 一拍作为提供技术服务的中立工具，提供的祛水映功能仅帮助用户提取视频自行学习，观看，降低视频浏览障碍，提升观赏体验。\n\n 请用户注意合法使用，若用户滥用该功能实施侵犯或违法行为，用户应自行承担由此产生的法律责任。一拍倡导与用户共同营造风清气正的网络环境。',
      messageAlign: 'left',
      confirmButtonText: '我知道了',
      cancelButtonText: '放弃祛水映'
    }).then(async () => {
      const originUrl = app.globalData.matchUrl(this.data.value);
      if (!originUrl || (originUrl && originUrl.length == 0)) {
        wx.showToast({
          title: '链接格式不正确',
          icon: 'error'
        })
        return false;
      }
      this.setData({
        originUrl: originUrl[0]
      })
      wx.showLoading({
        title: '正在处理中',
        mask: true
      });
      if (!app.globalData.isLogin) {
        await app.globalData.handleToLogin();
      }
      const res = await Tools.getVideoUrl({
        url: originUrl[0],
        tool_name: this.data.toolName
      });
      // 获取可用次数（会员不扣次数不用请求）
      const userInfo = await app.globalData.getAvailableNum();
      if (userInfo) {
        this.setData({
          userInfo: userInfo
        })
      }
      const result = res.data.data.result;
      const videoType = res.data.data.type;
      if (result.length > 0) {
        let videoUrl = result[0].trim()
        this.setData({
          videoUrl: videoUrl,
          videoType: videoType,
          downloadList: result
        })
      }
      wx.hideLoading();
    }).catch(() => {
      console.log('Error');
      wx.hideLoading();
    });
  },
  bindPlayVideo() {
    this.videoContext.play()
  },
  // 复制
  handleCopy() {
    if (this.data.videoUrl != '') {
      wx.setClipboardData({
        data: this.data.videoUrl,
        success(res) {
          console.log('res', res)
        }
      })
    }
  },
  // 下载视频
  async handleDownload() {
    const link = this.data.videoUrl
    if (link === '') {
      wx.showToast({
        title: '下载链接不存在',
        icon: 'error'
      })
      return false;
    }
    wx.showModal({
      title: '注意',
      content: '本产品不保存任何上传的内容 \r\n 请及时下载，过期不候。\r\n 如保存耗费时间较长，请自行复制链接下载',
      confirmText: '确定保存',
      success: async (res) => {
        if (res.confirm) {
          wx.showLoading({
            title: '正在保存中',
            mask: true
          })
          setTimeout(() => {
            wx.hideLoading();
            wx.showLoading({
              title: '视频较大，请耐心等待',
              mask: true
            })
          }, 5000)
          const fileUrl = await Tools.spsyUpload({
            "url": link,
            "origin_url": this.data.originUrl
          });
          await app.globalData.getUserSetting(app.globalData.handleDownload, 'mp4', fileUrl.data);
          console.log('确定')
        } else {
          console.log('取消')
        }
      }
    })
  },
  handleRedirect() {
    wx.showToast({
      title: 'spsy',
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {
    this.videoContext = wx.createVideoContext('myVideo')
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
    let code = this.data.toolName
    return shareMess('video', code)
  }
})