// app/service/userInfo.js
const Service = require("egg").Service;

class userInfo extends Service {
  async selUserInfoByUuid(uuid){
    let sql = `select address,avatar,introduction,name,phone,registerTime,uuid,sex from AdminUserInfo where uuid='${uuid}'`;
    return await this.app.mysql.query(sql);
  }
}

module.exports = userInfo;
