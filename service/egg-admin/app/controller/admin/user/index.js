'use strict';
const Controller = require('egg').Controller;
const register = require("./register");
const login = require("./login");
const userInfo = require("./userInfo");
const logout = require("./logout");
const userList = require("./userList");

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
  async userList() {
    return userList(this.ctx);
  }
}

module.exports = UserController;