/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/

// alexa-cookbook sample code

// There are three sections, Text Strings, Skill Code, and Helper Function(s).
// You can copy and paste the entire file contents as the code for a new Lambda function,
// or copy & paste section #3, the helper function, to the bottom of your existing Lambda code.

// TODO add URL to this entry in the cookbook


 // 1. Text strings =====================================================================================================
 //    Modify these strings and messages to change the behavior of your Lambda function

 var speechOutput;
 var repromptText;
 var reprompt;
 const request=require('request');
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
 var carOptions = null;
 var car_selection = null;
 var car_confirmation = null;
 var updatedIntent=null;


 // 2. Skill Code =======================================================================================================

'use strict';
const Alexa = require('alexa-sdk');
const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

const handlers = {
    'LaunchRequest': function () {
    	if (this.event.session.user.accessToken == undefined) {

  	      this.emit(':tellWithLinkAccountCard','to start using this skill, please use the companion app to authenticate on Amazon');

  	            return;

  	        }
  	var amznProfileURL = 'https://api.amazon.com/user/profile?access_token=';

      amznProfileURL += this.event.session.user.accessToken;
      this.attributes['state'] = 'launch';
          
      request(amznProfileURL, function(error, response, body) {
          if (response.statusCode == 200) {

              var profile = JSON.parse(body);
              console.log(profile.name);
              this.emit(':ask', "Hello, " + profile.name +" " + welcomeOutput, welcomeReprompt);  

          } else {

              this.emit(':tell', "Hello, I can't connect to Amazon Profile Service right now, try again later");

          }

      }.bind(this));
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

        // if(module == 'hotel'){

        	this.attributes['destination_hotel'] = destination_hotel;
        	this.attributes['startdate_hotel'] = startdate_hotel;
        	this.attributes['enddate_hotel'] = enddate_hotel;
        	this.attributes['guests_hotel'] = guests_hotel;
        // }

        // if(module == 'car'){

        // 	this.attributes['destination_car'] = destination;
        // 	this.attributes['startdate_car'] = startdate;
        // 	this.attributes['enddate_car'] = enddate;
        // 	this.attributes['guests_car'] = guests;
        // }

        // if(module == 'flight'){

        // 	this.attributes['destination_flight'] = destination;
        // 	this.attributes['startdate_flight'] = startdate;
        // 	this.attributes['enddate_flight'] = enddate;
        // 	this.attributes['guests_flight'] = guests;
        // }
        
        console.log(this.attributes);
        //say the results
        this.response.speak(speechOutput).listen(repromptText);
        console.log("before hotel emit: "+ JSON.stringify(this.response));
        this.event.request.dialogState = "IN_PROGRESS";
        this.emit(":responseReady");
        // this.emit(':ask', speechOutput);
    },
    'carIntent': function () {
        //delegate to Alexa to collect all the required slot values
    	
    	if(this.attributes['state']=="launch"){
    		var filledSlots = delegateSlotCollection.call(this);
    		destination_car=this.event.request.intent.slots.destination_car.value;
            startdate_car=this.event.request.intent.slots.startdate_car.value;
            enddate_car=this.event.request.intent.slots.enddate_car.value;
            guests_car=this.event.request.intent.slots.guests_car.value;
            this.attributes['destination_car'] = destination_car;
        	this.attributes['startdate_car'] = startdate_car;
        	this.attributes['enddate_car'] = enddate_car;
        	this.attributes['guests_car'] = guests_car;
    	}
        //compose speechOutput that simply reads all the collected slot values
      

        

        //Now let's recap the trip
        if(this.attributes['state']=="car_selection"){
        	car_selection = this.event.request.intent.slots.selection.value;
        	this.attributes['car_selection'] = car_selection;
        }
        
        car_confirmation = this.event.request.intent.slots.confirmation.value;
        // module=this.event.request.intent.slots.module.value;       	
        this.attributes['car_confirmation'] = car_confirmation;
        	
        	
        	if(car_selection != null && this.attributes['state']=="car_selection"){               
                this.attributes['car_selection'] = car_selection;             
                speechText = "You are about to book car " + this.attributes['carOptions'][car_selection] + " " + ".Please Confirm.";
                repromptText ="You are about to book car " + this.attributes['carOptions'][car_selection] + " " + ".Please Confirm.";
                console.log(this.attributes);
                this.event.request.dialogState = "STARTED";	
                this.attributes['state']='car_confirmation';
                this.emit(':confirmIntent', speechText, repromptText);
            }
        	
        	if(this.event.request.intent.confirmationStatus == 'CONFIRMED'){        		
                this.attributes['car_confirmation'] = car_confirmation;   
                car_selection = this.attributes['car_selection'];
                speechText = "You booked " + this.attributes['carOptions'][car_selection] + " " + ". Thank You for using I.T.A.";
                repromptText ="You booked " + this.attributes['carOptions'][car_selection] + " " + ". Thank You for using ITA";
                console.log(this.attributes);
                this.emit(':ask', speechText, repromptText);
            }
        	
        	console.log("option request : "+ JSON.stringify(this.event.request));
        	carOptions = {      1:"Option A",
                    2:"Option B",
                    3:"Option C",
                    4:"Option D",
                    5:"Option E"}
          speechText = "Five Cars available 1, 2, 3, 4, 5, choose one option";
          repromptText = "Five Cars available 1, 2, 3, 4, 5, choose one option";
          this.attributes['carOptions']=carOptions;
          this.event.request.dialogState = "STARTED";	
          console.log(this.attributes);
        //say the results    
          this.attributes['state']='car_selection';
          this.emit(':elicitSlot','selection', speechText, repromptText,updatedIntent);
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
      updatedIntent=this.event.request.intent;
      //optionally pre-fill slots: update the intent object with slot values for which
      //you have defaults, then return Dialog.Delegate with this updated intent
      // in the updatedIntent property
      console.log("event started: "+ JSON.stringify(this.event));
      this.emit(":delegate", updatedIntent);
    } else if (this.event.request.dialogState !== "COMPLETED") {
      console.log("in not completed");
      console.log("request inprogress: "+ JSON.stringify(this.event.request));
      if(this.event.request.intent.slots.destination_car.value!=undefined 
    		  && this.event.request.intent.slots.startdate_car.value!=undefined
    		  && this.event.request.intent.slots.enddate_car.value!=undefined
    		  && this.event.request.intent.slots.guests_car.value!=undefined){
    	  return this.event.request.intent;
      }
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