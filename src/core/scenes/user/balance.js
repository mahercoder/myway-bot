const { Scenes } = require('telegraf')
const { BaseScene } = Scenes
const { Models } = require('../../../models')
const { Users } = Models
const { helpers } = require('../../../utils')

const callback_data = {
    back: 'user.balance.back'
}

function makeButtons(ctx){
    return [
        [{ text: ctx.i18n.t(callback_data.back), callback_data: callback_data.back }],
    ]
}

const scene = new BaseScene('user-home-balance');

scene.enter( async ctx => {
    const user = await Users.findOne({ where: { id: ctx.from.id }})
    const caption = ctx.i18n.t('user.balance.caption', { balance: user.balance })
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx));
    await ctx.replyWithHTML(caption, { 
        reply_markup: keyboard 
    });
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data
    switch(action){
        case callback_data.back: {
            await ctx.deleteMessage().catch()
            await ctx.scene.enter('user-home');
            break;
        }
    }
})

module.exports = scene