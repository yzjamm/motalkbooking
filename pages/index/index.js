const util = require('../../utils/util.js');
const api = require('../../config/api.js');
const user = require('../../services/user.js');

//获取应用实例
const app = getApp()
Page({
  data: {
    newGoods: [],
    hotGoods: [],
    topics: [],
    brands: [],
    floorGoods: [],
    banner: [],
    channel: []
  },
  onShareAppMessage: function () {
    return {
      title: 'motalkbooking',
      desc: 'MoTalk选课小程序',
      path: '/pages/index/index'
    }
  },

  getIndexData: function () {
    let that = this;
    util.request(api.IndexUrl).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          newGoods: res.data.newGoodsList,
          hotGoods: res.data.hotGoodsList,
          topics: res.data.topicList,
          brand: res.data.brandList,
          floorGoods: res.data.categoryList,
          banner: res.data.banner,
          channel: res.data.channel
        });
      }
    });
  },
  onLoad: function (options) {
    this.getIndexData();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh();
    this.getIndexData();
  },
  ShowNewNotification: function () {
  wx.showModal({
    title: '2018-01-18 续班通知',
    content: '尊敬的各位家长：\n\n\n 感谢您长期以来对Motalk教育平台的信任和追随。由于是小组课程，为了孩子们的学习有更好的延续性和完整性，请学员在课程快到期前与团队沟通续费事宜。平台会为原班级保留原时间段一周的时间。学员需在上次订单下的最后三周之前完成续费。未沟通的，团队默认不续费。在阶段完成课时前，未付款的班组平台将不再为原班组保留该时间段。并将该时间段放出，重新组班。\n\n2018年1月18日\nMotalk英语网络教育',
    showCancel: true,
    cancelText: '知道了',
    cancelColor: '',
    confirmText: '去续班',
    confirmColor: '',
    success: function (res) { },
    fail: function (res) { },
    complete: function (res) { },
  })
  }
})
