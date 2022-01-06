'use strict';
const Controller = require('egg').Controller;
const register = require("./register");
const login = require("./login");
const userInfo = require("./userInfo");
const logout = require("./logout");


class UserController extends Controller {
  async register() {
    return register(this.ctx);
  }
  async login() {
    return login(this.ctx);
  }
  async userInfo() {
    return userInfo(this.ctx);
  }
  async logout() {
    return logout(this.ctx);
  }
}

module.exports = UserController;