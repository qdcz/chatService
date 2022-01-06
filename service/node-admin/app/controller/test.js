const Controller = require('egg').Controller;

class TestController extends Controller {
  async list() {
    const ctx = this.ctx;
    const page = ctx.query.page || 1;
    // const dataList = await ctx.service.test.list(page);
    await this.ctx.render('test.tpl',[]);
  }
}

module.exports = TestController;