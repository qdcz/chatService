// mysql数据库配置
exports.mysql = {
  // 单数据库信息配置
  client: {
    // host
    // host: '192.168.237.128',
    host: '192.168.16.128',
    // 端口号
    port: '3306',
    // 用户名
    user: 'root',
    // 密码
    password: '123456',
    // 数据库名
    database: 'yrh_chart',
  },
  // 是否加载到 app 上，默认开启
  app: true,
  // 是否加载到 agent 上，默认关闭
  agent: false,
};

// redis 配置
exports.redis = {
  Redis: require('ioredis'),
  client: {
    port: 6379,          // Redis port
    // host: '192.168.237.128',   // Redis host
    host: '192.168.16.128',
    name:"default",
    password: '123456',
    db:1,
  },
  app: true,
  agent: false,
};

exports.cluster = {
  listen: {
    path: "",
    port: 5301,
    // hostname:"0.0.0.0"
    hostname: "127.0.0.1"
  }
}

