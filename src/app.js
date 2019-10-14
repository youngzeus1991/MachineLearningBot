const bot  = require("./Telegram-Api/tapi.js")["bot"]

const engine = require('./machine_engine.js')

//Para testes, console.log('estou on')

bot.on('message', engine.start)

bot.on('polling_error', (err)=>{
	//Para testes, console.log(err)
	
})