const { Scenes } = require('telegraf')
const { BaseScene } = Scenes;
const { helpers } = require('../../../utils')

const callback_data = {
    vote: 'user.home.vote',
    balance: 'user.home.balance',
    referal: 'user.home.referal',
    withdraw: 'user.home.withdraw',
    about: 'user.home.about'
}

function makeButtons(ctx){
    return [
        [
            { text: ctx.i18n.t(callback_data.vote), callback_data: callback_data.vote },
            { text: ctx.i18n.t(callback_data.balance), callback_data: callback_data.balance }
        ],
        [ 
            { text: ctx.i18n.t(callback_data.referal), callback_data: callback_data.referal }, 
            { text: ctx.i18n.t(callback_data.withdraw), callback_data: callback_data.withdraw }
        ],
        [{ text: ctx.i18n.t(callback_data.about), callback_data: callback_data.about }],
    ]
}

const scene = new BaseScene('user-home');

scene.enter( async ctx => {
    const caption = ctx.i18n.t('user.home.caption')
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx))
    await ctx.replyWithHTML(caption, { reply_markup: keyboard })
});

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data
    switch(action){
        case callback_data.vote: {
            await ctx.deleteMessage()
            await ctx.scene.enter('user-home-vote-set_phone')
            break
        }
        case callback_data.balance: {
            await ctx.deleteMessage()
            await ctx.scene.enter('user-home-balance')
            break
        }
        case callback_data.referal: {
            await ctx.deleteMessage()
            await ctx.replyWithHTML(ctx.i18n.t('user.referal.caption', { 
                referalLink: helpers.referalMaker(ctx) 
            }))
            await ctx.scene.reenter()
            break
        }
        case callback_data.withdraw: {
            await ctx.deleteMessage()
            await ctx.scene.enter('user-home-withdraw')
            break
        }
        case callback_data.about: {
            await ctx.deleteMessage()
            await ctx.scene.enter('user-home-about')
            break
        }
    }
});

module.exports = scene;