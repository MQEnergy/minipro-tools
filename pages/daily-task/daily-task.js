// pages/daily/daily.js
import Task from '../../model/task'
import cache from "../../enum/cache"
import Ads from "../../utils/ads";
import store from "../../utils/store"
import User from "../../model/user";

const app = getApp();

Page({
  data: {
    userInfo: {
      uuid: '',
      available_num: 0,
      sign_num: 0,
      sign_time: 0,
    },
    signList: [
      {day_time: 1, available_num: 2, is_signed: false},
      {day_time: 2, available_num: 2, is_signed: false},
      {day_time: 3, available_num: 3, is_signed: false},
      {day_time: 4, available_num: 3, is_signed: false},
      {day_time: 5, available_num: 5, is_signed: false},
      {day_time: 6, available_num: 5, is_signed: false},
      {day_time: 7, available_num: 10, is_signed: false},
    ],
    taskList: [],
    isSigned: '', // 今天是否已签到
    isLogin: false,
    loading: true
  },
  onLoad(options) {
  },
  async _getTaskCenter() {
    if (!this.data.isLogin) {
      this.setData({
        taskList: [],
        loading: false
      })
      return false;
    }
    const taskCenter = await Task.getTaskCenter()
    this.setData({
      loading: false,
      signList: taskCenter.data.sign_list,
      taskList: taskCenter.data.task_list,
      userInfo: taskCenter.data.user,
      isSigned: this.checkIsSigned(taskCenter.data.user.sign_time)
    });
    return taskCenter
  },
  // 检查是否已经签到
  checkIsSigned(signTime) {
    let isSigned = false;
    let nowStartTime = new Date(new Date().setHours(0, 0, 0, 0)).getTime();
    let nowEndTime = new Date(new Date().setHours(23, 59, 59, 999)).getTime();
    if (signTime > nowStartTime / 1000 && signTime < nowEndTime / 1000) {
      isSigned = true;
    }
    return isSigned
  },
  //签到
  async bindSignIn(e) {
    if (!this.data.isLogin) {
      const loginResp = await app.globalData.handleToLogin();
      this.setData({
        isLogin: loginResp.isLogin,
        userInfo: loginResp.userInfo
      })
    }
    wx.showLoading({
      title: '签到中',
      mask: true
    })
    await Task.signUp();
    const data = await this._getTaskCenter()
    store.setItem("available_num", data.data.user.available_num, cache.USER_INFO)
    wx.hideLoading();
    wx.showToast({
      icon: 'none',
      title: '签到成功',
    })
  },
  // 授权登录
  async handleTologin() {
    if (this.data.isLogin) return
    const loginResp = await app.globalData.handleToLogin();
    this.setData({
      isLogin: loginResp.isLogin,
      userInfo: loginResp.userInfo
    })
    await this._getTaskCenter();
  },
  async handleAds() {
    wx.showModal({
      title: '提示',
      content: '活动期间，无法观看视频',
      showCancel: false,
      success: async (res) => {
        // await Ads.IncentiveAdvertising()
      }
    })
  },
  // 完成任务
  async handleFinish(e) {
    const taskId = e.currentTarget.dataset.id;
    if (taskId == 1) {
      wx.showModal({
        title: '提示',
        content: '活动期间，无法观看视频',
        showCancel: false,
        success: async (res) => {
          // await Ads.IncentiveAdvertising()
        }
      })
    } else {
      setTimeout(async () => {
        await Task.dayFinish({
          task_id: taskId,
        });
        await this._getTaskCenter();
        const taskInfo = this.data.taskList.filter((item, index) => {
          return taskId == item.id;
        });
        if (taskInfo.length > 0) {
          if (taskInfo[0].finish_num === taskInfo[0].curr_num) {
            const availableResp = await User.getAvailableNum();
            store.setItem("available_num", availableResp.data.available_num, cache.USER_INFO)
          }
        }
      }, 2000);
    }
  },
  onReady() {
  },
  async onShow() {
    app.globalData.isLogin = wx.getStorageSync(cache.TOKEN) ? true : false;
    this.setData({
      isLogin: app.globalData.isLogin,
    })
    await this._getTaskCenter();
  },

  onShareAppMessage() {
    return {
      title: '「免费易用」全面的自媒体工具你值得拥有！',
      path: '/pages/index/index',
      imageUrl: "/images/share/share_main.png",
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})