'use strict';
let {codeMap} = require("../../../utils/index");

// 查看角色信息
module.exports = async function (ctx) {
    try{
        const {uuid} = ctx.request.body;
        // if(!uuid) return ctx.body = codeMap('M201');

        const roleInfo = await ctx.service.adminRole.selRoleInfoByUuid(uuid);
        return ctx.body = Object.assign(codeMap('M200'),{
            data:roleInfo
        });
    }catch(e){
        let txt = '/admin/selRoleInfo 接口异常' + e;
        ctx.body = {msg:txt,code:500};
        console.log(txt)
    }
}  