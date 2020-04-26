/*
 * @Author: guwei ;
 * @Date: 2020-04-12 15:38:12 ;
 * @Last Modified by: guwei
 * @Last Modified time: 2020-04-14 20:59:09
 */
import { Controller } from 'egg';

export default class CategoryController extends Controller {

  public async getCategoryList() {
    const { ctx } = this;
    const result = await ctx.service.category.getList();
    if (result) {
      ctx.helper.successBody(result);
    }
  }

  public async newCategory() {
    const { ctx } = this;
    const validateResult = await ctx.validate('category.add', ctx.request.body);
    if (!validateResult) return;
    const result = await ctx.service.category.newCategory(ctx.request.body);
    if (result) {
      ctx.helper.successBody();
    }
  }

  public async editCategory() {
    const { ctx } = this;
    const validateResult = await ctx.validate('category.edit', ctx.request.body);
    if (!validateResult) return;
    const result = await ctx.service.category.editCategory(ctx.request.body);
    if (result) {
      ctx.helper.successBody();
    }
  }

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
