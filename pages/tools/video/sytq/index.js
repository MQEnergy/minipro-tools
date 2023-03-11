// pages/tools/video/sytq/index.js
import APIConfig from "../../../../config/api";
import Tools from "../../../../model/tools";
import user from "../../../../behaviors/user";
import shareMess from "../../../../utils/shareMess";
import Dialog from "@vant/weapp/dialog/dialog";

const app = getApp();

Page({
  behaviors: [user],
  data: {
    toolName: 'sytq',
    fileUrl: '',
    fileInfo: {
      url: ''
    },
    isFinished: false, // 是否转换完成
    src: '', // 音频播放地址
    tridPlay: true,// 播放的flag  暂停：true  播放：false
    duration: '00:00',// 播放时长     时间格式
    durationNum: 0,// 播放时长数字     数字格式
    current: '00:00',// 当前播放时长   时间格式
    currentNum: 0// 当前播放时长数字   数字格式
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },
  async chooseFile(e) {
    const {fileUrl, tempUrl} = e.detail.url;
    try {
      console.log(e.detail)
      this.setData({
        fileUrl: fileUrl,
        ['fileInfo.url']: tempUrl
      })
    } catch (err) {
      wx.showToast({
        title: err.message || '检测失败',
        icon: 'none'
      });
      wx.hideLoading();
    }
  },
  async handleOperate() {
    if (!this.data.fileUrl) {
      return false;
    }
    if (!this.data.isLogin) {
      await app.globalData.handleToLogin();
    }
    wx.showLoading({
      title: '正在处理中',
      mask: true
    });
    const res = await Tools.getVideoUrl({
      tool_name: this.data.toolName,
      url: this.data.fileUrl,
    });
    if (res.data.data.result == '') {
      wx.showToast({
        title: '提取失败',
        icon: 'error'
      })
      wx.hideLoading();
      return false;
    }
    // 获取可用次数（会员不扣次数不用请求）
    const userInfo = await app.globalData.getAvailableNum();
    if (userInfo) {
      this.setData({
        userInfo: userInfo
      })
    }
    this.setData({
      isFinished: true,
      src: APIConfig.uploadUrl + res.data.data.result
    });
    this.initAudio();
    wx.hideLoading();
  },
  // 复制
  handleCopy() {
    if (this.data.src != '') {
      wx.setClipboardData({
        data: this.data.src,
        success(res) {
          wx.showToast({
            title: '复制成功',
            icon: 'none'
          })
        }
      })
    }
  },
  async handleDownload() {
    let link = this.data.src
    if (link == '') {
      wx.showToast({
        title: '下载链接不存在',
        icon: 'error'
      })
      return;
    }
    Dialog.alert({
      title: '注意',
      message: '本产品不保存任何上传的内容 \n 请及时下载，过期不候。',
      confirmButtonText: '确定保存'
    }).then(async () => {
      wx.showLoading({
        title: '正在保存中',
        mask: true
      });
      await this.downloadAudioToLocal(link, 'mp3');
      wx.hideLoading();
    });
  },
  // 下载临时文件到本地
  downloadAudioToLocal(url, videoType = 'mp3') {
    return new Promise((resolve, reject) => {
      const fileName = new Date().valueOf();
      const filePath = wx.env.USER_DATA_PATH + '/' + fileName + '.' + videoType
      wx.downloadFile({
        url: url,
        filePath: filePath,
        success: (res) => {
          wx.saveVideoToPhotosAlbum({//保存视频到相册
            filePath: res.filePath,
            success: (file) => {
              //删除临时文件
              wx.getFileSystemManager().unlinkSync(res.filePath)
              resolve({
                filePath: filePath,
              })
            },
            fail: (err) => {
              reject(err)
            }
          });
          resolve({
            filePath
          })
        },
        fail: (err) => {
          reject(err)
        }
      })
    })
  },
  handleQuestion() {
    wx.showToast({
      icon: 'none',
      title: 'question'
    })
  },
  handleRedirect() {
    wx.navigateTo({
      url: '/pages/tools/video/spsy/index',
    })
  },
  handleDelete() {
    this.setData({
      fileUrl: '',
      fileInfo: {
        url: '',
      },
      isFinished: false,
      tridPlay: false
    })
  },
  // 时间格式化
  formatSeconds(value) {
    var secondTime = parseInt(value); // 秒
    var minuteTime = 0; // 分
    var hourTime = 0; // 小时
    if (secondTime > 60) {
      minuteTime = parseInt(secondTime / 60);
      secondTime = parseInt(secondTime % 60);
      if (minuteTime > 60) {
        hourTime = parseInt(minuteTime / 60);
        minuteTime = parseInt(minuteTime % 60);
      }
    }
    var result = "" + this.addZero(parseInt(secondTime)) + "";
    if (minuteTime > 0) {
      result = "" + this.addZero(parseInt(minuteTime)) + ":" + result;
    } else {
      result = "" + this.addZero(parseInt(minuteTime)) + ":" + result;
    }
    if (hourTime > 0) {
      result = "" + parseInt(hourTime) + ":" + result;
    }
    return result;
  },
  // 左侧补零
  addZero(val) {
    if (val < 10) {
      return 0 + '' + val
    } else {
      return val
    }
  },
  // 播放暂停 true 暂停 false 播放
  play() {
    if (this.data.tridPlay) {
      this.innerAudioContext.play();
    } else {
      this.innerAudioContext.pause()
    }
  },
  // 滑块拖动快进，快退
  changeValue(e) {
    if (this.innerAudioContext) {
      let val = e.detail.value
      let step = (val / 100) * this.data.durationNum
      this.innerAudioContext.seek(parseInt(step))
      this.changeCurrent(step)
      this.innerAudioContext.pause();
    }
  },
  // 当前播放时间
  changeCurrent(step) {
    const currentNum = parseInt(step)
    const current = this.formatSeconds(currentNum)
    this.setData({
      current: current,
      currentNum: currentNum * 100,
      tridPlay: false
    })
  },
  // 初始化
  initAudio() {
    this.innerAudioContext = wx.createInnerAudioContext();
    this.innerAudioContext.src = this.data.src;
    this.innerAudioContext.autoplay = true
    wx.setInnerAudioOption({
      obeyMuteSwitch: false
    })
    this.innerAudioContext.seek(0);
    // 监听播放
    this.innerAudioContext.onPlay(() => {
      console.log('开始播放')
      this.setData({
        tridPlay: false,
      })
    });
    // 监听暂停
    this.innerAudioContext.onPause(() => {
      console.log('暂停播放')
      this.setData({
        tridPlay: true,
      })
    });
    // 监听音频播放进度更新事件
    this.innerAudioContext.onTimeUpdate(() => {
      const durationNum = parseInt(this.innerAudioContext.duration)
      const durationFormat = this.formatSeconds(this.innerAudioContext.duration)
      this.setData({
        duration: durationFormat,
        durationNum: durationNum,
      });
      this.changeCurrent(this.innerAudioContext.currentTime)
    });
    this.innerAudioContext.onSeeked(() => {
      console.log('监听音频完成跳转');
      this.changeCurrent(this.innerAudioContext.currentTime)
      setTimeout(() => {
        this.innerAudioContext.play()
      }, 100)
    });
    // 监听播放结束
    this.innerAudioContext.onEnded(() => {
      console.log('播放结束')
      this.setData({
        isFinished: true,
        current: "00:00",
        currentNum: 0,
        tridPlay: true,
      })
    })
    // 监听播放出错
    this.innerAudioContext.onError((err) => {
      console.log('audio error => ', err)
      wx.showToast({
        title: err.message || '播放错误',
        icon: 'none'
      })
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady(e) {
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
    if (this.innerAudioContext) {
      this.innerAudioContext.destroy();
    }
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