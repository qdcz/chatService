'use strict';
const {codeMap} = require("../../../utils/index");
const uuidV4 = require("uuid-v4")
// 添加角色
module.exports = async function (ctx) {
    try{
        const {roleName,roleMark,routerId} = ctx.request.body;
        if(!(roleName && roleMark)) return ctx.body = codeMap('M201');
        const selRoleResult = await ctx.service.adminRole.selRoleNameIsRepeace(roleName)
        let count = selRoleResult[0]["count(*)"];
        if(count>=1) return ctx.body = codeMap("M211")
        const addResult = await ctx.service.adminRole.addRole(
            `
                '${uuidV4()}',
                '${roleName}',
                '${roleMark}',
                '${routerId}'
            `
        );
        if(addResult.affectedRows==1){
            return ctx.body = Object.assign(codeMap('M200'),{
                data:addResult
            });
        }else{
            throw Error("角色添加失败")
        }
    }catch(e){
        let txt = '/admin/role 接口异常' + e;
        ctx.body = {msg:txt,code:500};
        console.log(txt)
    }
}  