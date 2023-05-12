const axios = require('axios')
const { phone } = require("phone")
const { Scenes, } = require('telegraf')
const { BaseScene } = Scenes
const { api, config} = require('../../../../utils')

const callback_data = {
    cancel: 'user.vote.set_phone.cancel'
}

function makeButtons(ctx){
    const myPhoneBtn = ctx.i18n.t('user.vote.set_phone.my_phone')
    const cancel = ctx.i18n.t('user.vote.set_phone.cancel')

    return { 
        reply_markup: {
            one_time_keyboard: true,
            resize_keyboard: true,
            keyboard: [
                [ { text: myPhoneBtn, request_contact: true }],
                [ { text: cancel, callback_data: callback_data.cancel }]
            ],
        }
    }
}

const scene = new BaseScene('user-home-vote-set_phone')

scene.enter( async ctx => {
    const caption = ctx.i18n.t('user.vote.set_phone.caption')
    const keyboard = makeButtons(ctx)

    ctx.session.tempMessage = await ctx.replyWithHTML(caption, keyboard)

    ctx.session.serverUrl = await api.getFreeServer()
})

scene.hears("🚫 Бекор қилиш", async ctx => {
    await ctx.deleteMessage()
    await ctx.deleteMessage(ctx.session.tempMessage.message_id)
    ctx.scene.enter('user-home')
})

scene.on('contact', async ctx => {
    try{
        const { isValid, phoneNumber } = phone(ctx.message.contact.phone_number, {
            country: "UZ",
        })
    
        if(isValid){
            ctx.session.phone = phoneNumber
            await ctx.deleteMessage()
            await ctx.deleteMessage(ctx.session.tempMessage.message_id)

            ctx.session.loading = await ctx.reply('⌛️')
            const result = await api.setPhone(
                ctx.session.serverUrl, 
                config.getInitiativeLink(), 
                ctx.from.id
            )
            await ctx.deleteMessage(ctx.session.loading.message_id)
            if(result){
                ctx.session.captcha = result
                ctx.scene.enter('user-home-vote-set_captcha')
            } else {
                await ctx.replyWithHTML(ctx.i18n.t('request_leak'))
                await ctx.scene.enter('user-home')    
            }
        } else {
            const errorFormat = ctx.i18n.t('user.vote.set_phone.error_format')
            await ctx.deleteMessage()
            await ctx.deleteMessage(ctx.session.tempMessage.message_id)
            await ctx.replyWithHTML(errorFormat)
            await ctx.scene.reenter()
        } 
    }catch(err){
        console.log(err)
    }
})

scene.on('text', async ctx => {
    try{
        const { isValid, phoneNumber } = phone(ctx.message.text, {
            country: "UZ",
        })
    
        if(isValid){
            ctx.session.phone = phoneNumber
            await ctx.deleteMessage()
            await ctx.deleteMessage(ctx.session.tempMessage.message_id)
            
            ctx.session.loading = await ctx.reply('⌛️')
            const result = await api.setPhone(
                ctx.session.serverUrl, 
                config.getInitiativeLink(), 
                ctx.from.id
            )
            await ctx.deleteMessage(ctx.session.loading.message_id)
            if(result){
                ctx.session.captcha = result
                ctx.scene.enter('user-home-vote-set_captcha')
            } else {
                ctx.scene.enter('user-home')    
            }
        } else {
            const errorFormat = ctx.i18n.t('user.vote.set_phone.error_format')
            await ctx.deleteMessage()
            await ctx.deleteMessage(ctx.session.tempMessage.message_id)
            await ctx.replyWithHTML(errorFormat)
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