'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  // var auth = app.middleware.auth()
  router.post('/admin/register', controller.admin.user.index.register);  // 后台管理模板-注册
  router.post('/admin/login', controller.admin.user.index.login);  // 后台管理模板-登录
  router.post('/admin/logout',controller.admin.user.index.logout);  // 后台管理模板-登出
  router.put('/admin/userInfo', controller.admin.user.index.userInfo);  // 后台管理模板-完善个人信息
  router.post('/admin/userInfo', controller.admin.user.index.userInfo);  // 后台管理模板-查询个人信息
  router.delete('/admin/user', controller.admin.user.index.delUser);  // 后台管理模板-注销用户
  router.post('/admin/user', controller.admin.user.index.addUser);  // 后台管理模板-添加用户
  router.post('/admin/userList', controller.admin.user.index.userList);  // 后台管理模板-用户列表

  router.post('/admin/roleList', controller.admin.role.index.selRoleList);  // 后台管理模板-获取角色列表
  router.post('/admin/role', controller.admin.role.index.addRole);  // 后台管理模板-添加角色信息
  router.put('/admin/role', controller.admin.role.index.updRole);  // 后台管理模板-修改角色信息
  router.delete('/admin/role', controller.admin.role.index.delRole);  // 后台管理模板-删除角色


  router.post('/admin/router', controller.admin.router.index.addRouter);  // 后台管理模板-添加路由信息
  router.post('/admin/routerList', controller.admin.router.index.selRouterList);  // 后台管理模板-获取路由列表
  router.put('/admin/router', controller.admin.router.index.updRouter);  // 后台管理模板-修改路由信息
  router.delete('/admin/router', controller.admin.router.index.delRouter);  // 后台管理模板-删除路由

};
