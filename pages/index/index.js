// pages/index/index.js
import Tools from "../../model/tools";
import cache from "../../enum/cache";

const app = getApp();

Page({
  data: {
    toolsList: [{"code":"","colors":{"bg":"#ebedf0","text":""},"desc":"","icon_class":"","id":1,"member_only":1,"name":"","status":1,"type":1},{"code":"","colors":{"bg":"#ebedf0","text":""},"desc":"","icon_class":"","id":1,"member_only":1,"name":"","status":1,"type":1},{"code":"","colors":{"bg":"#ebedf0","text":""},"desc":"","icon_class":"","id":1,"member_only":1,"name":"","status":1,"type":1},{"code":"","colors":{"bg":"#ebedf0","text":""},"desc":"","icon_class":"","id":1,"member_only":1,"name":"","status":1,"type":1}],
    show: false,
    activity: {},
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getToolsList();
  },
  onClickHide() {
    // this.setData({ show: false });
  },
  handleRedirect() {
    wx.navigateTo({
      url: '/pages/tools/text/wztq/index'
    })
  },
  async handleActivity(e) {
    let path = e.currentTarget.dataset.path
    console.log(path)
    await this.handleTologin();
    // this.handleOverLayClose();
    wx.navigateTo({
      url: path
    })
  },
  async handlelogin() {
    await this.handleTologin();
    this.handleOverLayClose();
  },
  handleOverLayClose() {
    this.setData({show: false});
  },
  // 获取更多工具
  async getToolsList() {
    const res = await Tools.getToolsList({
      limit: 4
    })
    let randomList = app.globalData.shuffle([0, 1, 2, 3]);
    res.data.forEach((item, index) => {
      let randomInt = randomList[index];
      res.data[index].colors = app.globalData.colors[randomInt];
    })
    this.setData({
      toolsList: res.data,
    })
  },
  // 工具跳转
  async handleToolRedirect(e) {
    if (!this.data.isLogin) {
      const loginResp = await app.globalData.handleToLogin();
      this.setData({
        isLogin: loginResp.isLogin,
        userInfo: loginResp.userInfo
      })
    }
    let url = "/pages/tools/";
    const videoType = e.detail.item.type
    const videoCode = e.detail.item.code
    switch (videoType) {
      case 1: // 图片类
        url += "pic"
        break
      case 2: // 文字类
        url += "text"
        break
      case 3: // 视频类
        url += "video"
        break
      default:
        return
    }
    url += `/${videoCode}/index`
    wx.navigateTo({
      url: url,
      fail() {
        wx.showToast({
          icon: 'none',
          title: '即将开放，敬请期待'
        })
      }
    })
  },
  // 授权登录
  async handleTologin() {
    if (this.data.isLogin) return
    const loginResp = await app.globalData.handleToLogin();
    this.setData({
      isLogin: loginResp.isLogin,
      show: false
    })
  },
  // 跳转到任务中心
  handleDailyRedirect() {
    wx.switchTab({
      url: "/pages/daily-task/daily-task",
    })
  },
  async handleMemberRedirect() {
    if (this.data.isLogin) {
      wx.navigateTo({
        url: "/pages/member/member",
      });
      return;
    }
    const loginResp = await app.globalData.handleToLogin();
    this.setData({
      isLogin: loginResp.isLogin,
      userInfo: loginResp.userInfo
    })
    wx.navigateTo({
      url: "/pages/member/member",
    });
  },
  // 获取首页弹框
  async getActicityInfo() {
    if (!this.data.isLogin) {
      const info = await Tools.activityInfo({
        type: 1
      });
      this.setData({
        show: info.data.path ? true : false,
        activity: info.data
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },
  onShow() {
    console.log('onShow')
    app.globalData.isLogin = wx.getStorageSync(cache.TOKEN) ? true : false;
    app.globalData.userInfo = wx.getStorageSync(cache.USER_INFO) || {};
    this.setData({
      isLogin: app.globalData.isLogin,
      userInfo: app.globalData.userInfo
    })
    setTimeout( () => {
       this.getActicityInfo();
    }, 1000)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '「免费易用」全面的自媒体工具你值得拥有！',
      path: '/pages/index/index',
      imageUrl: '/images/share/share_main.png',
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})