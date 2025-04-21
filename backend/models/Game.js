// models/Game.js
const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    gameType: { type: String, required: true },
    players: [
      {
        id: String,
        username: String,
        isAdmin: Boolean,
        _id: false,
      },
    ],
    state: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

gameSchema.pre("save", function (next) {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Game", gameSchema);
