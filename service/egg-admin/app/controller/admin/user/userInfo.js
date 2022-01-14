'use strict';
let {codeMap,create_token} = require("../../../utils/index");

// 查看/修改用户信息
module.exports = async function (ctx) {
    try{
        let token = ctx.headers['y-authentication'];
        let tokenInfo = ctx.app.jwt.verify(token,ctx.app.config.jwt.secret);
        let {uuid} = tokenInfo;

        if(ctx.request.method == 'POST'){  // 查信息
            let result = await ctx.service.adminUser.selUserInfoByUuid(uuid);
            return ctx.body = Object.assign(codeMap('M200'),{data:result[0]});
        }else if(ctx.request.method == 'PUT'){  // 修改信息
            let params = ctx.request.body;
            const result = await ctx.app.mysql.update('AdminUserInfo',params,{
                where: {
                    uuid
                }
            })
            return ctx.body = codeMap('M200');
        }
    }catch(e){
        let txt = '/admin/userInfo 接口异常' + e;
        ctx.body = {msg:txt,code:500};
        console.log(txt)
    }
}  