/*
 * @Author: guwei ;
 * @Date: 2020-04-12 15:38:12 ;
 * @Last Modified by: guwei
 * @Last Modified time: 2020-05-09 00:17:47
 */
import { Controller } from 'egg';

export default class NewsController extends Controller {

  /**
* showdoc
* @catalog 管理后台/新闻管理/
* @title 获取新闻列表
* @description 获取新闻列表
* @method GET
* @url /admin/news/list
* @header mysess 必选 string 校验字符串
* @param page 可选 string 当面页，默认1
* @param pageSize 可选 string 每页数据，默认20
* @param search 可选 string 搜索关键字
* @return {"code":200,"message":"ok","data":{"list":[{"id":3,"categoryId":1,"categoryCode":"001","title":"112","uri":"529730507da411eaacfb512774dec231","keywords":null,"thumbnail":null,"content":"2112","abstract":null,"author":null,"isVideo":null,"count":1,"status":0,"showStatus":null,"time":"2020-04-14 00:32:10","uptime":"2020-04-14 00:32:10"}],"totalCount":19,"current":1}}
* @return_param id int 新闻id
* @return_param type int 新闻类型
* @return_param title string 新闻标题
* @return_param thumbnail string 图片
* @return_param content string 新闻内容
* @return_param abstract string 新闻简介
* @return_param author string 新闻作者
* @return_param count int 浏览量
* @return_param status int 0:已发布,1:草稿
* @return_param contentType int 0:自定义,1:第三方链接
* @return_param editReason string 编辑理由
* @return_param time datetime 发布时间
* @return_param uptime datetime 更新时间

* @number 99
*/

  public async getList() {
    const { ctx } = this;
    let { page, pageSize } = ctx.request.query;
    page = page || '1';
    pageSize = pageSize || '10';
    const result = await ctx.service.news.getList(
      {
        page,
        pageSize,
      },
    );
    if (result) {
      ctx.helper.successBody(result);
    }
  }


  /**
* showdoc
* @catalog 管理后台/新闻管理/
* @title 获取新闻详情
* @description 获取新闻详情
* @method GET
* @url /admin/news/detail
* @header mysess 必选 string 校验字符串
* @param id 必选 string 新闻ID
* @return {"code":200,"message":"ok","data":{"id":14,"title":"1133232","categoryId":1,"categoryCode":"001","uri":"f8c803107e5c11eaa7fa7fbd3a0c3ff4","keywords":null,"thumbnail":null,"content":"22","abstract":null,"author":"admin","isVideo":null,"count":1,"status":1,"showStatus":null,"time":"2020-04-13 14:33:56","uptime":"2020-04-14 16:19:25","pcMenuIds":"1,2,3,4,5,6,7","appMenuIds":"2,3,4,5,6"}}
* @return_param id int 新闻id
* @return_param type int 新闻类型
* @return_param title string 新闻标题
* @return_param thumbnail string 图片
* @return_param content string 新闻内容
* @return_param abstract string 新闻简介
* @return_param author string 新闻作者
* @return_param count int 浏览量
* @return_param status int 0:已发布,1:草稿
* @return_param time datetime 发布时间
* @return_param uptime datetime 更新时间
* @return_param contentType int 0:自定义,1:第三方链接
* @return_param editReason string 编辑理由
* @return_param showStatus int 0:首页不显示,1:PC首页,2:APP首页,3:全部首页
* @number 99
*/

  public async getDetail() {
    const { ctx } = this;
    const { id } = ctx.request.query;
    const result = await ctx.service.news.getNewsDetail(id);

    if (result) {
      ctx.helper.successBody(result);
    }
  }

