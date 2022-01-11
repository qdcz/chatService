'use strict';
let {codeMap} = require("../../../utils/index");

// 查看角色列表
module.exports = async function (ctx) {
    try{
        const {pageSize,pageNumber} = ctx.request.body;
        if(!(pageSize && pageNumber)) return ctx.body = codeMap('M201');
        if(pageNumber=='0') return ctx.body = codeMap('M201');

        const total = await ctx.service.public.selCountByTable("AdminUserRole");
        const roleList = await ctx.service.adminRole.selRoleList((pageNumber-1)*pageSize,pageSize);
        return ctx.body = Object.assign(codeMap('M200'),{
            data:roleList,
            total:total[0]['count(*)'],
            pageSize,
            pageNumber
        });
    }catch(e){
        let txt = '/admin/roleList 接口异常' + e;
        ctx.body = {msg:txt,code:500};
        console.log(txt)
    }
}  