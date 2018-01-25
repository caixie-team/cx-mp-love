/* eslint-disable func-call-spacing,no-unexpected-multiline,no-unused-vars,no-unused-vars */
import base from './base'
import Page from '../utils/Page'
import moment from 'moment/moment'
import wepy from 'wepy'

export default class Users extends base {
  /**
   * 根据类别获取回忆或故事
   */
  static page (category) {
    const url = `${this.baseUrl}/me/posts?category=${category}`
    return new Page(url, this.__before.bind(this), this.__after.bind(this))
    // return new Page(url)
  }

  /**
   * 获取作者信息
   * @param userId user_login
   * @returns {Promise.<*>}
   */
  static async detail (userId) {
    const url = `${this.baseUrl}/users/login:${userId}`
    const data = await this.get(url)
    return data
  }

  /**
   * 我喜欢的
   * @param userId
   * @returns {Promise.<*>}
   */
  static async iLiked (userId) {
    const v2Api = wepy.$instance.getVersionApi('v2')
    const url = `${v2Api}/me/likes`
    const data = await this.get(url)
    return data
  }

  /**
   * 获取个人信息
   * @returns {Promise.<void>}
   */
  static async me () {
    const url = `${this.baseUrl}/me`
    const data = await this.get(url)
    return data
  }

  /**
   * 前置数据处理
   * @param item
   * @returns {Promise.<*>}
   * @private
   */
  static async __before (item) {
    // item.title = item.title.split('-')[0]
    item.modified = moment(item.modified).fromNow()
    item.x = 0
    if (item.title.indexOf('-') > 0) {
      item.title = item.title.split('-')[0]
    }
  }

  static async __after (item) {
    // for (let item of this.page.list) {
    //   item.title = item.title.split('-')[0]
    //   item.date = moment(item.modified).fromNow()
    // }
    // $wxapp.emitter.emit(Event.PODCAST_LIST_UPDATE, item)
  }
}
