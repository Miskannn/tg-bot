const token = "2097975825:AAHWS5WlikG_6BgukCxpdT-TbKFNgExm0vc"
const TelegramApi = require("node-telegram-bot-api")
const bot = new TelegramApi(token, {polling: true})
const {gameOptions,againOptions} = require('./options')
const db = require('./database')
const UserModel = require('./models')
const User = require("./models")
const chats = {}

const startGame = async(chatId) =>{
    await bot.sendMessage(chatId, 'Сейчас я загадаю цифру от 1 до 9,а ты попробуй отгадать')
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber;
    await bot.sendMessage(chatId, "Отгадывай" , gameOptions)
}

const start = async () =>{

    try{
      await db.authenticate();
      await db.sync();

    } catch (e){
       console.log(e)
    }


    bot.setMyCommands([
        {command: "/start",description: "Start work with me"},
        {command: "/info",description: "Find out who you are"},
        {command: "/game",description: "Play a game with me"}
    ])
   
    
    bot.on("message", async msg =>{
        
        const text = msg.text;
        const chatId = msg.chat.id;
        
    try{
        if(text === "/start"){
            await UserModel.create({chatId})
            await bot.sendSticker(chatId,"https://tlgrm.ru/_/stickers/80a/5c9/80a5c9f6-a40e-47c6-acc1-44f43acc0862/2.webp")
            return bot.sendMessage(chatId,`Hello`)
        }
        
        if(text === "/info"){
            const user = await UserModel.findOne({chatId})
            return bot.sendMessage(chatId, `Тебя зовут ${msg.from.first_name} ${msg.from.last_name},в игре у тебя ${user.right} правильных ответов,и ${user.wrong} неправильных`)
        }
        
        if(text === "/game"){
           return startGame(chatId);
        }


        return bot.sendMessage(chatId, `Ты ввёл неправильную команду,попробуй снова`)
    }catch{
        bot.sendMessage(chatId, "Произошла непонятная ошибка")
    }
        
    })
    bot.on("callback_query",async msg =>{
        const data = msg.data;
        const chatId = msg.message.chat.id;
        const user = await UserModel.findOne({chatId})

        if (data === "/again"){
          return startGame(chatId);
        }

        if(data == chats[chatId]){
           user.right+=1;
           return bot.sendMessage(chatId,`Ты угадал,это было число ${chats[chatId]}`, againOptions)
        } else {
            user.wrong+=1;
            return bot.sendMessage(chatId,`Увы,ты не угадал, это было число ${chats[chatId]}`, againOptions)
        }
        await user.save();

        

        
    })
}

start();
