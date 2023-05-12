const { Scenes } = require('telegraf');
const { BaseScene } = Scenes;
const { helpers } = require('../../../../utils');

const callback_data = {
    to_card: 'user.withdraw.to_card',
    to_phone: 'user.withdraw.to_phone',
    back: 'user.withdraw.back'
}

function makeButtons(ctx){
    return [
        [
            { text: ctx.i18n.t(callback_data.to_card), callback_data: callback_data.to_card },
            { text: ctx.i18n.t(callback_data.to_phone), callback_data: callback_data.to_phone }
        ],
        [{ text: ctx.i18n.t(callback_data.back), callback_data: callback_data.back }],
    ]
}

const scene = new BaseScene('user-home-withdraw');

scene.enter( async ctx => {
    const caption = ctx.i18n.t('user.withdraw.caption')
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx))
    ctx.session.tempMessage = await ctx.replyWithHTML(caption, { reply_markup: keyboard })
});

scene.on('text', async ctx => {
    
    if(ctx.session.isCard){
        ctx.session.cardNumber = ctx.message.text
        ctx.session.isCard = null
        await ctx.scene.enter('user-home-withdraw-to_card')
    } else if(ctx.session.isPhone){
        ctx.session.phoneNumber = ctx.message.text
        ctx.session.isPhone = null
        await ctx.scene.enter('user-home-withdraw-to_phone')
    }
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data
    switch(action){
        case callback_data.to_card: {
            await ctx.deleteMessage(ctx.session.tempMessage.messageId).catch();
            ctx.session.isCard = true
            const enterCardNumbertext = ctx.i18n.t('user.withdraw.enter_card')
            ctx.session.tempMessage = await ctx.replyWithHTML(enterCardNumbertext)
            break;
        }
        case callback_data.to_phone: {
            await ctx.deleteMessage().catch();
            ctx.session.isPhone = true
            const enterPhoneNumbertext = ctx.i18n.t('user.withdraw.enter_phone')
            ctx.session.tempMessage = await ctx.replyWithHTML(enterPhoneNumbertext)
            break;
        }
        case callback_data.back: {
            await ctx.deleteMessage().catch();
            await ctx.scene.enter('user-home');
            break;
        }
    }
});

module.exports = [
    scene,
    require('./to_card'),
    require('./to_phone'),
]