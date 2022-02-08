'use strict';
const {codeMap} = require("../../../utils/index");
// 更新路由信息
module.exports = async function (ctx) {
    try{
        const {uuid,routerName,rootId,parentId,icon,routerFnId,routerSrc,pageSrc} = ctx.request.body;
        if(!(uuid && routerName)) return ctx.body = codeMap('M201');

        const updRoleInfoResult = await ctx.service.adminRouter.updRouterByUuid(uuid,{routerName,rootId,parentId,icon,routerFnId,routerSrc,pageSrc})
        if(updRoleInfoResult.affectedRows==1){
            ctx.body = codeMap('M200')
        }else{
            throw Error("修改路由信息失败/该路由id无效")
        }
    }catch(e){
        let txt = '/admin/router 接口异常' + e;
        console.log(txt)
        ctx.body = {msg:txt,code:500};
    }
}  