import Http from '../utils/http'

/**
 * 用户类
 */
class User {
  /**
   * 获取用户信息
   * @returns {Promise<*|undefined>}
   */
  static async getUserInfo() {
    return await Http.request({
      url: '/api/user/info'
    })
  }

  /**
   * 获取用户会员信息
   * @returns {Promise<*|undefined>}
   */
  static async getUserMemberInfo() {
    return await Http.request({
      url: '/api/user/member-info'
    })
  }

  /**
   * 获取用户可用次数
   * @returns {Promise<*|undefined>}
   */
  static async getAvailableNum() {
    return await Http.request({
      url: '/api/user/available-num'
    })
  }

  /**
   * 登录
   * @returns {Promise<*|undefined>}
   */
  static async mpLogin(data) {
    return await Http.request({
      url: '/api/auth/mp-login',
      data,
      method: "POST"
    })
  }
}

export default User