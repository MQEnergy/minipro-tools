// components/btn-upload/index.js
import Attachment from "../../model/attachment";
import cache from "../../enum/cache";

const app = getApp();

Component({
  properties: {
    toolName: {
      type: String,
      value: ''
    },
    uploadType: {
      type: Number,
      value: 0
    },
    acceptType: {
      type: String,
      value: 'image'
    },
    maxSize: {
      type: Number,
      value: 10485760
    }
  },
  data: {},
  methods: {
    onOversize(file) {
      wx.showToast({
        title: '文件大小不能超过' + this.data.maxSize / 1024 / 1024 + "M",
        icon: 'none'
      })
    },
    beforeRead(e) {
      const {file, callback} = e.detail;
      this.triggerEvent('beforeread', e.detail);
      callback(file.type === this.data.acceptType);
    },
    async afterRead(e) {
      const {file} = e.detail;
      wx.showLoading({
        title: '正在上传中',
        mask: true
      })
      let token = wx.getStorageSync(cache.TOKEN);
      if (!token) {
        await app.globalData.handleToLogin()
      }
      token = wx.getStorageSync(cache.TOKEN);
      wx.uploadFile({
        url: Attachment.getUploadUrl(),
        filePath: file.url,
        name: 'file',
        formData: {
          file_path: this.data.toolName,
          upload_type: this.data.uploadType
        },
        header: {
          "Authorization": "Bearer " + token
        },
        success: (res) => {
          const {data, message} = JSON.parse(res.data);
          if (data) {
            let url = {
              fileUrl: data.file_path,
              tempUrl: file.url,
              file: file,
            }
            this.triggerEvent('upload', {url})
          } else {
            wx.showToast({
              title: message,
              icon: 'none'
            })
          }
        },
        fail(err) {
          wx.showToast({
            title: err.message || '上传失败',
            icon: 'none'
          })
        },
        complete() {
          wx.hideLoading();
        }
      })
    }
  }
})