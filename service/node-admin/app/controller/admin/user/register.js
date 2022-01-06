'use strict';
let {codeMap,create_token} = require("../../../utils/index");
let date = require("qdcz-date");


// 后续要加一个激活码字段   搞个激活码表 对上才让注册
module.exports = async function (ctx) {
    try{
        const {account,password} = ctx.request.body;
        if(!(account && password)) return ctx.body = codeMap('M201');
        const dataList = await ctx.service.public.selectTableBySingleField("User","account",account);
        if(dataList.length!=0) return ctx.body = codeMap('M202');

        const conn = await ctx.app.mysql.beginTransaction(); // 初始化事务
        try {
            let userid = create_token(6) + "-" + new date().getFormat("yymmddhhmmss");
            await conn.insert("User", { id:userid,account,password });
            await conn.insert("UserInfo", {
                userid,
                registerTime:ctx.app.mysql.literals.now
            });
            await conn.commit();
            return ctx.body = codeMap('M200');
        } catch (err) {
            await conn.rollback();
            // return ctx.body = codeMap('M205');
            throw err;
        }

        // const result = await ctx.service.public.insertTable("User",{
        //     id:create_token(6) + "-" + new date().getFormat("yymmddhhmmss"),
        //     account,password,
        //     registerTime:ctx.app.mysql.literals.now
        // });

        // if(result.affectedRows === 1){
        //     return ctx.body = codeMap('M200');
        // }else{
        //     return ctx.body = codeMap('M205');
        // }
    }catch(e){
        let txt = '/cxyChat/register接口异常' + e;
        ctx.body = {msg:txt,code:500};
        console.log(txt)
    }
}  