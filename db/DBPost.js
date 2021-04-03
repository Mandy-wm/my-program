// var DBPost = function() {
// this.storageKeyName = "postList";
// }
// DBPost.prototye = {
//   getAllPostData: function() {
//     var res = wx.getStorageSync(this.storageKeyName);
//     if (!res) {
//       res = require('../data/data').postList;
//       this.execSetStorageSync(res);
//     }
//     return res;
//   },

//   execSetStorageSync: function(data) {
//     wx.setStorageSync(this.storageKeyName, data);
//   }
// };

// module.exports = {
//   DBPost: DBPost
// }

var util = require('../util/util.js')

//用ES6改写
class DBPost {
  
  constructor(postId) {
    this.storageKeyName = 'postList';
    this.postId = postId;
  }
  getPostItemById() {
    var postData = this.getAllPostData(); //获取缓存
    var len = postData.length;    
    for (var i = 0; i< len; i++) {  //遍历获取的缓存数据
      if (postData[i].postId == this.postId) {   //id相同则获取对应的数据
        return {
          index: i,
          data: postData[i]
        }
      }
    }
  }
  getAllPostData() {
    var res = wx.getStorageSync(this.storageKeyName);
    if (!res) {
      res = require("../data/data.js").postList;
      this.execSetStorageSync(res);
    }
    return res;
  }
  execSetStorageSync(data) {
    wx.setStorageSync(this.storageKeyName, data)
  }
  //收藏文章
  collect() {
    return this.updatePostData('collect');
  }
  //处理本地点赞、评论、收藏、阅读量
  updatePostData(category, newComment) {
    var itemData = this.getPostItemById(),
        postData = itemData.data,
        allPostData = this.getAllPostData();
    switch (category) {
      case 'collect' :
        //处理收藏
        if (!postData.collectionStatus) {
          postData.collectionNum++;
          postData.collectionStatus = true;
        } else {
          postData.collectionNum--;
          postData.collectionStatus = false;
        }
        break;
      case 'up' :
        //处理点赞
        if (!postData.upStatus) {
          postData.upNum++;
          postData.upStatus = true;
        } else {
          postData.upNum--;
          postData.upStatus = false;
        }   
        break;
      case 'comment' :
        postData.comments.push(newComment);
        postData.commentNum++;
        break;  
      case 'reading' :
        postData.readingNum++;
        break;
      defalult:
            break;  
      
    }
    //更新数据库缓存
    allPostData[itemData.index] = postData;
    this.execSetStorageSync(allPostData);
    return postData;
}
  
//点赞
  up() {
    return this.updatePostData('up');
    
  }
  //阅读数+1
  addReadingTimes(){
    this.updatePostData('reading');
  }
  getCommentData() {
    var itemData = this.getPostItemById().data;
    //按时间降序排列评论
    itemData.comments.sort(this.compareWithTime);
    var len = itemData.comments.length,
        comment;
    for (var i = 0; i < len; i++) {
      //将comment的时间戳换成可阅读模式
      comment = itemData.comments[i];
      comment.create_time = util.getDiffTime(comment.create_time, true)
    }    
    return itemData.comments;
  }
  compareWithTime (value1, value2) {
    var flag = parseFloat(value1.create_time) - parseFloat(value2.create_time)
    if (flag < 0) {
      return 1;
    } else if (flag > 0) {
      return -1;
    } else {
      return 0;
    }
  }
  /**发表评论 */
  newComment(newComment) {
    this.updatePostData('comment', newComment);
  }

}
export {DBPost}
