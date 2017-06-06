
var speechOutput;
var reprompt;
var welcomeOutput = "Let's book a hotel. Where would you like to go?";
var welcomeReprompt = "Let me know where you'd like to go or when you'd like to go on your trip";
var tripIntro = [
	"This sounds like a cool trip. ",
	"This will be fun. ",
	"Oh, I like this trip. "
	];

var snippets = {
		WELCOME: "<s>Welcome to the Intelligent travel agent.</s> " +
		"<s>You can ask to book Hotel</s>",

		WELCOME_REPROMPT: "You can say, " +
		"I want to book a hotel",

		DESTINATION: "Where do you want to book the hotel?",

		DESTINATION_REPROMPT: "In order to book a hotel, please tell me: the destination for the hotel?",

		DESTINATION_INVALID: "Sorry I couldn't understand your travel destination?",

		STARTDATE: "Ok, please tell me the date you want to book the hotel from",

		STARTDATE_REPROMPT: "In order to book a hotel, please tell me the travel check in date?",

		STARTDATE_INVALID_PAST: "Nice, you live in the past. Do you have a time machine? Seriously, can you please say your actual desired check in date?",

		STARTDATE_INVALID: "Sorry, i didnt get that. can you please repeat? you can say 1st January 2017.",

		ENDDATE: "Ok, please tell me the date you want to leave the hotel in.",

		ENDDATE_REPROMPT: "In order to book a hotel, please tell me the travel check out date?",

		ENDDATE_INVALID_PAST: "you cannot leave a hotel before you check in. Say the date you want to leave the hotel in ?",

		ENDDATE_INVALID: "Sorry, i didnt get that. can you please repeat? you can say 1st January 2017.",

		GUESTS: "Now please tell me the number of guests to book the hotel for",

		GUESTS_INVALID: "Invalid number of guests. Please say again",

		STOP: "Thank you for using the ITA app.",

		HELP: "You can ask things like: Book a hotel for me",

		HELP_REPROMPT: "Simply say: I want to book a hotel.",

		UNHANDLED: "I'm sorry I couldn't understand what you meant. Can you please say it again?",

		ERROR: "Sorry, there was a server problem. Please try again."
};
var hotelDestination = null;
var start_date_string = null;
var end_date_string = null;
var hotelGuests = null;
var speechText = "";
var repromptText = "";



// 2. Skill Code
// =======================================================================================================

'use strict';

const Alexa = require('alexa-sdk');
const request=require('request');
// const APP_ID = "amzn1.ask.skill.06e1a5f6-c4a2-4b77-844b-8e86b0e465a2";
var Speech=require('ssml-builder');
var moment = require('moment');

var handlers = {
		'LaunchRequest': function () {
			this.emit(':ask', welcomeOutput, welcomeReprompt);
		},
		'hotelIntent': function () {
			if(Object.keys(this.attributes).length === 0) { // Check if it's the
				// first time the
				// skill has been
				// invoked
				this.attributes['hotelDestination'] = undefined;
				this.attributes['hotelStartDate'] = undefined;
				this.attributes['hotelEndDate'] = undefined;
//				this.attributes['hotelGuests'] = undefined;
			}
			hotelDestination = this.event.request.intent.slots.hotelDestination.value;
			start_date_string = this.event.request.intent.slots.hotelStartDate.value;
			end_date_string = this.event.request.intent.slots.hotelEndDate.value;

			if(hotelDestination != null){
	            this.attributes['hotelDestination'] = hotelDestination;
	            console.log(this.attributes);
	            }
			
			if(start_date_string != null){
				var hotelStartDate = moment(start_date_string);
	            this.attributes['hotelStartDate'] = hotelStartDate;
	            console.log(this.attributes);
	            }
			
			if(end_date_string != null){
				var hotelEndDate = moment(end_date_string);
	            this.attributes['hotelEndDate'] = hotelEndDate;
	            console.log(this.attributes);
	            }
			if(this.attributes['hotelDestination'] == undefined){
				
					 speechText = snippets.DESTINATION;
			         repromptText = snippets.DESTINATION_REPROMPT;
						this.emit(':ask', speechText, repromptText);

			        
				
			}
			
			if(this.attributes['hotelStartDate'] == undefined){
				
				
					 speechText = snippets.STARTDATE;
			         repromptText = snippets.STARTDATE_REPROMPT;
						this.emit(':ask', speechText, repromptText);

			        
				
			}
			
			if(this.attributes['hotelEndDate'] == undefined){
				
				
					 speechText = snippets.ENDDATE;
			         repromptText = snippets.ENDDATE_REPROMPT;
						this.emit(':ask', speechText, repromptText);

				
			}
			

			if(this.attributes['hotelDestination'] != undefined && this.attributes['hotelStartDate'] != undefined && this.attributes['hotelEndDate'] != undefined){
			var myJSONObject={};
			myJSONObject={"input":hotelDestination,
					"sdatetime":"2017-6-07 16:25",
					"edatetime":"2017-6-09 16:25"
			};
			console.log(myJSONObject);
			request({
				url: "http://sample-env.3ypbe4xuwp.us-east-1.elasticbeanstalk.com/htl",
				method: "POST",
				json: true,   // <--Very important!!!
				body: myJSONObject
			}, function (error, response, body){
				// console.log("res"+response);
				if (!error && response.statusCode == 200) {
					// console.log("res"+JSON.parse(response));
					console.log("place"+JSON.stringify(response));
					// var replymsg =
					// JSON.parse(response);
					var carinfo = response["body"]["hotels"];
					console.log(carinfo);
					 speechText = "The top results are. ";
					speechText += carinfo;
					console.log(speechText);

					 repromptText = "For instructions on what you can say, please say help me.";
					// res.send(response);
						this.emit(':ask', speechText, repromptText);

				}
				else
				{
					speechText = snippets.ERROR;
					repromptText = snippets.ERROR; // could
					// be
					// improved
					// by
					// using
					// alternative
					// prompt
					// text
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
//	alexa.APP_ID = APP_ID;
	alexa.registerHandlers(handlers);
	alexa.execute();
};



function randomPhrase(array) {
	// the argument is an array [] of words or phrases
	var i = 0;
	i = Math.floor(Math.random() * array.length);
	return(array[i]);
}
function isSlotValid(request, slotName){
	var slot = request.intent.slots[slotName];
	// console.log("request = "+JSON.stringify(request)); //uncomment if you
	// want to see the request
	var slotValue;

	// if we have a slot, get the text and store it into speechOutput
	if (slot && slot.value) {
		// we have a value in the slot
		slotValue = slot.value.toLowerCase();
		return slotValue;
	} else {
		// we didn't get a value in the slot.
		return false;
	}
}