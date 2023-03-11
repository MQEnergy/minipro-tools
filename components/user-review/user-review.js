// components/user-review/user-review.js
Component({
  properties: {
    comment: {
      type: Object
    },
    backColor: {
      type: String,
      value: '#3a3a41'
    },
    color: {
      type: String,
      value: '#fff'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    value: 5
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
