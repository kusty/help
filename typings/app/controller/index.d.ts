// This file is created by egg-ts-helper@1.25.7
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportArticle from '../../../app/controller/article';
import ExportCategory from '../../../app/controller/category';
import ExportCommon from '../../../app/controller/common';
import ExportUser from '../../../app/controller/user';

declare module 'egg' {
  interface IController {
    article: ExportArticle;
    category: ExportCategory;
    common: ExportCommon;
    user: ExportUser;
  }
}
