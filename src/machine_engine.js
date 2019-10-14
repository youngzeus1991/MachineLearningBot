'use_strict'

const db = require("./db.js");
const bot  = require("./Telegram-Api/tapi.js")["bot"]
var Reply = db.model

exports.start = (msg) => {
	
	if(msg.reply_to_message){
	if(msg.reply_to_message.from.id != '952241356'){
		
		if(msg.reply_to_message.sticker != undefined){
			const stickerId = msg.reply_to_message.sticker.file_id
			
		Reply.find({message: stickerId})
		  .then(Obj => {
		  
		 if(JSON.stringify(Obj) != '[]'){
		 	 	 console.log('achou')
		  var arrayOfReplys = Obj[0].reply
		   		if(msg.sticker != undefined){
		    arrayOfReplys.push(msg.sticker.file_id )
		    } else {
		       arrayOfReplys.push(msg.text)
		    }
		    
		    console.log(arrayOfReplys)
		    
		Reply.findOneAndUpdate({message: stickerId}, {reply: arrayOfReplys}, {new: true})
			  .then(data => {
				  console.log(data)
		  })
		    .catch(error => {
		       console.log(error)
		    })
		   } else {
		      console.log(Obj)
		   	addNewReplyFile(msg, stickerId)
		   }
				})
		.catch(err => {
		   console.log(err)
		})
		} else if(msg.reply_to_message.text != undefined){
		
	   const messageText = msg.reply_to_message.text
		//for(let i = 0; i < replys.length; i++){
		  Reply.find({message: messageText})
		    .then(Obj => {
		    
		   if(JSON.stringify(Obj) != '[]'){
		   	 	 console.log('achou')
		    var arrayOfReplys = Obj[0].reply
		     
		     if(msg.sticker != undefined){
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
		})
		  .catch(err => {
		     console.log(err)
		  })
		//}
		}
	}
	}
	
	if(msg.reply_to_message == undefined || msg.reply_to_message.from.id == '952241356'){
	
	var messageText = ''
	var stickerId = ''
  
  	if(msg.sticker != undefined){
  		stickerId = msg.sticker.file_id
  	} else {
 	 	messageText = msg.text
  	}
  		
	if(msg.text){	   
	 Reply.find({message: messageText})
	 	.then(data => {
		  if(JSON.stringify(data) != '[]'){
			const textToSend = data[0].reply[Math.floor(Math.random()* data[0].reply.length)]
			replyUser(msg, textToSend)
		  } else {
			console.log('Sem resposta!')
			}
			})
		.catch(error => {
		
		})

	} else if(msg.sticker){

Reply.find({message: stickerId})
	.then(data => {
		  if(JSON.stringify(data) != '[]'){
			const textToSend = data[0].reply[Math.floor(Math.random()* data[0].reply.length)]
			replyUser(msg, textToSend)
		  } else {
			console.log('Sem resposta!')
			}
			})
		.catch(error => {
		
		})

	}
	}
	function addNewReply(msg){
		
		const messageObject = {
			message: msg.reply_to_message.text,
			reply: [msg.text]
		}
	
		replyDataBase = new Reply()
		replyDataBase.message = messageObject.message
		replyDataBase.reply = messageObject.reply[0]
		
		replyDataBase.save()
		 .then(s => {
		console.log('Salvo')
		})
		  .catch(e => {
		  	console.log('Erro: ',e)
		  })
	}
	
	function addNewReplyFile(msg){
	  var reply = ''
		if(msg.sticker != undefined){
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
		 .then(s => {
		console.log('Salvo')
		})
		  .catch(e => {
		  	console.log('Erro: ',e)
		  })
	}
	
	function replyUser(msg, reply){
	
	    const chatid = msg.chat.id
	    const replyId = msg.message_id
	    const messageToSend = reply
	    
	    const options = {
	        reply_to_message_id: replyId
	        
	    }
	    
	    bot.sendSticker(chatid, messageToSend, options)
	     .then(s => {
				console.log('sucess')
	   		})
	   	.catch(e => {
	   	     console.log(e.message)
	   		 bot.sendMessage(chatid, messageToSend, options)
	   	})
	   	
    }
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