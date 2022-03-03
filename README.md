# chatService

一个很牛逼的聊天服务

```js
// 数据库文件
databaseFile
// 前端
client			   
// 后端
service
```

# rpac-admin

一个基于node开发的权限管控后台管理系统模板

服务端：node语言，egg框架

客户端：js语言，vue2.0框架，vue-admin-template模板

数据库：mysql、redis

## 服务器环境配置推荐：

Os：centos7

Mysql Version 8.0.27

Redis Version：6.2.6

Node Version：14.15.4

## 导入数据库建表文件

```shell
# 克隆项目
git clone https://github.com/qdcz/chatService.git

# 进入databaseFile文件夹内
cd /databaseFile

# autherManager.sql 是仅包含建表结构sql文件
# yrh_chart.sql 	是包含建表结构和数据的sql文件
# 使用navicat或其它数据库管理工具将sql文件导入并运行
```

## 服务端运行方式

```shell
# 克隆项目
git clone https://github.com/qdcz/chatService.git

# 进入service文件夹内
cd /service/egg-admin

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

## 客户端运行方式

```shell
# 克隆项目
git clone https://github.com/qdcz/chatService.git

# 进入client端文件夹内
cd /client/rpac-admin

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装以来，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```



## 功能点：

1.用户注册

2.用户登录（jwt签证校验、redis缓存token可注销）

3.系统管理 (具备了增删改查、分页、模糊)

​	3.1系统用户管理（用户动态配置角色信息来达到控制菜单）（TODO:一个用户可以分配多个角色）

​	3.2角色管理（角色可灵活配置路由）

​	3.3路由管理（动态路由配置，路由名字、路径、页面、归属关系可动态配置）（TODO:归属关系可灵活/拖拽配置）

## TODO LIST

```

```

