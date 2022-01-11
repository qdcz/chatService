let {codeMap} = require("../utils/index");
/**
 * 
 * @param {*} options   app.config[${middlewareName}]
 * @param {*} app       app
 * @returns 
 */
module.exports = (options, app) => {
    return async function (ctx, next) {
        let token = ctx.headers['y-authentication'] || ""
        if(token){
            try {
                let tokenInfo = app.jwt.verify(token,app.config.jwt.secret);

                // redis校验
                // let redisResult = await app.redis.hget('AdminUserTokens', tokenInfo);
                let redisResult = await app.redis.get(token);
                if(!redisResult) return ctx.body = codeMap("M210")

                // token签名校验
                let expirationTime = app.config.jwt.expirationTime;
                let {exp,account,auther,role} = tokenInfo;
                if(auther!='qdds') return ctx.body = codeMap("M209");
                let timeDifference = exp - Date.now();
                if(timeDifference<=0) throw Error("token过期");

                
                await next(account);
            } catch (err) {
                console.log("中间件token鉴权",err)
                ctx.status = 401;
                return ctx.body = codeMap("M208")
            }
        }else{
            return ctx.body = codeMap('M209');
        }
    }
}