// const ngrok = require('ngrok');
const { sequelize, Models } = require('./models');
const { logger } = require('./utils');
const {
    bot, 
    setupCommands, 
    setupMiddlewares, 
    setupUpdates 
} = require('./core');

try {
    setupMiddlewares(bot);
    setupCommands(bot);
    setupUpdates(bot);

    // const port = 3000;
    // const url = await ngrok.connect({ addr: port });
    // botInstance.telegram.setWebhook(`${url}/bot`);
    // botInstance.startWebhook(`/bot`, null, port);
    
    console.log('Bot is up and running!');
    bot.launch({ dropPendingUpdates: true });

} catch(err){
    logger.error("Starting bot failed!", { message: err.message })
}

// Enable graceful stop
process.once('SIGINT', () => {
    const reason = 'SIGINT event is fired!';
    logger.error(reason);
    sequelize.close()
        .then( () => logger.info(`Database connection successfully closed.`));
    bot.stop(reason);
});

process.once('SIGTERM', () => {
    const reason = 'SIGTERM event is fired!';
    logger.error(reason);
    sequelize.close()
        .then( () => logger.info(`Database connection successfully closed.`));
    bot.stop(reason);
});
