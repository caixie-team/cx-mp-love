/* eslint-disable func-call-spacing,no-unexpected-multiline,no-unused-vars,no-unused-vars */
import base from './base'
import wepy from 'wepy'
import Page from '../utils/Page'
import moment from 'moment'

moment.locale('zh-cn')

export default class posts extends base {
  /**
   * 获取推荐内容列表
   * @returns {Pagination}
   */
  static stickys () {
    const url = `${this.baseUrl}/posts?sticky=true`
    // const data = await this.get(url)
    // return data
    return new Page(url)
  }
  /**
   * 获取节目列表从全部分类中
   */
  static page (category) {
    const url = `${this.baseUrl}/posts?category=${category}`
    if (category === 'stories') {
      // const url = `${this.baseUrl}/posts`
      return new Page(url, this.__before.bind(this), this.__after.bind(this))
    } else {
      return new Page(url)
    }
  }

  /**
   * 获取节目信息
   * @param id
   * @returns {Promise.<*>}
   */
  static async detail (id) {
    const url = `${this.baseUrl}/posts/${id}`
    const data = await this.get(url)
    return data
  }

  /**
   * 按作者查找
   * @param author
   * @returns {Promise.<*>}
   */
  static async findByAuthor (author) {
    const url = `${this.baseUrl}/posts`
    const data = await this.get(url, {author: author})
    return data
  }
  /**
   * 获取列表
   * @param parent
   * @returns {Promise.<*>}
   */
  static async list (items) {
    const list = []
    for (const item of items) {
      const url = `${this.baseUrl}/posts/${item.id}`
      const data = await this.get(url)
      list.unshift(data)
    }
    return list
  }

  /**
   * 更新内容
   * @param form
   * @returns {Promise<void>}
   */
  static async update(form) {
    const url = `${this.baseUrl}/posts/${form.id}`
    const data = await this.post(url, form)
    return data
  }

  /**
   * 删除内容至回收站（伪删除）
   * @param id
   * @returns {Promise<*>}
   */
  static async trash(id) {
    const url = `${this.baseUrl}/posts/${id}/delete`
    const data = await this.post(url, {})
    return data
  }

  /**
   * 获取喜欢的内容
   * @param items
   * @returns {Promise<Array>}
   */
  static async loadLikes (items) {
    const list = []
    for (const item of items) {
      const url = `${this.baseUrl}/posts/${item.post_id}`
      const data = await this.get(url)
      list.unshift(data)
    }
    return list
  }

  /**
   * 获取回忆列表
   * @param item
   * @returns {Promise<void>}
   */
  static async loadRecalls (parent) {
    const url = `${this.baseUrl}/posts`
    const data = await this.get(url, {parent: parent})
    return data.data
  }

  /**
   * Like
   * @param postId
   * @returns {Promise.<*>}
   */
  static async newLike (postId, date) {
    const url = `${this.baseUrl}/posts/${postId}/likes/new`
    const data = await this.post(url, {date: date})
    return data
  }

  /**
   * Un Like
   * @param postId
   * @returns {Promise.<void>}
   */
  static async unLike (postId) {
    const url = `${this.baseUrl}/posts/${postId}/likes/mine/delete`
    const data = await this.post(url, {})
    return data
  }

  /**
   * 获取喜爱这个主题的人
   * @param postId
   * @returns {Promise<void>}
   */
  static async getLovers (postId) {
    const url = `${this.baseUrl}/posts/${postId}/likes`
    const data = await this.get(url)
    return data.likes
  }
  /**
   * 获取当前内容的评论回复
   * @returns {Promise.<void>}
   */
  static async getReplies (postId) {
    // TODO: 需要支持下拉加载与分页 @basil 1107
    const url = `${this.baseUrl}/posts/${postId}/replies`
    const data = await this.get(url)
    return data
  }

  /**
   * 检索
   * @param title
   * @returns {Promise<*>}
   */
  static async search (title) {
    const url = `${this.baseUrl}/posts/search?param=${title}`
    const data = await this.get(url)
    return data.data
  }
  /**
   * 新建评论j
   * @param postId
   * @returns {Promise.<void>}
   */
  static async repliesNew (postId, content) {
    const url = `${this.baseUrl}/posts/${postId}/replies/new`
    const data = await this.post(url, { content: content })
    return data
  }

  /**
   * 新建 Love 主题
   * @param title
   * @param content
   * @returns {Promise<void>}
   */
  static async newLove (title, loveDate) {
    const url = `${this.baseUrl}/posts/new`
    try {
      const data = await this.post(url, {title: title, love_date: loveDate})
      return data
    } catch (e) {
      return null
    }
  }

  /**
   * 新建 回忆或故事
   * @param postData
   * @returns {Promise<*>}
   */
  static async newRecallOrStory (postData) {
    const url = `${this.baseUrl}/posts/new`
    const data = await this.post(url, postData)
    return data
  }

  /**
   * 新加回忆
   * @param parent
   * @param titie
   * @param content
   * @returns {Promise<void>}
   */
  static async saveRecall (parent, titie, content) {}

  /**
   * 新加故事
   * @param parent
   * @param titie
   * @param content
   * @returns {Promise<void>}
   */
  static async saveStory (parent, titie, content) {}

  /**
   * 删除图片
   */
  static async removeImage(id) {
    // 删除关联
    // 删除附件或者只是标记为 trash？
  }
  /**
   * 上传图片
   */
  static async image (filePath) {
    // const url = `${this.baseUrl}/images`;
    const url = `${this.baseUrl}/file`
    const param = {
      url,
      filePath,
      name: 'file'
    }
    return await wepy.uploadFile(param)
  }
  /**
   * 前置数据处理
   * @param item
   * @returns {Promise.<*>}
   * @private
   */
  static async __before (item) {
    item.title = item.title.split('-')[0]
    item.date = moment(item.modified).fromNow()
  }

  static async __after (item) {
    // for (let item of this.page.list) {
    //   item.title = item.title.split('-')[0]
    //   item.date = moment(item.modified).fromNow()
    // }
    // $wxapp.emitter.emit(Event.PODCAST_LIST_UPDATE, item)
  }
}
