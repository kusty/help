/*
 * @Author: guwei
 * @Date: 2020-04-08 20:44:57
 * @Last Modified by: guwei
 * @Last Modified time: 2020-04-12 12:32:46
 */

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const MenuApp = app.baseModel.define('pf_sapp_menu', {
    Id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    ParentId: INTEGER,
    Name: STRING(16),
    IsActive: STRING(1),
  }, {
    freezeTableName: true,
    timestamps: false,
  });
  return MenuApp;
};
