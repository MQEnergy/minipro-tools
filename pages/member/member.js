// pages/member/member.js
import Member from "../../model/member";
import cache from "../../enum/cache";
import APIConfig from "../../config/api";

const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    memberList: [],
    commentList: [],
    currentIndex: 0,
    currentPrice: {},
    excList: [
      {
        icon: 'todo-list',
        txt: '无限次数',
        desc: '保存视频'
      },
      {
        icon: 'browsing-history',
        txt: '免广告',
        desc: '专属特权'
      },
      {
        icon: 'video',
        txt: '高清导出',
        desc: '优质画面'
      },
      {
        icon: 'service',
        txt: '专属客服',
        desc: '优先接待'
      }
    ],
    payLock: false,
    isLogin: false,
    nowTime: new Date().getTime(),
    timeData: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
  },
  async getMemberCenter() {
    if (!this.data.isLogin) return
    const memberResp = await Member.GetMemberCenter()
    let commentList = memberResp.data.comment_list;
    commentList.forEach((cmt, idx) => {
      commentList[idx].avatar_url = APIConfig.uploadUrl + cmt.avatar_url;
    })
    this.setData({
      memberList: memberResp.data.member_list,
      commentList: commentList,
      currentPrice: memberResp.data.member_list[0],
    })
  },
  handleChange(event) {
    const index = event.currentTarget.dataset.index
    const id = event.currentTarget.dataset.id
    if (index === this.data.currentIndex) return
    const item = this.data.memberList.filter((item) => {
      if (item.id === id) {
        return item
      }
    })
    this.setData({
      currentIndex: index,
      currentPrice: item[0]
    })
  },
  onCountDownChange(e) {
    this.setData({
      timeData: e.detail
    })
  },
  // 发起支付
  async handlePay() {
    if (this.data.payLock) {
      return;
    }
    this.setData({
      payLock: true
    });
    wx.showLoading({
      title: "发起支付中",
      mask: true
    })
    const data = await Member.MemberOrderPay({
      member_conf_id: this.data.memberList[this.data.currentIndex].id
    });
    //弹起支付有延迟
    setTimeout(() => {
      this.setData({
        payLock: false
      });
    }, 500);
    if (data) {
      wx.requestPayment({
        timeStamp: data.data.timeStamp,
        nonceStr: data.data.nonceStr,
        package: data.data.package,
        signType: data.data.signType,
        paySign: data.data.paySign,
        success: async (res) => {
          await app.globalData.checkIsMember();
          wx.showModal({
            title: '提示',
            content: '支付成功，可以体验更多功能啦！',
            showCancel: false,
            success: async (res) => {
              wx.navigateBack();
            }
          })
        },
        fail(res) {
          wx.showToast({
            title: '支付失败请重新支付',
            icon: 'error',
            duration: 2000
          });
        }
      })
    }
    wx.hideLoading();
  },
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  async onShow() {
    app.globalData.isLogin = wx.getStorageSync(cache.TOKEN) ? true : false;
    this.setData({
      isLogin: app.globalData.isLogin,
    })
    await this.getMemberCenter()
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