const fs = require('fs')
const path = require('path')
const { Scenes } = require('telegraf')
const { BaseScene } = Scenes
const { Models } = require('../../../models')
const { Votes, Users } = Models
const { helpers } = require('../../../utils')

const callback_data = {
    change_initiative: 'admin.home.change_initiative',
    get_vote_list: 'admin.home.get_vote_list',
    vote_count: 'admin.home.vote_count',
    clear_votes: 'admin.home.clear_votes',
    change_costs: 'admin.home.change_costs',
    payment_channel: 'admin.home.payment_channel',    
    stats: 'admin.home.stats',
    publish_ad: 'admin.home.publish_ad', 
    exit: 'admin.home.exit', 
}

function makeButtons(ctx){
    return [
        [
            { text: ctx.i18n.t(callback_data.change_initiative), callback_data: callback_data.change_initiative }, 
            { text: ctx.i18n.t(callback_data.get_vote_list), callback_data: callback_data.get_vote_list }
        ],
        [
            { text: ctx.i18n.t(callback_data.vote_count), callback_data: callback_data.vote_count }, 
            { text: ctx.i18n.t(callback_data.clear_votes), callback_data: callback_data.clear_votes }
        ],
        [
            { text: ctx.i18n.t(callback_data.change_costs), callback_data: callback_data.change_costs }, 
            { text: ctx.i18n.t(callback_data.payment_channel), callback_data: callback_data.payment_channel }
        ],
        [
            { text: ctx.i18n.t(callback_data.stats), callback_data: callback_data.stats }, 
            { text: ctx.i18n.t(callback_data.publish_ad), callback_data: callback_data.publish_ad }
        ],
        [{ text: ctx.i18n.t(callback_data.exit), callback_data: callback_data.exit }],
    ]
}

const scene = new BaseScene('admin-home');

scene.enter( async ctx => {
    const caption = ctx.i18n.t('admin.home.caption')
    const keyboard = helpers.makeInlineKeyboard(makeButtons(ctx))
    await ctx.replyWithHTML(caption, { reply_markup: keyboard })
})

scene.action(/.+/, async ctx => {
    const action = ctx.callbackQuery.data

    switch(action){
        case callback_data.change_initiative: {
            ctx.deleteMessage().catch()
            ctx.scene.enter('admin-home-change_initiative')
            break
        }
        case callback_data.get_vote_list: {
            await ctx.deleteMessage()
            const votesListPath = path.join(__dirname, '../../..', '/votes.xlsx')
            await helpers.makeVoteList(Votes, votesListPath)
            ctx.session.loading = await ctx.replyWithHTML(ctx.i18n.t('admin.get_vote_list.loading'))
            setTimeout( async () => {
                try{
                    await ctx.replyWithDocument({ source: votesListPath })
                    fs.unlinkSync(votesListPath)
                    await ctx.deleteMessage(ctx.session.loading.message_id)
                    await ctx.scene.reenter()
                } catch(err){
                    await ctx.replyWithHTML(ctx.i18n.t('admin.get_vote_list.error'))
                    await ctx.deleteMessage(ctx.session.loading.message_id)
                    await ctx.scene.reenter()
                }
            }, 5000)
            break
        }
        case callback_data.vote_count: {
            const voteCount = await Votes.count()
            await ctx.deleteMessage()
            const voteCountCaption = ctx.i18n.t('admin.vote_count.caption', { voteCount })
            await ctx.replyWithHTML(voteCountCaption)
            await ctx.scene.reenter()
            break
        }
        case callback_data.clear_votes: {
            ctx.deleteMessage().catch()
            ctx.scene.enter('admin-home-clear_votes')
            break
        }
        case callback_data.change_costs: {
            ctx.deleteMessage().catch()
            ctx.scene.enter('admin-home-change_costs')
            break
        }
        case callback_data.payment_channel: {
            ctx.deleteMessage().catch()
            ctx.scene.enter('admin-home-payment_channel')
            break
        }
        case callback_data.stats: {
            const userCount = await Users.count()
            await ctx.deleteMessage()
            const userCountCaption = ctx.i18n.t('admin.stats.caption', { userCount })
            await ctx.replyWithHTML(userCountCaption)
            await ctx.scene.reenter()

            break
        }
        case callback_data.publish_ad: {
            ctx.deleteMessage().catch()
            ctx.scene.enter('admin-home-publish_ad')
            break
        }
        case callback_data.exit: {
            ctx.deleteMessage().catch()
            ctx.scene.enter('user-home')
            break
        }
    }
});

module.exports = scene;