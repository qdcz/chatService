'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;

  // var auth = app.middleware.auth()
  router.get('/', controller.home.index);
  router.get('/test', controller.test.list);
  router.post('/admin/register', controller.admin.user.index.register);  // 后台管理模板-注册
  router.post('/admin/login', controller.admin.user.index.login);  // 后台管理模板-登录
  router.post('/admin/logout',controller.admin.user.index.logout);  // 后台管理模板-登出
  router.put('/admin/userInfo', controller.admin.user.index.userInfo);  // 后台管理模板-完善个人信息
  router.post('/admin/userInfo', controller.admin.user.index.userInfo);  // 后台管理模板-查询个人信息
  router.delete('/admin/user', controller.admin.user.index.register);  // 后台管理模板-注销用户
};
