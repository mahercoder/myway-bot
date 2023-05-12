const fs = require('fs')
const path = require('path');
const Configuration = require('../../config.json')

const configFilePath = path.join(__dirname, '../..', '/config.json')

const config = {
    token: Configuration.BOT_TOKEN,
    owners: Configuration.OWNERS,
    admins: Configuration.ADMINS,
    paymentsChannelId: Configuration.PAYMENTS_CHANNEL_ID,
    databaseName: Configuration.DATABASE_NAME,
    redis: {
        host: '127.0.0.1',
        port: '6379',
    },
}

function addAdmin(userId){
    Configuration.ADMINS.push(+userId)
    fs.writeFileSync(
        configFilePath, JSON.stringify(Configuration)
    )
}

function getAdmins(){
    return Configuration.ADMINS
}

function removeAdmin(userId){
    for(let i=0; i < Configuration.ADMINS.length; i++){
        if(userId == Configuration.ADMINS[i]){
            Configuration.ADMINS.splice(i, 1)
        }
   }

   fs.writeFileSync(configFilePath, JSON.stringify(Configuration))
}

function addOwner(userId){
    Configuration.ADMINS.push(+userId)
    fs.writeFileSync(
        configFilePath, JSON.stringify(Configuration)
    )
}

function getOwners(){
    return Configuration.OWNERS
}

// Ushbu kanalda bot adminligini tekshiradi
async function isBotAdminInThisChannel(ctx, channelId){
    try{
        const admins = await ctx.telegram.getChatAdministrators(channelId)
        const bot_username = ctx.botInfo.username
    
        for(let i=0; i < admins.length; i++){
            if(admins[i].user.username == bot_username){
                return true
            }
        }
    } catch(err){
        if(err){
            return false
        }
    }

    return false
}

// userId owner`ga tegishli bo'lsa true, aks holda false
function isOwner(userId){
    let result = false
    const owners = getOwners()
    
    for(let i=0; i < owners.length; i++){
        if(userId == owners[i]){
            result = true
        }
    }

    return result
}

// userId egasi bot'ni boshqara oladigan adminmi?
function isAdmin(userId){
    let result = false
    const admins = getAdmins()
    
    for(let i=0; i < admins.length; i++){
        if(userId == admins[i]){
            result = true
        }
    }

    return result
}

function getReferalCost(){
    return Configuration.REFERAL_COST
}

function setReferalCost(newCost){
    Configuration.REFERAL_COST = newCost
    fs.writeFileSync(
        configFilePath, JSON.stringify(Configuration)
    )
}

function getVoteCost(){
    return Configuration.VOTE_COST
}

function setVoteCost(newCost){
    Configuration.VOTE_COST = newCost
    fs.writeFileSync(
        configFilePath, JSON.stringify(Configuration)
    )
}

function getMinimalWithdraw(){
    return Configuration.MINIMAL_WITHDRAW
}

function setMinimalWithdraw(newCost){
    Configuration.MINIMAL_WITHDRAW = newCost
    fs.writeFileSync(
        configFilePath, JSON.stringify(Configuration)
    )
}

function getPaymentChannelId(){
    return Configuration.PAYMENTS_CHANNEL_ID
}

function setPaymentChannelId(channelId){
    Configuration.PAYMENTS_CHANNEL_ID = channelId
    fs.writeFileSync(
        configFilePath, JSON.stringify(Configuration)
    )
}

function getInitiativeLink(){
    return Configuration.INITIATIVE_LINK
}

function setInitiativeLink(newLink){
    Configuration.INITIATIVE_LINK = newLink
    fs.writeFileSync(
        configFilePath, JSON.stringify(Configuration)
    )
}

function getServerFinderLink(){
    return Configuration.SERVER_FINDER_LINK
}

module.exports = {
    ...config,
    addAdmin, getAdmins, removeAdmin, isAdmin,
    addOwner, getOwners, isOwner,
    isBotAdminInThisChannel,

    getReferalCost, setReferalCost,
    getVoteCost, setVoteCost,
    getMinimalWithdraw, setMinimalWithdraw,
    getPaymentChannelId, setPaymentChannelId,
    getInitiativeLink, setInitiativeLink,
    getServerFinderLink
}
