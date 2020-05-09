/*
 * @Author: guwei ;
 * @Date: 2020-04-12 15:38:12 ;
 * @Last Modified by: guwei
 * @Last Modified time: 2020-05-09 15:25:37
 */
import { Controller } from 'egg';

export default class ArticleController extends Controller {

  /**
* showdoc
* @catalog 管理后台/文章管理/
* @title 获取文章列表
* @description 获取文章列表
* @method GET
* @url /admin/article/list
* @header mysess 必选 string 校验字符串
* @param page 可选 string 当面页，默认1
* @param pageSize 可选 string 每页数据，默认20
* @param search 可选 string 搜索关键字
* @return {"code":200,"message":"ok","data":{"list":[{"id":3,"categoryId":1,"categoryCode":"001","title":"112","uri":"529730507da411eaacfb512774dec231","keywords":null,"thumbnail":null,"content":"2112","abstract":null,"author":null,"isVideo":null,"count":1,"status":0,"showStatus":null,"time":"2020-04-14 00:32:10","uptime":"2020-04-14 00:32:10"}],"totalCount":19,"current":1}}
* @return_param id int 文章id
* @return_param categoryId int 分类id
* @return_param categoryCode string 分类code
* @return_param title string 文章标题
* @return_param keywords string 标签，逗号分隔
* @return_param thumbnail string 图片
* @return_param content string 文章内容
* @return_param abstract string 文章简介
* @return_param author string 文章作者
* @return_param isVideo int 是否是视频
* @return_param count int 浏览量
* @return_param status int 0:已发布,1:草稿
* @return_param showStatus int 0:首页不显示,1:PC首页,2:APP首页,3:全部首页
* @return_param time datetime 发布时间
* @return_param uptime datetime 更新时间

* @number 99
*/

