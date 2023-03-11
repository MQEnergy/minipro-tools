import cache from "../enum/cache"
import store from "../utils/store";
import User from "./user";

class Auth {
  /**
   * 获取登录token
   * @param code
   * @param userInfo
   * @returns {Promise<*>}
   */
  static async getToken(code, userInfo) {
    try {
      const res = await User.mpLogin({
        code,
        nick_name: userInfo.nickName,
        avatar_url: userInfo.avatarUrl,
        phone: userInfo.phone || ''
      })
      store.setItem(cache.TOKEN, res.data.token)
      return res.data

    } catch (e) {
      throw new Error(e.message)
    }
  }

  /**
   * 登录获取token和用户信息
   * @returns {Promise<{isLogin: boolean, isMember: *, availableNum: *, uuid: (string|*)}>}
   */
  static async handleLogin(userInfo) {
    try {
      const resCode = await wx.login()
      if (resCode.code && userInfo) {
        const loginResp = await this.getToken(resCode.code, userInfo)
        const userResp = await User.getUserInfo();
        store.setItem(cache.USER_INFO, userResp.data)
        return {
          isLogin: loginResp.token != "",
          userInfo: userResp.data
        }
      }
    } catch (e) {
      throw new Error(e)
    }
  }
}

export default Auth