/*
 * @Author: guwei ;
 * @Date: 2020-04-12 15:38:12 ;
 * @Last Modified by: guwei
 * @Last Modified time: 2020-04-25 21:23:42
 */
import { Controller } from 'egg';

export default class CommonController extends Controller {

  /**
* showdoc
* @catalog 管理后台/文章管理/
* @title 获取PC菜单列表
* @description 获取PC菜单列表
* @method GET
* @url /admin/common/pcMenu
* @header mysess 必选 string 校验字符串

* @return {"code":200,"message":"ok","data":[{"id":10001,"pid":0,"name":"会员营销"},{"id":10002,"pid":0,"name":"业务规则","children":[{"id":19774,"pid":10002,"name":"外部渠道","children":[{"id":19775,"pid":19774,"name":"注册渠道"},{"id":19776,"pid":19774,"name":"京东设置"}]}]},{"id":10003,"pid":0,"name":"移动管理","children":[{"id":19726,"pid":10003,"name":"支付配置","children":[{"id":19727,"pid":19726,"name":"公众号支付"},{"id":19728,"pid":19726,"name":"小程序支付"}]},{"id":19767,"pid":10003,"name":"微页面"}]},{"id":10004,"pid":0,"name":"基础设置"},{"id":10005,"pid":0,"name":"商城管理","children":[{"id":100120705,"pid":10005,"name":"数据看板","children":[{"id":100120706,"pid":100120705,"name":"销售看板"}]}]},{"id":10006,"pid":0,"name":"工作管理","children":[{"id":19750,"pid":10006,"name":"会员回访","children":[{"id":19751,"pid":19750,"name":"回访设置"},{"id":19753,"pid":19750,"name":"回访统计"},{"id":19754,"pid":19750,"name":"回访月报"}]},{"id":19779,"pid":10006,"name":"会员销售机会管理"}]}]}
* @return_param id int 菜单id
* @return_param pid int 菜单父级id
* @return_param name string 菜单名称
* @return_param children array 菜单的子集
* @number 99
*/


  public async getPcMenu() {
    const { ctx } = this;
    const result = await ctx.service.common.getPcMenu();
    if (result) {
      ctx.helper.successBody(result);
    }
  }

  /**
* showdoc
* @catalog 管理后台/文章管理/
* @title 获取App菜单列表
* @description 获取App菜单列表
* @method GET
* @url /admin/common/appMenu
* @header mysess 必选 string 校验字符串

* @return {"code":200,"message":"ok","data":[{"id":46,"pid":0,"name":"线上分销","children":[{"id":53,"pid":46,"name":"朋友圈"},{"id":54,"pid":46,"name":"活动专题"},{"id":55,"pid":46,"name":"分享商品"},{"id":56,"pid":46,"name":"收益"},{"id":57,"pid":46,"name":"提现"},{"id":58,"pid":46,"name":"排名"}]},{"id":47,"pid":0,"name":"首页"},{"id":48,"pid":0,"name":"业绩看板"},{"id":49,"pid":0,"name":"会员中心","children":[{"id":11,"pid":49,"name":"我的会员"},{"id":17,"pid":49,"name":"会员分组"},{"id":52,"pid":49,"name":"生日营销"}]},{"id":50,"pid":0,"name":"消息","children":[{"id":29,"pid":50,"name":"新的消费者"},{"id":30,"pid":50,"name":"品牌消息"},{"id":31,"pid":50,"name":"IM"}]},{"id":51,"pid":0,"name":"工作台","children":[{"id":2,"pid":51,"name":"送券"},{"id":3,"pid":51,"name":"邀请入会"},{"id":4,"pid":51,"name":"营销活动"},{"id":6,"pid":51,"name":"积分兑券"},{"id":7,"pid":51,"name":"门店业绩"},{"id":9,"pid":51,"name":"门店业绩排名"},{"id":10,"pid":51,"name":"会员业绩排名"},{"id":12,"pid":51,"name":"会员评价"},{"id":14,"pid":51,"name":"导购管理"},{"id":16,"pid":51,"name":"线上销售"},{"id":20,"pid":51,"name":"门店图文"},{"id":21,"pid":51,"name":"我的任务"},{"id":23,"pid":51,"name":"销售日报"},{"id":24,"pid":51,"name":"买单/券核销"},{"id":25,"pid":51,"name":"核销记录"},{"id":26,"pid":51,"name":"我的粉丝"},{"id":27,"pid":51,"name":"会员业绩"},{"id":32,"pid":51,"name":"目标管理"},{"id":33,"pid":51,"name":"预约管理"},{"id":34,"pid":51,"name":"会员关怀"},{"id":35,"pid":51,"name":"会员开卡"},{"id":36,"pid":51,"name":"门店订单"},{"id":37,"pid":51,"name":"会员招募"},{"id":38,"pid":51,"name":"历史会员线上化"},{"id":39,"pid":51,"name":"会员销售机会管理"},{"id":40,"pid":51,"name":"订单核销"},{"id":41,"pid":51,"name":"扫码扣积分"},{"id":42,"pid":51,"name":"招募会员"},{"id":43,"pid":51,"name":"导购收银"},{"id":44,"pid":51,"name":"礼品卡核销"},{"id":45,"pid":51,"name":"收入分析"}]}]}
* @return_param id int 菜单id
* @return_param pid int 菜单父级id
* @return_param name string 菜单名称
* @return_param children array 菜单的子集
* @number 99
*/

  public async getAppMenu() {
    const { ctx } = this;
    const result = await ctx.service.common.getAppMenu();
    if (result) {
      ctx.helper.successBody(result);
    }
  }

  /**
* showdoc
* @catalog 管理后台/文章管理/
* @title 上传文件
* @description 上传文件
* @method POST
* @url /admin/common/file/upload
* @header mysess 必选 string 校验字符串
* @param file 必选 file 图片文件
* @return {"code":200,"message":"ok","data":{"filename":"WechatIMG850.jpg","mime":"image/jpeg","path":"2020/4/b0ebf6613dd3d01534f1a0f77043e40a.jpg"}}
* @return_param filename string 文件名
* @return_param mime string 文件类型
* @return_param path string 文件路径
* @number 99
*/

  public async uploadFile() {
    const { ctx } = this;
    const result = await ctx.service.common.uploadImage();
    if (result) {
      ctx.helper.successBody(result);
    } else {
      ctx.helper.errorBody(10001, '上传失败');
    }
  }

  /**
* showdoc
* @catalog 管理后台/文章管理/
* @title 获取图片列表
* @description 获取图片列表
* @method GET
* @url /admin/common/file/list
* @header mysess 必选 string 校验字符串
* @param page 可选 int 页码
* @param pageSize 可选 int 分页大小
* @return {"code":200,"message":"ok","data":{"list":[{"id":2,"filename":"3.png","path":"2020/4/10fb15c77258a991b0028080a64fb42d.png","store":"oss","mime":"image/png","time":"2020-04-14 18:08:52"}],"totalCount":6,"current":1}}
* @return_param filename string 文件名
* @return_param mime string 文件类型
* @return_param path string 文件路径
* @return_param time string 上传时间
* @number 99
*/

  public async getFileList() {
    const { ctx } = this;
    let { page, pageSize } = ctx.request.query;
    page = page || '1';
    pageSize = pageSize || '10';
    const result = await ctx.service.common.getFileList(
      {
        page,
        pageSize,
      },
    );

    if (result) {
      ctx.helper.successBody(result);
    }
  }
}
