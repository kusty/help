/*
 * @Author: guwei
 * @Date: 2020-04-08 20:45:20
 * @Last Modified by:   guwei
 * @Last Modified time: 2020-04-08 20:45:20
 */

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;

  const File = app.model.define('file', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    filename: STRING(32),
    path: STRING(32),
    store: STRING(32),
    mime: STRING(32),
    createdAt: DATE,
    updatedAt: DATE,
  }, {
    freezeTableName: true,
  });
  File.sync({ alter: true });
  return File;
};
