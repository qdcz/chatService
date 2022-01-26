// app/service/userInfo.js
const Service = require("egg").Service;

class role extends Service {
    // 根据分页查询所有角色列表
  async selRoleList(offset=0,length=10) {
    let sql = `SELECT uuid,roleName,roleMark,routerId FROM AdminUserRole a JOIN (select id from AdminUserRole limit ${offset}, ${length}) b ON a.ID = b.id`;
    return await this.app.mysql.query(sql);
  }
    // 添加角色
  async addRole(valueStr){
    let sql = `insert into AdminUserRole (uuid,roleName,roleMark,routerId) values (${valueStr})`;
    return await this.app.mysql.query(sql);
  }
    // 查询角色名字是否重复(数量)
  async selRoleNameIsRepeace(roleName){
    let sql = `SELECT count(*) FROM AdminUserRole where roleName='${roleName}'`;
    return await this.app.mysql.query(sql);
  }
    // 根据uuid查询角色信息
  async selRoleInfoByUuid(uuid){
    let sql = `SELECT * FROM AdminUserRole where uuid='${uuid}'`;
    return await this.app.mysql.query(sql);
  }
    // 根据uuid更新角色信息
  async updRoleByUuid(uuid,updateObj){
    return await this.app.mysql.update('AdminUserRole',updateObj,{
      where: {
        uuid
      }
    })
  }
    // 根据uuid删除角色信息
  async delRoleByUuid(uuid){
    let sql = `delete from AdminUserRole where uuid='${uuid}'`;
    return await this.app.mysql.query(sql);
  }
}

module.exports = role;
