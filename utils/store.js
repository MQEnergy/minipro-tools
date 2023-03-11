module.exports = {
  // 设置值
  setItem(key, value, module_name = '') {
    if (module_name) {
      let module_name_info = this.getItem(module_name)
      module_name_info[key] = value
      wx.setStorageSync(module_name, module_name_info)
    } else {
      wx.setStorageSync(key, value)
    }
  },
  // 获取值
  getItem(key, module_name = '') {
    if (module_name) {
      let val = this.getItem(module_name)
      if (val) return val[key]
      return ''
    }
    return wx.getStorageSync(key)
  },
  // 删除或者清空值
  clearItem(key) {
    key ? wx.removeStorageSync(key) : wx.clearStorageSync()
  },
  // 获取系统信息
  getSystemInfo() {
    return wx.getSystemInfoSync();
  }
}