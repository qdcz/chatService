'use strict';
let {codeMap,create_token} = require("../../../utils/index");
// 登出
module.exports = async function (ctx) {
    try{
        let token = ctx.headers['y-authentication'];
        // let redisResult = await ctx.app.redis.hdel('AdminUserTokens', token);
        let redisResult = await ctx.app.redis.del(token);
        if(redisResult==1){
            return ctx.body = Object.assign(codeMap('M200'),{msg:"注销成功！"});
        }else{
            throw Error("redis校验异常")
        }
    }catch(e){
        let txt = '/admin/logout 接口异常' + e;
        ctx.body = {msg:txt,code:500};
        console.log(txt)
    }
}  