# 佛大叮当 校园小程序

- 服务端使用微信自带的云开发进行开发
- 部分界面与功能参考了szu帮帮

**可参考很程序来二次开发自己学校的小程序**



## TODO

#### 优化

- 将用户表划分成  用户-角色-权限表,目前所有用户数据都存到用户表中,表中数据过多了,先初步实现 用户-角色 表,后面有内容可以直接添加到权限表上.
- 获取当前手机屏幕高度的算法有问题(需要去优化)
- UI需要重新设计编写(找一个想做前端的人去实现,最好可以找到一个对ui设计有兴趣的最好)



#### 功能

- 接入公众号,小程序优惠模块跳转到 公众号的推文(大概能够实现优惠卷点击查看这个功能)
- 同样的,首页上的轮播图也需要接入到推文的那边(看能不能将这些推文跳转些到数据库上方便修改)
- 闲置物品的评论功能,这个比较难,可以后面做
- 后台管理页面过于简陋,需要重写,添加一下数据统计的功能
- 后续时间充足添加课程表等功能.



## 代码树形结构图

```
Pages
├─Admin 后台管理模块
│  ├─admin_main 后台管理首页
│  ├─agreement  佛大叮当服务协议
│  ├─secondHand  闲置交易管理页面
│  └─user		用户验证通过页面
├─Index			主要页面模块
│  ├─contact    闲置商品列表页面
│  ├─contact_express 快递列表页面
│  ├─contact_recourse 发现列表页面
│  ├─coupon		优惠卷
│  ├─goods		物品详情页面
│  ├─index_main 首页
│  ├─modal    这个是下面那个tabbar
│  └─search   搜索页面
├─Mine   个人模块
│  ├─mine_main 个人模块主页
│  ├─registered  注册页面
│  └─userInfo  个人信息页面
├─News  个人物品页面
│  ├─myDiscover  我的发现
│  ├─myExpress  我的快递
│  └─myGoods   我的二手闲置物品
└─Post    上传帖子页面
    ├─uploadDiscover   上传发现页面之类的
    ├─uploadExpress   上传快递
    └─uploadGoods    上传闲置物品
```





## 项目截图
[![首页](https://s1.ax1x.com/2020/05/03/YSpJj1.md.png)](https://imgchr.com/i/YSpJj1)
[![YSpr3d.md.jpg](https://s1.ax1x.com/2020/05/03/YSpr3d.md.jpg)](https://imgchr.com/i/YSpr3d)
[![YSpdAO.md.jpg](https://s1.ax1x.com/2020/05/03/YSpdAO.md.jpg)](https://imgchr.com/i/YSpdAO)
[![YSpNB6.md.jpg](https://s1.ax1x.com/2020/05/03/YSpNB6.md.jpg)](https://imgchr.com/i/YSpNB6)
[![YSpwND.md.jpg](https://s1.ax1x.com/2020/05/03/YSpwND.md.jpg)](https://imgchr.com/i/YSpwND)
[![YSpD9H.md.jpg](https://s1.ax1x.com/2020/05/03/YSpD9H.md.jpg)](https://imgchr.com/i/YSpD9H)
[![YSp04e.md.jpg](https://s1.ax1x.com/2020/05/03/YSp04e.md.jpg)](https://imgchr.com/i/YSp04e)



## 更多图片可扫描小程序码

[![YSptnx.md.png](https://s1.ax1x.com/2020/05/03/YSptnx.md.png)](https://imgchr.com/i/YSptnx)











## 功能列表

- 首页

- 闲置页面,能够发表和联系卖家

- 快递页面,能够详细地查看快递信息

- 互帮页面,能够解决给校园内的各种事情(约人跑步,借书等等)

- 闲置物品搜索功能

- 个人页面,能够通过校园卡与手机号码进行注册(提供短信验证)

  

  
  
  
  
  






## 已完成内容
### 功能
- 已将快递,求助模板消息更换至订阅消息(已测试快递)
### 优化
- 优化快递页面代码
- 完成上传快递与求助页面的重构
- 快递页面数据库搜索优化
- 清除所有"加载中,加载完成"等提示
- 优化获取快递列表逻辑
- 合并求助页面的数据库并优化获取列表逻辑
- 优化我的闲置快递页面的逻辑
- 修改for循环,减少开发者工具警告
- 注册页面逻辑优化

## 版本更新

### v1.02
- 模板信息转为订阅消息


### v1.01
- 开始重构,优化代码
- 已完成对主页与我的页面优化
- 封装部分函数
- 添加对旧校园卡照片的删除
- 优化个人信息页面(40%)

### v9.5
- 完成 "我的" 页面开发

### v9.41
- 重写我的快递页面


### v0.93
- 求助功能重写


### v0.92
- 优先显示未接单的快递
- 发现页面细分选项优化


### v0.9
- 快递功能可以接单并显示相关信息系
- 后台管理重写
- 优化用户验证的步骤


### v0.8
- 快递选项卡的制作
- 我的页面的样式
- 我的发现等添加删除功能


### v0.6

- 发布快递信息
- 发布信息列表样式
- 更新云函数,添加快递数据库的修改
- 添加快速方法快速测试模板消息

