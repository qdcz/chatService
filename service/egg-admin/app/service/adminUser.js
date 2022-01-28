// app/service/userInfo.js
const Service = require("egg").Service;

class userInfo extends Service {
    // 根据uuid查询用户信息
  async selUserInfoByUuid(uuid){
    let sql = `select account,password,address,avatar,introduction,name,phone,registerTime,uuid,sex from AdminUserInfo a left join AdminUser b on a.uuid = b.uuid where a.uuid='${uuid}'`;
    return await this.app.mysql.query(sql);
  }
    // 查询用户信息列表
  async selUserList(offset=0,length=10){
    let sql = `select address,avatar,introduction,name,phone,registerTime,uuid,sex from AdminUserInfo a JOIN (select id from AdminUserInfo limit ${offset}, ${length}) b ON a.ID = b.id`;
    return await this.app.mysql.query(sql);
  }
    // 根据uuid删除用户
  async delUser(uuid){
    let sql = `delete a,b from AdminUserInfo a left join AdminUser b on a.uuid=b.uuid where a.uuid = '${uuid}'`;
    return await this.app.mysql.query(sql);
  }
}

module.exports = userInfo;
