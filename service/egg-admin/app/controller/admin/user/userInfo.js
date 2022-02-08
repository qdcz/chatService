'use strict';
let {codeMap,addQuotationMarksForString,flatDataToTreeData} = require("../../../utils/index");

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
            let UserInfoResult = await ctx.service.adminUser.selUserInfoByUuid(uuid);
            let RoleInfoResult = await ctx.service.adminRole.selRoleInfoByUuid(UserInfoResult[0].roleId);
            let routerIds = RoleInfoResult[0].routerId;
            let routerIdsForSql =  addQuotationMarksForString(routerIds);                           // sql语句
            let routerInfo = await ctx.service.adminRouter.selRouterInfoByUuids(routerIdsForSql);  // 此角色包含的路由信息列表
            let allRouterList = await ctx.service.adminRouter.selRouterList(0,9999);  // 数据库中的所有路由信息
            let routerTreeData = flatDataToTreeData(routerInfo,allRouterList);       // 此角色包含的路由信息组合而成的路由树数据

            UserInfoResult[0].routerInfo = routerInfo;
            UserInfoResult[0].routerTreeData = routerTreeData;
            return ctx.body = Object.assign(codeMap('M200'),{data:UserInfoResult[0]});
        }else if(ctx.request.method == 'PUT'){ // 更新信息
            let params = ctx.request.body;
            const conn = await ctx.app.mysql.beginTransaction(); // 初始化事务
            try {
                // TODO 改造成sql语句   写联表更新
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