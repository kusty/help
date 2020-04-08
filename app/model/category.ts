/*
 * @Author: guwei
 * @Date: 2020-04-08 20:44:57
 * @Last Modified by:   guwei
 * @Last Modified time: 2020-04-08 20:44:57
 */

module.exports = app => {
  const { STRING, INTEGER, DATE, TINYINT } = app.Sequelize;

  const Category = app.model.define('category', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    code: INTEGER,
    name: STRING(32),
    pid: INTEGER,
    level: INTEGER,
    displayIndex: INTEGER,
    isNotShow: TINYINT,
    createdAt: DATE,
    updatedAt: DATE,
  }, {
    freezeTableName: true,
  });
  Category.sync({ alter: true });
  return Category;
};
