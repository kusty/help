/*
 * @Author: guwei
 * @Date: 2020-04-08 20:44:57
 * @Last Modified by: guwei
 * @Last Modified time: 2020-05-27 20:17:44
 */

module.exports = app => {
  const { STRING, INTEGER, DATE, TINYINT } = app.Sequelize;

  const ArticleMenu = app.model.define('article_menus', {
    id: { type: INTEGER, primaryKey: true },
    menuId: {
      type: STRING(256),
      field: 'menuId',
    },
    menuType: {
      type: TINYINT,
      field: 'menuType'
    },
    createdAt: DATE,
    updatedAt: DATE,
  }, {
    freezeTableName: true,

  });

  return ArticleMenu;
};
