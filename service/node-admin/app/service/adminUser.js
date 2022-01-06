// app/service/userInfo.js
const Service = require("egg").Service;

class userInfo extends Service {
  async selectUserInfoByAccount(account) {
    let sql = `select * from AdminUserInfo where userId='${account}'`;
    return await this.app.mysql.query(sql);
  }
}

module.exports = userInfo;
