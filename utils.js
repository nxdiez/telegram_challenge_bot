const {telegramSetup} = require('./keys.js');
const { promisify } = require('util')
const utils = new Object( );
utils.validateUserX8 = function (ctx){
    console.log('validando Usuario')
    return new Promise( async function (resolve, reject){
        let userId = ctx.message.from.id;
        let isUser = false;
        for(let i = 0; i < telegramSetup.GRUPOSPERMITIDOS.length; i++){
            let groupId = telegramSetup.GRUPOSPERMITIDOS[i];
            console.log('validando grupo: ' + groupId);
            try{
                //lanzo en sincrono, si es usuario no genera error
                await ctx.telegram.getChatMember(groupId,userId);
                console.log(userId + ' es miembro de grupo ' + groupId);
                isUser = true;
                break;
            }catch(e){
                console.log(userId + ' no es miembro de ' + groupId );
            }
        }
        (isUser?resolve(isUser):reject(isUser));
    })
}
module.exports = utils;