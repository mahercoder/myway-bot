const { Scenes } = require('telegraf');
const { BaseScene } = Scenes;
const { config, helpers } = require('../../../utils');

const callback_data = {
    back: 'admin.change_initiative.back'
}

function makeButtons(ctx){
    return [
        [{ text: ctx.i18n.t(callback_data.back), callback_data: callback_data.back }],
    ]
}

const scene = new BaseScene('admin-home-change_initiative');

scene.enter( async ctx => {
    const caption = ctx.i18n.t('admin.change_initiative.caption', {
        currentLink: config.getInitiativeLink()
    })
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx));
    ctx.session.tempMessage = await ctx.replyWithHTML(caption, { 
        reply_markup: keyboard,
        disable_web_page_preview: true 
    });
})

scene.on('text', async ctx => {
    try{
        const newLink = ctx.message.text
        if(helpers.isLinkValid(newLink)){
            const successText = ctx.i18n.t('admin.change_initiative.success')
            
            config.setInitiativeLink(newLink)

            await ctx.deleteMessage()
            await ctx.deleteMessage(ctx.session.tempMessage.message_id)
            
            await ctx.replyWithHTML(successText)

            ctx.scene.enter('admin-home')
        } else {
            const failText = ctx.i18n.t('admin.change_initiative.fail')
            
            await ctx.deleteMessage()
            await ctx.deleteMessage(ctx.session.tempMessage.message_id)

            await ctx.replyWithHTML(failText)
        }
    }catch(err){
        console.log(err)
    }
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data
    switch(action){
        case callback_data.back: {
            ctx.deleteMessage().catch();
            ctx.scene.enter('admin-home');
            break;
        }
    }
});

module.exports = scene;