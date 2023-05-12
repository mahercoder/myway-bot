const { Scenes } = require('telegraf');
const { BaseScene } = Scenes
const { Models } = require('../../../../models')
const { Users, Payments } = Models
const { config, helpers } = require('../../../../utils')

const callback_data = {
    pay: 'user.withdraw.status.pay',
    cancel: 'user.withdraw.status.cancel',
    back: 'user.withdraw.withdraw_to_card.back'
}

function makeButtons(ctx){
    return [
        [{ text: ctx.i18n.t(callback_data.back), callback_data: callback_data.back }],
    ]
}

function makeCheckoutButtons(ctx, paymentId){
    return [
        [
            { text: ctx.i18n.t(callback_data.pay), callback_data: `${callback_data.pay}--${paymentId}` },
            { text: ctx.i18n.t(callback_data.cancel), callback_data: `${callback_data.cancel}--${paymentId}` }
        ]
    ]
}

const scene = new BaseScene('user-home-withdraw-to_card');

scene.enter( async ctx => {
    const user = await Users.findOne({ where: { id: ctx.from.id }})
    const caption = ctx.i18n.t('user.withdraw.withdraw_to_card.caption', { balance: user.balance })
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx))
    ctx.setChatPermissions.tempMessage = await ctx.replyWithHTML(caption, { reply_markup: keyboard })
})

scene.on('text', async ctx => {
    const withdrawalCost = Number(ctx.message.text)
    if (!isNaN(withdrawalCost)) {
        if(config.getMinimalWithdraw() <= withdrawalCost && withdrawalCost > 0){
            const user = await Users.findOne({ where: { id: ctx.from.id }})
            if(user.balance >= withdrawalCost){
                try {
                    const paymentReceivedText = ctx.i18n.t('user.withdraw.withdraw_to_card.payment_received', { withdrawalCost })
                    
                    const cardOrPhone = ctx.session.cardNumber
                    const paymentMethod = ctx.i18n.t('user.withdraw.method.card')
                    const paymentStatus = ctx.i18n.t('user.withdraw.status.pending')
                    const checkoutText = ctx.i18n.t('user.withdraw.checkout', { paymentMethod, cardOrPhone, withdrawalCost, paymentStatus })
                
                    const payment = await Payments.create({
                        user_id: ctx.from.id,
                        cost: withdrawalCost,
                        card: cardOrPhone
                    })

                    const checkoutKeyboard = helpers.makeInlineKeyboard(makeCheckoutButtons(ctx, payment.id))
                    await ctx.telegram.sendMessage( config.getPaymentChannelId(), checkoutText, {
                        reply_markup: checkoutKeyboard,
                        parse_mode: 'HTML'
                    })
    
                    await ctx.replyWithHTML(paymentReceivedText)
                } catch(err){
                    console.log(err)
                }
            } else {
                const notEnoughMoneyText = ctx.i18n.t('user.withdraw.withdraw_to_card.not_enough_money')
                await ctx.replyWithHTML(notEnoughMoneyText)
            }
        } else {
            const errorMinimalWithdrawText = ctx.i18n.t('user.withdraw.withdraw_to_card.error_minimal_withdraw', { minimalCost: config.getMinimalWithdraw() })
            await ctx.replyWithHTML(errorMinimalWithdrawText)
        }

        await ctx.deleteMessage().catch()
        await ctx.deleteMessage(ctx.setChatPermissions.tempMessage.message_id).catch()
        await ctx.scene.enter('user-home')

    } else {
        const errorText = ctx.i18n.t('user.withdraw.withdraw_to_card.error_cost')
        await ctx.replyWithHTML(errorText)
    }
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data
    switch(action){
        case callback_data.back: {
            await ctx.deleteMessage().catch()
            await ctx.scene.enter('user-home-withdraw')
            break;
        }
    }
});

module.exports = scene