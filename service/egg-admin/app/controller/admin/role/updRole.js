'use strict';
const {codeMap} = require("../../../utils/index");
// 更新角色信息
module.exports = async function (ctx) {
    try{
        const {uuid,roleName,roleMark,routerId} = ctx.request.body;
        if(!(roleName && roleMark && uuid)) return ctx.body = codeMap('M201');

        const updRoleInfoResult = await ctx.service.adminRole.updRoleByUuid(uuid,{roleName,roleMark,routerId})
        if(updRoleInfoResult.affectedRows==1){
            ctx.body = codeMap('M200')
        }else{
            throw Error("修改角色信息失败/该角色id无效")
        }
    }catch(e){
        let txt = '/admin/role 接口异常' + e;
        ctx.body = {msg:txt,code:500};
        console.log(txt)
    }
}  