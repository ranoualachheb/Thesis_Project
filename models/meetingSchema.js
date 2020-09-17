const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MeetingSchema = new Schema({
  subject: {
    type: String,
  },
  HeadofDepartment: {
    type: String,
  },
   employees: {
    type: Array,
  },
  date: {
    type: String,
  },
  time: {
    type: String,
  },
  department: {
    type: String,
  },
});

const Meeting = mongoose.model("meeting", MeetingSchema);

module.exports = Meeting;
