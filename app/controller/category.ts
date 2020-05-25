/*
 * @Author: guwei ;
 * @Date: 2020-04-12 15:38:12 ;
 * @Last Modified by: guwei
 * @Last Modified time: 2020-05-09 02:06:37
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

  public async updateCategoryStatus() {
    const { ctx } = this;
    const validateResult = await ctx.validate('category.delete', ctx.request.body);
    if (!validateResult) return;
    const result = await ctx.service.category.updateCategoryStatus(ctx.request.body);
    if (result) {
      ctx.helper.successBody();
    }
  }

  /**
* showdoc
* @catalog 前台/文章/
* @title 获取分类列表
* @description 获取分类列表
* @method GET
* @url /category/list
* @param categoryCode 可选 string 分类code,不传取所有,传了取其子分类列表
* @return {"code":200,"message":"ok","data":[{"id":2001,"code":"002001","name":"会员营销","pid":2,"displayIndex":2,"isNotShow":0,"title":"会员营销","children":[{"id":2001005,"code":"002001005","name":"业绩分析","pid":2001,"displayIndex":0,"isNotShow":0,"title":"业绩分析"},{"id":2001002,"code":"002001002","name":"会员资产","pid":2001,"displayIndex":1,"isNotShow":0,"title":"会员资产"},{"id":2001003,"code":"002001003","name":"会员分组","pid":2001,"displayIndex":2,"isNotShow":0,"title":"会员分组"},{"id":2001007,"code":"002001007","name":"营销活动","pid":2001,"displayIndex":3,"isNotShow":0,"title":"营销活动"},{"id":2001004,"code":"002001004","name":"电子优惠券","pid":2001,"displayIndex":3,"isNotShow":0,"title":"电子优惠券"}]},{"id":2002,"code":"002002","name":"业务规则","pid":2,"displayIndex":3,"isNotShow":0,"title":"业务规则","children":[{"id":2002003,"code":"002002003","name":"会员权益","pid":2002,"displayIndex":1,"isNotShow":0,"title":"会员权益"},{"id":2002004,"code":"002002004","name":"数据定义","pid":2002,"displayIndex":1,"isNotShow":0,"title":"数据定义"},{"id":2002007,"code":"002002007","name":"短信模板","pid":2002,"displayIndex":3,"isNotShow":0,"title":"短信模板"},{"id":2002006,"code":"002002006","name":"会员标签","pid":2002,"displayIndex":4,"isNotShow":0,"title":"会员标签"},{"id":2002005,"code":"002002005","name":"电子券维护","pid":2002,"displayIndex":5,"isNotShow":0,"title":"电子券维护"},{"id":2002008,"code":"002002008","name":"门店支付","pid":2002,"displayIndex":6,"isNotShow":0,"title":"门店支付"},{"id":2002010,"code":"002002010","name":"外部渠道","pid":2002,"displayIndex":7,"isNotShow":0,"title":"外部渠道"},{"id":2002009,"code":"002002009","name":"评价管理","pid":2002,"displayIndex":7,"isNotShow":0,"title":"评价管理"}]},{"id":2003,"code":"002003","name":"数据中心","pid":2,"displayIndex":4,"isNotShow":0,"title":"数据中心","children":[{"id":2003001,"code":"002003001","name":"消费者数据","pid":2003,"displayIndex":0,"isNotShow":0,"title":"消费者数据"},{"id":2003009,"code":"002003009","name":"目标管理","pid":2003,"displayIndex":1,"isNotShow":0,"title":"目标管理"},{"id":2003005,"code":"002003005","name":"门店录单","pid":2003,"displayIndex":2,"isNotShow":0,"title":"门店录单"},{"id":2003007,"code":"002003007","name":"会员评价","pid":2003,"displayIndex":3,"isNotShow":0,"title":"会员评价"},{"id":2003002,"code":"002003002","name":"券活动分析","pid":2003,"displayIndex":3,"isNotShow":0,"title":"券活动分析"},{"id":2003006,"code":"002003006","name":"短信统计","pid":2003,"displayIndex":3,"isNotShow":0,"title":"短信统计"},{"id":2003014,"code":"002003014","name":"会员销售","pid":2003,"displayIndex":4,"isNotShow":0,"title":"会员销售"},{"id":2003004,"code":"002003004","name":"消费者积分","pid":2003,"displayIndex":4,"isNotShow":0,"title":"消费者积分"},{"id":2003008,"code":"002003008","name":"移动支付","pid":2003,"displayIndex":8,"isNotShow":0,"title":"移动支付"},{"id":2003012,"code":"002003012","name":"会员解绑","pid":2003,"displayIndex":9,"isNotShow":0,"title":"会员解绑"},{"id":2003011,"code":"002003011","name":"使用统计","pid":2003,"displayIndex":9,"isNotShow":0,"title":"使用统计"},{"id":2003013,"code":"002003013","name":"异常信息","pid":2003,"displayIndex":10,"isNotShow":0,"title":"异常信息"}]},{"id":2004,"code":"002004","name":"移动管理","pid":2,"displayIndex":5,"isNotShow":0,"title":"移动管理","children":[{"id":2004010,"code":"002004010","name":"公众号授权","pid":2004,"displayIndex":0,"isNotShow":0,"title":"公众号授权"},{"id":2004009,"code":"002004009","name":"自定义菜单","pid":2004,"displayIndex":1,"isNotShow":0,"title":"自定义菜单"},{"id":2004013,"code":"002004013","name":"自动回复","pid":2004,"displayIndex":3,"isNotShow":0,"title":"自动回复"},{"id":2004012,"code":"002004012","name":"图文素材","pid":2004,"displayIndex":4,"isNotShow":0,"title":"图文素材"},{"id":2004014,"code":"002004014","name":"群发消息","pid":2004,"displayIndex":5,"isNotShow":0,"title":"群发消息"},{"id":2004011,"code":"002004011","name":"页面管理","pid":2004,"displayIndex":6,"isNotShow":0,"title":"页面管理"},{"id":2004008,"code":"002004008","name":"模板消息","pid":2004,"displayIndex":7,"isNotShow":0,"title":"模板消息"},{"id":2004015,"code":"002004015","name":"支付配置","pid":2004,"displayIndex":8,"isNotShow":0,"title":"支付配置"},{"id":2004016,"code":"002004016","name":"带参二维码","pid":2004,"displayIndex":9,"isNotShow":0,"title":"带参二维码"},{"id":2004017,"code":"002004017","name":"微页面","pid":2004,"displayIndex":10,"isNotShow":0,"title":"微页面"}]},{"id":2009,"code":"002009","name":"基础设置","pid":2,"displayIndex":6,"isNotShow":0,"title":"基础设置","children":[{"id":2009002,"code":"002009002","name":"门店管理","pid":2009,"displayIndex":2,"isNotShow":0,"title":"门店管理"},{"id":2009004,"code":"002009004","name":"商品管理","pid":2009,"displayIndex":3,"isNotShow":0,"title":"商品管理"},{"id":2009003,"code":"002009003","name":"员工管理","pid":2009,"displayIndex":3,"isNotShow":0,"title":"员工管理"},{"id":2009001,"code":"002009001","name":"数据导入","pid":2009,"displayIndex":4,"isNotShow":0,"title":"数据导入"}]},{"id":2007,"code":"002007","name":"营销工具","pid":2,"displayIndex":7,"isNotShow":0,"title":"营销工具","children":[{"id":2007007,"code":"002007007","name":"门店摇一摇","pid":2007,"displayIndex":0,"isNotShow":0,"title":"门店摇一摇"},{"id":2007010,"code":"002007010","name":"扫码领券","pid":2007,"displayIndex":2,"isNotShow":0,"title":"扫码领券"},{"id":2007009,"code":"002007009","name":"互动中心","pid":2007,"displayIndex":3,"isNotShow":0,"title":"互动中心"},{"id":2007013,"code":"002007013","name":"导购线上销售2.0","pid":2007,"displayIndex":4,"isNotShow":0,"title":"导购线上销售2.0"},{"id":2007008,"code":"002007008","name":"门店图文","pid":2007,"displayIndex":5,"isNotShow":0,"title":"门店图文"},{"id":2007005,"code":"002007005","name":"门店送券","pid":2007,"displayIndex":6,"isNotShow":0,"title":"门店送券"},{"id":2007017,"code":"002007017","name":"积分兑券","pid":2007,"displayIndex":7,"isNotShow":0,"title":"积分兑券"},{"id":2007011,"code":"002007011","name":"积分兑礼","pid":2007,"displayIndex":8,"isNotShow":0,"title":"积分兑礼"},{"id":2007014,"code":"002007014","name":"预约管理","pid":2007,"displayIndex":9,"isNotShow":0,"title":"预约管理"},{"id":2007015,"code":"002007015","name":"总部批量送券","pid":2007,"displayIndex":10,"isNotShow":0,"title":"总部批量送券"},{"id":2007012,"code":"002007012","name":"会员任务","pid":2007,"displayIndex":12,"isNotShow":0,"title":"会员任务"},{"id":2007020,"code":"002007020","name":"礼品卡","pid":2007,"displayIndex":12,"isNotShow":0,"title":"礼品卡"},{"id":2007021,"code":"002007021","name":"门店满送","pid":2007,"displayIndex":12,"isNotShow":0,"title":"门店满送"},{"id":2007022,"code":"002007022","name":"现金红包","pid":2007,"displayIndex":13,"isNotShow":0,"title":"现金红包"},{"id":2007023,"code":"002007023","name":"附近小程序","pid":2007,"displayIndex":14,"isNotShow":0,"title":"附近小程序"}]},{"id":2008,"code":"002008","name":"工作管理","pid":2,"displayIndex":8,"isNotShow":0,"title":"工作管理","children":[{"id":2008007,"code":"002008007","name":"营销助手","pid":2008,"displayIndex":0,"isNotShow":0,"title":"营销助手"},{"id":2008009,"code":"002008009","name":"服务申请","pid":2008,"displayIndex":2,"isNotShow":0,"title":"服务申请"},{"id":2008003,"code":"002008003","name":"内部社区","pid":2008,"displayIndex":4,"isNotShow":0,"title":"内部社区"},{"id":2008006,"code":"002008006","name":"任务管理","pid":2008,"displayIndex":4,"isNotShow":0,"title":"任务管理"},{"id":2008010,"code":"002008010","name":"图片空间","pid":2008,"displayIndex":5,"isNotShow":0,"title":"图片空间"},{"id":2008008,"code":"002008008","name":"消息通知","pid":2008,"displayIndex":6,"isNotShow":0,"title":"消息通知"},{"id":2008011,"code":"002008011","name":"会员回访","pid":2008,"displayIndex":7,"isNotShow":0,"title":"会员回访"},{"id":2008012,"code":"002008012","name":"会员销售机会管理","pid":2008,"displayIndex":8,"isNotShow":0,"title":"会员销售机会管理"},{"id":2008013,"code":"002008013","name":"目标管理V2","pid":2008,"displayIndex":8,"isNotShow":0,"title":"目标管理V2"}]},{"id":2012,"code":"002012","name":"我的账户","pid":2,"displayIndex":9,"isNotShow":0,"title":"我的账户","children":[{"id":2012001,"code":"002012001","name":"订购门店","pid":2012,"displayIndex":0,"isNotShow":0,"title":"订购门店"}]},{"id":2013,"code":"002013","name":"日志查询","pid":2,"displayIndex":10,"isNotShow":0,"title":"日志查询","children":[{"id":2013001,"code":"002013001","name":"接口日志","pid":2013,"displayIndex":1,"isNotShow":0,"title":"接口日志"},{"id":2013002,"code":"002013002","name":"迁移日志","pid":2013,"displayIndex":1,"isNotShow":0,"title":"迁移日志"}]}]}

* @number 99
*/

  public async getArticleCategoryList() {
    const { ctx } = this;
    const { categoryCode } = ctx.request.query;
    const result = await ctx.service.article.getArticleCategoryList(categoryCode);
    if (result) {
      ctx.helper.successBody(result);
    }
  }

}
