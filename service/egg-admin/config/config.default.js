/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1640655520336_8996';

  // add your middleware config here
  config.middleware = ['auth'];
  // set auth.js file parameter
  config.auth = {
    enable:true,  // global config(If you want to configure it separately, please turn it off first)
    match(ctx) {
      // add no verification router list
      let noVerificationRouterList = ['/','/admin/register','/admin/login'];
      // ignore no verification router
      return noVerificationRouterList.findIndex(i=>i==ctx.url)==-1;
    },
    title: 'this is auth'
  };

  
  // template engine
  config.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks',
    },
  }
  // Database query correlation
  config.mysqlConfig = {
    pageSize: 10,
  };
  // About security related configuration
  config.security = {
    csrf:{
      enable:false,
      ignoreJSON: true,
    },
    domainWhiteList: ['*'], // Cross domain white list
  }
  // add to json web token config
  config.jwt = {
    secret: "qddscxy666",  // Custom sequence
    expiration:1000*60*10  // expiration time
  }
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH,OPTIONS',
  };
  
  

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
