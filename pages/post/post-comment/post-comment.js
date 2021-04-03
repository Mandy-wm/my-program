// pages/post/post-comment/post-comment.js
import {DBPost} from '../../../db/DBPost.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //控制使用键盘还是语音发送
    useKeyboardFlag: true,
    //控制 input组件的初始值
    keyboardInputValue: '',
    //控制是否显示图片选择面板
    sendMoreMsgFlag: false,
    //保存已经选择的图片的url
    chooseFiles: [],
    //被删除的图片序号
    deleteIndex: -1,
    //保存当前正播放语音的url
    currentAudio: ''


  },
  sendMoreMsg(){
    this.setData({
      sendMoreMsgFlag: !this.sendMoreMsgFlag
    })
  },
  switchInputType(event) {
    this.setData({
      useKeyboardFlag: !this.data.useKeyboardFlag
    })
  },
  //获取用户输入
  bindCommentInput: function (event) {
    var val = event.detail.value;
    console.log(val);
    var pos = event.detail.cursor;
    // if (pos != -1) {
      //光标在中间
      // var left = event.detail.value.slice(0, pos);
      // console.log(left);
      //计算光标的位置
      // pos = left.replace(/qq/g, '*').length;
    // }
    //直接返回对象，可以对输入进行过滤处理，同时可以控制光标位置
    // return {
    //   val: val.replace(/qq/g, '*'),
    //   cursor: pos
    // }
    this.data.keyboardInputValue = val;
    // return val + '+++'
  },
  //提交用户评论  加上 提交用户选择的图片
  submitComment: function (event) {
    var imgs = this.data.chooseFiles;
    var newData = {
      username: "青石",
      avatar: "../../images/avatar/1.jpg",
      create_time: new Date().getTime() / 1000,
      content: {
        txt: this.data.keyboardInputValue,
        img: imgs   //用户选择的图片的链接
      }
    };
    if (!newData.content.txt) {
      return; //若无任何评论内容，则不执行任何操作
    }
    //保存新评论到缓存中,以便下次打开评论页面可以显示该条评论
    this.dbPost.newComment(newData);
    //显示操作结果，显示评论成功的提示
    this.showCommitSuccessToast();
    //重新渲染并绑定所有评论，将当前发表的评论添加到评论列表中，并显示这条新加的评论
    this.bindCommentData(); 
    //恢复初始状态，清空input组件，准备接收下一条评论
    this.resetAllDefaultStatus();
  },
showCommitSuccessToast() {
   wx.showToast({
     title: '评论成功',
     duration: 1000,
     icon: "success"
   })
},
bindCommentData(){
  var comments = this.dbPost.getCommentData(); //重新去缓存加载全部评论 并用setData进行重新绑定
  this.setData({
    comments: comments
  })
},
resetAllDefaultStatus() {
  this.setData({
      keyboardInputValue: "",
      chooseFiles: [],     //清空图片选择框
      sendMoreMsgFlag: false   //发送图片按钮隐藏
    
  })
},
//选择本地照片与拍照
chooseImage(event) {
   //已选的图片数组
   var imgArr = this.data.chooseFiles;
   //只能上传3张，包括拍照
   var leftCount = 3 -imgArr.length;
   if (leftCount <= 0) {
     return;
   }
   var sourceType  = [event.currentTarget.dataset.category],
   that = this;
   wx.chooseImage({
     count: leftCount,
    sourceType: sourceType,
    success: function (res) {
      that.setData({
        chooseFiles: imgArr.concat(res.tempFilePaths)
      });
    }
   })
},
//删除已选图片
deleteImage(event) {
  var index = event.currentTarget.dataset.idx,
       that = this;
       that.data.chooseFiles.splice(index, 1);
  // that.setData({
    // chooseFiles: that.data.chooseFiles
      // deleteInde: index  
  // });

  setTimeout(function(){   //给删除图片做一个动画
    that.setData({
      deleteIndex: -1,
      chooseFiles: that.data.chooseFiles
    });
  }, 500)
  }  , 
  //开始录音
  recordStart: function() {
    var that = this;
    this.setData({
      recodingClass: 'recoding'
    });
    //记录录音开始时间
    this.startTime = new Date();
    wx.startRecord({
      success: function (res) {
        //计算录音时长
        var diff = (that.endTime - that.startTime) / 1000;
        diff = Math.ceil(diff);

        //发送录音
        that.submitVoiceComment({url: res.tempFilePath, timeLen: diff});
      },
      fail: function(res) {
        console.log(res);
      },
      complete: function(res) {
        console.log(res);
      }
    })
  }  ,
  //结束录音
  recordEnd: function() {
    this.setData({
      recodingClass: ""
    });
    this.endTime = new Date();
    wx.stopRecord();
  },
  //提交录音
  submitVoiceComment: function (audio) {
    var newData = {
      username: '小小',
      avatar: "../../images/avatar/1.jpg",
      create_time: new Date().getTime / 1000,
      content: {
        txt: "",
        img: [],
        audio: audio
      }
    };
    //保存新评论到缓存中
    this.dbPost.newComment(newData);
    //显示操作结果
    this.showCommitSuccessToast();
    //重新渲染并绑定所有评论
    this.bindCommentData();
  },
  //已发送评论中的语音  的播放
  playAudio(event) {
    var url = event.currentTarget.dataset.url,
        that = this;
     //暂停当前录音
     if (url == this.data.currentAudio) {
       wx.pauseVoice();
       this.data.currentAudio = ""
     } else {
       //播放录音
       this.data.currentAudio = url;
       wx.playVoice({
         filePath: url,
         complete: function () {
           //只有当录音播放完毕后才会执行
           that.data.currentAudio = "";
         }
       })
     }  

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var postId = options.id;
    this.dbPost = new DBPost(postId);
    var comments = this.dbPost.getCommentData();
    this.setData({
      comments: comments
    })

  },
  previewImg: function(event) {
    //获取评论序号
    var commentIdx = event.currentTarget.dataset.commentIdx,
    //获取图片在图片数组中的序号
         imgIdx = event.currentTarget.dataset.imgIdx;
         //获取评论全部图片
         console.log(this.data) //这里获取的是comments 
       var  imgs = this.data.comments[commentIdx].content.img;
         
         
    wx.previewImage({
      current: imgs[imgIdx],
      urls: imgs
    })     
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  onUnload: function () {

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