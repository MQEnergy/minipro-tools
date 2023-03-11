// components/my-content/index.js
Component({
  properties: {
    res: Array
  },

  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    handleItem(event) {
      console.log(event);
      const id = event.currentTarget.dataset.id
      this.triggerEvent('item', {id})
    }
  }
})
