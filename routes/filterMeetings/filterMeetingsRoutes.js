const express = require("express");
const router = express.Router();
const Meeting = require("../../models/meetingSchema.js");
const User = require("../../models/userSchema").User;
//
router.post("/", (req, res) => {
  let arr = [];
  if (req.body.role === "Head") {
    Meeting.find({ department: req.body.department }, (err, data) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send(data);
      }
    });
  } else if (req.body.role === "CEO") {
    Meeting.find({}, (err, data) => {
      if (err) {
        console.log(err);
        res.send(err);
      } else {
        res.send(data);
      }
    });
  } else if (req.body.role === "Employee") {
    User.find({ email: req.body.email }, (err, data) => {
      Meeting.find({}, (err, result) => {
        for (let i = 0; i < result.length; i++) {
          for (let j = 0; j < result[i].employees.length; j++) {
            if (result[i].employees[j].label === data[0].fullname) {
              arr.push(result[i]);
            }
          }
        }
        res.send(arr);
      });
    });
  }
});

module.exports = router;
