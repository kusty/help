/*
 * @Author: guwei ;
 * @Date: 2020-04-12 15:47:36 ;
 * @Last Modified by: guwei
 * @Last Modified time: 2020-05-08 15:38:39
 */
import { Service } from 'egg';
import uuidv1 = require('uuid/v1');
import moment = require('moment');

export default class Article extends Service {

  public async newArticle(params) {
    let transaction;
    try {
      transaction = await this.ctx.model.transaction();
      const { categoryId, pcMenuIds, appMenuIds } = params;
      const catResult = await this.ctx.model.Category.findOne({
        where: {
          id: categoryId,
        },
      });


      let categoryCode = '0';
      if (catResult) {

        categoryCode = catResult.code;
      } else {
        this.ctx.helper.errorBody(10003, '错误的分类');
        return null;
      }
      const num = await this.ctx.model.Article.max('id', {
        raw: true,
      });
      const articleId = num ? num + 1 : 1;

      if (pcMenuIds) {
        await this.ctx.model.ArticleMenu.create(
          {
            id: articleId,
            menuId: pcMenuIds,
            menuType: 1,
          },
          {
            transaction,
            raw: true,
          },
        );

      }

      if (appMenuIds) {
        await this.ctx.model.ArticleMenuApp.create(
          {
            id: articleId,
            menuId: appMenuIds,
            menuType: 2,
          },
          {
            transaction,
            raw: true,
          },

        );

      }

      const uri = uuidv1().replace(/-/g, '');

      const result = await this.ctx.model.Article.create(
        {
          ...params,
          id: articleId,
          contentType: params.contentType || 0,
          uri,
          categoryCode,
          count: 1,
          author: this.ctx.session.userInfo.name,
          time: moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss'),
          uptime: moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss'),
        },
        transaction,
      );
      if (result) {
        await transaction.commit();
        return result;
      }
      await transaction.rollback();
      this.ctx.helper.errorBody(10001, '文章新增错误');
      return null;

    } catch (error) {
      await transaction.rollback();
      this.ctx.throw('服务器处理错误:' + error);
    }

  }

  public async editArticle(params) {

    try {
      const articleId = params.id;

      const r1 = await this.ctx.model.Article.findOne({
        where: {
          id: articleId,
        },
      });

      if (!r1) {
        this.ctx.helper.errorBody(10003, '错误的ID');
        return null;
      }

      const { categoryId, pcMenuIds, appMenuIds } = params;
      const catResult = await this.ctx.model.Category.findOne({
        where: {
          id: categoryId,
        },
      });


      let categoryCode = '0';
      if (catResult) {

        categoryCode = catResult.code;
      } else {
        this.ctx.helper.errorBody(10003, '错误的分类');
        return null;
      }



      if (pcMenuIds) {
        const rr = await this.ctx.model.ArticleMenu.update(
          {

            menuId: pcMenuIds,
            menuType: 1,
          },
          {
            where: {
              id: Number(articleId),
            },

          },
        );
        if (rr[0] === 0) {
          await this.ctx.model.ArticleMenu.create(
            {
              id: Number(articleId),
              menuId: pcMenuIds,
              menuType: 1,
            },

          );
        }
      }

      if (appMenuIds) {
        const rr = await this.ctx.model.ArticleMenuApp.update(
          {

            menuId: appMenuIds,
            menuType: 1,
          },
          {
            where: {
              id: Number(articleId),
            },

          },
        );
        if (rr[0] === 0) {
          await this.ctx.model.ArticleMenuApp.create(
            {
              id: Number(articleId),
              menuId: appMenuIds,
              menuType: 1,
            },


          );
        }

      }
      const result = await this.ctx.model.Article.update(
        {

          categoryId: params.categoryId,
          title: params.title,
          keywords: params.keywords,
          thumbnail: params.thumbnail,
          content: params.content,
          abstract: params.abstract,
          isVideo: params.isVideo,
          status: params.status,
          showStatus: params.showStatus,
          contentType: params.contentType || 0,
          editReason: params.editReason || '',
          categoryCode,
          author: 'admin',
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

      this.ctx.helper.errorBody(10001, '文章编辑错误');
      return null;
    } catch (error) {

      this.ctx.throw('服务器处理错误:' + error);
    }

  }


  public async getList({ page, pageSize }) {
    const limit = parseInt(pageSize);
    const offset = limit * (parseInt(page) - 1);

    try {
      const result = await this.ctx.model.Article.findAndCountAll({
        limit,
        offset,
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

  public async getArticleDetail(id: string) {
    try {
      const result = await this.ctx.model.Article.findOne(
        {
          attributes: [
            'id',
            'title',
            'categoryId',
            'categoryCode',
            'uri',
            'keywords',
            'thumbnail',
            'content',
            'abstract',
            'author',
            'isVideo',
            'count',
            'status',
            'showStatus',
            'time',
            'uptime',
            [
              this.app.Sequelize.col('pcMenu.menu_id'),
              'pcMenuIds',
            ],
            [
              this.app.Sequelize.col('appMenu.menu_id'),
              'appMenuIds',
            ],
          ],
          include: [
            {
              model: this.ctx.model.ArticleMenu,
              as: 'pcMenu',
              attributes: [],
            },
            {
              model: this.ctx.model.ArticleMenuApp,
              as: 'appMenu',
              attributes: [],
            },
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

  public async deleteArticle(id) {

    try {
      const result = await this.ctx.model.Article.destroy({
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


  public async articleCounted(id) {
    try {
      const result = await this.ctx.model.Article.increment({
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
}
