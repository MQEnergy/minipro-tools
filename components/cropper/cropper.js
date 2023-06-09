// components/cropper/cropper.js
Component({
  properties: {
    src: {
      type: String,
      value: ''
    }
  },

  data: {
    cvs: {
      width: 500,
      height: 500
    },
    initCvs: {
      width: wx.getSystemInfoSync().windowWidth - 30,
      height: (wx.getSystemInfoSync().windowHeight - 100 - getApp().data.navBarHeight) - 60,
    },
    imgSize: {
      width: 500,
      height: 500
    },
    dpr: 1,
    cursorIndex: 8,
    getUrl: false
  },
  ready() {
    this.init(this.data.src);
  },
  methods: {
    init(src = '') {
      this.setData({
        src
      })
      this.getCanvasNode();
    },
    getCanvasNode() {
      // 通过 SelectorQuery 获取 Canvas 节点
      this.createSelectorQuery()
      .select('#canvas')
      .fields({
        node: true,
        size: true,
      })
      .exec(this.goNext.bind(this));
    },
    goNext(res) {
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      const _self = this;
      this.canvas = canvas;
      this.ctx = ctx;
      const img = canvas.createImage();
      // console.log('%O', img);
      img.onload = function() {
        _self.setData({ img });
        _self.getImageScale();
        _self.calcCanvasSize();
        _self.drawImage();
        _self.drawSelect(
          _self.data.selectPosi.x,
          _self.data.selectPosi.y,
          _self.data.selectPosi.w,
          _self.data.selectPosi.h
        )
      }
      img.src = this.data.src;
    },
    getImageScale() {
      let { width, height } = this.data.img;
      let { width: initCvsW, height: initCvsH } = this.data.initCvs;

      let prop = width / height;
      let imgScale = 1;
      if (width < initCvsW && height < initCvsH) {
        imgScale = 1;
        return;
      }
      if (prop >= 1) {  // w > h
        imgScale = initCvsW / width;
      } else { // w < h
        imgScale = initCvsH / height;
      }
      this.setData({
        imgSize: {
          width,
          height
        },
        imgScale
      })
    },
    calcCanvasSize() {
      let { imgSize, imgScale, initCvs } = this.data;
      let canvasWidth = Math.min(initCvs.width, imgSize.width * imgScale);
      let canvasHeight = Math.min(initCvs.height, imgSize.height * imgScale);

      let dpr = wx.getSystemInfoSync().pixelRatio;
      this.setData({ // cvs css wh
        cvs: {
          width: canvasWidth,
          height: canvasHeight
        },
        selectPosi: {
          x: 0,
          y: canvasHeight / 3,
          w: canvasWidth,
          h: canvasHeight / 3
        },
        dpr
      })
      // cvs size
      this.canvas.width = canvasWidth * dpr;
      this.canvas.height = canvasHeight * dpr;
      this.ctx.scale(dpr, dpr);
      let { x, y, w, h } = this.data.selectPosi;
      this.setData({ mousePosi: this.getMousePosi(x, y, w, h) });
    },
    getMousePosi(x, y, w, h) {
      // 四个点 四条边
      return [
        [ x, y, 15, 15 ],
        [ x + w - 15, y, 15, 15 ],
        [ x + w - 15, y + h - 15, 15, 15 ],
        [ x, y + h - 15, 15, 15 ],
        [ x + 15, y, w - 15, 15 ],
        [ x + w - 15, y + 15, 15, h - 15 ],
        [ x + 15, y + h - 15, w - 15, 15 ],
        [ x, y + 15, 15, h - 15 ],
        [ x + 15, y + 15, w - 15, h - 15 ]
      ]
    },
    drawImage() {
      let { cvs: { width: canvasWidth, height: canvasHeight }, img } = this.data;
      this.ctx.save();
      // 绘制新形状时应用的合成操作的类型
      this.ctx.globalCompositeOperation = 'destination-over';
      // this.ctx.translate(canvasWidth / 2, canvasHeight / 2);
      // this.ctx.translate(-canvasWidth / 2, -canvasHeight / 2);
      this.ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight)
      this.ctx.restore();
    },
    drawSelect(x, y, w, h) {
      let { cvs: { width: canvasWidth, height: canvasHeight }, selectPosi } = this.data;
      this.ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      // 画遮罩
      this.drawCover();
      // 画矩形
      this.ctx.save();
      this.ctx.strokeStyle = 'rgba(39, 85, 243, 0.6)';
      this.ctx.lineWidth = 2;
      this.ctx.clearRect(x, y, w, h);
      this.ctx.strokeRect(x, y, w, h);
      // 画八个操作点
      this.operatePoint = this.getOperatePoint(x, y, w, h);
      this.operatePoint.map((item) => {
        this.ctx.save();
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(...item);
        this.ctx.strokeStyle = 'rgba(39, 85, 243, 0.6)';
        this.ctx.strokeRect(...item);
        this.ctx.restore();
      })
      this.ctx.restore();
      this.drawImage();
      this.setData({ mousePosi: this.getMousePosi(x, y, w, h) });
    },
    getOperatePoint(x, y, w, h) {
      return [
        // 矩形
        [ x, y, 8, 8 ], // 0
        [ x + w - 8, y, 8, 8 ], // 1
        [ x + w - 8, y + h - 8, 8, 8 ], // 2
        [ x, y + h - 8, 8, 8 ], // 3
        [ x + w / 2 - 8, y, 8, 8 ], // 4
        [ x + w - 8, y + h / 2 - 4, 8, 8 ], // 5
        [ x + w / 2 - 8, y + h - 8, 8, 8 ], // 6
        [ x, y + h / 2 - 4, 8, 8 ] // 7
        // 圆
        // [ x, y, 8, 0, Math.PI * 2 ], // 0
        // [ x + w - 8, y, 8, 0, Math.PI * 2 ], // 1
        // [ x + w - 8, y + h - 8, 8, 0, Math.PI * 2 ], // 2
        // [ x, y + h - 8, 8, 0, Math.PI * 2 ], // 3
        // [ x + w / 2 - 8, y, 8, 0, Math.PI * 2 ], // 4
        // [ x + w - 8, y + h / 2 - 4, 8, 0, Math.PI * 2 ], // 5
        // [ x + w / 2 - 8, y + h - 8, 8, 0, Math.PI * 2 ], // 6
        // [ x, y + h / 2 - 4, 8, 0, Math.PI * 2 ] // 7
      ]
    },
    drawCover() {
      let { cvs: { width: canvasWidth, height: canvasHeight } } = this.data;
      this.ctx.save();
      // this.ctx.fillStyle = 'rgba(80, 80, 80, .6)';
      this.ctx.fillStyle = 'rgba(39, 85, 243, 0.2)';
      this.ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      this.ctx.globalCompositeOperation = 'source-atop';
      this.ctx.restore();
    },
    touchStart(e) {
      let { clientX, clientY } = e.touches[0];
      let { offsetLeft, offsetTop } = e.target;
      let { dpr, cvs: { width: canvasWidth, height: canvasHeight } } = this.data;
      this.setData({ origin: { x: offsetLeft, y: offsetTop } });
      let startPointX = (clientX - offsetLeft);
      let startPointY = (clientY - offsetTop);
      let pathX = startPointX * dpr;
      let pathY = startPointY * dpr;
      let initPosi = {
        x: startPointX < 0 ? 0 : startPointX >= canvasWidth ? canvasWidth : startPointX,
        y: startPointY < 0 ? 0 : startPointY >= canvasHeight ? canvasHeight : startPointY
      }
      // 开始范围
      this.setData({ initPosi, touchStart: true, cursorIndex: this.getInitCursorIndex(pathX, pathY) });
    },
    getInitCursorIndex(pathX, pathY) {
      let { mousePosi, selectPosi } = this.data;
      for(let i = 0; i < mousePosi.length; i++) {
        if (this.checkPath(pathX, pathY, mousePosi[i])) {
          return i;
        }
      }
    },
    checkPath(x, y, rect) {
      this.ctx.beginPath();
      this.ctx.rect(...rect);
      let status = this.ctx.isPointInPath(x, y);
      this.ctx.closePath();
      return status;
    },
    touchMove(e) {
      let { clientX, clientY } = e.touches[0];
      let { offsetLeft, offsetTop } = e.target;
      let { cvs: { width: canvasWidth, height: canvasHeight }, dpr, mousePosi, touchStart, selectPosi, initPosi } = this.data;
      let movePointX = (clientX - offsetLeft);
      let movePointY = (clientY - offsetTop);
      movePointX = movePointX < 0 ? 0 : movePointX >= canvasWidth ? canvasWidth - 4 : movePointX,
      movePointY = movePointY < 0 ? 0 : movePointY >= canvasHeight ? canvasHeight : movePointY
      let distanceX = movePointX - initPosi.x;
      let distanceY = movePointY - initPosi.y;
      if (!this.data.touchStart) return;
      selectPosi = this.getNewSelectPosi(
        this.data.cursorIndex,
        selectPosi,
        { x: distanceX, y: distanceY }
      );
      selectPosi = this.checkBoundarySize(selectPosi);
      this.setData({ initPosi: { x: movePointX, y: movePointY }, selectPosi });
      this.drawSelect(selectPosi.x, selectPosi.y, selectPosi.w, selectPosi.h);
    },
    getNewSelectPosi(i, select, distance) {
      let _select = { ...select };
      let { x: distanceX, y: distanceY } = distance;
      switch(i) {
        case 0:
          _select.x += distanceX;
          _select.y += distanceY;
          _select.w -= distanceX;
          _select.h -= distanceY;
          break;
        case 1:
          _select.y += distanceY;
          _select.w += distanceX;
          _select.h -= distanceY;
          break;
        case 2:
          _select.w += distanceX;
          _select.h += distanceY;
          break;
        case 3:
          _select.x += distanceX;
          _select.w -= distanceX;
          _select.h += distanceY;
          break;
        case 4:
          _select.y += distanceY;
          _select.h -= distanceY;
          break;
        case 5:
          _select.w += distanceX;
          break;
        case 6:
          _select.h += distanceY;
          break;
        case 7:
          _select.x += distanceX;
          _select.w -= distanceX;
          break;
        case 8:
          _select.x += distanceX;
          _select.y += distanceY;
          break;
        default:
          break;
      }
      return _select;
    },
    checkBoundarySize(_select) {
      let { cvs: { width: canvasWidth, height: canvasHeight } } = this.data;

      _select.x < 0 && (_select.x = 0);
      _select.y < 0 && (_select.y = 0);
      _select.w < 50 && (_select.w = 50);
      _select.h < 50 && (_select.h = 50);
      _select.x + _select.w >= canvasWidth && (_select.w -=  (_select.x + _select.w - canvasWidth));
      // _select.x + _select.w >= canvasWidth && (_select.x -= (_select.x + _select.w - canvasWidth));
      // _select.y + _select.h >= canvasHeight && (_select.y -= (_select.y + _select.h - canvasHeight));
      _select.y + _select.h >= canvasHeight && (_select.h -= (_select.y + _select.h - canvasHeight));
      return _select;
    },
    touchEnd(e) {
      if (this.data.touchStart) {
        this.setData({ touchStart: false, getUrl: true });
      }
    },
    save() {
      if (!this.data.getUrl) return;
      // 重新创建一块画布
      this.createSelectorQuery()
      .select('#clip-canvas')
      .fields({
        node: true,
        size: true,
      })
      .exec(this.getDrawData.bind(this));
    },
    getDrawData(res) {
      const canvas = res[0].node;
      const ctx = canvas.getContext('2d');
      let { imgSize: { width: imgW, height: imgH }, imgScale, img } = this.data;
      
      let { x, y, w, h } = this.data.selectPosi;
      x = x / imgScale;
      y = y / imgScale;
      w = w / imgScale;
      h = h / imgScale;
      console.log('x1, y1, w1, h1', x, y, w, h);
      let pos = {x, y, w, h}
      this.triggerEvent('pos', { pos });
      // canvas.width = imgW;
      // canvas.height = imgH;
      // console.log(imgW, imgH);
      // ctx.clearRect(0, 0, imgW, imgH);
      // ctx.translate(imgW / 2, imgH / 2);
      
      // ctx.translate(-imgW / 2, -imgH / 2);
      // ctx.drawImage(img, 0, 0, imgW, imgH);
      // const getImageData = ctx.getImageData(x, y, w, h);
      // let { width: getW, height: getH } = getImageData;
      // // console.log(canvas, ctx, ctx.getImageData(x, y, w, h), getW, getH);
      // canvas.width = getW;
      // canvas.height = getH;
      // ctx.putImageData(getImageData, 0, 0);
      // const url = canvas.toDataURL('jpeg', .92);
      // console.log('url', url);
      // wx.redirectTo({
      //   url: '../../Pages/previewImage/index?src=' + encodeURIComponent(JSON.stringify(url)),
      // })
      // this.triggerEvent('imgUrl', { url });
    }
  }
})
