import Http from '../utils/http'

/**
 * 工具类
 */
class Tools {
  /**
   * 获取首页工具列表
   * @returns {Promise<*|undefined>}
   */
  static async getToolsList(data) {
    return await Http.request({
      url: '/api/tools/index',
      data
    })
  }

  /**
   * 获取更多工具列表
   * @returns {Promise<*|undefined>}
   */
  static async getMoreTools() {
    return await Http.request({
      url: '/api/tools/more',
    })
  }

  /**
   * 视频类工具
   * @returns {Promise<*|undefined>}
   */
  static async getVideoUrl(data) {
    return await Http.request({
      url: '/api/video-tools/cmd',
      method: 'POST',
      data
    })
  }

  /**
   * 图片类工具
   * @param data
   * @returns {Promise<*|undefined>}
   */
  static async getPicUrl(data) {
    return await Http.request({
      url: '/api/pic-tools/cmd',
      method: 'POST',
      data
    })
  }

  /**
   * 文字类工具
   * @param data
   * @returns {Promise<*|undefined>}
   */
  static async getTextUrl(data) {
    return await Http.request({
      url: '/api/text-tools/cmd',
      method: 'POST',
      data
    })
  }

  /**
   * 无水印视频地址上传
   * @param data
   * @returns {Promise<*|undefined>}
   */
  static async spsyUpload(data) {
    return await Http.request({
      url: '/api/video-tools/spsy-upload',
      method: 'POST',
      data
    })
  }

  /**
   * 获取首页活动图
   * @returns {Promise<*|undefined>}
   */
  static async activityInfo(data) {
    return await Http.request({
      url: '/api/home/activity',
      data
    })
  }
}

export default Tools