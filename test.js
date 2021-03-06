// test.js
const util = require('/utils/util.js');
const api = require('/config/api.js');
const user = require('/services/user.js');
var initData = 'J老师：2个空闲时间段：\n 周三19:10/周六18:00 \n可组：人物传记，世界历史故事，美国历史，RE世界地理';
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    text: initData,
    countdown: 5,
    computeTime: 5,
    isEnd: false,
    numStyle: 'width: 48rpx; font-size: 28rpx; color: #ffffff; background: #000; text-align: center; border-radius: 8rpx; padding: 5rpx 0;',
    symbolStyle: 'font-size: 28rpx; color: #000; padding: 0 12rpx;',
    steps: [{
      title: '步骤1: 点击上方MoTalk学员头像登录',
      desc: '注册，登录'
    }, {
      title: '步骤2: 小程序首页浏览课程和放出的课程时段',
      desc: '选课'
    }, {
      title: '步骤3: 选择2/3/4人班',
      desc: '组班'
    }, {
      title: '步骤4: 分享组班页面邀请学伴',
      desc: '邀请学伴'
    }, {
      title: '步骤5: 组班成功，进入付款环节',
      desc: '付款'
    }],
    current: 2,
    isPopping: true,//是否已经弹出  
    animPlus: {},//旋转动画  
    animCollect: {},//item位移,透明度  
    animTranspond: {},//item位移,透明度  
    animInput: {},//item位移,透明度 

    groupings: [{ groupingid: '001', weekday: '周三', starthour: '19:10', teachername: 'J老师', coursename: '历史的故事', classmates: '4', price: '115' }, { groupingid: '002', weekday: '周三', starthour: '19:10', teachername: 'J老师', coursename: '国家地理RE', classmates: '4', price: '150' }, { groupingid: '003', weekday: '周日', starthour: '18:00', teachername: 'E老师', coursename: 'G4加州科学', classmates: '4', price: '120' }, { groupingid: '004', weekday: '周五', starthour: '19:10', teachername: 'M老师', coursename: 'G3写作', classmates: '4', price: '175' }],
    id: 0,             //进入页面时，默认选择第0个，如果不需要默认选中，注释掉就可以了  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');
    // 页面显示
    if (userInfo && token) {
      app.globalData.userInfo = userInfo;
      app.globalData.token = token;
    }
    this.setData({
      userInfo: app.globalData.userInfo,
    });
    console.log('test' + app.globalData.token);

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
    let userInfo = wx.getStorageSync('userInfo');
    let token = wx.getStorageSync('token');
    // 页面显示
    if (userInfo && token) {
      app.globalData.userInfo = userInfo;
      app.globalData.token = token;
    }
    this.setData({
      userInfo: app.globalData.userInfo,
    });
    console.log('test' + app.globalData.token);
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
    // 用户点击右上角分享  
    return {
      title: '邀请学伴', // 分享标题  
      desc: '我们正在组班：人物传记，确 1 个学生', // 分享描述  
      path: '/test' // 分享路径  
    }
  },

  //实现绑定的formSubmit 将formId传给服务器
  formSubmit: function (e) {
    var that = this
    wx.request({
      url: 'https://www.hellomotalk.com/api/',
      data: {
        'input': e.detail.value.input,
        'formId': e.detail.formId,
        //'code': that.data.login_res.code
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      // header: {}, // 设置请求的 header
      success: function (res) {
        // success
        console.log('成功' + res);
        console.log(e.detail.formId);
      },
      fail: function (err) {
        // fail
        console.log('失败' + err);
      },
      complete: function () {
        // complete
      }
    })
  },

  goLogin() {
    user.loginByWeixin().then(res => {
      this.setData({
        userInfo: res.data.userInfo
      });
      app.globalData.userInfo = res.data.userInfo;
      app.globalData.token = res.data.token;
    }).catch((err) => {
      console.log(err)
    });
  },
  exitLogin: function () {
    wx.showModal({
      title: '',
      confirmColor: '#b4282d',
      content: '退出登录？',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('token');
          wx.removeStorageSync('userInfo');
          app.globalData.userInfo = {
            nickname: 'Hi,MoTalk学员',
            username: '点击去登录',
            avatar: 'https://www.hellomotalk.com/jack/static/icons8-graduate-80.png'
          };
          app.globalData.token = '';
          wx.switchTab({
            url: '/pages/index/index'
          });
        }
      }
    })

  }
  ,
  onRunCount(e) {
    let detail = e.detail
    this.setData({
      computeTime: detail.computeTime
    })
  },
  onEndCount() {
    this.setData({
      isEnd: true
    })
  },
  countAgain() {
    let countdown = this.data.countdown + 1
    if (this.data.isEnd) {
      this.setData({
        countdown: countdown,
        isEnd: false
      })
    }
  },
  //点击弹出  
  plus: function () {
    if (!this.data.isPopping) {
      //弹出动画  
      this.takeback();
      this.setData({
        isPopping: true
      })
    } else if (this.data.isPopping) {
      //缩回动画  
      this.popp();
      this.setData({
        isPopping: false
      })
    }
  },
  input: function () {
    console.log("input")
  },
  transpond: function () {
    console.log("transpond")
  },
  collect: function () {
    console.log("collect")
  },

  //弹出动画  
  popp: function () {
    //plus顺时针旋转  
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollectbtn = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTranspondbtn = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(180).step();
    animationcollect.translate(-50, -50).rotateZ(360).opacity(1).step();
    animationcollectbtn.translate(-50, -50).rotateZ(360).opacity(0).step();
    animationTranspond.translate(-70, 0).rotateZ(360).opacity(1).step();
    animationTranspondbtn.translate(-70, 0).rotateZ(360).opacity(0).step();
    animationInput.translate(-50, 50).rotateZ(360).opacity(1).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animCollectBtn: animationcollectbtn.export(),
      animTranspond: animationTranspond.export(),
      animTranspondBtn: animationTranspondbtn.export(),
      animInput: animationInput.export(),
    })
  },
  //收回动画  
  takeback: function () {
    //plus逆时针旋转  
    var animationPlus = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollect = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationcollectbtn = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTranspond = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationTranspondbtn = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    var animationInput = wx.createAnimation({
      duration: 500,
      timingFunction: 'ease-out'
    })
    animationPlus.rotateZ(0).step();
    animationcollect.translate(0, 0).rotateZ(0).opacity(0).step();
    animationcollectbtn.translate(0, 0).rotateZ(0).opacity(0).step();
    animationTranspond.translate(0, 0).rotateZ(0).opacity(0).step();
    animationTranspondbtn.translate(0, 0).rotateZ(0).opacity(0).step();
    animationInput.translate(0, 0).rotateZ(0).opacity(0).step();
    this.setData({
      animPlus: animationPlus.export(),
      animCollect: animationcollect.export(),
      animCollectBtn: animationcollectbtn.export(),
      animTranspond: animationTranspond.export(),
      animTranspondBtn: animationTranspondbtn.export(),
      animInput: animationInput.export(),
    })
  },
  choseTxtColor: function (e) {
    var id = e.currentTarget.dataset.id;  //获取自定义的ID值  
    this.setData({
      id: id
    })
  }
})