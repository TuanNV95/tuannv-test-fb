'use strict';
const BootBot = require('bootbot');

const bot = new BootBot({
  accessToken: 'EAAMfpc4yQYkBAFF68TFvlJLfQeSzUZCfmAASilPV7b8rNtjvSyk1JuBssvKpfMHtsRODTVfGZBhRfurYEfPDxxyk8fSxlWdbYjzBxZAFdf4KxE7cSN4cvmaoO4PCC4TBY4hL9HOXc6Qb92ZAtdZAT43xRNZAzYuCZBWtqvzjyACWwZDZD',
  verifyToken: 'TUANNGUYENPX',
  appSecret: 'e684d2bb23ee636372faaf2be5a2803a'
});

bot.on('message', (payload, chat) => {
  const text = payload.message.text;
  chat.say('Echo: ' + text);
});

bot.start();