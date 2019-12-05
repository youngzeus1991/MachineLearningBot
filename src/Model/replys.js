"use strict";

const mongoose = require("mongoose");  // Nao precisa dizer que o mongoose está na 'node_modules',
// o Node sabe que está la se foi instalado pelo comando npm install mongoose
const Schema = mongoose.Schema;
const schema = new Schema({
message: {
			type: String,
			required: true,
			unique: true
		},
reply: {
			type: Array,
			trim: true
		}
		})
		
		
module.exports = mongoose.model("Reply", schema);