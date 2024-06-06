var express = require('express');
var app = express();
var webPush = require('web-push');
var bodyParser = require('body-parser');

app.set('port', 5001);
app.use(express.static(__dirname + '/'));
app.use(bodyParser.json());

const publicVapidKey = 'BBhBkM0W8x3qpogVpX6S4x40zDi_BosKA7gwr7lsH13PhgYi0FpUvXE8Ut4zYVgoeTHp9HP3Y3JEnzHeet8W3lw';  // Replace with your public VAPID key
const privateVapidKey = 'S7cmw0VY70Ym7UyOJP-9G5BZQL0PwQhAxjHxTdLpJ98';  // Replace with your private VAPID key

webPush.setVapidDetails('mailto:seth.pattee@students.snow.edu', publicVapidKey, privateVapidKey);
webPush.setGCMAPIKey(null);  // Set the GCM API Key to null

app.post('/register', function(req, res) {
  // A real world application would store the subscription info.
  res.sendStatus(201);
});

app.post('/sendNotification', function(req, res) {
  console.log(req.body);

  const subscription = {
    endpoint: req.body.endpoint,


    
    keys: {
      p256dh: req.body.key,
      auth: req.body.authSecret
    }
  };

  const payload = JSON.stringify({
    title: req.body.title,
    icon: req.body.icon,
    body: req.body.body,
    url: req.body.link
  });

  webPush.sendNotification(subscription, payload)
    .then(function() {
      console.log("Push notification sent successfully");
      res.sendStatus(201);
    })
    .catch(function(err) {
      console.error('Error sending push notification', err);
      res.sendStatus(500);
    });
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


//to run 
//npm install
//node server
//Now open http://localhost:5001