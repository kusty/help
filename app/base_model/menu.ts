/*
 * @Author: guwei
 * @Date: 2020-04-08 20:44:57
 * @Last Modified by: guwei
 * @Last Modified time: 2020-05-27 15:32:55
 */

module.exports = app => {
  const { STRING, INTEGER } = app.Sequelize;

  const Menu = app.baseModel.define('pf_busi_menu_dtl', {
    Id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    TreePId: INTEGER,
    Name: STRING(16),
    MenuFuncId: INTEGER(11),
    IsActive: STRING(1),
  }, {
    freezeTableName: true,
    timestamps: false,
  });
  return Menu;
};
