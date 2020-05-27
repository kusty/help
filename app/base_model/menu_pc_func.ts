/*
 * @Author: guwei
 * @Date: 2020-04-08 20:44:57
 * @Last Modified by: guwei
 * @Last Modified time: 2020-05-27 15:32:34
 */

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const MenuPcFunc = app.baseModel.define('pf_busi_menu_func', {
    Id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    Name: STRING(16),
    Url: STRING(120),
    Href: STRING(64),
  }, {
    freezeTableName: true,
    timestamps: false,
  });
  return MenuPcFunc;
};
