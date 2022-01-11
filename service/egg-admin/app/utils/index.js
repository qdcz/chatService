const {codeMap} = require("../../config/staticConfig")
module.exports = {
    codeMap:function (code) {
        console.log(code,codeMap[code])
        return JSON.parse(JSON.stringify({msg:codeMap[code],code}))
    },
    create_token(leng){
        leng = leng==undefined?32:leng	//默认32位
        let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz23456789'
        let token = ''
        for(let i=0;i<leng;++i) token+=chars.charAt(Math.floor(Math.random()*chars.length))
        return token
    },
    // create_AccessToken(){
    //     const token = await app.jwt.sign({
    //         data,
    //         exp: created + 60 * 30,
    //         iat: created,
    //     }, app.config.jwt.secret);
    //     console.log("token",token)
    // }
}