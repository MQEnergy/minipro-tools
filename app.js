import User from "./model/user";
import cache from "./enum/cache";
import Auth from "./model/auth";
import store from "./utils/store";

/**
 * 全局登录
 * @returns {Promise<{isLogin: boolean, userInfo: *}>}
 */
const handleToLogin = async function () {
  try {
    // 1.获取用户信息，获取用户的微信昵称及头像
    const res = await wx.getUserProfile({
      desc: "用于完善用户信息",
    })
    wx.showLoading({
      title: '正在授权',
      mask: true
    });
    const loginResp = await Auth.handleLogin(res.userInfo);
    const memberResp = await checkIsMember();
    wx.hideLoading();
    return {
      isLogin: loginResp.isLogin,
      userInfo: loginResp.userInfo,
      memberInfo: memberResp
    }
  } catch (e) {
    wx.showToast({
      title: "登录才能获取完整功能哦",
      icon: 'none',
      duration: 3000,
    })
    wx.hideLoading();
    throw new Error("登录才能获取完整功能哦")
  }
}

// 检查是不是登录，如果登录，查看是不是会员
const checkIsMember = async () => {
  if (!wx.getStorageSync(cache.TOKEN)) {
    return {}
  }
  let res = await User.getUserMemberInfo();
  if (res.data) {
    wx.setStorageSync(cache.MEMBER_INFO, res.data);
  }
  return res.data
}

/**
 * 获取最新的可用次数
 * @returns {Promise<*|string|{}>}
 */
const getAvailableNum = async () => {
  // 会员不扣次数不用请求
  if (!store.getItem(cache.MEMBER_INFO)) {
    const availableResp = await User.getAvailableNum();
    store.setItem("available_num", availableResp.data.available_num, cache.USER_INFO)
    const userInfo = store.getItem(cache.USER_INFO) || {};
    return userInfo;
  } else {
    return false;
  }
}

/**
 * 给定数组乱序
 * @param arr
 * @returns {*}
 */
const shuffle = function (arr) {
  return arr.sort(() => (Math.random() - 0.5))
}

/**
 * 取数组中随机元素
 * @param arr
 * @param start
 * @param num
 * @returns {*}
 */
const randomArr = function (arr, start, num) {
  return arr
    .sort((x, y) => {
      return Math.random() > 0.5 ? -1 : 1;
    })
    .slice(start, num)
}

/**
 * 匹配链接地址
 * @param s
 * @returns {*}
 */
const matchUrl = function httpString(s) {
  let reg = /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
  s = s.match(reg);
  return s
}

/**
 * 获取用户文件授权
 */
const getUserSetting = async function (callback, _type = 'jpg', _link = '') {
  wx.getSetting({
    success: (res) => {
      if (res.authSetting['scope.writePhotosAlbum'] === undefined) {
        wx.authorize({
          scope: 'scope.writePhotosAlbum',
          success() {
            console.log('打开了授权')
            callback(_type, _link);
          },
          fail(err) {
            wx.showToast({
              title: '授权失败',
              icon: 'none'
            });
          }
        })
      } else if (!res.authSetting['scope.writePhotosAlbum']) {
        wx.openSetting({
          success: (res) => {
            if (res.authSetting['scope.writePhotosAlbum']) {
              callback(_type, _link);

            } else {
              wx.showToast({
                title: '您没有授权，无法保存到相册',
                icon: 'none'
              })
            }
          },
          fail(err) {
            wx.showToast({
              title: '授权失败',
              icon: 'none'
            });
          },
        })
      } else {
        callback(_type, _link);
      }
    },
    fail() {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      });
    },
  })
}
/**
 * 保存临时文件到系统相册
 * @param _type
 * @param filePath 临时文件路径
 * @returns {Promise<void>}
 */
