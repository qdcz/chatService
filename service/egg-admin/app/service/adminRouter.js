// app/service/adminRouter.js
const Service = require("egg").Service;

const recursionDelRouter = (id)=>{

}


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
        let count = (await conn.query(`select count(*) from AdminUserRouter`))[0]["count(*)"];  // 查询路由总数量
        let delUuidList = await conn.query(`select uuid from AdminUserRouter where FIND_IN_SET(uuid, AdminUserRouter_GetChildNodesRecursion('${uuid}'));`); // 查询所有路由数据
        let delStr = ''
        delUuidList.forEach(i=>{
          console.log(i)
        })
        console.log(delUuidList)
        return 
        await conn.insert("AdminUser", { uuid:`${uuid}`,account,password });
        await conn.insert("AdminUserInfo", {
          uuid:`${uuid}`,
          registerTime:ctx.app.mysql.literals.now,
          avatar:"https://img2.baidu.com/it/u=2182014426,2379325530&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500"
        });
        await conn.commit();
        return ctx.body = codeMap('M200');
    } catch (err) {
        await conn.rollback();
        throw err;
    }

    // let sql = `delete from AdminUserRouter where uuid='${uuid}'`;
    // let sql = `delete from AdminUserRouter as a right join AdminUserRouter as b on a.parentId = b.uuid where a.uuid = '${uuid}'`;
    // console.log(sql)
    // let sql = `
    //   DELETE FROM AdminUserRouter
    //   WHERE uuid IN(
    //   SELECT aid FROM (
    //     SELECT A.uuid aid,B.uuid bid FROM AdminUserRouter A LEFT JOIN AdminUserRouter B
    //     ON A.parentid = B.uuid
    //     WHERE A.uuid = '${uuid}') C
    //   UNION 
    //   SELECT bid FROM (
    //     SELECT A.uuid aid,B.uuid bid FROM AdminUserRouter A LEFT JOIN AdminUserRouter B
    //     ON A.parentid = B.uuid
    //     WHERE A.uuid = '${uuid}') C
    //   )
    // `








    return await this.app.mysql.query(sql);
  }
}

module.exports = role;
