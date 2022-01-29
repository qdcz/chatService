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
    const conn = await this.app.mysql.beginTransaction(); // 初始化事务
    try {
        // 功能拆解-方便后期维护
        let delUuidList = await conn.query(`select uuid from AdminUserRouter where FIND_IN_SET(uuid, AdminUserRouter_GetChildNodesRecursion('${uuid}'));`); // 查询所有路由数据
        let delArr = [];
        delUuidList.forEach((i)=>delArr.push(i.uuid));
        let deleteResult = null;
        if(delArr.length>0){
          let scopeStr = "";
          delArr.forEach((i,index)=>scopeStr += `'${i}'${index<delArr.length-1?',':''}`)
          deleteResult = await conn.query(`delete from AdminUserRouter where uuid in (${scopeStr})`);  // 删除指定的所有路由
          await conn.commit();
        }
        return deleteResult
    } catch (err) {
        await conn.rollback();
        throw err;
        return null;
    }
  }
}

module.exports = role;