const saveTempFileToAlbum = async function (_type = 'png', filePath) {
  if (_type === 'mp4') {
    wx.saveVideoToPhotosAlbum({//保存视频到相册
      filePath,
      success: (file) => {
        wx.showToast({
          title: '保存视频成功',
          icon: 'success',
        })
      },
      fail: (err) => {
        wx.showToast({
          title: '保存视频失败',
          icon: 'none'
        });
      },
      complete() {
        wx.hideLoading()
      }
    })
  } else {
    wx.saveImageToPhotosAlbum({ // 保存图片到相册
      filePath: filePath,
      success: (file) => {
        wx.showToast({
          title: '保存图片成功',
          icon: 'success',
        })
      },
      fail: (err) => {
        wx.showToast({
          title: '保存图片失败',
          icon: 'none'
        })
      },
      complete() {
        wx.hideLoading()
      }
    })
  }
}

/**
 * 视频链接保存到本地
 * @param _type
 * @param _link
 */
const handleDownload = (_type = 'png', _link = '') => {
  try {
    const filePath = wx.env.USER_DATA_PATH + '/' + new Date().valueOf() + '.' + _type
    wx.downloadFile({
      url: _link,
      filePath: filePath, // 指定文件下载后存储的路径
      success: function (res) {
        let _filePath = res.filePath;//下载到本地获取临时路径
        if (res.statusCode === 200) {
          if (_type === 'mp4') {
            wx.saveVideoToPhotosAlbum({//保存视频到相册
              filePath: _filePath,
              success: function (res1) {
                //删除临时文件
                wx.getFileSystemManager().unlink({
                  filePath: _filePath,
                })
                wx.hideLoading();
                wx.showToast({
                  title: '下载成功',
                })
              },
              fail(err) {
                wx.hideLoading();
                wx.showModal({
                  title: '提示',
                  content: '下载失败，请关注陈王百口公众号进行更多视频提取',
                  success: function (res) {
                    if (res.confirm) {
                      console.log('确定')
                    } else {
                      console.log('取消')
                    }
                  }
                });
              }
            })
          } else {
            wx.saveImageToPhotosAlbum({ // 保存图片到相册
              filePath: _filePath,
              success: function (res1) {
                wx.hideLoading();
                wx.showToast({
                  title: '下载成功',
                })
              },
              fail(err) {
                wx.hideLoading();
                wx.showModal({
                  title: '提示',
                  content: '下载失败，请关注陈王百口公众号进行更多图片操作',
                  success: function (res) {
                    if (res.confirm) {
                      console.log('确定')
                    } else {
                      console.log('取消')
                    }
                  }
                });
              }
            })
          }
        } else {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '下载失败，请关注陈王百口公众号进行视频提取',
            success: function (res) {
              if (res.confirm) {
                console.log('确定')
              } else {
                console.log('取消')
              }
            }
          })
        }
      },
      fail(err) {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '下载失败，请关注陈王百口公众号进行视频提取',
          success: function (res) {
            if (res.confirm) {
              console.log('确定')
            } else {
              console.log('取消')
            }
          }
        })
      },
    });
  } catch (e) {
    wx.hideLoading();
  }
}

let globalData = {
  appId: wx.getStorageSync(cache.APPID) || '',
  systeminfo: {}, // 系统信息
  headerBtnPosi: {}, // 胶囊按钮位置信息
  userInfo: wx.getStorageSync(cache.USER_INFO) || {},
  memberInfo: wx.getStorageSync(cache.MEMBER_INFO) || {},
  isLogin: wx.getStorageSync(cache.TOKEN) ? true : false,
  capshlebarData: wx.getStorageSync('capshlebarData') || {},
  colors: [
    {'bg': '#f9801c', 'text': '#fff'},
    {'bg': '#3271fd', 'text': '#fff'},
    {'bg': '#1fcabc', 'text': '#fff'},
    {'bg': '#53b851', 'text': '#fff'},
    {'bg': '#f6a646', 'text': '#fff'},
    {'bg': '#f96c16', 'text': '#fff'},
    {'bg': '#0b73f5', 'text': '#fff'},
    {'bg': '#8189f5', 'text': '#fff'},
    {'bg': '#26818a', 'text': '#fff'},
    {'bg': '#1e80ff', 'text': '#fff'},
    {'bg': '#2848f9', 'text': '#fff'},
    {'bg': '#178c70', 'text': '#fff'},
    {'bg': '#c73d3d', 'text': '#fff'},
    {'bg': '#a932f7', 'text': '#fff'},
  ],
  handleToLogin,
  shuffle,
  randomArr,
  matchUrl,
  getUserSetting,
  handleDownload,
  saveTempFileToAlbum,
  getAvailableNum,
  checkIsMember
};

