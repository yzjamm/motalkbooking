// test1.js
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
    token: '',
    text: initData,
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
    now:0,
    isEnd: 1,
    disabled: false,
    countdays:7,
    icountdown: 0,
    countoneday:[],
    isonedayEnd:[],
    computeTime: 0,
    numStyle: 'width: 48rpx; font-size: 28rpx; color: #ffffff; background: #000; text-align: center; border-radius: 8rpx; padding: 5rpx 0;',
    symbolStyle: 'font-size: 28rpx; color: #000; padding: 0 12rpx;',

    //groupings: [{ groupingid: '001', weekday: '周三', starthour: '19:10', teachername: 'J老师', coursename: '历史的故事', classmates: '4', price: '115' }, { groupingid: '002', weekday: '周三', starthour: '19:10', teachername: 'J老师', coursename: '国家地理RE', classmates: '4', price: '150' }, { groupingid: '003', weekday: '周日', starthour: '18:00', teachername: 'E老师', coursename: 'G4加州科学', classmates: '4', price: '120' }, { groupingid: '004', weekday: '周五', starthour: '19:10', teachername: 'M老师', coursename: 'G3写作', classmates: '4', price: '175' }],
    
    groupings: [],

    isPopping: true,//是否已经弹出  
    animPlus: {},//旋转动画  
    animCollect: {},//item位移,透明度  
    animTranspond: {},//item位移,透明度  
    animInput: {},//item位移,透明度 
  
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
      now: parseInt(new Date().getTime() / 1000)
    });
    console.log('test1 onload token is ...' + app.globalData.token);
   this.getGroupingList();
  
  },

getGroupingList (event){
    let that = this;
    let groupings = [];
    let isEnd = [];
    let countoneday = [];
    let isonedayEnd = [];
    let icountdown=[];
    let computeTime=[];
    let now=parseInt(new Date().getTime() / 1000);
    util.request(api.GroupingList).then(function (res) {
      if (res.errno === 0) {
        console.log(res.data);
    groupings= res.data.groupingList;
    console.log(groupings);
    for (let i = 0; i < groupings.length; i++) {
    icountdown[i]=(groupings[i].startime ? 20+groupings[i].startime-now : 0);
    isEnd[i]=(icountdown[i] > 0 ? 0 : 1);
    //if (groupings[i].startime === 0) {
    //countoneday[i]=0;
    //} else {
    //countoneday[i]=(((120 + groupings[i].startime - parseInt(new Date().getTime() / 1000)) > 0) ? (120 + groupings[i].startime - parseInt(new Date().getTime() / 1000)) : 0);      
    //}
    //isonedayEnd[i] = (countoneday[i] ? 0 : 1);
    //computeTime[i] = countoneday[i];
  };
          that.setData({
    groupings: groupings,
    isEnd: isEnd,
    icountdown: icountdown,
    //countoneday: countoneday,
    //isonedayEnd: isonedayEnd,
    //computeTime: computeTime
        });

      }
    });
  },


joinGrouping: function (event) {
    let that = this;
    let index = this.data.groupings.map(function (element, index, array) {
        return index;
      });
    let itemIndex = event.target.dataset.itemIndex;
    let userInfo = this.data.userInfo;
    let token = wx.getStorageSync('token');
    let current = this.data.current;
    let countoneday=this.data.countoneday;
    let isonedayEnd=this.data.isonedayEnd;
    let icountdown= 5;
    console.log('index is '+index);
    console.log('itemindex is '+itemIndex);
    if (!token){
    user.loginByWeixin().then(res => {
      this.setData({
        userInfo: res.data.userInfo
      });
      console.log('userInfo is here......' + userInfo);
      app.globalData.userInfo = res.data.userInfo;
      app.globalData.token = res.data.token;
    }).catch((err) => {
      console.log(err)
    });
  }

  wx.showModal({
    title: '组班确认',
    content: '24小时后可取消，7天之后组班未成功，自动取消，确认要加入吗？',
    showCancel: true,
    cancelText: '取消',
    cancelColor: '',
    confirmText: '加入',
    confirmColor: '',
    success: function (res) {
        if (res.confirm) {
    util.request(api.JoinGrouping, {
      groupingId: that.data.groupings[itemIndex].groupingid
    },'POST').then(function (res) {
      
    that.getGroupingList();
      
    }); 
     } 
   },
    fail: function (res) { },
    complete: function (res) {
      },
  });  
  },

