'use strict';

// Imports dependencies and set up http server
const
  express = require('express'),
  bodyParser = require('body-parser'),
  app = express().use(bodyParser.json()); // creates express http server

// Sets server port and logs message on success
app.listen(process.env.PORT || 5000, () => console.log('webhook is listening'));

app.get('/', (req, res) => {
  res.send("webhook is listening...");
});

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 
  // Parse the request body from the POST
  let body = req.body;

  // Check the webhook event is from a Page subscription
  if (body.object === 'page') {

	  console.log(body);
    // Iterate over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

	  // Gets the body of the webhook event
	  let webhook_event = entry.messaging[0];
	  console.log(webhook_event);


	  // Get the sender PSID
	  let sender_psid = webhook_event.sender.id;
	  console.log('Sender PSID: ' + sender_psid);

	  // Check if the event is a message or postback and
	  // pass the event to the appropriate handler function
	  if (webhook_event.message) {
		res.status(200).send(handleMessage(sender_psid, webhook_event.message));        
	  } else if (webhook_event.postback) {
		handlePostback(sender_psid, webhook_event.postback);
	  }
	  
	});

    // Return a '200 OK' response to all events
    res.status(200).send('EVENT_RECEIVED');

  } else {
    // Return a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "TUANNGUYENPX"
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});

function handleMessage(sender_psid, received_message) {

  let response;
  console.log("rece: " + received_message);

  // Check if the message contains text
  if (received_message.text) {    

    // Create the payload for a basic text message
    response = {
      "text": "You sent the message: " + received_message.text + ". Now send me an image!"
    };
  }  
  
  console.log("Sends the response message");
  console.log("id: " + sender_psid);
  console.log("res: " + response.text);
  
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  console.log(request_body);
  return request_body;
  // callSendAPI(sender_psid, response);
}

function callSendAPI(sender_psid, response) {
  // Construct the message body
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  }

  console.log(request_body);
  // Send the HTTP request to the Messenger Platform
  // request({
    // "url": "https://graph.facebook.com/v2.6/me/messages",
    // "qs": { "access_token": "EAAMfpc4yQYkBACHtTgsDV2ocjbbRLqU1YsbIldG9mqLEZAJIV8IJD5ZAhfdcq9NcbixEe7eFcIZAbMkqY2UAjx19SuTQhVk6CTJMZC6n5tuXTSV78Yv3j7f9ZBt8QL51WGAOqfPgUPGDcrHJF3qKMRUO9LlLqoDr8jeZA2luwqxgZDZD" },
    // "method": "POST",
    // "json": request_body
  // }, (err, res, body) => {
    // if (!err) {
      // console.log('message sent!')
    // } else {
      // console.error("=========================== error ============================");
      // console.error("Unable to send message:" + err);
    // }
  // }); 
}
