const { phone } = require("phone")
const { Scenes, } = require('telegraf')
const { BaseScene } = Scenes
const { Models } = require('../../../../models')
const { Votes, Users } = Models
const { api, helpers, config } = require('../../../../utils')

const callback_data = {
    cancel: 'user.vote.set_smscode.cancel'
}

function makeButtons(ctx){
    return [
        [{ text: ctx.i18n.t(callback_data.cancel), callback_data: callback_data.cancel }],
    ]
}

const scene = new BaseScene('user-home-vote-set_smscode')

scene.enter( async ctx => {
    const caption = ctx.i18n.t('user.vote.set_smscode.caption')
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx))

    ctx.session.tempMessage = await ctx.replyWithHTML(caption, { 
        reply_markup: keyboard
    })
})

scene.on('text', async ctx => {
    try{
        const smsCode = ctx.message.text
        
        ctx.session.loading = await ctx.reply('⌛️')
        const result = await api.setSMSCode(
            ctx.session.serverUrl,
            ctx.from.id,
            smsCode
        )
        await ctx.deleteMessage(ctx.session.loading.message_id)
        if(typeof result == 'boolean'){
            if(result){
                const user = await Users.findOne({ where: { id: ctx.from.id }})
                
                await Votes.create({
                    fullname: user.fullname,
                    phone_number: ctx.session.phone,
                    votedAt: helpers.getGMT5().toISOString()
                })
                
                user.balance += config.getVoteCost()
                await user.save()
                
                await ctx.telegram.sendMessage(
                    user.id,
                    ctx.i18n.t('user.set_smscode.success', { 
                        voteCost: config.getVoteCost()
                    }),
                    { parse_mode: 'HTML' }
                )

                if(ctx.session.referal){
                    const referalMan = await Users.findOne({ where: { id: ctx.session.referal }})
                    referalMan.balance += config.getReferalCost()
                    await referalMan.save()
                    
                    await ctx.telegram.sendMessage(
                        referalMan.id,
                        ctx.i18n.t('start.referrer_voted', { 
                            referalCost: config.getReferalCost(), 
                            newUserFullname: user.fullname
                        }),
                        { parse_mode: 'HTML' }
                    )
                }
            } else {
                await ctx.replyWithHTML(ctx.i18n.t('request_leak'))
                ctx.scene.enter('user-home')
            }
        } else {
            await ctx.reply(result)
            await ctx.scene.reenter()
        }

    }catch(err){
        console.log(err)
    }
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data.split('--')[0]

    switch(action){
        case callback_data.cancel: {
            await ctx.deleteMessage(ctx.session.tempMessage.message_id)
            await ctx.scene.enter('user-home')
            break;
        }
    }
})

module.exports = scene