var util = require('../../../utils/util.js')
const app = getApp();
Page({

  data: {
    //快递信息
    express_data: {},
    //劫取快递重量
    express_weight: "",
    //用户openid
    user_openid: "",
    //接收者真实姓名
    accepter_real_name: "",
    //接收者微信
    accepter_wechat_id: "",
    //接收者电话号码
    accepter_phone: "",
    //接收者取件码
    accepter_code: "",
  },

  onLoad: function (options) {
    var express_data=JSON.parse(options.express_data)
    this.setData({
      express_data:express_data,
      user_openid: app.globalData.userCloudData._openid,
    })
    this.setData({
      express_weight: this.data.express_data.weight.split('(')[0]
    })
    this.getAccepter()

    console.log(express_data.accepter_openid)
    console.log(express_data._openid)
    console.log(this.data.user_openid)
    
  },

  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })

  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  //接收快递任务
  accept:function(){

    console.log(this.data.express_data._id)
    console.log(this.data.user_openid)

    // 判断当前用户是否为以注册用户
    var isRegistered=util.isRegistered()
    if(isRegistered){
      wx.cloud.callFunction({
        name: 'updateAccepter',
        data: {
          _id: this.data.express_data._id,
          user_openid: this.data.user_openid,
          database:"express"
        },
        success: res => {
          console.warn('[云函数] [updateExpress] updateExpress 调用成功：', res)
          wx.showModal({
            title: '更新成功',
            content: '成功更新信息',
            showCancel: false,
          })
  
          // 发送接单成功的模板信息
          this.sendExpress("true")
  
  
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '调用失败',
          })
          console.error('[云函数] [updateExpress] updateExpress 调用失败：', err)
        }
      })
      wx.navigateBack({})
    }


  },



  // 发送快递模板消息
  sendExpress: function (id) {
    if (id == "true") {
      var orders = "快递代收成功"
    } else if (id == "false") {
      var orders = "快递代收失败"
    }

    wx.cloud.init()
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'sendExpressTemplate',
        formId: this.data.express_data.formId,
        orders: orders,
        user_openid: this.data.express_data._openid
      },
      success: res => {
        console.warn('[云函数] [openapi] sendExpressTemplate 调用成功：', res)
      },
      fail: err => {
        console.error('[云函数] [openapi] sendExpressTemplate 调用失败：', err)
      }
    })
  },



  //获取接收者信息
  async getAccepter(){
    console.log('fuck',this.data.express_data.accepter_openid)
    var that=this
    if (this.data.express_data.accepter_openid!=""){
      const db = wx.cloud.database()
      await db.collection('users').where({
        _openid: this.data.express_data.accepter_openid,
      }).get({
        success: async function(res) {
          console.log(res.data[0])
          await that.setData({
            accepter_real_name: res.data[0].real_name,
            accepter_wechat_id: res.data[0].wechat_id,
            accepter_phone: res.data[0].phone,
            accepter_code: res.data[0].code,
          })
        }
      })
    }else {
      that.setData({
        accepter_real_name: "",
        accepter_wechat_id: "",
        accepter_phone: "",
        accepter_code: "",
      })
    }
  }
})