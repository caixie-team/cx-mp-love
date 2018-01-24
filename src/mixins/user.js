/* eslint-disable no-undef,no-unused-vars */
import wepy from 'wepy'

export default class userMixin extends wepy.mixin {
  /* ============= 工具方法（mixins没法复写，就再写一遍了） ============= */
  isFunction (item) {
    return typeof item === 'function'
  }

  /* ========================== 用户方法 ========================== */

  // 获取用户信息
  $getUserInfo (callback) {
    // 顶级容错
    if (!wepy.$instance || (!wepy.$instance.$updateGlobalData)) return
    // 取缓存信息
    const user = wepy.$instance.$updateGlobalData('user')
    // 不重复获取用户信息
    if (user && user.nickName) {
      this.isFunction(callback) && callback(user)
      this.$apply()
      return user
    }
    // 首次获取用户信息
    this.$login((res) => {
      // console.log('res -----')
      // console.log(JSON.stringify(res))
      this.code = res.code
      // 再获取用户信息
      this._wxUserInfo(callback)
    })
  }

  // 进行微信登陆
  $login (success = () => {
  }, noAutoLogin) {
    // 先登录
    wepy.login({
      success: (res) => {
        console.log('wepy.login.success:', res)

        // 如果不需要自动登录，就return
        if (noAutoLogin) {
          // 串行回调
          this.isFunction(success) && success(res)
          this.$apply()
          return
        }
        this.isFunction(success) && success(res)

        // if (res.code) {
        //   let encryptedData = 'ency'
        //   let iv = 'iv'
        //   that.getUserInfo((data) => {
        //     encryptedData = data.encryptedData || 'ency'
        //     iv = data.iv
        //     wx.request({
        //       method: 'POST',
        //       url: 'http://zy.picker.la/api/app/1/login',
        //       header: {
        //         Authorization: ''
        //       },
        //       data: {
        //         username: encryptedData,
        //         password: iv,
        //         grant_type: 'password',
        //         auth_approach: 'wxapp',
        //         code: res.code
        //       },
        //       success: (res) => {
        //         console.log(res.data)
        //       }
        //     })
        //   })
        // } else {
        //   console.log('获取用户登录态失败！' + res.errMsg)
        // }
        // 根据业务接口处理:业务登陆:异步
        // this.$post({
        //   url: 'http://zy.picker.la/api/app/1/login',
        //   data: {
        //     code: res.code
        //   }
        // }, {
        //   success: ({code, data}) => {
        //   },
        //   fail: ({code, data}) => {
        //   }
        // })

        // ===== 以下随机示例 =====
        // setTimeout(() => {
        //   wepy.$instance.$updateGlobalData('user', {
        //     session: Math.random().toString(36).substring(2),
        //     packages: {
        //       times: 0,
        //       quantity: 0,
        //       status: '未借阅'
        //     },
        //     identity: {
        //       collection: 20,
        //       type: '未订阅用户',
        //       mobile: '1234567890',
        //       address: '在那遥远的地方 有一位美丽的姑娘',
        //     }
        //   })
        //   // 串行回调
        //   this.isFunction(success) && success(res)
        //   this.$apply()
        // }, 100)
      },
      fail: (res) => {
        console.log('wepy.login.fail:', res)
      }
    })
  }

  /* ========================= 其他方法 ========================= */

  // 获取用户公开信息
  _wxUserInfo (callback) {
    wepy.getUserInfo({
      success: (res) => {
        console.log('wepy.getUserInfo.success:', res)
        // 缓存用户信息
        const user = wepy.$instance.$updateGlobalData('user', res.userInfo)
        user.iv = res.iv
        user.code = this.code
        user.encryptedData = res.encryptedData
        this.isFunction(callback) && callback(user)
        this.$apply()
      },
      fail: (res) => {
        console.log('wepy.getUserInfo.fail:', res)
        // 用户拒绝授权:填充默认数据
        const user = wepy.$instance.$updateGlobalData('user', {
          nickName: '未授权',
          avatarUrl: '/images/icon/icon-avatar@2x.png'
        })
        // res.code = loginRes.code
        // 串行回调
        this.isFunction(callback) && callback(res)
        this.$apply()

        // 尝试授权
        this._wxAuthModal(callback)
      }
    })
  }

  // 提示用户开启授权
  _wxAuthModal (callback) {
    // 先判断是否支持开启授权页的API
    wx.openSetting && wx.showModal({
      title: '授权提示',
      content: '【采撷最爱】希望获得以下权限：\n · 获取您的公开信息（昵称、头像等）',
      confirmText: '去授权',
      cancelText: '先不授权',
      success: (res) => {
        if (res.confirm) {
          console.log('_wxAuthModal.showModal: 用户点击确定', res)
          this._wxOpenSetting(callback)
        }
      }
    })
  }

  // 打开授权页
  _wxOpenSetting (callback) {
    wx.openSetting && wx.openSetting({
      success: ({authSetting}) => {
        console.log('wx.openSetting.success', authSetting)
        if (authSetting['scope.userInfo']) {
          // 用户打开设置，重新获取信息
          this._wxUserInfo(callback)
        }
      }
    })
  }
}