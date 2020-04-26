/*
 * @Author: guwei
 * @Date: 2020-04-08 20:45:20
 * @Last Modified by: guwei
 * @Last Modified time: 2020-04-15 02:08:03
 */

module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const File = app.model.define('file', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    filename: STRING(128),
    path: STRING(128),
    store: STRING(32),
    mime: STRING(32),
    time: DATE,

  }, {
    freezeTableName: true,
    timestamps: false,
  });

  return File;
};
