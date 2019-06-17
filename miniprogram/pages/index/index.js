var util = require('../../utils/util.js')
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentData: 0,
    feed: [],
    feed_length: 2,
    //下拉继续读取数据
    nextPage:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('onLoad')
    var that = this
    // 改变选项卡的值
    console.log(options.tab_id)
    that.setData({
      currentData: options.tab_id
    })
    //调用应用实例的方法获取全局数据
    this.getData();

  },
  //完成选项卡的跳转
  bindchange: function (e) {
    const that = this;
    that.setData({
      currentData: e.detail.current
    })

  },
  //分析选项卡是否正确
  checkCurrent: function (e) {
    const that = this;
    if (that.data.currentData === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentData: e.target.dataset.current
      })
    }
  },


  // 拖到最下面更新数据
  lower: function (e) {
    wx.showNavigationBarLoading();
    var that = this;
    // setTimeout(function(){wx.hideNavigationBarLoading();that.nextLoad();}, 1000);
    that.nextLoad();
    console.log("lower")
  },

  upper: function () {
    wx.showNavigationBarLoading()
    console.log("upper");
    var that = this;
    that.getData();
  },



  // 在云数据库上查找数据(查找10条)
  nextLoad: function(){
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 500
    })
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('post')
    .orderBy('date', 'desc')
    .skip(this.data.nextPage)
    .limit(10) // 限制返回数量为 10 条
    .get({
      //成功读取写入数据
      success: res => {
        this.setData({
          // feed: JSON.stringify(res.data, null, 2)
          // feed:res.data
          feed:this.data.feed.concat(res.data),
          nextPage:this.data.nextPage+10
        })
        console.log('[数据库] [查询记录] 成功: ', this.data.feed)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    });
    wx.showToast({
      title: '加载成功',
      icon: 'success',
      duration: 1000
    })
  },
  
  //第一次从数据查找数据
  getData: function(){
    wx.showToast({
      title: '加载中',
      icon: 'loading',
      duration: 500
    })
    const db = wx.cloud.database()
    // 查询当前用户所有的 counters
    db.collection('post')
    .orderBy('date', 'desc')
    .limit(10) // 限制返回数量为 10 条
    .get({
      success: res => {
        this.setData({
          // feed: JSON.stringify(res.data, null, 2)
          feed:res.data,
          nextPage:this.data.nextPage+10
          // feed:this.data.feed.concat(res.data)
        })
        console.log('[数据库] [查询记录] 成功: ', this.data.feed)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    });

    wx.showToast({
      title: '加载成功',
      icon: 'success',
      duration: 1000
    })
  },



    //跳转到点击页面
    jumpToPost: function(e){
      var id=e.currentTarget.id
      console.log(e.currentTarget.id)
      console.log(this.data.feed[id])
      var post_data=JSON.stringify(this.data.feed[id])
      wx.navigateTo({
        // url: '../posttest/posttest?post_data=' + post_data
        url: '../post/post?post_data=' + post_data
      
      })
    },



})