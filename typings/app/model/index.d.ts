// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportArticle from '../../../app/model/article';
import ExportArticleMenu from '../../../app/model/article_menu';
import ExportArticleMenuApp from '../../../app/model/article_menu_app';
import ExportCategory from '../../../app/model/category';
import ExportFile from '../../../app/model/file';
import ExportNews from '../../../app/model/news';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    Article: ReturnType<typeof ExportArticle>;
    ArticleMenu: ReturnType<typeof ExportArticleMenu>;
    ArticleMenuApp: ReturnType<typeof ExportArticleMenuApp>;
    Category: ReturnType<typeof ExportCategory>;
    File: ReturnType<typeof ExportFile>;
    News: ReturnType<typeof ExportNews>;
    User: ReturnType<typeof ExportUser>;
  }
}
