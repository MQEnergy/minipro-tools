// components/tool-item/tool-item.js
Component({
  properties: {
    toolName: {
      type: String,
      value: ''
    },
    toolData: {
      type: Array,
      value: []
    }
  },

  data: {

  },

  methods: {
    // 工具跳转
    handleTool(e) {
      let item = e.currentTarget.dataset.item
      this.triggerEvent('handleTool', {item})
    }
  }
})
