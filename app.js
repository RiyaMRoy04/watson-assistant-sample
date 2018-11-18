// Example 2: adds user input and detects intents.

var prompt = require('prompt-sync')();
var AssistantV2 = require('watson-developer-cloud/assistant/v2');

// Set up Assistant service wrapper.
var service = new AssistantV2({
  iam_apikey: '', // replace with API key
  version: '2018-09-20'
});

var assistantId = ''; // replace with assistant ID
var sessionId;

// Create session.
service.createSession({
  assistant_id: assistantId
}, function(err, result) {
  if (err) {
    console.error(err); // something went wrong
    return;
  }
  sessionId = result.session_id;
  sendMessage(); // start conversation with empty message
});

// Send message to assistant.
function sendMessage(messageText) {
  service.message({
    assistant_id: assistantId,
    session_id: sessionId,
    input: {
      message_type: 'text',
      text: messageText
    }
  }, processResponse);
}

// Process the response.
function processResponse(err, response) {
  if (err) {
    console.error(err); // something went wrong
    return;
  }

  // If an intent was detected, log it out to the console.
  if (response.output.intents.length > 0) {
    console.log('Detected intent: #' + response.output.intents[0].intent);
  }

  // Display the output from assistant, if any. Assumes a single text response.
  if (response.output.generic.length != 0) {
    console.log(response.output.generic[0].text);
  }

  // Prompt for the next round of input.
  var newMessageFromUser = prompt('>> ');
    if (newMessageFromUser === 'quit') {
      service.deleteSession({
        assistant_id: assistantId,
        session_id: sessionId
      }, function(err, result) {
        if (err) {
          console.error(err); // something went wrong
        }
      });
      return;
    }
  sendMessage(newMessageFromUser);
}