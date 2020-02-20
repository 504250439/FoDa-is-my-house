var util = require('../../../utils/util.js')
var app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    //选择物品类型
    types:["求助","找队友","寻物"],
    type_index:0,
    inputLength: 0, //文字输入框字数

    //用户上传的信息
    title:"",
    price:Number,
    type:"",
    content:"",
    //照片在云的位置
    discover_imgs:[],
    // 登记用户的formId在帖子数据库上
    formId:"",
    //存放照片在手机中的位置
    images:[],

    // 时间选择
    time: '',
    date: '',
    startDate:"",
    endDate: "",
    deadline:"",  // 求助截止时间 存放 具体时间 yyyy-mm-dd hh:mm
    timeStamp:"", // 求助截止时间 存放时间戳

    //警告
    warning:"",
    //检验状态
    mode:"",
    // 辨别用户第几次点击发布
    display:true,

    //可选择联系方式
    contact_wechat: true,
    contact_phone: true,

    //发布的联系方式
    contact_way: "all",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断当前用户是否为以注册用户
    util.isRegistered()

    // 对求助开始时间和结束时间的处理
    var startDate=new Date()
    var endDate=new Date()
    endDate.setDate(startDate.getDate()+10)
    this.setData({
      startDate:util.getDate(startDate),
      endDate:util.getDate(endDate)
    })
  },


  //统计文本域字数
  bindInput: function(e) {
    var inputLength = e.detail.value.length;
    this.setData({
      inputLength: inputLength,
    })
  },

  //判断物品的类型
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      contact_wechat: true,
      contact_phone: true,
      type_index: e.detail.value,
      type:this.data.types[e.detail.value]
    })
  },

  //处理用户填写信息并准备上传
  uploadPost:function(e){
    console.log(e.detail.formId)
    //得到用户填写的信息
    this.setData({
      title:e.detail.value.title,
      price:e.detail.value.price,
      content:e.detail.value.content,
      warning:"",
      mode: false,
      formId:e.detail.formId
    })

    
    //检查提交信息
    this.checkInfo()

    // 先将照片上传再上传数据库
    if (this.data.mode) {
      if (this.data.images.length === 0) {
        console.log("没有上传图片")
        this.uploadData()
      } else {
        this.uploadImages()
      }
    }
  },


  //检查提交信息
  checkInfo() {
    if (this.data.type=="") {
      this.setData({
        warning: "请选择分类类型",
      })
    } 
    else if (this.data.title=="") {
      this.setData({
        warning: "请输入标题",
      })
    } else if (this.data.type != "求助") {
      if (this.data.contact_way == "none") {
        this.setData({
          warning: "请至少选择一种联系方式",
        })
      } else {
        this.setData({
          warning: "发布成功",
          mode: true,
        })
      }
    }else if (this.data.type=="求助"){
      // 如果是求助类型的判断 有无输入时间和价钱
      if (this.data.price == "") {
        this.setData({
          warning: "请输入求助价格",
        })
      
      } else if (this.data.date == "") {
        this.setData({
          warning: "请输入求助截止日期",
        }) 
      } else if (this.data.time == "") {
        this.setData({
          warning: "请输入求助截止时间",
        })
      } // 多个 if else if else等嵌套,注意逻辑
        else {
        this.setData({
          warning: "发布成功",
          mode: true,
        })
      }
      // 都填完后就提示成功
    } 
    else {
      this.setData({
        warning: "发布成功",
        mode: true,
        display:false
      })
    }
    this.setData({
      modalName: "Modal",
    })
  },

  //隐藏模态窗口
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },

  //将帖子信息上传到数据库
  uploadData:function(){
    // 分辨数据库位置
    var database="recourse"
    // 发帖时间
    var date=new Date()
    // 求助截止时间
    var deadline=this.data.date+" "+this.data.time
    // 将截止时间转换为时间戳
    this.setData({
      timeStamp:new Date(deadline).getTime(),
      deadline:deadline
    })
    //发布完成后跳转
    category_id=0


    console.log(database)

    if(this.data.type=="寻物"){
      database="discover"
      category_id=1
    } else if (this.data.type == "找队友"){
      database = "discover"
      category_id = 2
    }

    const db = wx.cloud.database()
    db.collection(database).add({
      data:{
        "content":this.data.content,
        "imgs":this.data.discover_imgs,
        "price":this.data.price,
        "title":this.data.title,
        "type":this.data.type,
        "date":date,
        "timeStamp":this.data.timeStamp,
        "deadline":this.data.deadline,
        "formId":this.data.formId,
        'accepter_openid': "",
        "contact": this.data.contact_way,
      },
      success(res){
        //成功上传后提示信息
        console.log("插入成功")

        wx.showToast({
          title: '成功上传',
          icon: 'success',
          duration: 1000
        })

        wx.redirectTo({
          url: "../../Index/goods/goods?tab_id=" + 2 + "&category_id=" + category_id
        })

      }
    })

    
  },

  //上传物品图片信息
  uploadImages:function(){

    var images=this.data.images
    //先添加到这一变量,在最后一个再改变this.data.中的discover_imgs
    var discover_imgs=[]

    images.forEach(item => {
      console.log(item)
      wx.cloud.uploadFile({
        cloudPath: "discover_imgs/"+item.substring(item.length-20), // 上传至云端的路径
        filePath: item, // 小程序临时文件路径
        success: res => {
          // 返回文件 ID
          discover_imgs.push(res.fileID)
          console.log(discover_imgs)

          //获取所有图片在云端的位置后上传到数据库
          if(discover_imgs.length===images.length){
            //将局部变量赋给this.data
            this.setData({
              discover_imgs:discover_imgs
            })
            console.log(this.data.discover_imgs)
            //隐藏上传提示
            wx.hideLoading()
            this.uploadData()
          }
        },
        fail: console.error
      })
    });
  },


  //选择图片
  chooseImage: function(e) {
    var that = this;
    if (that.data.images.length < 3) {
      wx.chooseImage({
        count: 3, //最多可以选择的图片张数
        sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: res => {
          this.setData({
            images:this.data.images.concat(res.tempFilePaths)
          })
          console.log(this.data.images)
        }
      });
    } else {
      wx.showToast({
        title: "图片限传三张！",
        icon: 'none',
        duration: 2000,
        mask: true,
      });
    }
  },

  //用户点击放大图片
  handleImagePreview:function(e) {
    var index = e.target.dataset.index
    var images = this.data.images
    wx.previewImage({
      current: images[index],  //当前预览的图片
      urls: images,  //所有要预览的图片
    })
  },

  //点击删除移除照片
  removeImage:function(e) {
    var index = e.target.dataset.index
    //删除指定位置的照片
    var images=this.data.images
    images.splice(index,1)
    this.setData({
      images:images
    })
    console.log(index)
    console.log(this.data.images)
  },

  // 选择时间的变化函数
  TimeChange(e) {
    this.setData({
      time: e.detail.value
    })
    console.log(this.data.time)
  },

  // 选择日期的变化函数
  DateChange(e) {
    this.setData({
      date: e.detail.value
    })

  },

  //选择微信联系方式
  switch1Change: function (e) {
    console.log('wechat', e.detail.value)
    this.setData({
      contact_wechat: e.detail.value,
    })
    this.contactChange()
    console.log('contact_way值为：', this.data.contact_way)
  },

  //选择手机号联系方式
  switch2Change: function (e) {
    console.log('phone', e.detail.value)
    this.setData({
      contact_phone: e.detail.value,
    })
    this.contactChange()
    console.log('contact_way值为：', this.data.contact_way)
  },

  //选择联系方式
  contactChange: function () {
    if (this.data.contact_wechat && this.data.contact_phone) {
      this.setData({
        contact_way: "all"
      })
    } else if (!this.data.contact_wechat && this.data.contact_phone) {
      this.setData({
        contact_way: "phone"
      })
    } else if (this.data.contact_wechat && !this.data.contact_phone) {
      this.setData({
        contact_way: "wechat"
      })
    } else {
      this.setData({
        contact_way: "none"
      })
    }
  },

})    