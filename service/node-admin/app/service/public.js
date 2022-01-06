// app/service/news.js
const Service = require("egg").Service;

class publicApi extends Service {
  logQuery(query){
    // console.log(query)
    return query
  }
  async selectUserIdByAccount(table,account){
    let sql = `select id from ${table} where account='${account}'`;
    return await this.app.mysql.query(this.logQuery(sql));
  }
  async selectAll(table) {
    let sql = `select * from ${table}`;
    return await this.app.mysql.query(this.logQuery(sql));
  }
  async selectTableById(table,id){
    let sql = `select * from ${table} where id=${id}`;
    return await this.app.mysql.query(this.logQuery(sql));
  }
  async selectTableBySingleField(table,key,value){
    let sql = `select * from ${table} where ${key}='${value}'`;
    return await this.app.mysql.query(this.logQuery(sql));
  }
  async selectTableByDoubleField(table,key1,value1,key2,value2){
    let sql = `select * from ${table} where ${key1}='${value1}' and ${key2}='${value2}'`;
    return await this.app.mysql.query(this.logQuery(sql));
  }
  async insertTable(table,insertObj){
    // 框架建议写法
    return await this.app.mysql.insert(table,this.logQuery(insertObj));
    // let keyStr = '',
    //     valueStr = '';
    // for(let i in keys) keyStr = keyStr + i + ",";
    // for(let i in valueStr) valueStr = valueStr + i + ",";
    // keyStr = keyStr.slice(0,-1)
    // valueStr = valueStr.slice(0,-1)
    // let sql = `insert into ${table} (${keyStr}) VALUES ('Wilson', 'Champs-Elysees')`;
    // return await this.app.mysql.query(this.logQuery(sql));
  }
}

module.exports = publicApi;
