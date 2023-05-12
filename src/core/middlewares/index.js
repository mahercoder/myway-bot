const report = require('./report');
const i18n = require('./i18n');
const stage = require('./stage');
const session  = require('./session');
// const isAuth = require('./isAuth');
const paymentHandler = require('./paymentHandler');

module.exports = async bot => {
    bot.use(session);
    bot.use(i18n);
    bot.use(stage);
    bot.action(/.+/, paymentHandler);
    bot.catch(report);
}