/*
 * @Author: guwei 
 * @Date: 2019-12-03 22:26:20 
 * @Last Modified by: guwei
 * @Last Modified time: 2020-04-15 18:21:27
 */

module.exports = () => {
  return async function adminAuth(ctx, next) {
    const { mysess } = ctx.request.header;

    if (!mysess) {
      return ctx.helper.errorBody(8001, '权限校验失败');
    }

    const userInfo = await ctx.service.cache.get(mysess);

    if (!userInfo) {
      return ctx.helper.errorBody(8001, '权限校验失败');
    }
    ctx.session.userInfo = JSON.parse(userInfo);

    await next();
  };
};
