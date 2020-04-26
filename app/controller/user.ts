/*
 * @Author: guwei ;
 * @Date: 2020-04-12 15:38:12 ;
 * @Last Modified by: guwei
 * @Last Modified time: 2020-04-15 17:52:54
 */
import { Controller } from 'egg';

export default class UserController extends Controller {

  /**
* showdoc
* @catalog 管理后台/用户
* @title 用户登录
* @description 用户登录的接口
* @method get
* @url /api/admin/user/login
* @param token 必选 string sso拿到的token
* @return {"code":200,"message":"ok","data":{"id":1,"name":"顾伟","phone":"13816659396","department":null,"avatar":null,"role":null,"createdAt":null,"updatedAt":null,"mysess":"ba070cd0-8491-11ea-8878-0523250f1d6b"}}
* @return_param name string 用户姓名
* @return_param phone string 用户手机号
* @return_param mysess string 验签的字符串
* @remark mysess 保存到本地，放到header里面
* @number 1
*/

  public async login() {
    const { ctx } = this;
    const { token } = ctx.request.body;
    const result = await this.ctx.service.user.userLogin(token);

    if (result) {
      ctx.helper.successBody(result);
    }
  }
}