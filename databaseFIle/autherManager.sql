 --RBAC 通用模板

CREATE TABLE AdminUser (
    id varchar(32) NOT NULL,
    account varchar(255) COMMENT '账号',
    password varchar(255) COMMENT '密码',
    lastLoginTime timestamp(6) COMMENT '最后登录时间',
    roleId varchar(50) COMMENT '角色id',
    PRIMARY KEY (id)
) COMMENT='用户表';

CREATE TABLE AdminUserInfo (
    userId varchar(50) NOT NULL COMMENT '用户id 主键',
    name varchar(50) COMMENT '昵称',
    sex varchar(4) COMMENT '性别',
    phone varchar(32) COMMENT '联系方式',
    address varchar(255) COMMENT '住址',
    introduction varchar(255) COMMENT '个人简介',
    registerTime timestamp(6) COMMENT '注册时间',
    PRIMARY KEY (userId)
) COMMENT='用户信息表';

CREATE TABLE AdminUserRole (
    id varchar(32) NOT NULL COMMENT '角色id 主键',
    roleName varchar(50) COMMENT '角色名字',
    routerId varchar(255) COMMENT '路由id',
    PRIMARY KEY (id)
) COMMENT='用户角色表';

CREATE TABLE AdminUserRouter (
    id varchar(50) NOT NULL COMMENT '路由id 主键',
    name varchar(50) COMMENT '路由名字',
    rootid varchar(50) COMMENT '根级id',
    parentid varchar(50) COMMENT '父级id',
    icon varchar(50) COMMENT '路由图标',
    routerFnid varchar(255) COMMENT '功能id',
    PRIMARY KEY (id)
) COMMENT='用户路由表';

CREATE TABLE AdminUserRouterFunction (
    id varchar(50) NOT NULL COMMENT '功能id 主键',
    name varchar(50) COMMENT '功能名字',
    PRIMARY KEY (id)
) COMMENT='用户路由下功能表';
