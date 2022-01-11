const Service = require('egg').Service;

class TestService extends Service {
  async list(page = 1) {
    // read config
    const { serverUrl, pageSize } = this.config.mysql;
    
    const user = await this.app.mysql.query('select * from dgg_sjtj_zs');
    console.log(user)




    // use build-in http client to GET hacker-news api
    const { data: idList } = await this.ctx.curl(`${serverUrl}/topstories.json`, {
      data: {
        orderBy: '"$key"',
        startAt: `"${pageSize * (page - 1)}"`,
        endAt: `"${pageSize * page - 1}"`,
      },
      dataType: 'json',
    });

    // parallel GET detail
    const newsList = await Promise.all(
      Object.keys(idList).map(key => {
        const url = `${serverUrl}/item/${idList[key]}.json`;
        return this.ctx.curl(url, { dataType: 'json' });
      })
    );
    return newsList.map(res => res.data);
  }
  async selectAll(table){
    return await this.app.mysql.query(`select * from ${table}`)
  }
}

module.exports = TestService;