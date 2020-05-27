/*
 * @Author: guwei
 * @Date: 2020-04-12 15:47:36
 * @Last Modified by: guwei
 * @Last Modified time: 2020-05-27 20:16:25
 */
import { Service } from 'egg';

export default class Category extends Service {

  public async getList() {
    try {
      const result = await this.ctx.model.Category.findAll({
        order: [
          [
            'displayIndex', 'DESC',
          ],
        ],
        raw: true,
      });

      const newResult = result.reverse().map(v => {
        return {
          ...v,
          title: v.name,
        };
      });

      return this.ctx.helper.treeData(newResult, 'id', 'pid', 'children');
    } catch (error) {
      this.ctx.throw('服务器处理错误:' + error);
    }
  }

  public async newCategory(params) {
    try {
      const { type, id } = params;
      let pid = id;
      const result = await this.ctx.model.Category.findOne({
        where: {
          id,
        },
        raw: true,
      });
      // type：1 平级新增，2子级新增
      if (Number(type) === 1) {
        pid = result.pid;
      }
      let mid = 0;
      const num = await this.ctx.model.Category.max('id', {
        where: {
          pid,
        },
        raw: true,
      });
      if (num > 0) {
        mid = num + 1;
      } else {
        if (pid === 0) {
          mid = 1;
        } else {
          mid = Number(pid + '001');
        }
      }

      let mcode,
        tpid = 0;

      if (pid === 0) {
        mcode = '0' + mid;
      } else {
        const r1 = await this.ctx.model.Category.findOne({
          where: {
            id: pid,
          },
          raw: true,
        });
        mcode = r1.code;
        tpid = r1.pid;
        let greaterThan10 = false;
        if (pid >= 10 && pid <= 99) {
          greaterThan10 = true;
        }
        if (tpid >= 10 && tpid <= 99) {
          greaterThan10 = true;
        }
        if (greaterThan10) {
          mcode = '0' + mid;
        } else {
          mcode = '00' + mid;
        }
      }
      const obj = {
        ...params,
        id: mid,
        code: mcode,
        pid,

      };
      return await this.ctx.model.Category.create(obj);

    } catch (error) {
      this.ctx.throw('服务器处理错误:' + error);
    }

  }

  public async editCategory(params) {
    try {
      const result = await this.ctx.model.Category.update({
        name: params.name,
        displayIndex: Number(params.displayIndex),
      }, {
        where: {
          id: Number(params.id),
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

  public async updateCategoryStatus(params) {
    try {
      const result = await this.ctx.model.Category.update({
        isNotShow: Number(params.state) === 1 ? 0 : 1,
      }, {
        where: {
          id: Number(params.id),
        },
      });
      if (result[0]) {
        return true;
      }
      this.ctx.helper.errorBody(10003, '处理错误');
      return null;

    } catch (error) {
      this.ctx.throw('服务器处理错误:' + error);
    }
  }
}
