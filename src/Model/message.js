"use strict";

const mongoose = require("../Telegram-Api/node_modules/mongoose");
const Schema = mongoose.Schema;
const schema = new Schema({
message: {
			type: String,
			required: true,
			unique: true
		},
reply: {[
			type: Number,
			trim: true
		]}
		})
		
		
module.exports = mongoose.model("Player", schema);