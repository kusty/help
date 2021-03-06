/*
 * @Author: guwei ;
 * @Date: 2020-04-12 15:47:36 ;
 * @Last Modified by: guwei
 * @Last Modified time: 2020-12-03 22:06:48
 */
import { Service } from 'egg';
import uuidv1 = require('uuid/v1');
import moment = require('moment');
import { sortBy, pick } from 'lodash';
import { makePy } from '../utils/ChinesePY';

export default class Article extends Service {
  public async checkIsHotOrNew(list) {
    if (!list || list.length < 1) {
      return list;
    }
    const articleList = await this.ctx.model.Article.findAll({
      attributes: [ 'count', 'time' ],
      raw: true,
    });

    const countSortedList = sortBy(articleList, v => {
      return -v.count;
    });

    const num = Math.floor(Number(articleList.length * 0.2));
    const last3 = moment().subtract('days', 6).format('YYYY-MM-DD 00:00:00');
    const data = countSortedList[num];
    return list.map(v => {
      return {
        ...v,
        isHot: Boolean(v.count > data.count),
        isNew: moment(v.time).isAfter(last3),
      };
    });


  }

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
        await transaction.rollback();
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
          subTitle: params.subTitle,
          logo: params.logo,
          content: params.content,
          abstract: params.abstract,
          isVideo: params.isVideo,
          status: params.status,
          showStatus: params.showStatus,
          contentType: params.contentType || 0,
          editReason: params.editReason || '',
          categoryCode,
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

