const XLSX = require('xlsx')

/**
 * ButtonObject -> { text: 'some text', callback_data: 'some_text' }
 * @param {Array<ButtonObject>} buttons
 * @return {Array<InlineKeyboardButton>}
 */
function makeInlineKeyboard(buttons){
    const inline_keyboard = [];
    for(let i=0; i < buttons.length; i++){
        inline_keyboard.push(buttons[i]);
    }
    return {
      inline_keyboard: inline_keyboard
    }
}

// Ushbu intervaldagi [min, max] tasodifiy sonlarni qaytaradi
function getRandomNumber(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Array<number> dan String ga o'tkazuvchi funksiya
function arrToStr(arr) {
    return arr.join(',');
}
  
// String dan Array<number> ga o'tkazuvchi funksiya
function strToArr(str) {
    if (str === '') {
      return [];
    } else {
      const arr = str.split(',');
      return arr.map(Number);
    }
}

function getGMT5() {
    // Convert date string to Date object
    const dateObj = new Date();
    
    // Add 5 hours to the date
    dateObj.setHours(dateObj.getHours() + 5);
    // dateObj.setHours(dateObj.getHours());
  
    return dateObj
}

function extractNumberFromStart(text) {
    const startCommand = '/start ';
    if (text.startsWith(startCommand)) {
      const numberStr = text.slice(startCommand.length);
      const number = Number(numberStr);
      if (!isNaN(number)) {
        return number;
      }
    }
    return null;
}

/**
 * `cmd` `/help`, `/setvc` kabi bo'lishi mumkin
 */
function extractNumberFromCommand(cmd, text) {
    const startCommand = `${cmd} `;
    if (text.startsWith(startCommand)) {
      const numberStr = text.slice(startCommand.length);
      const number = Number(numberStr);
      if (!isNaN(number)) {
        return number;
      }
    }
    return null;
}

function isLinkValid(newLink) {
    const startingUrl = 'https://openbudget.uz/boards-list/2/';
    return newLink.startsWith(startingUrl);
}

function referalMaker(ctx){
  const userId = ctx.from.id
  const botUsername = ctx.botInfo.username
  const link = `https://t.me/${botUsername}?start=${userId}`

  return link;
}

function captchaCutter(captcha){
  return captcha.split('data:image/png;base64,')[1]
}

async function makeVoteList(Votes, filePath, callback=()=>{}){
  // Excel faylni yaratish
  const workbook = XLSX.utils.book_new()

  // Votes table'ni olish
  Votes.findAll()
  .then((votes) => {
    // Excel faylda ishlatiladigan ma'lumotlar massivini yaratish
    const worksheetData = [];
    worksheetData.push(['id', 'phone_number', 'votedAt']);
    votes.forEach((vote) => {
      worksheetData.push([vote.id, vote.phone_number, vote.votedAt]);
    });

    // Worksheet yaratish
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Workbookga worksheetni qo'shish
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Votes');

    // Faylni yaratish
    XLSX.writeFile(workbook, filePath); //'votes.xlsx'
  })
  .catch((err) => {
    console.error(err);
  });
}

module.exports = {
    makeInlineKeyboard,
    getRandomNumber,
    arrToStr, strToArr, getGMT5,
    extractNumberFromStart, extractNumberFromCommand,
    isLinkValid, referalMaker, captchaCutter, 
    makeVoteList
}