import APIConfig from '../config/api'
import wxToPromise from './wx.js'
import cache from '../enum/cache'
import store from "./store";

class Http {
  /**
   * 请求方法
   * 因为不需要使用类的属性，所以定义为静态方法，类的静态方法不需要实例化
   * refetch控制自动刷新令牌
   * @param url
   * @param data
   * @param method
   * @param refetch
   * @returns {Promise<*|undefined>}
   */
  static async request({url, data, method = 'GET', refetch = true}) {
    const token = store.getItem(cache.TOKEN);
    const appId = store.getItem(cache.APPID);
    if (appId) {
      APIConfig.header.Appid = appId;
    }
    if (!token) {
      delete APIConfig.header.Authorization
    } else {
      APIConfig.header.Authorization = 'Bearer ' + token;
    }
    let res = await wxToPromise('request', {
      url: APIConfig.baseUrl + url,
      data,
      method,
      header: APIConfig.header
    });
    // 全局的统一响应、异常处理
    if (res && res.data && res.statusCode != 200) {
      switch (res.statusCode) {
        case 400: res.data.message = res.data.message; break;
        case 401: res.data.message = '未授权，请登录'; break;
        case 403: res.data.message = '拒绝访问'; break;
        case 404: res.data.message = `请求地址出错`; break;
        case 405: res.data.message = `请求方法不允许`; break;
        case 408: res.data.message = '请求超时'; break;
        case 500: res.data.message = '服务器内部错误'; break;
        case 501: res.data.message = '服务未实现'; break;
        case 502: res.data.message = '网关错误'; break;
        case 503: res.data.message = '服务不可用'; break;
        case 504: res.data.message = '网关超时'; break;
        case 505: res.data.message = 'HTTP版本不受支持'; break;
        default: break;
      }
      // const message = Http._generateMessage(res.data.message)
      if (res.statusCode === 401) {
        store.clearItem(cache.TOKEN)
        store.clearItem(cache.USER_INFO)
        store.clearItem(cache.MEMBER_INFO)

        // 直接提示需要登录 或者 打开授权 Todo
        if (refetch) {
          // return await Http._refetch({url, data, method, refetch})
        }
      } else {
        Http._showError(res.data.message)
      }
      throw new Error(res.data.message)
    }
    return res.data;
  }

  /**
   * 刷新令牌
   * @param data
   * @returns {Promise<*|undefined>}
   * @private
   */
  static async _refetch(data) {
    // await Auth.getToken()
    // data.refetch = false
    // return await Http.request(data)
  }

  /**
   * 展示错误
   * @param message
   * @private
   */
  static _showError(message) {
    wx.showToast({
      title: message,
      icon: 'none',
      duration: 3000,
    })
  }

  /**
   * 信息过滤
   * @param message
   * @returns {string|*}
   * @private
   */
  static _generateMessage(message) {
    return typeof message === 'object' ? Object.values(message).join(';') : message
  }
}

export default Http