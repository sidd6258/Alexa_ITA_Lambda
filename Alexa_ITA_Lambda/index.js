 // 1. Text strings =====================================================================================================

 var speechOutput;
 var repromptText;
 var reprompt;
 const welcomeOutput = "Let's plan a trip. What would you like to book? Say book a hotel, book a car or book a flight";
 const welcomeReprompt = "Let me know how can i help you. Say book a hotel, book a car or book a flight";
 const tripIntro = [
   "This sounds like a cool trip. ",
   "This will be fun. ",
   "Oh, I like this trip. "
 ];

 var destination_car = null;
 var startdate_car = null;
 var enddate_car = null;
 var guests_car = null;
 var module = null;
 var destination_hotel = null;
 var startdate_hotel = null;
 var enddate_hotel = null;
 var guests_hotel = null;


 // 2. Skill Code =======================================================================================================

'use strict';
const Alexa = require('alexa-sdk');
const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const handlers = {
    'LaunchRequest': function () {
      this.response.speak(welcomeOutput).listen(welcomeReprompt);
      console.log("launch req: "+ JSON.stringify(this.response));
      this.emit(':responseReady');
    },
    'PlanMyTrip': function () {
        //delegate to Alexa to collect all the required slot values
        var filledSlots = delegateSlotCollection.call(this);

        //compose speechOutput that simply reads all the collected slot values
        speechOutput = randomPhrase(tripIntro);

        

        //Now let's recap the trip
        destination_hotel=this.event.request.intent.slots.destination_hotel.value;
        startdate_hotel=this.event.request.intent.slots.startdate_hotel.value;
        enddate_hotel=this.event.request.intent.slots.enddate_hotel.value;
        guests_hotel=this.event.request.intent.slots.guests_hotel.value;
        // module=this.event.request.intent.slots.module.value;

        
        



        console.log("user wants to book a hotel in "+destination_hotel+ " on "+startdate_hotel+" till "+enddate_hotel+ " with "+guests_hotel+" people.");

        speechOutput = "user wants to book a hotel in "+destination_hotel+ " on "+startdate_hotel+" till "+enddate_hotel+ " with "+guests_hotel+" people.";
        repromptText = "user wants to book a hotel in "+destination_hotel+ " on "+startdate_hotel+" till "+enddate_hotel+ " with "+guests_hotel+" people.";

        
        	this.attributes['destination_hotel'] = destination_hotel;
        	this.attributes['startdate_hotel'] = startdate_hotel;
        	this.attributes['enddate_hotel'] = enddate_hotel;
        	this.attributes['guests_hotel'] = guests_hotel;
      
        
        console.log(this.attributes);
        //say the results
        this.response.speak(speechOutput).listen(repromptText);
        console.log("before hotel emit: "+ JSON.stringify(this.response));
      
        this.emit(":responseReady");
        // this.emit(':ask', speechOutput);
    },
    'carIntent': function () {
        //delegate to Alexa to collect all the required slot values
        var filledSlots = delegateSlotCollection.call(this);

        //compose speechOutput that simply reads all the collected slot values
        speechOutput = randomPhrase(tripIntro);

        

        //Now let's recap the trip
        destination_car=this.event.request.intent.slots.destination_car.value;
        startdate_car=this.event.request.intent.slots.startdate_car.value;
        enddate_car=this.event.request.intent.slots.enddate_car.value;
        guests_car=this.event.request.intent.slots.guests_car.value;
        // module=this.event.request.intent.slots.module.value;

        
        



        console.log("user wants to book a car in "+destination_car+ " on "+startdate_car+" till "+enddate_car+ " with "+guests_car+" people.");

        speechOutput = "user wants to book a car in "+destination_car+ " on "+startdate_car+" till "+enddate_car+ " with "+guests_car+" people.";
        repromptText = "user wants to book a car in "+destination_car+ " on "+startdate_car+" till "+enddate_car+ " with "+guests_car+" people.";
        

        	this.attributes['destination_car'] = destination_car;
        	this.attributes['startdate_car'] = startdate_car;
        	this.attributes['enddate_car'] = enddate_car;
        	this.attributes['guests_car'] = guests_car;
        
        console.log(this.attributes);
        //say the results
        this.response.speak(speechOutput).listen(repromptText);        
        console.log("before car emit: "+ JSON.stringify(this.response));
        this.emit(":responseReady");
        // this.emit(':ask', speechOutput, repromptText);
    },
    'AMAZON.HelpIntent': function () {
        speechOutput = "";
        reprompt = "";
        this.response.speak(speechOutput).listen(reprompt);
        this.emit(':responseReady');
    },
    'AMAZON.CancelIntent': function () {
        speechOutput = "";
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'AMAZON.StopIntent': function () {
        speechOutput = "";
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
    'Unhandled': function () {
                HelpMessage ="help me"; 
                this.emit(':ask', HelpMessage, HelpMessage);
            },
    'SessionEndedRequest': function () {
        var speechOutput = "";
        this.response.speak(speechOutput);
        this.emit(':responseReady');
    },
};

exports.handler = (event, context) => {
    var alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    //alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};

//    END of Intent Handlers {} ========================================================================================
// 3. Helper Function  =================================================================================================

function delegateSlotCollection(){
  console.log("in delegateSlotCollection");
  console.log("current dialogState: "+this.event.request.dialogState);
    if (this.event.request.dialogState === "STARTED") {
      console.log("in Beginning");
      var updatedIntent=this.event.request.intent;
      //optionally pre-fill slots: update the intent object with slot values for which
      //you have defaults, then return Dialog.Delegate with this updated intent
      // in the updatedIntent property
      this.emit(":delegate", updatedIntent);
    } else if (this.event.request.dialogState !== "COMPLETED") {
      console.log("in not completed");
      // return a Dialog.Delegate directive with no updatedIntent property.
      this.emit(":delegate");
    } else {
      console.log("in completed");
      console.log("returning: "+ JSON.stringify(this.response));
      // Dialog is now complete and all required slots should be filled,
      // so call your normal intent handler.
      return this.event.request.intent;
    }
}

function randomPhrase(array) {
    // the argument is an array [] of words or phrases
    var i = 0;
    i = Math.floor(Math.random() * array.length);
    return(array[i]);
}