App({
  data: {
    screenRatio: 750 / wx.getSystemInfoSync().screenWidth,
    navBarHeight: wx.getSystemInfoSync().statusBarHeight + 44
  },
  // 显示页面，显示的时候就加载
  onShow() {
    this.checkUpdateVersion();
    // this.checkIsMember();
  },
  // 页面加载只执行一次
  async onLaunch() {
    // 获取小程序的账号信息和环境
    const accountInfo = wx.getAccountInfoSync();
    // 设置全局AppId以供多页面调用，同时store存储一份
    let appId = accountInfo.miniProgram.appId;
    this.globalData.appId = appId;
    wx.setStorageSync(cache.APPID, appId);
    // 获取设备信息
    wx.getSystemInfo({
      success: (res) => {
        this.globalData.systeminfo = res;
      }
    });
    // 获得胶囊按钮位置信息
    this.globalData.headerBtnPosi = wx.getMenuButtonBoundingClientRect();
    // 处理橡胶囊的数据
    this.initCapshlebar();
  },
  // 查看小程序版本有没有更新
  checkUpdateVersion() {
    //判断微信版本是否 兼容小程序更新机制API的使用
    if (wx.canIUse('getUpdateManager')) {
      //创建 UpdateManager 实例
      const updateManager = wx.getUpdateManager();
      //检测版本更新
      updateManager.onCheckForUpdate(function (res) {
        // 请求完新版本信息的回调
        if (res.hasUpdate) {
          //监听小程序有版本更新事件
          updateManager.onUpdateReady(function () {
            //TODO 新的版本已经下载好，调用 applyUpdate 应用新版本并重启 （ 此处进行了自动更新操作）
            updateManager.applyUpdate();
          });
          updateManager.onUpdateFailed(function () {
            // 新版本下载失败
            wx.showModal({
              title: '已经有新版本喽~',
              content: '请您删除当前小程序，到微信 “发现-小程序” 页，重新搜索打开哦~'
            });
          });
        }
      });
    } else {
      //TODO 此时微信版本太低（一般而言版本都是支持的）
      wx.showModal({
        title: '溫馨提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      });
    }
  },
  initCapshlebar() {
    let statusBarHeight = this.globalData.systeminfo.statusBarHeight; // 状态栏高度
    let headerPosi = this.globalData.headerBtnPosi; // 胶囊位置信息
    let btnPosi = {
      // 胶囊实际位置，坐标信息不是左上角原点
      height: headerPosi.height,
      width: headerPosi.width,
      top: headerPosi.top - statusBarHeight, // 胶囊top - 状态栏高度
      bottom: headerPosi.bottom - headerPosi.height - statusBarHeight, // 胶囊bottom - 胶囊height - 状态栏height （胶囊实际bottom 为距离导航栏底部的长度）
      right: this.globalData.systeminfo.screenWidth - headerPosi.right // 屏幕宽度 - 胶囊right
    };
    /**
     * wx.getMenuButtonBoundingClientRect() 坐标信息以屏幕左上角为原点
     * 菜单按键宽度： 87
     * 菜单按键高度： 32
     * 菜单按键左边界坐标： 278
     * 菜单按键上边界坐标： 26
     * 菜单按键右边界坐标： 365
     * 菜单按键下边界坐标： 58
     */
    let dwObj = wx.getMenuButtonBoundingClientRect();
    let capshlebarData = {
      statusBarHeight: statusBarHeight,
      navbarHeight: dwObj.height + dwObj.top + 7, // 胶囊bottom + 胶囊实际bottom
      navbarBtn: btnPosi,
      navbarTop: dwObj.top,
      navHeight: dwObj.height
    };
    this.globalData.capshlebarData = capshlebarData;
    wx.setStorageSync('capshlebarData', capshlebarData);
  },
  globalData
});