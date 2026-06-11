const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  meetingId: String,
  title: String,
  host: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
},
  status: String,
});

const Meeting = mongoose.model("Meeting", meetingSchema);

module.exports = Meeting;