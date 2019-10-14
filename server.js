"use strict"

var http = require("http")

var port = (process.env.PORT || 8080)
require('./src/app.js')

http.createServer(function(request, response){
	response.writeHead(200, {"content-type":" aplication/json"})

	response.write(JSON.stringify({name: "MachineLearning", version: "0.0.1"}))

	        response.end()
}).listen(port)
