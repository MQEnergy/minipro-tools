// pages/tools/tools.js
import Tools from "../../model/tools";
import user from "../../behaviors/user";

const app = getApp();

Page({
  behaviors: [user],
  /**
   * 页面的初始数据
   */
  data: {
    loading: true,
    pic: [{
      "code": "",
      "colors": {"bg": "#ebedf0", "text": ""},
      "desc": "",
      "icon_class": "",
      "id": 1,
      "member_only": 1,
      "name": "",
      "status": 1,
      "type": 1
    }, {
      "code": "",
      "colors": {"bg": "#ebedf0", "text": ""},
      "desc": "",
      "icon_class": "",
      "id": 1,
      "member_only": 1,
      "name": "",
      "status": 1,
      "type": 1
    }, {
      "code": "",
      "colors": {"bg": "#ebedf0", "text": ""},
      "desc": "",
      "icon_class": "",
      "id": 1,
      "member_only": 1,
      "name": "",
      "status": 1,
      "type": 1
    }, {
      "code": "",
      "colors": {"bg": "#ebedf0", "text": ""},
      "desc": "",
      "icon_class": "",
      "id": 1,
      "member_only": 1,
      "name": "",
      "status": 1,
      "type": 1
    }],
    text: [{
      "code": "",
      "colors": {"bg": "#ebedf0", "text": ""},
      "desc": "",
      "icon_class": "",
      "id": 1,
      "member_only": 1,
      "name": "",
      "status": 1,
      "type": 1
    }, {
      "code": "",
      "colors": {"bg": "#ebedf0", "text": ""},
      "desc": "",
      "icon_class": "",
      "id": 1,
      "member_only": 1,
      "name": "",
      "status": 1,
      "type": 1
    }, {
      "code": "",
      "colors": {"bg": "#ebedf0", "text": ""},
      "desc": "",
      "icon_class": "",
      "id": 1,
      "member_only": 1,
      "name": "",
      "status": 1,
      "type": 1
    }, {
      "code": "",
      "colors": {"bg": "#ebedf0", "text": ""},
      "desc": "",
      "icon_class": "",
      "id": 1,
      "member_only": 1,
      "name": "",
      "status": 1,
      "type": 1
    }],
    video: [{
      "code": "",
      "colors": {"bg": "#ebedf0", "text": ""},
      "desc": "",
      "icon_class": "",
      "id": 1,
      "member_only": 1,
      "name": "",
      "status": 1,
      "type": 1
    }, {
      "code": "",
      "colors": {"bg": "#ebedf0", "text": ""},
      "desc": "",
      "icon_class": "",
      "id": 1,
      "member_only": 1,
      "name": "",
      "status": 1,
      "type": 1
    }, {
      "code": "",
      "colors": {"bg": "#ebedf0", "text": ""},
      "desc": "",
      "icon_class": "",
      "id": 1,
      "member_only": 1,
      "name": "",
      "status": 1,
      "type": 1
    }, {
      "code": "",
      "colors": {"bg": "#ebedf0", "text": ""},
      "desc": "",
      "icon_class": "",
      "id": 1,
      "member_only": 1,
      "name": "",
      "status": 1,
      "type": 1
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getToolsList();
  },
  /**
   * 获取更多工具列表
   * @returns {Promise<void>}
   * @private
   */
  async getToolsList() {
    const res = await Tools.getMoreTools()
    let randomList = app.globalData.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]);
    res.data.forEach((item, index) => {
      let randomInt = randomList[index];
      res.data[index].colors = app.globalData.colors[randomInt];
    })
    let pic = []
    let text = []
    let video = []
    res.data.filter((item) => {
      if (item.type === 1) {
        pic.push(item)
      }
      if (item.type === 2) {
        text.push(item)
      }
      if (item.type === 3) {
        video.push(item)
      }
    })
    this.setData({
      pic,
      text,
      video
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
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '「免费易用」全面的自媒体工具你值得拥有！',
      path: '/pages/tools/tools',
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