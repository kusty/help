/*
 * @Author: guwei
 * @Date: 2020-04-08 20:45:39
 * @Last Modified by:   guwei
 * @Last Modified time: 2020-04-08 20:45:39
 */

module.exports = app => {
  const { STRING, INTEGER, DATE, TINYINT, LONGTEXT } = app.Sequelize;

  const Article = app.model.define('article', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    categoryId: INTEGER,
    categoryCode: INTEGER,
    title: STRING(256),
    uri: STRING(64),
    keywords: STRING(64),
    thumbnail: STRING(128),
    content: LONGTEXT,
    abstract: STRING(256),
    author: STRING(32),
    isVideo: TINYINT,
    count: INTEGER,
    status: TINYINT,
    showStatus: TINYINT,
    createdAt: DATE,
    updatedAt: DATE,
  }, {
    freezeTableName: true,
  });
  Article.sync({ alter: true });
  return Article;
};
