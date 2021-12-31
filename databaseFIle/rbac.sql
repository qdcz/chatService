 --RBAC 通用模板

CREATE TABLE AdminUser (
    id varchar(32) NOT NULL,
    account varchar(50) COMMENT '账号',
    password varchar(50) COMMENT '密码',
    lastLoginTime timestamp(6) COMMENT '最后登录时间',
    PRIMARY KEY (id)
) COMMENT='用户表';

CREATE TABLE AdminUserInfo (
    userid varchar(50) NOT NULL COMMENT '用户id 主键',
    name varchar(50) COMMENT '昵称',
    sex varchar(4) COMMENT '性别',
    phone TINYINT(32) COMMENT '联系方式',
    address varchar(255) COMMENT '住址',
    introduction varchar(255) COMMENT '个人简介',
    registerTime timestamp(6) COMMENT '注册时间',
    role varchar(50) COMMENT '角色',
    PRIMARY KEY (userid)
) COMMENT='用户信息表';

CREATE TABLE AdminUserRole (
    id varchar(32) NOT NULL,
    PRIMARY KEY (id),
) COMMENT='用户角色表';

CREATE TABLE AdminUserRouter (
    userid varchar(50) NOT NULL COMMENT '用户id 主键',
) COMMENT='用户路由表';

CREATE TABLE AdminUserFunction (
    userid varchar(50) NOT NULL COMMENT '用户id 主键',
) COMMENT='用户路由下功能权限表';
