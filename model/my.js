import Http from '../utils/http'

class My {
  // 建议反馈
  static async sendFeedback(data) {
    return await Http.request({
      url: '/api/settings/feedback',
      method: 'POST',
      data
    })
  }
  // 退出登录
  static async authLogout() {
    return await Http.request({
      url: '/api/auth/logout',
      method: 'POST'
    })
  }
}

export default My