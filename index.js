/* eslint-disable no-console */
/* eslint no-use-before-define: ["error", {"functions": false}] */
/* eslint-disable prefer-destructuring */
/* eslint-disable prefer-arrow-callback */

var jar_list = [];

var jar = {jar_task: "workout", frequency: "weekly", payment: 2, destination: "American Cancer Society", total: 0};
jar_list.push(jar);

// alexa-cookbook sample code

// There are three sections, Text Strings, Skill Code, and Helper Function(s).
// You can copy and paste the entire file contents as the code for a new Lambda function,
//  or copy & paste section #3, the helper function, to the bottom of your existing Lambda code.


// 1. Text strings =====================================================================================================
//    Modify these strings and messages to change the behavior of your Lambda function

const myRequest = ['hello','howdy','hi', 'good day'];  // Array of items

// 2. Skill Code =======================================================================================================


const Alexa = require('ask-sdk');

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "LaunchRequest";
    },
    
    handle(handlerInput) {
        // this.response.speak("This is test");
        return handlerInput.responseBuilder.speak("Welcome to swear jar").getResponse();
    }
};

const SetupJarHandler = {
  canHandle(handlerInput) {
      return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
      handlerInput.requestEnvelope.request.intent.name === "Setup";
  }, 
  
  handle(handlerInput) {
    var slots = handlerInput.requestEnvelope.request.intent.slots;
    var newjar = 
    { 
      jar_task: slots.goal.value, 
      frequency: slots.frequency.value, 
      payment: slots.amount.value, 
      destination: "American Cancer Society",
      total: 0
    }
    jar_list.push(newjar);
    return handlerInput.responseBuilder.speak("Great! Making a "  + newjar.jar_task + " jar with " + newjar.payment + " dollars.").getResponse();
  }
}

const CheckJarHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
        handlerInput.requestEnvelope.request.intent.name === "Check";
    },
    
    handle(handlerInput) {
        // this.response.speak("This is test");
        return handlerInput.responseBuilder.speak("In the " + jar.jar_task + " swear jar, you have " + jar.total).getResponse();
    }
};

/*
    Helper function that returns a speakable list of product names from a list of
    entitled products.
*/
function getSpeakableListOfJars() {
  const jarNameList = jar_list.map(jar => jar.jar_task);
  let jarListSpeech = jarNameList.join(', '); // Generate a single string with comma separated product names
  jarListSpeech = jarListSpeech.replace(/_([^_]*)$/, 'and $1'); // Replace last comma with an 'and '
  return jarListSpeech;
}

const ListJarHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === "IntentRequest" &&
        handlerInput.requestEnvelope.request.intent.name === "List";
  },
  
  
  handle(handlerInput) {
    return handlerInput.responseBuilder.speak(`You currently have ${getSpeakableListOfJars()}`).getResponse();
  }
}

exports.handler = Alexa.SkillBuilders.standard()
  .addRequestHandlers(
    LaunchRequestHandler,
    SetupJarHandler,
    ListJarHandler,
    CheckJarHandler
  )
//   .addRequestInterceptors(RequestLog)
//   .addResponseInterceptors(ResponseLog)
//   .addErrorHandlers(ErrorHandler)
  .lambda();
