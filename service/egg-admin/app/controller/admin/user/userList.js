'use strict';
let {codeMap} = require("../../../utils/index");

// 查看用户信息列表
module.exports = async function (ctx) {
    try{
        const {pageSize,pageNumber} = ctx.request.body;
        console.log(pageSize,pageNumber)
        if(!(pageSize && pageNumber)) return ctx.body = codeMap('M201');
        if(pageNumber=='0') return ctx.body = codeMap('M201');

        const total = await ctx.service.public.selCountByTable("AdminUser");
        const userList = await ctx.service.adminUser.selUserList((pageNumber-1)*pageSize,pageSize);
        return ctx.body = Object.assign(codeMap('M200'),{
            data:userList,
            total:total[0]['count(*)'],
            pageSize,
            pageNumber
        });
    }catch(e){
        let txt = '/admin/userList 接口异常' + e;
        ctx.body = {msg:txt,code:500};
        console.log(txt)
    }
}  