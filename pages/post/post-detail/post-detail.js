import {DBPost} from "../../../db/DBPost.js"
var app = getApp();
console.log(app)
// pages/post/post-detail/post-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //是否播放音乐
    isPlayingMusic: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id; //在detail页面获得postId， 就是上个url上附带的查询参数id=
    //获取postId后，根据postId获取缓存中数据
    console.log(postId)
   
   this.dbPost = new DBPost(postId); //构造函数
   console.log(this.dbPost.postId)
   this.postData = this.dbPost.getPostItemById().data;
    this.setData({
      post: this.postData
    })
    //每次点击进入页面详情页，阅读数就会加1
    this.addReadingTimes();

    //监听音乐播放器，音乐停止播放时，音乐图片变成未播放状态
    this.setMusicMonitor();

    //初始化音乐播放图片
    this.initMusicStatus();

    //点赞动作动画效果
    this.setAniation();
    
  


  },
  onCollectionTap: function (event) {
    var newData = this.dbPost.collect();
    //重新绑定数据，注意，不要将整个newData全部作为setData的参数，应当有选择的更新  部分 数据
    this.setData({
      'post.collectionStatus' : newData.collectionStatus,
      'post.collectionNum' : newData.collectionNum
    })
    //交互结果反馈
    wx.showToast({
      title: newData.collectionStatus ? "收藏成功" : "取消收藏",
      duration: 1000,
      icon: "success",
      mask: true
    })
  },
  onUpTap: function (event) {
    var newData = this.dbPost.up();
    this.setData({
      'post.upStatus' : newData.upStatus,
      'post.upNum' : newData.upNum
    })
    //点赞动作动画效果
    this.animationUp.scale(2).step();
    this.setData({
      animationUp: this.animationUp.export() //export()是导出动画， 绑定到需要作用的wxml上，之后需要在wxml上绑定这个动画
    })
    setTimeout(function(){
      this.animationUp.scale(1).step();
      this.setData({
        animationUp: this.animationUp.export()
      })
    }.bind(this), 300);
  

  },
  onCommentTap: function(event) {
    var id = event.currentTarget.dataset.postId;
    wx.navigateTo({
      url:'../../../pages/post/post-comment/post-comment?id=' + id
    })
  },
  //阅读量+1
  addReadingTimes: function() {
    this.dbPost.addReadingTimes();
  },
  //切换音乐播放图标
  onMusicTap(event) {
    console.log(this.data.isPlayingMusic)
    
    if (this.data.isPlayingMusic) {
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
    } else {
      wx.playBackgroundAudio({
        dataUrl: this.postData.music.url,
        title: this.postData.music.title,
        coverImgUrl: this.postData.music.coverImg
      })
      this.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = this.postData.postId;
    }
    // var that = this;
    
    // this.setData({
      
    //   isPlayingMusic: ! that.data.isPlayingMusic
    // })
    // console.log(this.data.isPlayingMusic)
  },
  setMusicMonitor() {
    var that = this;
    wx.onBackgroundAudioStop(function() {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
    })
  },
  //初始化音乐播放图片
  initMusicStatus() {
    var currentPostId = this.postData.postId;
    console.log(app.globalData.g_isPlayingMusic)
    console.log(app.globalData.g_currentMusicPostId)
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === currentPostId) {
      //若全局播放的音乐是当前文章的音乐，就将图标设为播放
      this.setData({
        isPlayingMusic: true
      })
    } else{
      this.setData({
        isPlayingMusic: false
      })
    }
    // this.setData({
    //   isPlayingMusic: app.globalData.g_isPlayingMusic
    // })
  },
  onShareAppMessage(){
    return {
      title: this.postData.title,
      descL: this.postData.content,
      path: "/pages/post/post-detail/post-detail"
    }
  },
   //点赞动画效果
 setAniation() {
  var animationUp = wx.createAnimation({
    timingFunction: 'ease-in-out'
  })
  this.animationUp = animationUp
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.setNavigationBarTitle({
      title: this.postData.title
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function (event) {
    console.log("page is unload---post-detail.js")
    wx.stopBackgroundAudio()
    this.setData({
      isPlayingMusic: false
    })

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})