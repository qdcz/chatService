'use strict';

/** @type Egg.EggPlugin */
// module.exports = {
//   // had enabled by egg
//   // static: {
//   //   enable: true,
//   // }
// };

module.exports = {
  cors:{
    enable: true,
    package: 'egg-cors',
  },
  // 模板引擎插件
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks'
  },
  // mysql数据库插件
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },
  jwt: {
    enable: true,
    package: 'egg-jwt',
  },
  // redis数据库
  redis: {
    enable: true,
    package: 'egg-redis',
  },
}
