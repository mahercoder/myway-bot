const { Scenes } = require('telegraf');
const { BaseScene } = Scenes;
const { Models } = require('../../../models')
const { Votes } = Models
const { config, helpers } = require('../../../utils');

const callback_data = {
    no: 'admin.clear_votes.no',
    yes: 'admin.clear_votes.yes'
}

function makeButtons(ctx){
    return [
        [
            { text: ctx.i18n.t(callback_data.no), callback_data: callback_data.no },
            { text: ctx.i18n.t(callback_data.yes), callback_data: callback_data.yes }
        ]
    ]
}

const scene = new BaseScene('admin-home-clear_votes');

scene.enter( async ctx => {
    const caption = ctx.i18n.t('admin.clear_votes.caption')
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx));
    ctx.session.tempMessage = await ctx.replyWithHTML(caption, { reply_markup: keyboard });
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data
    switch(action){
        case callback_data.no: {
            await ctx.deleteMessage()
            await ctx.replyWithHTML(ctx.i18n.t('admin.clear_votes.fail'))
            await ctx.scene.enter('admin-home')
            break
        }
        case callback_data.yes: {
            try{
                await ctx.deleteMessage()
                await Votes.destroy({ where: {} })
                await ctx.replyWithHTML(ctx.i18n.t('admin.clear_votes.success'))
                await ctx.scene.enter('admin-home');
            }catch(err){
                console.log(err)
            }
            break;
        }
    }
});

module.exports = scene