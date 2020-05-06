import { Application } from 'egg';

export default (app: Application) => {
  const { controller, router } = app;
  const { adminAuth } = app.middleware;

  router.get('/api/admin/common/pcMenu', adminAuth(), controller.common.getPcMenu);
  router.get('/api/admin/common/appMenu', adminAuth(), controller.common.getAppMenu);
  router.post('/api/admin/common/file/upload', adminAuth(), controller.common.uploadFile);
  router.get('/api/admin/common/file/list', adminAuth(), controller.common.getFileList);

  router.get('/api/admin/category/list', adminAuth(), controller.category.getCategoryList);
  router.post('/api/admin/category/add', adminAuth(), controller.category.newCategory);
  router.post('/api/admin/category/edit', adminAuth(), controller.category.editCategory);
  router.post('/api/admin/category/delete', adminAuth(), controller.category.deleteCategory);

  router.post('/api/admin/article/add', adminAuth(), controller.article.newArticle);
  router.post('/api/admin/article/delete', adminAuth(), controller.article.deleteArticle);
  router.post('/api/admin/article/edit', adminAuth(), controller.article.editArticle);
  router.get('/api/admin/article/list', adminAuth(), controller.article.getList);
  router.get('/api/admin/article/detail', adminAuth(), controller.article.getDetail);

  router.post('/api/admin/user/login', controller.user.login);

  router.get('/api/article/counted', controller.article.counted);
  router.get('/api/article/list', controller.article.counted);

};
