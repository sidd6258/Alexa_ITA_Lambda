var speechOutput;
var reprompt;
var welcomeOutput = "<s>Welcome to the Intelligent travel agent.</s> " +
"<s>You can ask to book a Hotel or book a rental car</s>";
var welcomeReprompt = "You can say, " +
"I want to book a hotel or I want to book a rental car";
var tripIntro = [
	"This sounds like a cool trip. ",
	"This will be fun. ",
	"Oh, I like this trip. "
	];

var snippets = {
        WELCOME: "<s>Welcome to the Intelligent travel agent.</s> " +
        "<s>You can ask to book a Hotel or book a rental car</s>",

        WELCOME_REPROMPT: "You can say, " +
        "I want to book a hotel or I want to book a rental car",

        DESTINATION: "Ok, Where do you want to book the hotel?",
        DESTINATION_CAR: "Ok, Where do you want to book the rental car?",

        DESTINATION_REPROMPT: "In order to book a hotel, please tell me: the destination for the hotel?",
        DESTINATION_REPROMPT_CAR: "In order to book a rental car, please tell me: the destination?",

        DESTINATION_INVALID: "Sorry I couldn't understand your travel destination?",

        STARTDATE: "Ok, please tell me the date you want to book the hotel from",
        STARTDATE_CAR: "Ok, please tell me the date you want to book the car from",

        STARTDATE_REPROMPT: "In order to book a hotel, please tell me the travel check in date?",
        STARTDATE_REPROMPT_CAR: "In order to book a car, please tell me the travel check in date?",

        STARTDATE_INVALID_PAST: "Nice, you live in the past. Do you have a time machine? Seriously, can you please say your actual desired check in date?",

        STARTDATE_INVALID: "Sorry, i didnt get that. can you please repeat? you can say 1st January 2017.",
        
        ENDDATE: "Ok, please tell me the date you want to leave the hotel in.",
        ENDDATE_CAR: "Ok, please tell me the date you want to drop off the car",
        
        ENDDATE_REPROMPT: "In order to book a hotel, please tell me the travel check out date?",
        ENDDATE_REPROMPT_CAR: "In order to book a car, please tell me the drop off date date?",

        ENDDATE_INVALID_PAST: "you cannot leave a hotel before you check in. Say the date you want to leave the hotel in ?",

        ENDDATE_INVALID: "Sorry, i didnt get that. can you please repeat? you can say 1st January 2017.",
        
        GUESTS: "Now please tell me the number of guests to book the hotel for",
        
        GUESTS_INVALID: "Invalid number of guests. Please say again",

        STOP: "Thank you for using the I.T.A. app.",

        HELP: "You can ask things like: Book a hotel for me or Book a car for me",

        HELP_REPROMPT: "Simply say: I want to book a hotel.",

        UNHANDLED: "I'm sorry I couldn't understand what you meant. Can you please say it again?",
        
        ERROR: "Error occurred while getting information from car api"
};
var carDestination = null;
var start_date_string = null;
var end_date_string = null;
var speechText = "";
var repromptText = "";



//========================================================Skill Code=================================

'use strict';

const Alexa = require('alexa-sdk');
const request=require('request');
const APP_ID = "amzn1.ask.skill.06e1a5f6-c4a2-4b77-844b-8e86b0e465a2"; // TODO replace with your app ID (OPTIONAL).
//var flights=require('./flights');
var Speech=require('ssml-builder');
var moment = require('moment'); // deals with dates and date formatting, for instance converts AMAZON.DATE to timestamp

var handlers = {
		'LaunchRequest': function () {
			this.emit(':ask', welcomeOutput, welcomeReprompt);
		},
		'carIntent': function () {
			if(Object.keys(this.attributes).length === 0) { // Check if it's the
				// first time the
				// skill has been
				// invoked
				this.attributes['destination_car'] = undefined;
				this.attributes['startdate_car'] = undefined;
				this.attributes['enddate_car'] = undefined;
			}

//			============================================ store slots locally==================
			
			carDestination = this.event.request.intent.slots.destination_car.value;
			start_date_string = this.event.request.intent.slots.startdate_car.value;
			end_date_string = this.event.request.intent.slots.enddate_car.value;

//			============================================ store slots in attributes ==================
			
			if(carDestination != null){
				this.attributes['destination_car'] = carDestination;
				console.log(this.attributes);
			}

			if(start_date_string != null){
				var carStartDate = moment(start_date_string);
				this.attributes['startdate_car'] = carStartDate;
				console.log(this.attributes);
			}

			if(end_date_string != null){
				var carEndDate = moment(end_date_string);
				this.attributes['enddate_car'] = carEndDate;
				console.log(this.attributes);
			}

//			============================================= ask for missing slots ======================
			
			if(this.attributes['destination_car'] == undefined){

				speechText = snippets.DESTINATION_CAR;
				repromptText = snippets.DESTINATION_REPROMPT_CAR;
				this.emit(':ask', speechText, repromptText);



			}

			if(this.attributes['startdate_car'] == undefined){


				speechText = snippets.STARTDATE_CAR;
				repromptText = snippets.STARTDATE_REPROMPT_CAR;
				this.emit(':ask', speechText, repromptText);



			}

			if(this.attributes['enddate_car'] == undefined){


				speechText = snippets.ENDDATE_CAR;
				repromptText = snippets.ENDDATE_REPROMPT_CAR;
				this.emit(':ask', speechText, repromptText);
			}

//			========================================slots confirmation =====================


//			============================================================= api call ===============
			
			if(this.attributes['destination_car'] != undefined && this.attributes['startdate_car'] != undefined && this.attributes['enddate_car'] != undefined){
				var myJSONObject={};
				myJSONObject={"input":this.attributes['destination_car'],
						"sdatetime": this.attributes['startdate_car'],
						"edatetime":this.attributes['enddate_car']
				};
				console.log(myJSONObject);
				request({
					url: "http://Sample-env.mqwha4phuc.us-east-1.elasticbeanstalk.com/car",
					method: "POST",
					json: true,   // <--Very important!!!
					body: myJSONObject
				}, function (error, response, body){
						console.log("res"+response);
						if (!error && response.statusCode == 200) {
							console.log("place"+JSON.stringify(response));
							var carinfo = body.cars;
							console.log("car object is"+carinfo);
							var speechText = "";
							speechText += carinfo;
							console.log(speechText);
							var repromptText = "For instructions on what you can say, please say help me.";
							this.emit(':tell', speechText);
						}
					else
					{
						speechText = snippets.ERROR;
						repromptText = snippets.ERROR; 
						this.emit(':ask', speechText, repromptText);
					}
				}.bind(this));

			}

		},
		'AMAZON.HelpIntent': function () {
			speechOutput = "";
			reprompt = "";
			this.emit(':ask', speechOutput, reprompt);
		},
		'Unhandled': function () {
			HelpMessage =snippets.HELP; 
			this.emit(':ask', HelpMessage, HelpMessage);
		},
		'AMAZON.CancelIntent': function () {
			speechOutput = "";
			this.emit(':tell', speechOutput);
		},
		'AMAZON.StopIntent': function () {
			speechOutput = "";
			this.emit(':tell', speechOutput);
		},
		'SessionEndedRequest': function () {
			var speechOutput = "";
			this.emit(':tell', speechOutput);
		},
};

exports.handler = (event, context) => {
	var alexa = Alexa.handler(event, context);
 	alexa.APP_ID = APP_ID;
	alexa.registerHandlers(handlers);
	alexa.execute();
};