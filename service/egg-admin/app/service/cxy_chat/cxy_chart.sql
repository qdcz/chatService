
 --注意：这级不做权限管理 仅供个人使用
CREATE TABLE AdminUser (
    id varchar(32) NOT NULL,
    account varchar(50) COMMENT '账号',
    password varchar(50) COMMENT '密码',
    PRIMARY KEY (id)
) COMMENT='管理会员用户的用户表';


CREATE TABLE User (
    id varchar(32) NOT NULL,
    account varchar(50) COMMENT '账号',
    password varchar(50) COMMENT '密码',
    lastLoginTime timestamp(6) COMMENT '最后登录时间',
    loginFailCount TINYINT(32) COMMENT '登录失败次数',
    token varchar(255) COMMENT 'token',
    PRIMARY KEY (id)
) COMMENT='用户表（购买服务的用户）';


CREATE TABLE MemberUser (
    id varchar(32) NOT NULL,
    account varchar(50) COMMENT '账号',
    password varchar(50) COMMENT '密码',
    lastLoginTime timestamp(6) COMMENT '最后登录时间',
    loginFailCount TINYINT(32) COMMENT '登录失败次数',
    token varchar(255) COMMENT 'token',
    PRIMARY KEY (id)
) COMMENT='用户表（用户下的聊天用户表）';


CREATE TABLE UserInfo (
    userid varchar(50) NOT NULL COMMENT '用户id 主键',
    name varchar(50) COMMENT '昵称',
    sex varchar(4) COMMENT '性别',
    phone TINYINT(32) COMMENT '联系方式',
    address varchar(255) COMMENT '住址',
    introduction varchar(255) COMMENT '个人简介',
    status TINYINT(4) COMMENT '当前状态0离线1在线2隐身',
    registerTime timestamp(6) COMMENT '注册时间',
    PRIMARY KEY (userid)
) COMMENT='用户信息表（购买服务的用户信息表）';




CREATE TABLE Friend (
    id varchar(32) NOT NULL,
    userid varchar(50) COMMENT '用户id',
    friendid varchar(50) COMMENT '好友id',
    friendNotes varchar(50) COMMENT '好友备注',
    belongid varchar(50) COMMENT '所属分组id',
    PRIMARY KEY (id)
);




CREATE TABLE FriendGroups (
    id varchar(32) NOT NULL,
    userid varchar(50) COMMENT '用户id',
    groupName varchar(255) COMMENT '分组名字',
    PRIMARY KEY (id)
);




CREATE TABLE ChatRecord (
    id varchar(32) NOT NULL,
    messageContent Text(255) COMMENT '消息内容',
    messageType TINYINT(4) COMMENT '消息类型1文字2图片3视频4语音5混合',
    receiveStatus TINYINT(4) COMMENT '接收状态 1已读2未读',
    sendid varchar(50) COMMENT '发送者id',
    receiveid varchar(50) COMMENT '接收者id',
    PRIMARY KEY (id)
);




CREATE TABLE UserGroup (
    id varchar(50) NOT NULL COMMENT '群id 主键',
    createTime timestamp(6) COMMENT '创建时间',
    groupName varchar(50) COMMENT '群昵称',
    groupNotice varchar(255) COMMENT '群公告',
    groupIntroduce varchar(255) COMMENT '群简介',
    PRIMARY KEY (id)
);




CREATE TABLE GroupsToUser (
    userid varchar(32) NOT NULL COMMENT '用户id 主键',
    groupid varchar(50) COMMENT '群id',
    groupUserName varchar(50) COMMENT '群内用户昵称',
    PRIMARY KEY (userid)
);




CREATE TABLE GroupsMSGContent (
    id varchar(32) NOT NULL COMMENT '群消息id 主键',
    sendid varchar(50) COMMENT '发送者id',
    sendTime timestamp(6) COMMENT '发送时间',
    PRIMARY KEY (id)
);

