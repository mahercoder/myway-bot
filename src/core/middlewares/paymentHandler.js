const { Models } = require('../../models')
const { Payments, Users } = Models
const { config } = require('../../utils')

const callback_data = {
    pay: 'user.withdraw.status.pay',
    cancel: 'user.withdraw.status.cancel'
}

module.exports = async ctx => {

    try{
        const action = ctx.update.callback_query.data.split('--')[0]        
        switch(action){
            case callback_data.pay: {
                if(config.isAdmin(ctx.from.id)){
                    const paymentId = ctx.update.callback_query.data.split('--')[1]

                    const payment = await Payments.findOne({ where: { id: paymentId } })
                    const user = await Users.findOne({ where: { id: payment.user_id } })
                
                    const cardOrPhone = payment.card ? payment.card : payment.phone
                    const withdrawalCost = payment.cost
                    const paymentMethod =  payment.card 
                        ? ctx.i18n.t('user.withdraw.method.card')
                        : ctx.i18n.t('user.withdraw.method.phone')

                    const paymentStatusPayed = ctx.i18n.t('user.withdraw.status.payed')

                    user.balance -= payment.cost
                    await user.save()
                    
                    payment.isPaid = true
                    await payment.save()
    
                    const checkoutText = ctx.i18n.t('user.withdraw.checkout', { 
                        paymentMethod, cardOrPhone, withdrawalCost, paymentStatus: paymentStatusPayed 
                    })
                    await ctx.editMessageText(checkoutText, { parse_mode: 'HTML' })
                    const warnTextToUser = ctx.i18n.t('user.withdraw.status.payment_approved')
                    await ctx.telegram.sendMessage(payment.user_id, warnTextToUser, { parse_mode: 'HTML' })
                } else {
                    ctx.answerCbQuery("🚫 Фақатгина бот админи боса олади!")
                }
                break;
            }
            case callback_data.cancel: {
                if(config.isAdmin(ctx.from.id)){
                    const paymentId = ctx.update.callback_query.data.split('--')[1]
                    const payment = await Payments.findOne({ where: { id: paymentId } })
                
                    const cardOrPhone = payment.card ? payment.card : payment.phone
                    const withdrawalCost = payment.cost
                    const paymentMethod =  payment.card 
                        ? ctx.i18n.t('user.withdraw.method.card')
                        : ctx.i18n.t('user.withdraw.method.phone')
                    const paymentStatusCancelled = ctx.i18n.t('user.withdraw.status.cancelled')

                    const checkoutText = ctx.i18n.t('user.withdraw.checkout', { 
                        paymentMethod, cardOrPhone, withdrawalCost, paymentStatus: paymentStatusCancelled 
                    })
                    await ctx.editMessageText(checkoutText, { parse_mode: 'HTML' })
                    const warnTextToUser = ctx.i18n.t('user.withdraw.status.warn_cancelled')
                    await ctx.telegram.sendMessage(payment.user_id, warnTextToUser, { parse_mode: 'HTML' })
                    await Payments.destroy({ where: { id: payment.id } })
                } else {
                    ctx.answerCbQuery("🚫 Фақатгина бот админи боса олади!")
                }
                break;
            }
        }
    } catch(err){
        console.log(err)
    }

};