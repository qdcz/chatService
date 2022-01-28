'use strict';
let {codeMap} = require("../../../utils/index");
const uuidV4 = require("uuid-v4")

// 添加用户信息
module.exports = async function (ctx) {
    try{
        const {account,password,name,sex,phone,address,introduction,avatar,roleId} = ctx.request.body;
        if(!(account && password)) return ctx.body = codeMap('M201');
        const dataList = await ctx.service.public.selectTableBySingleField("AdminUser","account",account);
        if(dataList.length!=0) return ctx.body = codeMap('M202');

        const conn = await ctx.app.mysql.beginTransaction(); // 初始化事务
        try {
            let uuid = uuidV4()
            console.log(uuid)
            await conn.insert("AdminUser", { uuid:`${uuid}`,account,password,roleId });
            await conn.insert("AdminUserInfo", {
                uuid:`${uuid}`,
                registerTime:ctx.app.mysql.literals.now,
                avatar:"https://img2.baidu.com/it/u=2182014426,2379325530&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500",
                name,sex,phone,address,introduction
            });
            await conn.commit();
            return ctx.body = codeMap('M200');
        } catch (err) {
            await conn.rollback();
            throw err;
        }
    }catch(e){
        let txt = '/admin/addUser接口异常' + e;
        console.log(txt)
        ctx.body = {msg:txt,code:500};
    }
}  