const mongoose = require("mongoose");

const GameSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  picture:String,
  cloudinaryId: String,
  numberOfVotes: Number,
  sumOfVotes: Number,
});

module.exports = mongoose.model("Game", GameSchema);
