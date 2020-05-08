// This file is created by egg-ts-helper@1.25.7
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportArticle from '../../../app/service/Article';
import ExportCache from '../../../app/service/Cache';
import ExportCategory from '../../../app/service/Category';
import ExportCommon from '../../../app/service/Common';
import ExportNews from '../../../app/service/News';
import ExportUser from '../../../app/service/User';

declare module 'egg' {
  interface IService {
    article: AutoInstanceType<typeof ExportArticle>;
    cache: AutoInstanceType<typeof ExportCache>;
    category: AutoInstanceType<typeof ExportCategory>;
    common: AutoInstanceType<typeof ExportCommon>;
    news: AutoInstanceType<typeof ExportNews>;
    user: AutoInstanceType<typeof ExportUser>;
  }
}
