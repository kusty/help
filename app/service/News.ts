/*
 * @Author: guwei ;
 * @Date: 2020-04-12 15:47:36 ;
 * @Last Modified by: guwei
 * @Last Modified time: 2020-05-12 20:04:27
 */
import { Service } from 'egg';
import uuidv1 = require('uuid/v1');
import moment = require('moment');

export default class News extends Service {

  public async newNews(params) {
    try {

      const uri = uuidv1().replace(/-/g, '');

      const result = await this.ctx.model.News.create(
        {
          ...params,
          contentType: params.contentType || 0,
          uri,
          count: 1,
          author: this.ctx.session.userInfo.name,
          time: moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss'),
          uptime: moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss'),
        },
      );
      if (result) {
        return result;
      }
      this.ctx.helper.errorBody(10001, '新增错误');
      return null;

    } catch (error) {
      this.ctx.throw('服务器处理错误:' + error);
    }

  }

  public async editNews(params) {

    try {
      const articleId = params.id;

      const r1 = await this.ctx.model.News.findOne({
        where: {
          id: articleId,
        },
      });

      if (!r1) {
        this.ctx.helper.errorBody(10003, '错误的ID');
        return null;
      }

      const result = await this.ctx.model.News.update(
        {

          type: params.type,
          title: params.title,
          thumbnail: params.thumbnail,
          content: params.content,
          abstract: params.abstract,
          status: params.status,
          showStatus: params.showStatus,
          contentType: params.contentType || 0,
          editReason: params.editReason || '',
          author: this.ctx.session.userInfo.name,
          uptime: moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss'),
        },
        {
          where: {
            id: articleId,
          },

        });
      if (result[0]) {

        return true;
      }

      this.ctx.helper.errorBody(10001, '编辑错误');
      return null;
    } catch (error) {

      this.ctx.throw('服务器处理错误:' + error);
    }

  }


  public async getList({ page, pageSize, type }) {
    const limit = parseInt(pageSize);
    const offset = limit * (parseInt(page) - 1);
    let queryParams = {};
    if (type) {
      queryParams = {
        type,
      }
    }
    try {
      const result = await this.ctx.model.News.findAndCountAll({
        limit,
        offset,
        where: queryParams,
        order: [
          ['time', 'DESC'],
        ],
      });
      return {
        list: result.rows,
        totalCount: result.count,
        current: parseInt(page),
      };

    } catch (error) {
      this.ctx.throw('服务器处理错误:' + error);
    }
  }

  public async getNewsDetail(id: string) {
    try {
      const result = await this.ctx.model.News.findOne(
        {
          attributes: [
            'id',
            'title',
            'type',
            'uri',
            'thumbnail',
            'content',
            'abstract',
            'author',
            'count',
            'status',
            'contentType',
            'editReason',
            'time',
            'uptime',
          ],
          where: {
            id,
          },
        },
      );
      if (result) {

        return result;
      }
      this.ctx.helper.errorBody(10003, '处理错误');
      return null;
    } catch (error) {
      this.ctx.throw('服务器处理错误:' + error);
    }
  }

  public async deleteNews(id) {

    try {
      const result = await this.ctx.model.News.destroy({
        where: {
          id,
        },
      });

      if (result) {
        return true;
      }
      this.ctx.helper.errorBody(10003, '处理错误');
      return null;

    } catch (error) {
      this.ctx.throw('服务器处理错误:' + error);
    }
  }


  public async newsCounted(id) {
    try {
      const result = await this.ctx.model.News.increment({
        count: 1,
      }, {
        where: {
          id,
        },
      });

      if (result) {
        return true;
      }
      this.ctx.helper.errorBody(10003, '处理错误');
      return null;

    } catch (error) {
      this.ctx.throw('服务器处理错误:' + error);
    }
  }

  public async getNewsList({ page, pageSize, type }) {
    const limit = parseInt(pageSize);
    const offset = limit * (parseInt(page) - 1);

    const queryParams = {
      status: 0
    };
    if (type) {
      Object.assign(queryParams, {
        type,
      })
    }
    try {
      const result = await this.ctx.model.News.findAndCountAll({
        limit,
        offset,
        where: queryParams,
      });
      return {
        list: result.rows,
        totalCount: result.count,
        current: parseInt(page),
      };

    } catch (error) {
      this.ctx.throw('服务器处理错误:' + error);
    }
  }

  public async getNewsDetailByUri(uri: string) {
    try {
      const result = await this.ctx.model.News.findOne(
        {
          attributes: [
            'id',
            'title',
            'type',
            'uri',
            'thumbnail',
            'content',
            'abstract',
            'author',
            'count',
            'status',
            'contentType',
            'editReason',
            'time',
            'uptime',
          ],

          where: {
            uri,
          },
        },
      );
      if (result) {
        await this.ctx.model.News.increment({
          count: 1,
        }, {
          where: {
            uri,
          },
        });
        return result;
      }
      this.ctx.helper.errorBody(10003, '处理错误');
      return null;
    } catch (error) {
      this.ctx.throw('服务器处理错误:' + error);
    }
  }
}
