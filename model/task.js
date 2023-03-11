import Http from '../utils/http'

class Task {
  // 任务中心首页
  static async getTaskCenter() {
    return await Http.request({
      url: '/api/task-center/config'
    })
  }
  // 任务中心签到
  static async signUp() {
    return await Http.request({
      url: '/api/task-center/signup',
      method: 'POST'
    })
  }
  // 每日完成任务
  static async dayFinish(data) {
    return await Http.request({
      url: '/api/task-center/day-finish',
      method: 'POST',
      data
    })
  }
}

export default Task