// const { Models } = require('./src/models')
// const { Votes } = Models;
// const helpers  = require('./src/utils/helpers');

// (async () => {
//   for(let i=0; i < 10; i++){
//     setTimeout( async () => {
//       await Votes.create({
//         fullname: `Name ${i}`,
//         phone_number: `+998911459${i}`,
//         votedAt: helpers.getGMT5().toISOString()
//       })
//     }, 500)
//   }

//   console.log('Tugadi!')
// })()

const { captcha } = require('./captcha.json')

console.log(
    captcha.split('data:image/png;base64,')[1]
)