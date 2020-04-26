/*
 * @Author: guwei
 * @Date: 2020-04-08 20:44:57
 * @Last Modified by: guwei
 * @Last Modified time: 2020-04-14 14:19:21
 */

module.exports = app => {
  const { STRING, INTEGER, DATE, TINYINT } = app.Sequelize;

  const ArticleMenu = app.model.define('article_menu', {
    id: { type: INTEGER, primaryKey: true },
    menuId: STRING(256),
    menuType: TINYINT,
    createdAt: DATE,
    updatedAt: DATE,
  }, {
    freezeTableName: true,

  });

  return ArticleMenu;
};
