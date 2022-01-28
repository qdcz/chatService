
'use strict';
const {codeMap} = require("../../../utils/index");
// 删除用户
module.exports = async function (ctx) {
    try{
        const {uuid} = ctx.request.body;
        if(!(uuid)) return ctx.body = codeMap('M201');

        const Result = await ctx.service.adminUser.delUser(uuid)
        if(Result.affectedRows>=1){
            ctx.body = codeMap('M200')
        }else{
            throw Error("删除用户信息失败/用户id无效！")
        }
    }catch(e){
        let txt = '/admin/delUser 接口异常' + e;
        ctx.body = {msg:txt,code:500};
        console.log(txt)
    }
}  