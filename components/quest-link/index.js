// components/quest-link/index.js
Component({
  properties: {
    toolId: String,
    code: String,
    type: String
  },

  data: {},

  methods: {
    handleTip(e) {
      console.log('this', this.data.toolId);
    },
    handleLink() {
      let url = "/pages/tools/";
      const linkType = this.data.type
      const linkCode = this.data.code
      switch (linkType) {
        case '1': // 图片类
          url += "pic"
          break
        case '2': // 文字类
          url += "text"
          break
        case '3': // 视频类
          url += "video"
          break
        default:
          return
      }
      url += `/${linkCode}/index`
      console.log('url', url);
      wx.navigateTo({
        url: url,
        fail() {
          wx.showToast({
            icon: 'none',
            title: '功能暂未开通 code:' + linkCode
          })
        }
      })
    }
  }
})
