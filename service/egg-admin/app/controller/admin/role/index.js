'use strict';
const Controller = require('egg').Controller;
const addRole = require("./addRole");
const delRole = require("./delRole");
const updRole = require("./updRole");
const selRoleList = require("./selRoleList");

class UserController extends Controller {
  async addRole() {
    return addRole(this.ctx);
  }
  async delRole() {
    return delRole(this.ctx);
  }
  async updRole() {
    return updRole(this.ctx);
  }
  async selRoleList() {
    return selRoleList(this.ctx);
  }
}

module.exports = UserController;