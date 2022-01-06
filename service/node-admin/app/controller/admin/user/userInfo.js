'use strict';
let {codeMap,create_token} = require("../../../utils/index");

// 查看/修改用户信息
module.exports = async function (ctx) {
    try{
        let token = ctx.headers['y-authentication'];
        let tokenInfo = ctx.app.jwt.verify(token,ctx.app.config.jwt.secret);
        let {exp,iat,account,auther,role} = tokenInfo;
        let id = await ctx.service.public.selectUserIdByAccount("AdminUser",account);
        if(id.length<=0) return ctx.body = codeMap('M207');
        id = id[0].id;

        if(ctx.request.method == 'POST'){  // 查信息
            let result = await ctx.service.adminUser.selectUserInfoByAccount(id);
            return ctx.body = Object.assign(codeMap('M200'),{data:result});
        }else if(ctx.request.method == 'PUT'){  // 修改信息
            let params = ctx.request.body;
            const result = await ctx.app.mysql.update('AdminUserInfo',params,{
                where: { userId: id }
            })
            return ctx.body = codeMap('M200');
        }
    }catch(e){
        let txt = '/cxyChat/userInfo 接口异常' + e;
        ctx.body = {msg:txt,code:500};
        console.log(txt)
    }
}  