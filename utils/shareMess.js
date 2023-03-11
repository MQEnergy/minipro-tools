export default function share(type, code) {
  console.log('code', code);
  let url = '/pages/tools/';
  switch(type) {
    case 'pic':
      url += 'pic'
      break
    case 'text':
      url += 'text'
      break
    case 'video':
      url += 'video'
      break
    default:
      return
  }
  url += `/${code}/index`
  let imageUrl = `/images/share/share_${type}.png`
  return {
    title: '「免费易用」全面的自媒体工具你值得拥有！',
    path: url,
    imageUrl,
    success: (res) => {
      console.log("转发成功", res);
    },
    fail: (res) => {
      console.log("转发失败", res);
    }
  }
}