// pages/tools/text/wbjc/result/result.js
import shareMess from "../../../../../utils/shareMess";

Page({
  data: {
    toolName: 'wbjc',
    vecFrag: [],
    correctQuery: '',
    text: ''
  },

  onLoad(options) {
    // let result = {
    //   "item": {
    //     "vec_fragment": [{"end_pos": 20, "begin_pos": 17, "correct_frag": "大生地", "ori_frag": "大声地"}],
    //     "score": 0.5656900405883789,
    //     "correct_query": "123123啊实打实大师大多阿达撒大生地"
    //   },
    //   "text": "123123啊实打实大师大多阿达撒大声地",
    //   "log_id": 1629402961677994898
    // };
    let result = JSON.parse(options.res)
    this.handleTextOperate(result);
  },
  // 文字显示处理
  handleTextOperate(result) {
    wx.showLoading({
      title: '正在处理中',
      mask: true
    })
    const resItem = result.item
    const resText = result.text
    const vecFrag = resItem.vec_fragment
    const correctQuery = resItem.correct_query
    const textList = resText.split('')

    for (let j = 0; j < vecFrag.length; j++) {
      let beginPos = vecFrag[j].begin_pos;
      let endPos = vecFrag[j].end_pos;
      let wordNum = endPos - beginPos;
      let oriFrag = vecFrag[j].ori_frag.split('');
      let correctFrag = vecFrag[j].correct_frag.split('');
      let oriFragItems = [`<text class="line">`, ...oriFrag, `</text>`];
      let correctFragItems = [`<text class="right">`, ...correctFrag, `</text>`];
      textList.splice(beginPos, wordNum, ...oriFragItems, ...correctFragItems)
    }
    wx.hideLoading();
    this.setData({
      vecFrag: vecFrag,
      correctQuery: correctQuery,
      text: textList.join('')
    })
  },
  handleCopy() {
    wx.setClipboardData({
      data: this.data.correctQuery,
      success: (res) => {
        wx.getClipboardData({
          success: (res) => {
            wx.showToast({
              title: '复制成功',
            })
          }
        });
      }
    })
  },
  onReady() {
  },
  onShow() {
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    let code = this.data.toolName
    return shareMess('pic', code)
  }
})