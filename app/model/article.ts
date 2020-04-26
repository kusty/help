/*
 * @Author: guwei
 * @Date: 2020-04-08 20:45:39
 * @Last Modified by: guwei
 * @Last Modified time: 2020-04-14 14:58:23
 */

module.exports = app => {
  const { STRING, INTEGER, DATE, TINYINT, TEXT } = app.Sequelize;

  const Article = app.model.define('article', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    categoryId: INTEGER,
    categoryCode: STRING(64),
    title: STRING(256),
    uri: STRING(64),
    keywords: STRING(64),
    thumbnail: STRING(128),
    content: TEXT('long'),
    abstract: STRING(256),
    author: STRING(32),
    isVideo: TINYINT,
    count: INTEGER,
    status: TINYINT,
    showStatus: TINYINT, // 0:首页不显示,1:PC首页,2:APP首页,3:全部首页
    time: {
      type: DATE,

    },
    uptime: DATE,
  }, {
    freezeTableName: true,
    timestamps: false,

  });
  Article.associate = () => {
    app.model.Article.hasOne(
      app.model.ArticleMenu,
      {
        foreignKey: 'id',
        as: 'pcMenu',
      });

    app.model.Article.hasOne(
      app.model.ArticleMenuApp,
      {
        foreignKey: 'id',
        as: 'appMenu',
      });
  };
  return Article;
};
