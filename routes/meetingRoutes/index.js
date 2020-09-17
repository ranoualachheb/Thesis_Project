const express = require('express');
const router = express.Router();
const Meeting = require('../../models/meetingSchema.js');
const Notification = require('../../models/notificationSchema.js');

router.post('/create', (req, res) => {
  const data = req.body;
  //   console.log(data);
 
var model = new Meeting(req.body);
  model.save(function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.send('meeting have been created');
    }
    res.end();
  });
});
//
router.post('/store', (req, res) => {
  var notification = new Notification(req.body);
  notification.save(function (err, result) {
    if (err) {
      res.send(err);
    } else {
      console.log(result);
    }
    res.send();
  });
});

module.exports = router;
