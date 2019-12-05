const mongoose = require("mongoose"); // Nao precisa dizer que o modulo esta dentro dentro de "node_modules", o Node sabe que esta la
mongoose.connect("Data Base Link", {useNewUrlParser: true, useUnifiedTopology: true});

const rmodel = require("./Model/replys");

exports.model = mongoose.model("Reply");