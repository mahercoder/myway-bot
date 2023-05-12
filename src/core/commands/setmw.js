const { config, helpers } = require('../../utils')

module.exports = {
    name: `setmw`,
    action:
    async function(ctx){        
        if(config.isAdmin(ctx.from.id)){
            const text = ctx.message.text
            const newMinWithCost = helpers.extractNumberFromCommand('/setmw', text)
            config.setMinimalWithdraw(newMinWithCost)
            await ctx.replyWithHTML(ctx.i18n.t('admin.change_costs.min_with_cost_changed', { 
                minWithdraw: newMinWithCost 
            }))
        }
    }
}