// app/service/userInfo.js
const Service = require("egg").Service;

class userInfo extends Service {
    // 根据uuid查询用户信息
  async selUserInfoByUuid(uuid){
    let sql = `select address,avatar,introduction,name,phone,registerTime,uuid,sex from AdminUserInfo where uuid='${uuid}'`;
    return await this.app.mysql.query(sql);
  }
    // 查询用户信息列表
  async selUserList(offset=0,length=10){
    let sql = `select address,avatar,introduction,name,phone,registerTime,uuid,sex from AdminUserInfo a JOIN (select id from AdminUserInfo limit ${offset}, ${length}) b ON a.ID = b.id`;
    return await this.app.mysql.query(sql);s
  }
}

module.exports = userInfo;
