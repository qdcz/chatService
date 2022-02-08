'use strict';
const {codeMap} = require("../../../utils/index");
const uuidV4 = require("uuid-v4")
// 添加路由
module.exports = async function (ctx) {
    try{
        const {routerName,rootId,parentId,icon,routerFnId,routerSrc,pageSrc} = ctx.request.body;
        if(!(routerName)) return ctx.body = codeMap('M201');

        const selRouterResult = await ctx.service.adminRouter.selRouterNameIsRepeace(routerName);
        let count = selRouterResult[0]["count(*)"];
        if(count>=1) return ctx.body = codeMap("M212")
        const addResult = await ctx.service.adminRouter.addRouter(
            `
                '${uuidV4()}',
                '${routerName}',
                '${rootId || ""}',
                '${parentId || ""}',
                '${icon || ""}',
                '${routerFnId || ""}',
                '${routerSrc || ""}',
                '${pageSrc || ""}'
            `
        );
        if(addResult.affectedRows==1){
            return ctx.body = Object.assign(codeMap('M200'),{
                data:addResult
            });
        }else{
            throw Error("路由添加失败")
        }
    }catch(e){
        let txt = '/admin/router 接口异常' + e;
        ctx.body = {msg:txt,code:500};
        console.log(txt)
    }
}  