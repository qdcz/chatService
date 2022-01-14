// app/service/adminRouter.js
const Service = require("egg").Service;

class role extends Service {
    // 添加角色
  async addRouter(valueStr){
    let sql = `insert into AdminUserRouter (uuid,routerName,rootId,parentId,icon,routerFnId) values (${valueStr})`;
    return await this.app.mysql.query(sql);
  }
    // 查询路由名字是否重复
  async selRouterNameIsRepeace(routerName){
    let sql = `SELECT count(*) FROM AdminUserRouter where routerName='${routerName}'`;
    return await this.app.mysql.query(sql);
  }
    // 根据分页查询所有路由列表
  async selRouterList(offset=0,length=10) {
    let sql = `SELECT uuid,routerName,rootId,parentId,icon,routerFnId FROM AdminUserRouter a JOIN (select id from AdminUserRouter limit ${offset}, ${length}) b ON a.ID = b.id`;
    return await this.app.mysql.query(sql);
  }
    // 根据uuid更新路由信息
  async updRouterByUuid(uuid,updateObj) {
    return await this.app.mysql.update('AdminUserRouter',updateObj,{
      where: {
        uuid
      }
    })
  }
    // 根据uuid删除路由信息
  async delRouterByUuid(uuid){
    let sql = `delete from AdminUserRouter where uuid='${uuid}'`;
    return await this.app.mysql.query(sql);
  }
}

module.exports = role;
