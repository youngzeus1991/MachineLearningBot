const mongoose = require("./Telegram-Api/node_modules/mongoose");
mongoose.connect("Data Base Link");

const rmodel = require("./Model/replys");

exports.model = mongoose.model("Reply");