/*
 * @Author: guwei
 * @Date: 2019-10-22 20:57:52
 * @Last Modified by: guwei
 * @Last Modified time: 2020-04-10 14:52:18
 */

module.exports = app => {
  const { STRING, INTEGER, DATE, TINYINT } = app.Sequelize;

  const User = app.model.define('user', {
    id: { type: INTEGER, primaryKey: true },
    name: STRING(32),
    phone: STRING(32),
    department: STRING(32),
    avatar: STRING(128),
    role: TINYINT(2),
    createdAt: DATE,
    updatedAt: DATE,
  });

  return User;
};
