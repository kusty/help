/*
 * @Author: guwei
 * @Date: 2020-04-08 20:44:57
 * @Last Modified by: guwei
 * @Last Modified time: 2020-04-08 20:50:32
 */

module.exports = app => {
  const { STRING, INTEGER, DATE, TINYINT } = app.Sequelize;

  const ArticleMenuApp = app.model.define('article_menu_app', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    menuId: STRING(256),
    menuType: TINYINT,
    createdAt: DATE,
    updatedAt: DATE,
  }, {
    freezeTableName: true,
  });
  ArticleMenuApp.sync({ alter: true });
  return ArticleMenuApp;
};
