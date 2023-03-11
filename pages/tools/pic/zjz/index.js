// pages/tools/pic/zjz/detail.js
import WeCropper from "../../../../components/we-cropper/we-cropper";
import APIConfig from "../../../../config/api";

const device = wx.getSystemInfoSync()
const width = device.windowWidth
const height = device.windowHeight - 166 - 44

Page({
  data: {
    toolName: 'zjz',
    active: 0,
    cropperOpt: {
      id: 'cropper', // 用于手势操作的canvas组件标识符
      targetId: 'targetCropper', // 用于用于生成截图的canvas组件标识符
      pixelRatio: device.pixelRatio, // 传入设备像素比
      width: width, // 画布宽度
      height: height, // 画布高度
      scale: 2.5, // 最大缩放倍数
      zoom: 8, // 缩放系数
      cut: {
        x: (width - 295) / 2,
        y: (height - 413) / 2,
        width: 295,
        height: 413
      },
      boundStyle: {
        color: '#2755f3',
        mask: 'rgba(0,0,0,0.8)',
        lineWidth: 1
      },
      isFinished: false // true:上传图片成功
    },
    colorList: [
      '#fff',
      '#EB3817',
      '#76B0F0',
      '#7B818F',
      '#80A8E8',
      '#31527C',
      '#568BDB',
    ],
    sizeList: [
      // 一寸照片
      {
        width: 295,
        height: 413,
      },
      // 小两寸照片
      {
        width: 413,
        height: 531,
      },
      // 两寸照片
      {
        width: 413,
        height: 579,
      },
    ],
    currentSize: {
      width: 295,
      height: 413,
    },
    imgUrl: '',
    isFinished: false, // true:上传图片成功
    fileInfo: null,
    curIndex: 0,
  },
  removeImage() {
    this.cropper.removeImage()
  },
  touchStart(e) {
    this.cropper.touchStart(e)
  },
  touchMove(e) {
    this.cropper.touchMove(e)
  },
  touchEnd(e) {
    this.cropper.touchEnd(e)
  },
  getCropperImage() {
    this.cropper.getCropperImage()
      .then((src) => {
        console.log("src", src)
        wx.previewImage({
          current: '', // 当前显示图片的http链接
          urls: [src] // 需要预览的图片http链接列表
        })
      })
      .catch((err) => {
        wx.showModal({
          title: '温馨提示',
          content: err.message
        })
      })
  },
  uploadTap() {
    const self = this
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        const src = res.tempFilePaths[0]
        self.cropper.pushOrigin(src)

        //  获取裁剪图片资源后，给data添加src属性及其值
        // wx.uploadFile({
        //   url: Attachment.getUploadUrl(), // 仅为示例，非真实的接口地址
        //   filePath: src,
        //   name: 'file',
        //   formData: {file_path: 'zjz'},
        //   success: (res) => {
        //     self.cropper.pushOrigin(src)
        //     const {data} = JSON.parse(res.data);
        //     console.log('data', data);
        //     self.setData({
        //       fileInfo: data,
        //       cropperOpt: {
        //         isFinished: true
        //       }
        //     })
        //   },
        // });

      }
    })
  },
  handleTabChange(event) {
    this.setData({
      currentSize: {
        width: this.data.sizeList[event.detail.name].width, // 画布宽度
        height: this.data.sizeList[event.detail.name].height, // 画布高度
      }
    })
  },
  handleChoose(e) {
    this.setData({
      curIndex: e.currentTarget.dataset.index
    })
  },
  onLoad(option) {
    this.setData({
      imgUrl: APIConfig.uploadUrl + decodeURIComponent(option.url)
    })
    const {cropperOpt} = this.data
    this.cropper = new WeCropper(cropperOpt)
      .on('ready', (ctx) => {
        console.log(`wecropper is ready for work!`)
      })
      .on('beforeImageLoad', (ctx) => {
        console.log(`weCropper is ready`)
        console.log(`current canvas context:`, ctx)
        wx.showToast({
          title: '上传中',
          icon: 'loading',
          duration: 20000
        })
      })
      .on('imageLoad', (ctx) => {
        console.log(`picture loaded`)
        console.log(`current canvas context:`, ctx)
        wx.hideToast()
      })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    return {
      title: '「免费易用」全面的自媒体工具你值得拥有！',
      path: '/pages/tools/pic/zjz/index',
      imageUrl: "/images/share/share_pic.png",
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})