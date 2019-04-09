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
   * 根据类别查询用户发布的内容
   * @param category
   * @param userId
   * @returns {Pagination}
   */
  static list (category, userId) {
    const url = `${this.baseUrl}/users/${userId}/posts?category=${category}`
    return new Page(url, this.__before.bind(this), this.__after.bind(this))
  }
  /**
   * 获取作者信息
   * @param userId user_login
   * @returns {Promise.<*>}
   */
  static async detail (userId) {
    // const url = `${this.baseUrl}/users/login:${userId}`
    const url = `${this.baseUrl}/users/${userId}`
    const data = await this.get(url)
    return data
  }

  /**
   * 按分类统计用户的内容数量
   * @param userId
   * @param termId
   * @returns {Promise<*>}
   */
  static async count (userId, termId) {
    const url = `${this.baseUrl}/posts/counts?author=${userId}&term=${termId}`
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
   * 根据用户ID获取用户喜欢的内容
   * @param userId
   * @returns {Promise<*>}
   */
  static async getLikes (userId, intersection) {
    let url = `${this.baseUrl}/users/${userId}/likes`
    url = intersection ? `${url}?intersection=${intersection}` : url
    const data = await this.get(url)
    return data
  }
  /**
   * 获取个人信息
   * @returns {Promise.<void>}
   */
  static async me () {
    const url = `${this.baseUrl}/me`
    try {
      const data = await this.get(url)
      // console.log(data)
      if (data.statusCode === 500 || data.errno === 1000) {
        return false
      }
      return data
    } catch (e) {
      console.log(e)
      return false
    }
    // return data
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
