'use strict';
const {codeMap} = require("../../../utils/index");
// 删除角色信息
module.exports = async function (ctx) {
    try{
        const {uuid} = ctx.request.body;
        if(!(uuid)) return ctx.body = codeMap('M201');

        const selRoleResult = await ctx.service.adminRole.delRoleByUuid(uuid)
        console.log(selRoleResult)

        if(selRoleResult.affectedRows==1){
            ctx.body = codeMap('M200')
        }else{
            throw Error("删除角色信息失败或角色信息已被删除！")
        }
    }catch(e){
        let txt = '/admin/role 接口异常' + e;
        ctx.body = {msg:txt,code:500};
        console.log(txt)
    }
}  