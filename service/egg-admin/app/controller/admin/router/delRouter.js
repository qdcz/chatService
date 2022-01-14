'use strict';
const {codeMap} = require("../../../utils/index");
// 删除路由信息
module.exports = async function (ctx) {
    try{
        const {uuid} = ctx.request.body;
        if(!(uuid)) return ctx.body = codeMap('M201');

        const selRouterResult = await ctx.service.adminRouter.delRouterByUuid(uuid)
        console.log(selRouterResult)

        if(selRouterResult.affectedRows==1){
            ctx.body = codeMap('M200')
        }else{
            throw Error("删除路由信息失败/路由id无效！")
        }
    }catch(e){
        let txt = '/admin/router 接口异常' + e;
        ctx.body = {msg:txt,code:500};
        console.log(txt)
    }
}  