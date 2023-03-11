import Http from "../utils/http";

/**
 * 会员类
 */
class Member {

  /**
   * 获取会员中心信息
   * @returns {Promise<*|undefined>}
   */
  static async GetMemberCenter() {
    return await Http.request({
      url: '/api/member-center/config'
    })
  }

  /**
   * 订单支付
   * @param data
   * @returns {Promise<*|undefined>}
   * @constructor
   */
  static async MemberOrderPay(data) {
    return await Http.request({
      url: '/api/member-center/order-pay',
      method: 'post',
      data
    })
  }
}

export default Member