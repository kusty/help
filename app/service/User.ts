/*
 * @Author: guwei ;
 * @Date: 2020-04-12 15:47:36 ;
 * @Last Modified by: guwei
 * @Last Modified time: 2020-05-28 23:55:12
 */
import { Service } from 'egg';
import { request } from '../utils/http';
import uuidv1 = require('uuid/v1');
export default class User extends Service {

  public async userLogin(token) {

    try {
      const result = await request({
        url: 'http://log-ops.ezrpro.cn/api/auth?token=' + token,
      });
      if (result.status) {
        const { data } = result;
        const r1 = await this.ctx.model.User.findOne({
          where: {
            phone: data.phone,
          },
          raw: true,
        });
        if (r1) {
          const mysess = uuidv1();
          await this.ctx.service.cache.set(mysess, JSON.stringify(r1), 3 * 24 * 3600);
          return {
            ...r1,
            mysess,
          };
        }
        this.ctx.helper.errorBody(10002, '用户信息未找到');
        return null;
      }

      this.ctx.helper.errorBody(10001, 'token错误');
      return null;

    } catch (error) {
      this.ctx.throw('服务器处理错误:' + error);
    }

  }


}