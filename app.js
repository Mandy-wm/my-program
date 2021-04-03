// app.js

App({
  onLaunch() {
    // wx.setStorage({ 异步版本
    //   key: 'postList',
    //   data: dataObj.post,
    //   success() {

    //   },
    //   fail() {

    //   },
    //   complete() {
    //     0
    //   }
    // })
    var storageData = wx.getStorageSync('postList');
    if (!storageData) {
       var dataObj = require("data/data.js")
       wx.clearStorageSync(); 
       wx.setStorageSync('postList', dataObj.postList);
    }
  },
  globalData: {
    userInfo: null,
    g_isPlayingMusic: false,
    g_currentMusicPostId: null, //音乐所属文章的id号
    doubanBase: "https://douban.uieee.com"
  }
})
