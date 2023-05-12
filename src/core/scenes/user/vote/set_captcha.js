const axios = require('axios')
const { phone } = require("phone")
const { Scenes, } = require('telegraf')
const { BaseScene } = Scenes
const { api, helpers } = require('../../../../utils')

const callback_data = {
    cancel: 'user.vote.set_captcha.cancel'
}

function makeButtons(ctx){
    return [
        [{ text: ctx.i18n.t(callback_data.cancel), callback_data: callback_data.cancel }],
    ]
}

const scene = new BaseScene('user-home-vote-set_captcha')

scene.enter( async ctx => {
    const caption = ctx.i18n.t('user.vote.set_captcha.caption')
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx))
    const captchaData = helpers.captchaCutter(ctx.session.captcha)
    const imageBuffer = Buffer.from(captchaData, "base64")
    
    ctx.session.tempMessage = await ctx.replyWithPhoto({ source: imageBuffer }, {
        caption,
        reply_markup: keyboard
    })
})

scene.on('text', async ctx => {
    try{
        const captchaResult = ctx.message.text
        
        ctx.session.loading = await ctx.reply('⌛️')
        const result = await api.setCaptcha(
            ctx.session.serverUrl,
            ctx.from.id,
            captchaResult
        )
        await ctx.deleteMessage(ctx.session.loading.message_id)
        if(typeof result == 'boolean'){
            if(result){
                ctx.scene.enter('user-home-vote-set_smscode')
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