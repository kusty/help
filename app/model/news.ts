/*
 * @Author: guwei
 * @Date: 2020-04-08 20:45:39
 * @Last Modified by: guwei
 * @Last Modified time: 2020-05-09 14:34:15
 */

module.exports = app => {
  const { STRING, INTEGER, DATE, TINYINT, TEXT } = app.Sequelize;

  const News = app.model.define('news', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    type: INTEGER, // 1.市场活动,2.官方发布,100:官网-媒体报道,101:官网-客户新闻,102:官网-生态,103:官网-产品发布 
    title: STRING(256),
    uri: STRING(64),
    thumbnail: STRING(128),
    content: TEXT('long'),
    abstract: STRING(256),
    author: STRING(32),
    contentType: TINYINT,
    editReason: STRING(256),
    count: INTEGER,
    status: TINYINT,
    showStatus: TINYINT, // 0:首页不显示,1:PC首页,2:APP首页,3:全部首页,
    time: DATE,
    uptime: DATE,
  }, {
    freezeTableName: true,
    timestamps: false,
  });
  News.sync({ alter: true });

  return News;
};
