'use strict';
let {codeMap} = require("../../../utils/index");

// 查看/修改用户信息
module.exports = async function (ctx) {
    try{
        let {uuid} = ctx.request.body;

        let token=null,
            tokenInfo = null;
        if(!uuid){
            // 查询token携带的uuid信息
            token = ctx.headers['y-authentication'];
            tokenInfo = ctx.app.jwt.verify(token,ctx.app.config.jwt.secret);
            uuid = tokenInfo.uuid;
        }
        
        if(ctx.request.method == 'POST'){  // 查信息
            let result = await ctx.service.adminUser.selUserInfoByUuid(uuid);
            return ctx.body = Object.assign(codeMap('M200'),{data:result[0]});
        }else if(ctx.request.method == 'PUT'){ 
            let params = ctx.request.body;
            const conn = await ctx.app.mysql.beginTransaction(); // 初始化事务
            try {
                // TODO 改造成sql语句   写连表更新
                await ctx.app.mysql.update('AdminUser',params,{
                    where: { uuid },
                    columns: [ 'password', 'roleId' ]
                })
                await ctx.app.mysql.update('AdminUserInfo',params,{
                    where: { uuid },
                    columns: [ 'avatar', 'introduction','name','phone','sex']
                })
                await conn.commit();
                return ctx.body = codeMap('M200');
            } catch (err) {
                await conn.rollback();
                throw err;
                return null;
            }
        }
    }catch(e){
        let txt = '/admin/userInfo 接口异常' + e;
        ctx.body = {msg:txt,code:500};
        console.log(txt)
    }
}  