  public async getList() {
    const { ctx } = this;
    let { page, pageSize } = ctx.request.query;
    page = page || '1';
    pageSize = pageSize || '10';
    const result = await ctx.service.article.getList(
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
* @catalog 管理后台/文章管理/
* @title 获取文章详情
* @description 获取文章详情
* @method GET
* @url /admin/article/detail
* @header mysess 必选 string 校验字符串
* @param id 必选 string 文章ID
* @return {"code":200,"message":"ok","data":{"id":14,"title":"1133232","categoryId":1,"categoryCode":"001","uri":"f8c803107e5c11eaa7fa7fbd3a0c3ff4","keywords":null,"thumbnail":null,"content":"22","abstract":null,"author":"admin","isVideo":null,"count":1,"status":1,"showStatus":null,"time":"2020-04-13 14:33:56","uptime":"2020-04-14 16:19:25","pcMenuIds":"1,2,3,4,5,6,7","appMenuIds":"2,3,4,5,6"}}
* @return_param id int 文章id
* @return_param categoryId int 分类id
* @return_param categoryCode string 分类code
* @return_param title string 文章标题
* @return_param keywords string 标签，逗号分隔
* @return_param thumbnail string 图片
* @return_param content string 文章内容
* @return_param abstract string 文章简介
* @return_param author string 文章作者
* @return_param isVideo int 是否是视频
* @return_param count int 浏览量
* @return_param status int 0:已发布,1:草稿
* @return_param showStatus int 0:首页不显示,1:PC首页,2:APP首页,3:全部首页
* @return_param time datetime 发布时间
* @return_param uptime datetime 更新时间

* @number 99
*/

  public async getDetail() {
    const { ctx } = this;
    const { id } = ctx.request.query;
    const result = await ctx.service.article.getArticleDetail(id);

    if (result) {
      ctx.helper.successBody(result);
    }
  }

  /**
* showdoc
* @catalog 管理后台/文章管理/
* @title 新建文章
* @description 新建文章
* @method POST
* @url /admin/article/add
* @header mysess 必选 string 校验字符串
* @param categoryId 必选 int 分类id
* @param title 必选 string 文章标题
* @param content 必选 string 文章内容
* @param status 必选 int 0:发布,1:发布到草稿
* @param keywords 可选 string 标签，逗号分隔
* @param thumbnail 可选 string 图片
* @param abstract 可选 string 文章简介
* @param isVideo 可选 int 是否是视频
* @param showStatus 可选 0:首页不显示,1:PC首页,2:APP首页,3:全部首页
* @param pcMenuIds 可选 string 文章关联的pc菜单id
* @param appMenuIds 可选 string 文章关联的app菜单id
* @param contentType 可选 0:自定义,1:第三方链接
* @param editReason 可选 编辑理由
* @return {"code":200,"message":"ok","data":{"title":"112","categoryId":"1","content":"2112","status":"0","id":22,"uri":"ad0f54a0853711ea84ff47fbf9fcf70f","categoryCode":"001","count":1,"author":"顾伟","time":"2020-04-23T07:54:36.000Z","uptime":"2020-04-23T07:54:36.000Z"}}
* @return_param id int 文章id
* @return_param categoryId int 分类id
* @return_param categoryCode string 分类code
* @return_param title string 文章标题
* @return_param keywords string 标签，逗号分隔
* @return_param thumbnail string 图片
* @return_param content string 文章内容
* @return_param abstract string 文章简介
* @return_param author string 文章作者
* @return_param isVideo int 是否是视频
* @return_param count int 浏览量
* @return_param status int 0:已发布,1:草稿
* @return_param showStatus int 0:首页不显示,1:PC首页,2:APP首页,3:全部首页
* @return_param time datetime 发布时间
* @return_param uptime datetime 更新时间

* @remark 返回参数参照列表
* @number 99
*/

  public async newArticle() {
    const { ctx } = this;
    const validateResult = await ctx.validate('article.add', ctx.request.body);
    if (!validateResult) return;
    const result = await ctx.service.article.newArticle(ctx.request.body);
    if (result) {
      ctx.helper.successBody(result);
    }
  }


  /**
* showdoc
* @catalog 管理后台/文章管理/
* @title 修改文章
* @description 修改文章
* @method POST
* @url /admin/article/edit
* @header mysess 必选 string 校验字符串
* @param id 必选 int 文章id
* @param categoryId 必选 int 分类id
* @param title 必选 string 文章标题
* @param content 必选 string 文章内容
* @param status 必选 int 0:发布,1:发布到草稿
* @param keywords 可选 string 标签，逗号分隔
* @param thumbnail 可选 string 图片
* @param abstract 可选 string 文章简介
* @param isVideo 可选 int 是否是视频
* @param showStatus 可选 0:首页不显示,1:PC首页,2:APP首页,3:全部首页
* @param contentType 可选 0:自定义,1:第三方链接
* @param editReason 可选 编辑理由
* @param showStatus 可选 0:首页不显示,1:PC首页,2:APP首页,3:全部首页
* @param pcMenuIds 可选 string 文章关联的pc菜单id
* @param appMenuIds 可选 string 文章关联的app菜单id
* @return {"code":200,"message":"ok","data":{"title":"112","categoryId":"1","content":"2112","status":"0","id":22,"uri":"ad0f54a0853711ea84ff47fbf9fcf70f","categoryCode":"001","count":1,"author":"顾伟","time":"2020-04-23T07:54:36.000Z","uptime":"2020-04-23T07:54:36.000Z"}}
* @return_param id int 文章id
* @return_param categoryId int 分类id
* @return_param categoryCode string 分类code
* @return_param title string 文章标题
* @return_param keywords string 标签，逗号分隔
* @return_param thumbnail string 图片
* @return_param content string 文章内容
* @return_param abstract string 文章简介
* @return_param author string 文章作者
* @return_param isVideo int 是否是视频
* @return_param count int 浏览量
* @return_param status int 0:已发布,1:草稿
* @return_param showStatus int 0:首页不显示,1:PC首页,2:APP首页,3:全部首页
* @return_param time datetime 发布时间
* @return_param uptime datetime 更新时间

* @remark 返回参数参照列表
* @number 99
*/

  public async editArticle() {
    const { ctx } = this;
    const validateResult = await ctx.validate('article.edit', ctx.request.body);
    if (!validateResult) return;
    const result = await ctx.service.article.editArticle(ctx.request.body);
    if (result) {
      ctx.helper.successBody();
    }
  }


  /**
* showdoc
* @catalog 管理后台/文章管理/
* @title 删除文章
* @description 删除文章
* @method POST
* @url /admin/article/delete
* @header mysess 必选 string 校验字符串
* @param id 必选 int 文章id

* @return {"code":200,"message":"ok","data":{}}

* @number 99
*/

  public async deleteArticle() {
    const { ctx } = this;
    const validateResult = await ctx.validate('article.delete', ctx.request.body);
    if (!validateResult) return;
    const { id } = ctx.request.body;
    const result = await ctx.service.article.deleteArticle(id);
    if (result) {
      ctx.helper.successBody();
    }
  }

  /**
* showdoc
* @catalog 前台/文章/
* @title 文章浏览计数
* @description 文章浏览计数
* @method GET
* @url /article/counted
* @param id 必选 int 文章id

* @return {"code":200,"message":"ok","data":{}}

* @number 99
*/


  public async counted() {
    const { ctx } = this;
    const validateResult = await ctx.validate('article.delete', ctx.request.query);
    if (!validateResult) return;
    const { id } = ctx.request.query;
    const result = await ctx.service.article.articleCounted(id);
    if (result) {
      ctx.helper.successBody();
    }
  }

  /**
 * showdoc
 * @catalog 前台/文章/
 * @title 获取首页文章列表
 * @description 获取首页文章列表
 * @method GET
 * @url /main/article/list
 * @param type 必选 string 文章类型,hot:最热文章;recent:最新文章
 * @param categoryCode 必选 string 分类的code
 * @return {"code":200,"message":"ok","data":[{"id":23,"categoryId":1001,"categoryCode":"001001","title":"112","uri":"4522cf80914d11ea8cbb479ed8680227","keywords":null,"thumbnail":null,"content":"2112","abstract":null,"author":"顾伟","isVideo":null,"contentType":0,"editReason":null,"count":1,"status":0,"showStatus":null,"time":"2020-05-09 00:59:24","uptime":"2020-05-09 00:59:24"},{"id":14,"categoryId":1,"categoryCode":"001","title":"1133232","uri":"f8c803107e5c11eaa7fa7fbd3a0c3ff4","keywords":null,"thumbnail":null,"content":"22","abstract":null,"author":"admin","isVideo":null,"contentType":1,"editReason":"12121221","count":1,"status":1,"showStatus":null,"time":"2020-04-13 14:33:56","uptime":"2020-05-08 15:26:21"},{"id":22,"categoryId":1,"categoryCode":"001","title":"112","uri":"ad0f54a0853711ea84ff47fbf9fcf70f","keywords":null,"thumbnail":null,"content":"2112","abstract":null,"author":"顾伟","isVideo":null,"contentType":null,"editReason":null,"count":1,"status":0,"showStatus":null,"time":"2020-04-23 07:54:36","uptime":"2020-04-23 07:54:36"},{"id":21,"categoryId":1,"categoryCode":"001","title":"112","uri":"6d099c707f0211eaa7ced3cf35b250fd","keywords":null,"thumbnail":null,"content":"2112","abstract":null,"author":"顾伟","isVideo":null,"contentType":null,"editReason":null,"count":1,"status":0,"showStatus":null,"time":"2020-04-15 10:18:18","uptime":"2020-04-15 10:18:18"},{"id":20,"categoryId":1,"categoryCode":"001","title":"112","uri":"48f884907f0211eab217fd5b98b8faac","keywords":null,"thumbnail":null,"content":"2112","abstract":null,"author":"顾伟","isVideo":null,"contentType":null,"editReason":null,"count":1,"status":0,"showStatus":null,"time":"2020-04-15 10:17:17","uptime":"2020-04-15 10:17:17"}]}

 * @number 99
 */

  public async getListForMain() {
    const { ctx } = this;
    let { type, categoryCode } = ctx.request.query;
    type = type || 'hot';
    const result = await ctx.service.article.getListForMain(
      {
        type,
        categoryCode,
      },
    );
    if (result) {
      ctx.helper.successBody(result);
    }
  }

  /**
 * showdoc
 * @catalog 前台/文章/
 * @title 获取分类下文章列表
 * @description 获取分类下文章列表
 * @method GET
 * @url /category/article/list
 * @param categoryCode 可选 string 分类的code
 * @return {"code":200,"message":"ok","data":{"list":[{"id":23,"categoryId":1001,"categoryCode":"001001","title":"112","uri":"4522cf80914d11ea8cbb479ed8680227","keywords":null,"thumbnail":null,"content":"2112","abstract":null,"author":"顾伟","isVideo":null,"contentType":0,"editReason":null,"count":1,"status":0,"showStatus":null,"time":"2020-05-09 00:59:24","uptime":"2020-05-09 00:59:24"}],"totalCount":1,"current":1}}

 * @number 99
 */

  public async getCategoryArticleList() {
    const { ctx } = this;
    let { categoryCode, page, pageSize } = ctx.request.query;
    page = page || '1';
    pageSize = pageSize || '10';
    const result = await ctx.service.article.getCategoryArticleList(
      {
        page,
        pageSize,
        categoryCode,
      },
    );
    if (result) {
      ctx.helper.successBody(result);
    }
  }

  /**
* showdoc
* @catalog 前台/文章/
* @title 获取标签列表
* @description 获取标签列表
* @method GET
* @url /article/keywords/list
* @param type 必选 string 标签类型,hot:最热;all:所有
* @return {"code":200,"message":"ok","data":["qw","das","qew","问问","wqeq","wqeqw","你好","我去","ceshi"]}

* @number 99
*/

  public async getKeywordsList() {
    const { ctx } = this;
    let { type } = ctx.request.query;
    type = type || 'all';
    const result = await ctx.service.article.getKeywordsList(type);
    if (result) {
      ctx.helper.successBody(result);
    }
  }

  /**
* showdoc
* @catalog 前台/文章/
* @title 获取文章详情
* @description 获取文章详情
* @method GET
* @url /article/detail
* @param uri 必选 string 文章的uri
* @return {"code":200,"message":"ok","data":{"id":14,"title":"1133232","categoryId":1,"categoryCode":"001","uri":"f8c803107e5c11eaa7fa7fbd3a0c3ff4","keywords":null,"thumbnail":null,"content":"22","abstract":null,"author":"admin","isVideo":null,"count":1,"status":1,"showStatus":null,"contentType":1,"editReason":"12121221","time":"2020-04-13 14:33:56","uptime":"2020-05-08 15:26:21","pcMenuIds":"1,2,3,4,5,6,7","appMenuIds":"2,3,4,5,6"}}

* @number 99
*/

  public async getArticleDetailByUri() {
    const { ctx } = this;
    const { uri } = ctx.request.query;
    const result = await ctx.service.article.getArticleDetailByUri(uri);
    if (result) {
      ctx.helper.successBody(result);
    }
  }

  /**
* showdoc
* @catalog 前台/文章/
* @title 获取标签下文章列表
* @description 获取标签下文章列表
* @method GET
* @url /keywords/article/list
* @param keywords 可选 string 标签名
* @return {"code":200,"message":"ok","data":{"list":[{"id":23,"categoryId":1001,"categoryCode":"001001","title":"112","uri":"4522cf80914d11ea8cbb479ed8680227","keywords":null,"thumbnail":null,"content":"2112","abstract":null,"author":"顾伟","isVideo":null,"contentType":0,"editReason":null,"count":1,"status":0,"showStatus":null,"time":"2020-05-09 00:59:24","uptime":"2020-05-09 00:59:24"}],"totalCount":1,"current":1}}

* @number 99
*/

  public async getKeywordsArticleList() {
    const { ctx } = this;
    let { keywords, page, pageSize } = ctx.request.query;
    page = page || '1';
    pageSize = pageSize || '10';
    const result = await ctx.service.article.getKeywordsArticleList(
      {
        page,
        pageSize,
        keywords,
      },
    );
    if (result) {
      ctx.helper.successBody(result);
    }
  }


  /**
  * showdoc
  * @catalog 前台/文章/
  * @title 获取文章列表(搜索)
  * @description 获取文章列表(搜索)
  * @method GET
  * @url /article/list
  * @param search 可选 string 搜索内容
  * @return {"code":200,"message":"ok","data":{"list":[{"id":23,"categoryId":1001,"categoryCode":"001001","title":"112","uri":"4522cf80914d11ea8cbb479ed8680227","keywords":null,"thumbnail":null,"content":"2112","abstract":null,"author":"顾伟","isVideo":null,"contentType":0,"editReason":null,"count":1,"status":0,"showStatus":null,"time":"2020-05-09 00:59:24","uptime":"2020-05-09 00:59:24"}],"totalCount":1,"current":1}}

  * @number 99
  */

  public async getAllArticleList() {
    const { ctx } = this;
    let { search, page, pageSize } = ctx.request.query;
    page = page || '1';
    pageSize = pageSize || '10';
    const result = await ctx.service.article.getAllArticleList(
      {
        page,
        pageSize,
        search,
      },
    );
    if (result) {
      ctx.helper.successBody(result);
    }
  }

}
