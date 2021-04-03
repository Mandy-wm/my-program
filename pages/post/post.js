// pages/post/post.js
var dataObj = require("../../data/data.js")
var DBPost = require('../../db/DBPost').DBPost

Page({


  /**
   * 页面的初始数据
   */
  data: {


  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad:页面被加载")
    var dbPost = new DBPost();

    this.setData({
      // postList: dataObj.postList
      postList: dbPost.getAllPostData()
    })
    
  },
  onTapToDetail(event) {
    var postId = event.currentTarget.dataset.postId;
    console.log(postId);
    wx.navigateTo({
      url: `/pages/post/post-detail/post-detail?id=`+postId
    })
  },
 //swiper上注册事件代理，利用冒泡机制，点击事件能传到父节点上，因此，只需要在父节点上捕获这个点击事件即可
 onSwiperTap(event) {
   var postId = event.target.dataset.postId;  //这里用的是target，而不是currentTarget, target是触发事件的元素，而currentTarget是捕获事件的元素
   wx.navigateTo({
     url: "post-detail/post-detail?id=" + postId
   })
 },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady:页面被渲染")

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow: 页面被显示")

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("onHide:页面被隐藏")

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("onUnload:页面被卸载")

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh:页面下拉触底")

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log("页面上拉触顶部")

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})