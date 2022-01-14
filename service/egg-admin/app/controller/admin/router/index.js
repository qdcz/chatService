
'use strict';
const Controller = require('egg').Controller;
const addRouter = require("./addRouter");
const delRouter = require("./delRouter");
const updRouter = require("./updRouter");
const selRouterList = require("./selRouterList");

class UserController extends Controller {
  async addRouter() {
    return addRouter(this.ctx);
  }
  async delRouter() {
    return delRouter(this.ctx);
  }
  async updRouter() {
    return updRouter(this.ctx);
  }
  async selRouterList() {
    return selRouterList(this.ctx);
  }
}

module.exports = UserController;