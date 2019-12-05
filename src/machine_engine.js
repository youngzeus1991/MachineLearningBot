/* Modulos
 -Node-telegram-api
 -mongoose
*/

//Importando DataBase
const db = require("./db.js")
//Importando Api telegram
const bot  = require("./Telegram-Api/tapi.js")["bot"]

//Setando DataBase
var Reply = db.model

//Funcao De Start
exports.start = async (msg) => {
	const dadosBot = await bot.getMe()
	// console.log(dadosBot) // Pra saber dados do bot
	
	//Restringindo o bot a responder apenas mesagens sem narcação
	if(msg.reply_to_message) { // Se for uma resposta/reply, esse 'if' é true entao vai executar, se for undefined ou null é false
		//Restringindo o bot a também só responder mensagens no qual ele foi marcado
		if(msg.reply_to_message.from.id != dadosBot.id) { // Ao inves de colocar um ID fixo do bot, verificar se o id de quem mandou a mensagem é o mesmo do bot
			//Setando opção para enviar ou reconhecer stickers e textos
			if(msg.reply_to_message.sticker) { // Em checagens 'if', qualquer valor diferente de undefined, null, false ou até zero é igual a true
				// Entao dentro de 'if's, undefined == null == false, apenas em checagens do tipo boolean (true e false)
				const stickerId = msg.reply_to_message.sticker.file_id

				var Obj = await Reply.find({message: stickerId})
					
				if(JSON.stringify(Obj) != '[]') {
				
					var arrayOfReplys = Obj[0].reply
					if(msg.sticker) { // Novamente aqui o valor é true se for diferente de undefined, null ou false
						arrayOfReplys.push(msg.sticker.file_id)
					}
					else {
						arrayOfReplys.push(msg.text)
					}
					
					Reply.findOneAndUpdate({message: stickerId}, {reply: arrayOfReplys}, {new: true})
						.then(data => {
							console.log(data)
					  	})
					  	.catch(error => {
					   		console.log(error)
						})
				}

				   else {
				    	console.log(Obj)
				   		addNewReplyFile(msg, stickerId)
				   }
				
			} else if(msg.reply_to_message.text) {
			
		   		const messageText = msg.reply_to_message.text

				var Obj = await Reply.find({message: messageText})
					.catch(err => {
						console.log(err.message)
						return
					})
				
			   	if(JSON.stringify(Obj) != '[]') {
			   		console.log('achou')
			    	var arrayOfReplys = Obj[0].reply
			
			    	if(msg.sticker){
			    		arrayOfReplys.push(msg.sticker.file_id )
			    	 	console.log(arrayOfReplys)
			    	} else {
				    	arrayOfReplys.push(msg.text)
			    	}
			
			    	console.log(arrayOfReplys)
			 
			  	Reply.findOneAndUpdate({message: messageText}, {reply: arrayOfReplys}, {new: true})
			  		.then(data => {
			  			console.log(data)
			    	})
			      	.catch(error => {
			        	console.log(error)
			    	})
			    } else {
				
			        console.log(Obj)
			     	addNewReply(msg, messageText)
			    }
		  
			}
		}
	}
	
	if(!msg.reply_to_message || msg.reply_to_message.from.id == dadosBot.id) { // Se valor == undefined, valor == false ou !valor (valor NAO true => !valor)
		
		var messageText = ''
		var stickerId = ''
		
  		if(msg.sticker) {
  			stickerId = msg.sticker.file_id
  		} else {
 		 	messageText = msg.text
  		}
	  
		if(msg.text){	   
			Reply.find({message: messageText})
		 		.then(data => {
					if(JSON.stringify(data) != '[]') {
						const textToSend = data[0].reply[Math.floor(Math.random()* data[0].reply.length)]
						replyUser(msg, textToSend)
			  		} else {
			//Para testes, console.log('Sem resposta!')
					}	
				})
				.catch(error => {
					console.log(error.message) // Mensagem de erro adicionada porque está faltando
			})
		
		} else if(msg.sticker) {
		
			Reply.find({message: stickerId})
				.then(data => {
					if(JSON.stringify(data) != '[]'){
						const textToSend = data[0].reply[Math.floor(Math.random()* data[0].reply.length)]
						replyUser(msg, textToSend)
			  		} else {
				//Para testes, console.log('Sem resposta!')
					}
				})
				.catch(error => {
					console.log(error.message)
			})
		
		}
	}
	//Funcao para adicionar uma resposta a DataBase
	function addNewReply(msg){
		
		const messageObject = {
			message: msg.reply_to_message.text,
			reply: [msg.text]
		}
	
		replyDataBase = new Reply()
		replyDataBase.message = messageObject.message
		replyDataBase.reply = messageObject.reply[0]
		
		replyDataBase.save()
		 	.then(() => {
				console.log('Salvo')
		})
			.catch(e => {
		  		console.log('Erro: ' + e.message)
		  })
	}
	
	//Funcao para adicionar novo sticker(file_id) na data base
	function addNewReplyFile(msg){
		var reply = ''
		if(msg.sticker) { // msg.sticker != undefined é o mesmo que msg.sticker (true)
			reply = msg.sticker.file_id
		} else {
			reply = msg.text
		}
		
		const messageObject = {
			message: msg.reply_to_message.sticker.file_id,
			reply: [reply]
		}
	
		replyDataBase = new Reply()
		replyDataBase.message = messageObject.message
		replyDataBase.reply = messageObject.reply[0]
		
		replyDataBase.save()
			.then(() => {
				console.log('Salvo')
			})
		  	.catch(e => {
		  		console.log('Erro: ',e)
		  	})
	}
	
	//Funcao para responder o usuário
	function replyUser(msg, reply){
	
	    const chatid = msg.chat.id
	    const replyId = msg.message_id
	    const messageToSend = reply
	    
	    const options = {
	        reply_to_message_id: replyId
	        
	    }
	    //Lógica: Caso falhar em enviar o sticker, ele irá enviar a mensagem
	    bot.sendSticker(chatid, messageToSend, options)
	    	.then(() => {
				//Para testes, console.log('sucess')
	   		})
	   		.catch(() => {
	   	     //Para testes, console.log(e.message)
	   			bot.sendMessage(chatid, messageToSend, options)
	   		})
	   	
    }
    //Funcao teste
    /*
    function replyUserFile(msg, reply){
    
    const chatid = msg.chat.id
    const replyId = msg.message_id
    const stickerId = reply
    
    const options = {
    reply_to_message_id: replyId
    }
    
    bot.sendSticker(chatid, stickerId, options)
    
    }
    */
  
}