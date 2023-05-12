const { config, helpers } = require('../../utils')

module.exports = {
    name: `setvc`,
    action:
    async function(ctx){        
        if(config.isAdmin(ctx.from.id)){
            const text = ctx.message.text
            const newVoteCost = helpers.extractNumberFromCommand('/setvc', text)
            config.setVoteCost(newVoteCost)
            await ctx.replyWithHTML(ctx.i18n.t('admin.change_costs.vote_cost_changed', { 
                voteCost: newVoteCost 
            }))
        }
    }
}