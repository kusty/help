/*
 * @Author: guwei ;
 * @Date: 2020-04-12 15:38:12 ;
 * @Last Modified by: guwei
 * @Last Modified time: 2020-04-14 20:59:09
 */
import { Controller } from 'egg';

export default class CategoryController extends Controller {

  /**
* showdoc
* @catalog 管理后台/分类管理/
* @title 获取分类列表
* @description 获取分类列表
* @method GET
* @url /admin/category/list
* @header mysess 必选 string 校验字符串
* @return {"code":200,"message":"ok","data":[{"id":2,"code":"002","name":"SCRM","pid":0,"displayIndex":0,"isNotShow":0,"title":"SCRM","children":[{"id":2001,"code":"002001","name":"会员营销","pid":2,"displayIndex":2,"isNotShow":0,"title":"会员营销","children":[{"id":2001005,"code":"002001005","name":"业绩分析","pid":2001,"displayIndex":0,"isNotShow":0,"title":"业绩分析"}]}]}]}
* @return_param id int 分类ID
* @return_param code string 分类的code
* @return_param name/title string 分类名称
* @return_param pid int 父级ID，无父级为0
* @return_param displayIndex int 排序
* @return_param isNotShow int 是否显示,1不显示,0显示
* @return_param children array 子级
* @number 99
*/

  public async getCategoryList() {
    const { ctx } = this;
    const result = await ctx.service.category.getList();
    if (result) {
      ctx.helper.successBody(result);
    }
  }

  /**
* showdoc
* @catalog 管理后台/分类管理/
* @title 新增分类
* @description 新增分类
* @method POST
* @url /admin/category/add
* @header mysess 必选 string 校验字符串
* @param id 必选 int 需要新增分类的节点id
* @param type 必选 int 1平级新增,2子级新增
* @param name 必选 string 分类名称
* @param displayIndex 必选 int 排序
* @return {"code":200,"message":"ok","data":{}}
* @number 99
*/

  public async newCategory() {
    const { ctx } = this;
    const validateResult = await ctx.validate('category.add', ctx.request.body);
    if (!validateResult) return;
    const result = await ctx.service.category.newCategory(ctx.request.body);
    if (result) {
      ctx.helper.successBody();
    }
  }

  /**
* showdoc
* @catalog 管理后台/分类管理/
* @title 修改分类
* @description 修改分类
* @method POST
* @url /admin/category/edit
* @header mysess 必选 string 校验字符串
* @param id 必选 int 修改的分类id
* @param name 必选 string 分类名称
* @param displayIndex 必选 int 排序
* @return {"code":200,"message":"ok","data":{}}
* @number 99
*/

  public async editCategory() {
    const { ctx } = this;
    const validateResult = await ctx.validate('category.edit', ctx.request.body);
    if (!validateResult) return;
    const result = await ctx.service.category.editCategory(ctx.request.body);
    if (result) {
      ctx.helper.successBody();
    }
  }

  /**
* showdoc
* @catalog 管理后台/分类管理/
* @title 删除分类
* @description 删除分类
* @method POST
* @url /admin/category/delete
* @header mysess 必选 string 校验字符串
* @param id 必选 int 需要删除的分类id
* @return {"code":200,"message":"ok","data":{}}
* @number 99
*/

  public async deleteCategory() {
    const { ctx } = this;
    const validateResult = await ctx.validate('category.delete', ctx.request.body);
    if (!validateResult) return;
    const result = await ctx.service.category.deleteCategory(ctx.request.body);
    if (result) {
      ctx.helper.successBody();
    }
  }

}
