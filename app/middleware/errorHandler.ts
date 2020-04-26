const VALIDATE_ERROR_CODE = 6001;
module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
    } catch (err) {
      // 所有的异常都在 app 上触发一个 error 事件，框架会记录一条错误日志

      console.log('=============================')
      console.log(err);
      console.log('=============================')

      ctx.app.emit('error', err, ctx);
      const status = err.status;
      let message = err.message || '服务器打了个盹儿';
      let code = err.code || 10000;
      if (status === VALIDATE_ERROR_CODE) {
        message = err.message === 'Validation Failed' ? '请求参数错误' : err.message;
        code = VALIDATE_ERROR_CODE;
      };

      ctx.status = status === 500 ? status : 200;

      // 错误响应对象
      ctx.body = {
        code,
        message,
        // detail: status === 422 ? err.errors : undefined, // 参数校验未通过
      };
    }
  }
}