  /**
* showdoc
* @catalog 管理后台/新闻管理/
* @title 新建新闻
* @description 新建新闻
* @method POST
* @url /admin/news/add
* @header mysess 必选 string 校验字符串
* @param type 必选 int 新闻类型
* @param title 必选 string 新闻标题
* @param content 必选 string 新闻内容
* @param status 必选 int 0:发布,1:发布到草稿
* @param thumbnail 可选 string 图片
* @param abstract 可选 string 新闻简介
* @param contentType 可选 0:自定义,1:第三方链接
* @param editReason 可选 编辑理由
* @param showStatus 可选 0:首页不显示,1:PC首页,2:APP首页,3:全部首页
* @return {"code":200,"message":"ok","data":{"title":"112","categoryId":"1","content":"2112","status":"0","id":22,"uri":"ad0f54a0853711ea84ff47fbf9fcf70f","categoryCode":"001","count":1,"author":"顾伟","time":"2020-04-23T07:54:36.000Z","uptime":"2020-04-23T07:54:36.000Z"}}
* @return_param id int 新闻id
* @return_param type int 新闻类型
* @return_param title string 新闻标题
* @return_param thumbnail string 图片
* @return_param content string 新闻内容
* @return_param abstract string 新闻简介
* @return_param author string 新闻作者
* @return_param count int 浏览量
* @return_param status int 0:已发布,1:草稿
* @return_param time datetime 发布时间
* @return_param uptime datetime 更新时间
* @return_param contentType int 0:自定义,1:第三方链接
* @return_param editReason string 编辑理由
* @return_param showStatus int 0:首页不显示,1:PC首页,2:APP首页,3:全部首页
* @remark 返回参数参照列表
* @number 99
*/

  public async newNews() {
    const { ctx } = this;
    const validateResult = await ctx.validate('news.add', ctx.request.body);
    if (!validateResult) return;
    const result = await ctx.service.news.newNews(ctx.request.body);
    if (result) {
      ctx.helper.successBody(result);
    }
  }


  /**
* showdoc
* @catalog 管理后台/新闻管理/
* @title 修改新闻
* @description 修改新闻
* @method POST
* @url /admin/news/edit
* @header mysess 必选 string 校验字符串
* @param id 必选 int 新闻id
* @param type 必选 int 新闻类型
* @param title 必选 string 新闻标题
* @param content 必选 string 新闻内容
* @param status 必选 int 0:发布,1:发布到草稿
* @param thumbnail 可选 string 图片
* @param abstract 可选 string 新闻简介
* @param contentType 可选 0:自定义,1:第三方链接
* @param editReason 可选 编辑理由
* @param showStatus 可选 0:首页不显示,1:PC首页,2:APP首页,3:全部首页
* @return {"code":200,"message":"ok","data":{"title":"112","categoryId":"1","content":"2112","status":"0","id":22,"uri":"ad0f54a0853711ea84ff47fbf9fcf70f","categoryCode":"001","count":1,"author":"顾伟","time":"2020-04-23T07:54:36.000Z","uptime":"2020-04-23T07:54:36.000Z"}}
* @return_param id int 新闻id
* @return_param type int 新闻类型
* @return_param title string 新闻标题
* @return_param thumbnail string 图片
* @return_param content string 新闻内容
* @return_param abstract string 新闻简介
* @return_param author string 新闻作者
* @return_param count int 浏览量
* @return_param status int 0:已发布,1:草稿
* @return_param time datetime 发布时间
* @return_param uptime datetime 更新时间
* @return_param contentType int 0:自定义,1:第三方链接
* @return_param showStatus int 0:首页不显示,1:PC首页,2:APP首页,3:全部首页
* @return_param editReason string 编辑理由

* @remark 返回参数参照列表
* @number 99
*/

  public async editNews() {
    const { ctx } = this;
    const validateResult = await ctx.validate('news.edit', ctx.request.body);
    if (!validateResult) return;
    const result = await ctx.service.news.editNews(ctx.request.body);
    if (result) {
      ctx.helper.successBody();
    }
  }


  /**
* showdoc
* @catalog 管理后台/新闻管理/
* @title 删除新闻
* @description 删除新闻
* @method POST
* @url /admin/news/delete
* @header mysess 必选 string 校验字符串
* @param id 必选 int 新闻id

* @return {"code":200,"message":"ok","data":{}}

* @number 99
*/

  public async deleteNews() {
    const { ctx } = this;
    const validateResult = await ctx.validate('news.delete', ctx.request.body);
    if (!validateResult) return;
    const { id } = ctx.request.body;
    const result = await ctx.service.news.deleteNews(id);
    if (result) {
      ctx.helper.successBody();
    }
  }

  /**
* showdoc
* @catalog 前台/新闻/
* @title 新闻浏览计数
* @description 新闻浏览计数
* @method GET
* @url /news/counted
* @param id 必选 int 新闻id

* @return {"code":200,"message":"ok","data":{}}

* @number 99
*/


  public async counted() {
    const { ctx } = this;
    const validateResult = await ctx.validate('news.delete', ctx.request.query);
    if (!validateResult) return;
    const { id } = ctx.request.query;
    const result = await ctx.service.news.newsCounted(id);
    if (result) {
      ctx.helper.successBody();
    }
  }

}
