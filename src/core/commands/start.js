const { Models } = require('../../models');
const { Users } = Models;
const { config, helpers } = require('../../utils');

module.exports = {
    name: `start`,
    action:
    async function(ctx){
        ctx.reply("Open Budget tashabbuslarida aktiv bo'ling. Bizdan uzoqlashmang!")
        // const [savedUser, created] = await Users.findOrCreate({
        //     where: { id: ctx.from.id },
        //     defaults: {
        //         id: ctx.from.id,
        //         fullname: ctx.from.first_name ? ctx.from.first_name : "Noma'lum" + ' ' + ctx.from.last_name ? ctx.from.last_name : '',
        //         username: ctx.from.username,
        //         createdAt: helpers.getGMT5().toISOString()
        //     }
        // })

        // if(created){
        //     try{
        //         const text = ctx.message.text
                
        //         const caption = ctx.i18n.t('start.caption')
        //         await ctx.replyWithHTML(caption)
    
        //         const referalId = helpers.extractNumberFromStart(text)
                
        //         if(referalId != null){
        //             const thanksForNewUser = ctx.i18n.t('start.referrer_started', { 
        //                 newUserFullname: savedUser.fullname,
        //                 referalCost: config.getReferalCost()
        //             })
                    
        //             ctx.session.referal = referalId

        //             const referrer = await Users.findOne({ where: { id: referalId }})
        //             const referals = helpers.strToArr(referrer.referals)
        //             referals.push(savedUser.id)
        //             referrer.referals = helpers.arrToStr(referals)
        //             referrer.save()
    
        //             await ctx.telegram.sendMessage(referalId, thanksForNewUser, {
        //                 parse_mode: 'HTML'
        //             })
        //         }
        //     } catch(err){
        //         console.log(err)
        //     }

        // }

        // ctx.scene.enter('user-home')
    }
}