const { config, helpers } = require('../../utils')

module.exports = {
    name: `setrc`,
    action:
    async function(ctx){        
        if(config.isAdmin(ctx.from.id)){
            const text = ctx.message.text
            const newReferalCost = helpers.extractNumberFromCommand('/setrc', text)
            config.setReferalCost(newReferalCost)
            await ctx.replyWithHTML(ctx.i18n.t('admin.change_costs.referal_cost_changed', { 
                referalCost: newReferalCost 
            }))
        }
    }
}