const bot  = require("./Telegram-Api/tapi.js")["bot"]

const engine = require('./machine_engine.js')

console.log('estou on')

bot.on('message', engine.start)

bot.on('polling_error', (err)=>{
	console.log(err)
})