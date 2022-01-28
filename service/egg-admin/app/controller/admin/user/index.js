'use strict';
const Controller = require('egg').Controller;
const register = require("./register");
const login = require("./login");
const userInfo = require("./userInfo");
const logout = require("./logout");
const userList = require("./userList");
const addUser = require("./addUser");
const delUser = require("./delUser");


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
  async addUser() {
    return addUser(this.ctx);
  }
  async delUser() {
    return delUser(this.ctx);
  }
}

module.exports = UserController;