      this.ctx.helper.errorBody(10001, '文章编辑错误');
      return null;
    } catch (error) {

      this.ctx.throw('服务器处理错误:' + error);
    }

  }
  public async editArticleDisplayIndex(list) {

    try {
      const newList: any[] = [];
      for (const v of list) {
        const r1 = await this.ctx.model.Article.findOne({
          where: {
            id: v.id,
          },
          raw: true,
        });
        console.log('=============================');
        console.log(r1);
        console.log('=============================');

        if (r1) {
          newList.push(v);
        }

      }
      const result = await this.ctx.model.Article.bulkCreate(newList,
        { updateOnDuplicate: [ 'displayIndex', 'id' ] },
      );
      if (result) {
        return result;
      }
      this.ctx.helper.errorBody(10001, '编辑错误');
      return null;
    } catch (error) {
      this.ctx.throw('服务器处理错误:' + error);
    }
  }
  public async getList({ page, pageSize,
    title,
    pcMenuIds,
    appMenuIds,
    categoryId,
    startDate,
    endDate,
    status }) {
    const limit = parseInt(pageSize);
    const offset = limit * (parseInt(page) - 1);
    await this.checkIsHotOrNew([]);
    let queryParmas = {};

    if (title) {
      queryParmas = {
        ...queryParmas,
        title: {
          [this.app.Sequelize.Op.like]: '%' + title + '%',
        },
      };
    }

    if (categoryId) {
      queryParmas = {
        ...queryParmas,
        categoryId: {
          [this.app.Sequelize.Op.like]: categoryId + '%',
        },
      };
    }
    if (status) {
      queryParmas = {
        ...queryParmas,
        status,
      };
    }

    if (startDate || endDate) {
      queryParmas = {
        ...queryParmas,
        time: {
          [this.app.Sequelize.Op.between]: [
            startDate || '2000-01-01 00:00:00', endDate || moment().format('YYYY-MM-DD HH:mm:ss'),
          ],
        },
      };
    }
    try {
      const result = await this.ctx.model.Article.findAndCountAll({
        limit,
        offset,
        where: queryParmas,
        order: [
          [ 'time', 'DESC' ],
        ],
        include: [
          {
            model: this.ctx.model.ArticleMenu,
            as: 'pcMenu',
            where: pcMenuIds ? {
              menuId: {
                [this.app.Sequelize.Op.or]: [
                  this.app.Sequelize.where(this.app.Sequelize.col('pcMenu.menuId'), {
                    [this.app.Sequelize.Op.like]: '%,' + pcMenuIds,
                  }),
                  this.app.Sequelize.where(this.app.Sequelize.col('pcMenu.menuId'), {
                    [this.app.Sequelize.Op.like]: pcMenuIds + ',%',
                  }),
                  this.app.Sequelize.where(this.app.Sequelize.col('pcMenu.menuId'), {
                    [this.app.Sequelize.Op.like]: '%,' + pcMenuIds + ',%',
                  }),
                  this.app.Sequelize.where(this.app.Sequelize.col('pcMenu.menuId'), pcMenuIds),
                ],
              },
            } : null,
          },
          {
            model: this.ctx.model.ArticleMenuApp,
            as: 'appMenu',
            where: appMenuIds ? {
              menuId: {
                [this.app.Sequelize.Op.or]: [
                  this.app.Sequelize.where(this.app.Sequelize.col('appMenu.menuId'), {
                    [this.app.Sequelize.Op.like]: '%,' + appMenuIds,
                  }),
                  this.app.Sequelize.where(this.app.Sequelize.col('appMenu.menuId'), {
                    [this.app.Sequelize.Op.like]: appMenuIds + ',%',
                  }),
                  this.app.Sequelize.where(this.app.Sequelize.col('appMenu.menuId'), {
                    [this.app.Sequelize.Op.like]: '%,' + appMenuIds + ',%',
                  }),
                  this.app.Sequelize.where(this.app.Sequelize.col('appMenu.menuId'), appMenuIds),
                ],
              },
            } : null,
          },
        ],
        raw: true,
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
  public async exportList({
    title,
    pcMenuIds,
    appMenuIds,
    categoryId,
    startDate,
    endDate,
    status }) {

    let queryParmas = {};

    if (title) {
      queryParmas = {
        ...queryParmas,
        title: {
          [this.app.Sequelize.Op.like]: '%' + title + '%',
        },
      };
    }

    if (categoryId) {
      queryParmas = {
        ...queryParmas,
        categoryId,
      };
    }
    if (status) {
      queryParmas = {
        ...queryParmas,
        status,
      };
    }

    if (startDate || endDate) {
      queryParmas = {
        ...queryParmas,
        uptime: {
          [this.app.Sequelize.Op.between]: [
            startDate || '2000-01-01 00:00:00', endDate || moment().format('YYYY-MM-DD HH:mm:ss'),
          ],
        },
      };
    }
    try {
      const result = await this.ctx.model.Article.findAll({

        where: queryParmas,
        include: [
          {
            model: this.ctx.model.ArticleMenu,
            as: 'pcMenu',
            where: pcMenuIds ? {
              menuId: {
                [this.app.Sequelize.Op.or]: [
                  this.app.Sequelize.where(this.app.Sequelize.col('pcMenu.menuId'), {
                    [this.app.Sequelize.Op.like]: '%,' + pcMenuIds,
                  }),
                  this.app.Sequelize.where(this.app.Sequelize.col('pcMenu.menuId'), {
                    [this.app.Sequelize.Op.like]: pcMenuIds + ',%',
                  }),
                  this.app.Sequelize.where(this.app.Sequelize.col('pcMenu.menuId'), {
                    [this.app.Sequelize.Op.like]: '%,' + pcMenuIds + ',%',
                  }),
                  this.app.Sequelize.where(this.app.Sequelize.col('pcMenu.menuId'), pcMenuIds),
                ],
              },
            } : null,
          },
          {
            model: this.ctx.model.ArticleMenuApp,
            as: 'appMenu',
            where: appMenuIds ? {
              menuId: {
                [this.app.Sequelize.Op.or]: [
                  this.app.Sequelize.where(this.app.Sequelize.col('appMenu.menuId'), {
                    [this.app.Sequelize.Op.like]: '%,' + appMenuIds,
                  }),
                  this.app.Sequelize.where(this.app.Sequelize.col('appMenu.menuId'), {
                    [this.app.Sequelize.Op.like]: appMenuIds + ',%',
                  }),
                  this.app.Sequelize.where(this.app.Sequelize.col('appMenu.menuId'), {
                    [this.app.Sequelize.Op.like]: '%,' + appMenuIds + ',%',
                  }),
                  this.app.Sequelize.where(this.app.Sequelize.col('appMenu.menuId'), appMenuIds),
                ],
              },
            } : null,
          },
        ],
        raw: true,
      });

      const pcMenuData = await this.ctx.baseModel.Menu.findAll({
        raw: true,
      });

      const appMenuData = await this.ctx.baseModel.MenuApp.findAll({
        raw: true,
      });

      const newPcArticleData: any[] = [];
      const newAppArticleData: any[] = [];
      result.forEach(v => {
        if (v['pcMenu.menuId']) {

          const pcIdList = v['pcMenu.menuId'].split(',');
          pcIdList.forEach(vs => {
            const arr = this.ctx.helper.findParentList(vs, pcMenuData, 'TreePId', 'Id');

            const newArr: any[] = [];
            for (let index = 0; index < 3; index++) {
              newArr.push({
                name: arr[index] ? arr[index].Name : '',
                id: arr[index] ? arr[index].Id : '',
              });

            }
            newPcArticleData.push({
              ...v,
              uri: 'https://doc.ezrpro.com/article/' + v.uri,
              pc1Name: newArr[0].name,
              pc2Name: newArr[1].name,
              pc3Name: newArr[2].name,
            });
          });
        } else {
          newPcArticleData.push({
            ...v,
            uri: 'https://doc.ezrpro.com/article/' + v.uri,
            pc1Name: '',
            pc2Name: '',
            pc3Name: '',
          });
        }
        if (v['appMenu.menuId']) {

          const pcIdList = v['appMenu.menuId'].split(',');
          pcIdList.forEach(vs => {
            const arr = this.ctx.helper.findParentList(vs, appMenuData, 'ParentId', 'Id');

            const newArr: any[] = [];
            for (let index = 0; index < 3; index++) {
              newArr.push({
                name: arr[index] ? arr[index].Name : '',
                id: arr[index] ? arr[index].Id : '',
              });

            }
            newAppArticleData.push({
              ...v,
              uri: 'https://doc.ezrpro.com/article/' + v.uri,
              app1Name: newArr[0].name,
              app2Name: newArr[1].name,
              app3Name: newArr[2].name,
            });
          });
        } else {
          newAppArticleData.push({
            ...v,
            uri: 'https://doc.ezrpro.com/article/' + v.uri,
            app1Name: '',
            app2Name: '',
            app3Name: '',
          });
        }
      });

      const exportData = [{
        result: newPcArticleData,
        headers: [[
          { t: '1级菜单', k: 'pc1Name' },
          { t: '2级菜单', k: 'pc2Name' },
          { t: '3级菜单', k: 'pc3Name' },
          { t: '文章标题', k: 'title' },
          { t: '标签', k: 'keywords' },
          { t: '文章链接', k: 'uri' },
          { t: '阅读量', k: 'count' },
          { t: '编辑人', k: 'author' },
          { t: '编辑时间', k: 'time' },
          { t: '编辑原因', k: 'editReason' },
        ]],
        sheetName: 'pc菜单文章列表',
      }, {
        result: newAppArticleData,
        headers: [[
          { t: '1级菜单', k: 'app1Name' },
          { t: '2级菜单', k: 'app2Name' },
          { t: '3级菜单', k: 'app3Name' },
          { t: '文章标题', k: 'title' },
          { t: '标签', k: 'keywords' },
          { t: '文章链接', k: 'uri' },
          { t: '阅读量', k: 'count' },
          { t: '编辑人', k: 'author' },
          { t: '编辑时间', k: 'time' },
          { t: '编辑原因', k: 'editReason' },
        ]],
        sheetName: 'app菜单文章列表',
      }];
      return await this.ctx.helper.excelNew(exportData, moment().format('YYYYMMDDHHmmss'));
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
            'subTitle',
            'logo',
            'thumbnail',
            'content',
            'abstract',
            'author',
            'isVideo',
            'count',
            'status',
            'showStatus',
            'contentType',
            'editReason',
            'time',
            'uptime',
            [
              this.app.Sequelize.col('pcMenu.menuId'),
              'pcMenuIds',
            ],
            [
              this.app.Sequelize.col('appMenu.menuId'),
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
      await this.ctx.model.ArticleMenu.destroy({
        where: {
          id,
        },
      });
      await this.ctx.model.ArticleMenuApp.destroy({
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
  async getListForMain({ categoryCode, type }) {

    const queryParmas = {
      status: 0,
    };
    if (categoryCode) {
      Object.assign(queryParmas, {
        categoryCode: {
          [this.app.Sequelize.Op.like]: categoryCode + '%',
        },
      });
    }
    let order: any[] = [];
    if (!type) {
      order = [
        [
          'displayIndex', 'DESC',
        ],
        [
          [
            'time', 'DESC',
          ],
        ],
      ];
    } else {
      if (type === 'recent') {
        order = [
          [
            'time', 'DESC',
          ],
        ];
      }
      if (type === 'hot') {
        order = [
          [
            'count', 'DESC',
          ],
        ];
      }
    }
    try {
      const result = await this.ctx.model.Article.findAll({
        attributes: [ 'id', 'title', 'uri', 'abstract', 'count', 'keywords', 'time', 'displayIndex' ],
        where: queryParmas,
        order,
        limit: 5,
        raw: true,
      });
      return await this.checkIsHotOrNew(result);
    } catch (error) {
      this.ctx.throw('服务器处理错误:' + error);
    }
  }
  async getKeywordsList(type, sort = false) {
    try {
      const result = await this.ctx.model.Article.findAll({
        attributes: [ 'keywords' ],
        raw: true,
        where: {
          status: 0,
        },
      });
      const obj = {};
      result.forEach(v => {

        if (v.keywords) {
          const newStr = v.keywords.replace(/，/g, ',');
          const arr = newStr.split(',');

          arr.forEach(vs => {
            const key = vs.trim();
            if (key) {
              if (obj[key]) {
                obj[key]++;
              } else {
                obj[key] = 1;
              }
            }
          });

        }

      });
      if (type === 'hot') {
        return Object.keys(obj).sort((a, b) => {
          return obj[b] - obj[a];
        }).slice(0, 21);
      }
      const data = Object.keys(obj);

      if (sort) {
        const newObj = {};
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {

            const char = makePy(key.substr(0, 1))[0].toUpperCase();

            if (typeof char === 'string') {
              if (newObj[char]) {
                newObj[char] = [ ...newObj[char], key ];
              } else {
                newObj[char] = [ key ];
              }
            }
          }
        }
        const retData = {};
        Object.keys(newObj).sort().forEach(v => {
          retData[v] = newObj[v];
        });
        return retData;
      }
      return data;
    } catch (error) {
      this.ctx.throw('服务器处理错误:' + error);
    }
  }
  public async getArticleDetailByUri(uri: string) {
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
            'subTitle',
            'logo',
            'thumbnail',
            'content',
            'abstract',
            'author',
            'isVideo',
            'count',
            'status',
            'displayIndex',
            'showStatus',
            'contentType',
            'editReason',
            'time',
            'uptime',
            [
              this.app.Sequelize.col('pcMenu.menuId'),
              'pcMenuIds',
            ],
            [
              this.app.Sequelize.col('appMenu.menuId'),
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
            uri,
          },
        },
      );
      if (result) {
        await this.ctx.model.Article.increment({
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
  async getCategoryArticleList({ page, pageSize, categoryCode }) {

    const queryParmas = {
      status: 0,
    };
    if (categoryCode) {

      Object.assign(queryParmas, {
        categoryCode: {
          [this.app.Sequelize.Op.like]: categoryCode + '%',
        },
      });
    }

    const newSearch = categoryCode ? (' categoryCode LIKE "' + categoryCode + '%" AND') : '';
    const limit = parseInt(pageSize);
    const offset = limit * (parseInt(page) - 1);

    try {

      const data = await this.ctx.model.query('select *, case when display_index is null or display_index=0 then 0 else display_index+ 900000000 end as c1, case when time>=DATE_ADD(sysdate(),INTERVAL -7 DAY) then DATEDIFF(time,sysdate())+9000000  else 0 end as c2,count as c3  from article WHERE' + newSearch + ' `status` = 0 order by c1 desc,c2 desc,c3 desc  limit ' + offset + ' , ' + limit);
      const totalCount = await this.ctx.model.Article.count({
        where: queryParmas,
      });

      const newArr = data[0].map((v: any) => {
        v.displayIndex = v.display_index;
        return pick(v, [ 'id', 'title', 'uri', 'abstract', 'count', 'keywords', 'time', 'displayIndex', 'subTitle',
          'logo' ]);
      });
      return {
        list: await this.checkIsHotOrNew(newArr),
        totalCount,
        current: parseInt(page),
      };

    } catch (error) {
      this.ctx.throw('服务器处理错误:' + error);
    }
  }
  async getCategoryArticleListByType({ page, pageSize, categoryCode, type }) {

    const queryParmas = {
      status: 0,
      showStatus: 1,
    };
    if (categoryCode) {
      Object.assign(queryParmas, {
        categoryCode: {
          [this.app.Sequelize.Op.like]: categoryCode + '%',
        },
      });
    }
    const limit = parseInt(pageSize);
    const offset = limit * (parseInt(page) - 1);
    let order: any[] = [];
    if (type === 'recent') {
      order = [
        [
          'time', 'DESC',
        ],
      ];
    }
    if (type === 'hot') {
      order = [
        [
          'count', 'DESC',
        ],
      ];
    }
    try {
      const result = await this.ctx.model.Article.findAndCountAll({
        attributes: [ 'id', 'title', 'uri', 'abstract', 'count', 'keywords', 'time', 'displayIndex', 'thumbnail', 'subTitle',
          'logo' ],
        where: queryParmas,
        order,
        limit,
        offset,
        raw: true,
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
  async getArticleCategoryList(categoryCode) {

    const queryParmas = {
      isNotShow: {
        [this.app.Sequelize.Op.ne]: 1,
      },
      isShowMain: {
        [this.app.Sequelize.Op.ne]: 1,
      },
    };
    if (categoryCode) {

      Object.assign(queryParmas, {
        code: {
          [this.app.Sequelize.Op.like]: categoryCode + '%',
        },
      });
    }

    try {
      const result = await this.ctx.model.Category.findAll({
        order: [
          [
            'displayIndex', 'DESC',
          ],
        ],
        where: queryParmas,
        raw: true,
      });

      const newResult = result.reverse().map(v => {
        return {
          ...v,
          title: v.name,
        };
      });

      const returnData = this.ctx.helper.treeData(newResult, 'id', 'pid', 'children');
      if (categoryCode) {
        return returnData[0] ? returnData[0].children || [] : [];
      }
      return returnData;


    } catch (error) {
      this.ctx.throw('服务器处理错误:' + error);
    }
  }
  async getKeywordsArticleList({ page, pageSize, keywords }) {

    const queryParmas = {
      status: 0,
    };
    if (keywords) {
      Object.assign(queryParmas, {
        keywords: {
          [this.app.Sequelize.Op.like]: '%' + keywords + '%',
        },

      });

    }

    const limit = parseInt(pageSize);
    const offset = limit * (parseInt(page) - 1);
    const newSearch = keywords ? (' keywords LIKE "%' + keywords + '%" AND') : '';


    try {

      const data = await this.ctx.model.query('select *, case when display_index is null or display_index=0 then 0 else display_index+ 900000000 end as c1, case when time>=DATE_ADD(sysdate(),INTERVAL -7 DAY) then DATEDIFF(time,sysdate())+9000000  else 0 end as c2,count as c3  from article WHERE' + newSearch + ' `status` = 0 order by c1 desc,c2 desc,c3 desc  limit ' + offset + ' , ' + limit);
      const totalCount = await this.ctx.model.Article.count({
        where: queryParmas,
      });

      const newArr = data[0].map((v: any) => {
        v.displayIndex = v.display_index;
        return pick(v, [ 'id', 'title', 'uri', 'abstract', 'count', 'keywords', 'time', 'displayIndex', 'subTitle',
          'logo' ]);
      });
      return {
        list: await this.checkIsHotOrNew(newArr),
        totalCount,
        current: parseInt(page),
      };

    } catch (error) {
      this.ctx.throw('服务器处理错误:' + error);
    }
  }
  async getAllArticleList({ page, pageSize, search }) {

    const queryParmas = {
      status: 0,
    };

    if (search) {

      Object.assign(queryParmas, {
        [this.app.Sequelize.Op.or]: [
          { content: { [this.app.Sequelize.Op.like]: '%' + search + '%' } }, // like和or连用
          { title: { [this.app.Sequelize.Op.like]: '%' + search + '%' } },
        ],
      });
    }
    const newSearch = search ? ('(title LIKE "%' + search + '%" OR content LIKE "%' + search + '%" OR keywords LIKE "' + search + ',%" OR keywords LIKE "%,' + search + '"  OR keywords LIKE "%,' + search + ',%") AND') : '';
    const limit = parseInt(pageSize);
    const offset = limit * (parseInt(page) - 1);


    try {

      const data = await this.ctx.model.query('select *, case when display_index is null or display_index=0 then 0 else display_index+ 900000000 end as c1, case when time>=DATE_ADD(sysdate(),INTERVAL -7 DAY) then DATEDIFF(time,sysdate())+9000000  else 0 end as c2,count as c3  from article WHERE ' + newSearch + ' `status` = 0 order by c1 desc,c2 desc,c3 desc  limit ' + offset + ' , ' + limit);
      const totalCount = await this.ctx.model.Article.count({
        where: queryParmas,
      });

      const newArr = data[0].map((v: any) => {
        v.displayIndex = v.display_index;
        return pick(v, [
          'id', 'title', 'uri', 'abstract', 'count', 'keywords', 'time', 'displayIndex', 'subTitle',
          'logo',
        ]);
      });
      return {
        list: await this.checkIsHotOrNew(newArr),
        totalCount,
        current: parseInt(page),
      };

    } catch (error) {
      this.ctx.throw('服务器处理错误:' + error);
    }

  }
  public async getMenuArticleList(href) {

    try {
      const pcMenuFuncData = await this.ctx.baseModel.MenuPcFunc.findOne({
        where: {
          href,
        },
        raw: true,
      });
      if (!pcMenuFuncData) {
        return [];
      }
      const { Id } = pcMenuFuncData;
      const pcMenuData = await this.ctx.baseModel.Menu.findOne({
        where: {
          MenuFuncId: Id,
        },
        raw: true,
      });
      const menuId = pcMenuData.Id;
      if (!menuId) {
        return [];
      }
      const result = await this.ctx.model.Article.findAll({
        attributes: [ 'id', 'title', 'uri', 'abstract', 'count', 'keywords', 'time', 'displayIndex', 'subTitle',
          'logo' ],
        order: [
          [ 'displayIndex', 'DESC' ],
          [ 'time', 'DESC' ],
        ],
        where: {
          status: 0,
        },
        include: [
          {
            model: this.ctx.model.ArticleMenu,
            as: 'pcMenu',
            attributes: [],
            where: {
              menuId: {
                [this.app.Sequelize.Op.or]: [
                  this.app.Sequelize.where(this.app.Sequelize.col('pcMenu.menuId'), {
                    [this.app.Sequelize.Op.like]: '%,' + menuId,
                  }),
                  this.app.Sequelize.where(this.app.Sequelize.col('pcMenu.menuId'), {
                    [this.app.Sequelize.Op.like]: menuId + ',%',
                  }),
                  this.app.Sequelize.where(this.app.Sequelize.col('pcMenu.menuId'), {
                    [this.app.Sequelize.Op.like]: '%,' + menuId + ',%',
                  }),
                  this.app.Sequelize.where(this.app.Sequelize.col('pcMenu.menuId'), menuId),
                ],
              },
            },
          },

        ],
        raw: true,
      });

      // const newData = orderBy(result, ['displayIndex', 'time', 'count'], ['desc', 'desc', 'desc']);
      const arr = result.map(v => {


        if (v.displayIndex > 0) {
          return {
            ...v,
            sort: 900000000000 + v.displayIndex,
          };
        } else if (new Date().getTime() - new Date(v.time).getTime() <= 7 * 24 * 3600 * 1000) {

          const sort = new Date(v.time).getTime() - new Date().getTime() + 7 * 24 * 3600 * 1000 + 9000000;
          return {
            ...v,
            sort,
          };
        }
        return {
          ...v,
          sort: v.count,
        };
      });


      const newData = arr.sort((a, b) => {
        return b.sort - a.sort;
      });

      return this.checkIsHotOrNew(newData) || [];

    } catch (error) {

      return [];
    }
  }
  public async getAppMenuArticleList(href) {

    try {

      const appMenuData = await this.ctx.baseModel.MenuApp.findOne({
        where: {
          Code: href,
        },
        raw: true,
      });
      const menuId = appMenuData.Id;
      if (!menuId) {
        return [];
      }
      let result = await this.ctx.model.Article.findAll({
        attributes: [ 'id', 'title', 'uri', 'abstract', 'count', 'keywords', 'time', 'isVideo', 'displayIndex', 'subTitle',
          'logo' ],
        order: [
          [ 'displayIndex', 'DESC' ],
          [ 'time', 'DESC' ],
        ],
        where: {
          status: 0,
        },
        include: [
          {
            model: this.ctx.model.ArticleMenuApp,
            as: 'appMenu',
            attributes: [],
            where: {
              menuId: {
                [this.app.Sequelize.Op.or]: [
                  this.app.Sequelize.where(this.app.Sequelize.col('appMenu.menuId'), {
                    [this.app.Sequelize.Op.like]: '%,' + menuId + '%',
                  }),
                  this.app.Sequelize.where(this.app.Sequelize.col('appMenu.menuId'), {
                    [this.app.Sequelize.Op.like]: '%' + menuId + ',%',
                  }),
                  this.app.Sequelize.where(this.app.Sequelize.col('appMenu.menuId'), {
                    [this.app.Sequelize.Op.like]: '%,' + menuId + ',%',
                  }),
                  this.app.Sequelize.where(this.app.Sequelize.col('appMenu.menuId'), menuId),
                ],
              },
            },
          },

        ],
        raw: true,
      });

      if (result.length) {
        result = result.map(v => {
          return {
            ...v,
            uri: 'https://help.ezrpro.com/article/' + v.uri,
            count: '' + v.count,
            isVideo: '' + v.isVideo,
            isVideoShow: Boolean(v.isVideo === 1),
          };
        });
      }

      const arr = result.map(v => {


        if (v.displayIndex > 0) {
          return {
            ...v,
            sort: 900000000000 + v.displayIndex,
          };
        } else if (new Date().getTime() - new Date(v.time).getTime() <= 7 * 24 * 3600 * 1000) {

          const sort = new Date(v.time).getTime() - new Date().getTime() + 7 * 24 * 3600 * 1000 + 9000000;
          return {
            ...v,
            sort,
          };
        }
        return {
          ...v,
          sort: v.count,
        };
      });


      const newData = arr.sort((a, b) => {
        return b.sort - a.sort;
      });

      return this.checkIsHotOrNew(newData) || [];

    } catch (error) {

      return [];
    }
  }
  async getArticleSearchList({ search, page, pageSize }) {
    const limit = parseInt(pageSize);
    const offset = limit * (parseInt(page) - 1);
    try {
      if (search) {

        const queryTitle = {
          status: 0,
          [this.app.Sequelize.Op.or]: [
            { title: { [this.app.Sequelize.Op.like]: '%' + search + '%' } },
          ],
        };

        const result = await this.ctx.model.Article.findAll({
          attributes: [ 'id' ],
          where: {
            status: 0,
            [this.app.Sequelize.Op.or]: [
              { title: { [this.app.Sequelize.Op.like]: '%' + search + '%' } },
              { keywords: { [this.app.Sequelize.Op.like]: '%' + search + '%' } },
              { content: { [this.app.Sequelize.Op.like]: '%' + search + '%' } },
            ],
          },

        });
        const allCount = result.length;
        const r1 = await this.ctx.model.Article.findAndCountAll({
          attributes: [ 'id', 'title', 'uri', 'time', 'count' ],
          where: queryTitle,
          limit,
          offset,
          order: [
            [ 'time', 'DESC' ],
          ],
        });

        if (r1.rows.length === limit) {
          return {
            list: r1.rows,
            totalCount: allCount,
            current: parseInt(page),
          };
        }
        const queryKeywords = {
          status: 0,
          [this.app.Sequelize.Op.and]: [
            { keywords: { [this.app.Sequelize.Op.like]: '%' + search + '%' } }, // like和or连用
            { title: { [this.app.Sequelize.Op.notLike]: '%' + search + '%' } },
          ],
        };

        let r2Offset = parseInt(page) - Math.ceil(r1.count / limit);

        if (r2Offset >= 1) {
          r2Offset = (limit - r1.count % limit) + (r2Offset - 1) * limit;
        }
        const r2 = await this.ctx.model.Article.findAndCountAll({
          attributes: [ 'id', 'title', 'uri', 'time', 'count' ],
          where: queryKeywords,
          limit: limit - r1.rows.length,
          offset: r2Offset,
          order: [
            [ 'time', 'DESC' ],
          ],
        });

        if (r1.rows.length + r2.rows.length === limit) {
          return {
            list: r1.rows.concat(r2.rows),
            totalCount: allCount,
            current: parseInt(page),
          };
        }

        const queryContent = {
          status: 0,
          [this.app.Sequelize.Op.and]: [
            { keywords: { [this.app.Sequelize.Op.notLike]: '%' + search + '%' } }, // like和or连用
            { title: { [this.app.Sequelize.Op.notLike]: '%' + search + '%' } },
            { content: { [this.app.Sequelize.Op.like]: '%' + search + '%' } },
          ],
        };
        let r3Offset = parseInt(page) - Math.ceil((r1.count + r2.count) / limit);

        if (r3Offset >= 1) {
          r3Offset = (limit - (r2.count + r1.count) % limit) + (r3Offset - 1) * limit;
        }

        const r3 = await this.ctx.model.Article.findAndCountAll({
          attributes: [
            'id', 'title', 'uri', 'time', 'count',
          ],
          where: queryContent,
          limit: limit - r1.rows.length - r2.rows.length,
          offset: r3Offset,
          order: [
            [ 'time', 'DESC' ],
          ],
        });
        return {
          list: r1.rows.concat(r2.rows).concat(r3.rows),
          totalCount: allCount,
          current: parseInt(page),
        };
      }
      return [];
    } catch (error) {
      this.ctx.throw('服务器处理错误:' + error);
    }

  }
}
