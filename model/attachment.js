import APIConfig from "../config/api";

/**
 * 附件类
 */
class Attachment {
  /**
   * 获取上传地址
   * @returns {string}
   */
  static getUploadUrl() {
    return APIConfig.baseUrl + '/api/attachment/upload'
  }
}

export default Attachment