/*
 * @Author: guwei
 * @Date: 2020-04-08 20:44:57
 * @Last Modified by: guwei
 * @Last Modified time: 2020-04-13 21:25:46
 */

module.exports = app => {
  const { STRING, INTEGER, TINYINT } = app.Sequelize;

  const Category = app.model.define('category', {
    id: { type: INTEGER, primaryKey: true },
    code: {
      type: STRING(64),
    },
    name: STRING(32),
    pid: INTEGER,
    displayIndex: INTEGER,
    isNotShow: {
      type: TINYINT(1),
      defaltValue: 0,
    },
  }, {
    freezeTableName: true,
    timestamps: false,
  });

  return Category;
};
