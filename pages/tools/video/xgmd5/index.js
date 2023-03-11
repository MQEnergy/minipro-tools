// pages/tools/video/xgmd5/index.js
import SparkMD5 from 'spark-md5';
import Tools from "../../../../model/tools";
import APIConfig from "../../../../config/api";
import user from "../../../../behaviors/user";
import shareMess from "../../../../utils/shareMess";

const app = getApp();

Page({
  behaviors: [user],
  data: {
    toolName: 'xgmd5',
    fileUrl: '', // 处理前的地址
    fullUrl: '', // 处理后的地址
    buffer: {}, //
    fileInfo: {
      url: '', // 临时地址
      size: '', // 大小
      duration: '', // 时长
      oldmd5: '', // 原md5值
      newmd5: '', // 新md5值
    },
    isChange: false,
  },
  onLoad(options) {
  },
  async chooseFile(e) {
    const {fileUrl, tempUrl, file} = e.detail.url;
    try {
      // 获取文件md5信息
      const fileInfo = await this.getFileHashInfo(tempUrl);
      // 上传文件
      this.setData({
        fileUrl: fileUrl,
        buffer: fileInfo.buffer,
        ['fileInfo.url']: tempUrl,
        ['fileInfo.size']: this.renderSize(file.size),
        ['fileInfo.duration']: this.formatDuraton(file.duration),
        ['fileInfo.oldmd5']: fileInfo.hexHash,
      })
    } catch (err) {
      wx.showToast({
        title: err.message || '检测失败',
        icon: 'none'
      });
      wx.hideLoading();
    }
  },
  handleDelete() {
    this.setData({
      fileUrl: '',
      fullUrl: '',
      buffer: {},
      fileInfo: {
        url: '',
        size: '', // 大小
        duration: '', // 时长
        oldmd5: '', // 原md5值
        newmd5: '', // 新md5值
      },
      isChange: false
    })
  },
  // 上传前
  async beforeRead(e) {
    const {file, callback} = e.detail;
    callback(file.type === 'video');
  },
  // 文件大小显示转换
  renderSize(value) {
    if (null == value || value == '') {
      return "0 Bytes";
    }
    var unitArr = new Array("Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB");
    var index = 0;
    var srcsize = parseFloat(value);
    index = Math.floor(Math.log(srcsize) / Math.log(1024));
    var size = srcsize / Math.pow(1024, index);
    size = size.toFixed(2);//保留的小数位数
    return size + unitArr[index];
  },
  // 时间格式化转换
  formatDuraton(time) {
    if (time > -1) {
      var hour = Math.floor(time / 3600);
      var min = Math.floor(time / 60) % 60;
      var sec = Math.floor(time % 60);
      if (hour < 10) {
        time = '0' + hour + ":";
      } else {
        time = hour + ":";
      }
      if (min < 10) {
        time += "0";
      }
      time += min + ":";
      if (sec < 10) {
        time += "0";
      }
      time += sec;
    }
    return time;
  },
  // 获取文件信息并获取hash值
  getFileHashInfo(tempUrl, extra = '') {
    return new Promise((resolve, reject) => {
      try {
        wx.getFileSystemManager().readFile({
          filePath: tempUrl, //选择图片返回的相对路径
          // encoding: 'binary', //编码格式
          success: (res) => {
            const spark = new SparkMD5.ArrayBuffer();
            spark.append(res.data);
            if (extra) {
              const data = new Int8Array(1);
              spark.append(data);
            }
            const hexHash = spark.end(false);
            resolve({
              buffer: res.data,
              hexHash: hexHash
            })
          },
          fail(err) {
            reject(err);
          }
        });
      } catch (e) {
        reject(e);
      }
    })
  },
  // 开始处理
  async handleOperate() {
    if (!this.data.fileUrl) {
      return false;
    }
    if (!this.data.isLogin) {
      await app.globalData.handleToLogin()
    }
    wx.showLoading({
      title: '正在处理中',
      mask: true
    });
    const res = await Tools.getVideoUrl({
      url: this.data.fileUrl,
      tool_name: this.data.toolName
    });
    if (res.data.data.result == '') {
      wx.showToast({
        title: '获取新值失败',
        icon: 'error'
      })
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
      isChange: true,
      ['fileInfo.newmd5']: res.data.data.result,
      ['fileInfo.url']: APIConfig.uploadUrl + res.data.data.file_path,
      fullUrl: APIConfig.uploadUrl + res.data.data.file_path
    });
    wx.hideLoading();
  },
  async handleDownload() {
    let link = this.data.fullUrl
    if (link == '') {
      wx.showToast({
        title: '下载链接不存在',
        icon: 'error'
      })
      return;
    }
    wx.showLoading({
      title: '正在保存中',
    })
    await app.globalData.getUserSetting(app.globalData.handleDownload, 'mp4', link)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

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