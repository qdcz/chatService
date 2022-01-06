'use strict';
let {codeMap,create_token} = require("../../../utils/index");

// 登录接口
module.exports = async function (ctx) {
    try{
        const {account,password} = ctx.request.body;

        if(!(account && password)) return ctx.body = codeMap('M201');
        const dataList = await ctx.service.public.selectTableBySingleField("AdminUser","account",account);
        if(dataList.length==0) return ctx.body = codeMap('M207');
        if(dataList[0].password != password) return ctx.body = codeMap('M204');
        // 后续将失败登录次数过多迁移到redis
        // let loginFailCount = dataList[0].loginFailCount;


        let exp = 1000*60*5 * 1
        // 目前只用了accessToken 后续要补上RefreshToken
        let token = ctx.app.jwt.sign({
            auther:"qdds",
            role:"test",
            account,
            exp:Date.now() + exp,   // 五分钟过期时间
            iat: Date.now(), // 创建时间
        }, ctx.app.config.jwt.secret);
        const result = await ctx.app.mysql.update('AdminUser',{
            id:dataList[0].id,
            lastLoginTime:ctx.app.mysql.literals.now,
            // loginFailCount:0  // 登录成功后将失败次数修改为0
        })
        if(result.affectedRows == 1){
            // let redisResult = await ctx.app.redis.hset('AdminUserTokens', token,"");
            await ctx.app.redis.set(token,account);
            await ctx.app.redis.expire(token, exp/1000);
            return ctx.body = Object.assign(codeMap('M200'),{msg:"登录成功！",token});
        }else{
            return ctx.body = codeMap('M206');
        }
    }catch(e){
        let txt = '/cxyChat/login接口异常' + e;
        ctx.body = {msg:txt,code:500};
        console.log(txt)
    }
}  