quitGrouping: function (event) {
    let that = this;
    let index = this.data.groupings.map(function (element, index, array) {
        return index;
      });
    let itemIndex = event.target.dataset.itemIndex;
    let userInfo = this.data.userInfo;
    let token = wx.getStorageSync('token');
    let current = this.data.current;
    let icountdown= 5;
    console.log('index is '+index);
    console.log('itemindex is '+itemIndex);
    if (!token){
    user.loginByWeixin().then(res => {
      this.setData({
        userInfo: res.data.userInfo
      });
      console.log('userInfo is here......' + userInfo);
      app.globalData.userInfo = res.data.userInfo;
      app.globalData.token = res.data.token;
    }).catch((err) => {
      console.log(err)
    });
  }

  wx.showModal({
    title: '退组确认',
    content: '退组后，可随时重新参加组班',
    showCancel: true,
    cancelText: '取消',
    cancelColor: '',
    confirmText: '退组',
    confirmColor: '',
    success: function (res) {
        if (res.confirm) {
    util.request(api.QuitGrouping, {
      groupingId: that.data.groupings[itemIndex].groupingid
    },'POST').then(function (res) {
      
    that.getGroupingList();
    that.setData({
      current: current - 1,
      groupings: that.data.groupings,
      now: parseInt(new Date().getTime() / 1000)
    });
      
    }); 
     } 
   },
    fail: function (res) { },
    complete: function (res) {
      },
  });  
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
    console.log('test1 onshow is ...' + app.globalData.token);
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
      path: '/test1' // 分享路径  
    }
  },
    goLogin() {
    user.loginByWeixin().then(res => {
      this.setData({
        userInfo: res.data.userInfo
      });
      console.log('userInfo is here......' + userInfo);
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
            nickname: 'Hi,MoTalk学员,点此头像登录',
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

  },
  onRunCount(e) {
    let that=this;
    let itemIndex = e.target.dataset.itemIndex;
    that.data.countoneday[itemIndex]=(10+that.data.groupings[itemIndex].startime-parseInt(new Date().getTime() / 1000)) > 0 ? (10+that.data.groupings[itemIndex].startime-parseInt(new Date().getTime() / 1000)) : 0;
    that.data.isonedayEnd[itemIndex]=that.data.countoneday[itemIndex] ? false : true;
    that.setData({
      countoneday: that.data.countoneday,
      isonedayEnd: that.data.isonedayEnd
    });
  },
  onEndCount(e) {
    let that=this;
    let detail = e.detail;
    let itemIndex = e.target.dataset.itemIndex;
    let userInfo = this.data.userInfo;
    let token = wx.getStorageSync('token');
    console.log('reset grouping is here ');


    that.data.isEnd[itemIndex]=1;
    that.data.countoneday[itemIndex]=0;
    that.data.isonedayEnd[itemIndex]=true;
    that.data.icountdown[itemIndex]=0;

        util.request(api.ResetGrouping, {
      groupingId: that.data.groupings[itemIndex].groupingid
    },'POST').then(function (res) {
      
    that.getGroupingList();
    that.setData({
      current: 1,
      groupings: that.data.groupings,
      isEnd: that.data.isEnd,
      countoneday: that.data.countoneday,
      isonedayEnd: that.data.isonedayEnd,
      icountdown: that.data.icountdown
    });
      
    }); 
  
  },
  countAgain() {
    if (this.data.isEnd) {
      this.setData({
        icountdown: icountdown,
        isEnd: false,
        disabled:true
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
  }
})

