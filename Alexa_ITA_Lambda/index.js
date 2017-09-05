
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
            DESTINATION_F: "Ok, Where do you want to book the flight?",

            DESTINATION_REPROMPT: "In order to book a hotel, please tell me: the destination for the hotel?",
            DESTINATION_REPROMPT_CAR: "In order to book a rental car, please tell me: the destination?",
            DESTINATION_HOTEL: "Where do you want to book the hotel?",
            DESTINATION_REPROMPT_HOTEL: "In order to book a hotel, please tell me: the destination for the hotel?",
            DESTINATION_REPROMPT_F: "In order to book a flight, please tell me: the destination?",
            DESTINATION_INVALID: "Sorry I couldn't understand your travel destination?",

            ORIGIN_F:"OK, from where do you want to book the flight",

            ORIGIN_REPROMT_F:"In order to book a flight,please tell me: the origin",
            
            STARTDATE: "Ok, please tell me the date you want to book the hotel from",
            STARTDATE_CAR: "Ok, please tell me the date you want to book the car from",
            STARTDATE_HOTEL: "Ok, please tell me the date you want to book the hotel from",
            STARTDATE_F: "Ok, please tell me the date you want to book the flight from",
            STARTDATE_REPROMPT: "In order to book a hotel, please tell me the travel check in date?",
            STARTDATE_REPROMPT_CAR: "In order to book a car, please tell me the travel check in date?",
            STARTDATE_REPROMPT_HOTEL: "In order to book a hotel, please tell me the travel check in date?",
            STARTDATE_REPROMPT_F: "In order to book a flight, please tell me the travel check in date?",
            STARTDATE_INVALID_PAST: "Nice, you live in the past. Do you have a time machine? Seriously, can you please say your actual desired check in date?",
            STARTDATE_INVALID: "Sorry, i didnt get that. can you please repeat? you can say 1st January 2017.",
            
            ENDDATE: "Ok, please tell me the date you want to leave the hotel in.",
            ENDDATE_CAR: "Ok, please tell me the date you want to drop off the car",
            ENDDATE_HOTEL: "Ok, please tell me the date you want to leave the hotel in.",
            ENDDATE_REPROMPT_HOTEL: "In order to book a hotel, please tell me the travel check out date?",
            ENDDATE_REPROMPT: "In order to book a hotel, please tell me the travel check out date?",
            ENDDATE_REPROMPT_CAR: "In order to book a car, please tell me the drop off date date?",

            ENDDATE_INVALID_PAST: "Checkout date cannot be before start date",

            ENDDATE_INVALID: "Sorry, i didnt get that. can you please repeat? you can say 1st January 2017.",
            
            GUESTS_HOTEL: "Now please tell me the number of guests to book the hotel for",
            GUESTS_F: "Now please tell me the number of guests to book the flight for",

            GUESTS_INVALID: "Invalid number of guests. Please say again",

            STOP: "Thank you for using the I.T.A. app.",

            HELP: "You can ask things like: Book a hotel for me or Book a car for me",

            HELP_REPROMPT: "Simply say: I want to book a hotel.",

            UNHANDLED: "I'm sorry I couldn't understand what you meant. Can you please say it again?",
            
            ERROR: "Error occurred while getting information from car api"
    };
    var carDestination = null;
    var hotelDestination = null;
    var flightDestination = null;
    var hotelGuests = null;
    var flightGuests = null;
    var hotelSelection = null;
    var hotelConfirmation = null;
    var carSelection = null;
    var carConfirmation = null;
    var flightSelection = null;
    var flightConfirmation = null;
    var start_date_string = null;
    var end_date_string = null;
    var speechText = "";
    var repromptText = "";
    var hotelOptions = null;
    var carOptions = null;
    var flightOptions=null;
    var module = null;
    var state = null;
//---------------------------------------------skill code------------------------------------
/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This  demonstrates a  skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This  supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/sidd6258/Alexa_ITA_Lambda
 **/

'use strict';

const Alexa = require('alexa-sdk');
const request=require('request');
const APP_ID = "amzn1.ask.skill.06e1a5f6-c4a2-4b77-844b-8e86b0e465a2"; // TODO replace with your app ID (OPTIONAL).
var flights=require('./flights');
var Speech=require('ssml-builder');
var moment = require('moment'); // deals with dates and date formatting, for instance converts AMAZON.DATE to timestamp




var states = {
	    START: '_STARTMODE',  // Prompt the user to start or restart
	    DESTINATION: '_DESTINATION',
	    DESTINATION_CAR: '_DESTINATION_CAR',
	    DESTINATION_F: 'DESTINATION_F',
	    ORIGIN_F:'ORIGIN_F',
	    STARTDATE: '_STARTDATE',
	    STARTDATE_CAR: '_STARTDATE_CAR',
	    STARTDATE_F: '_STARTDATE_F',
	    ENDDATE: '_ENDDATE',
	    ENDDATE_CAR: '_ENDDATE_CAR',
	    GUESTS: '_GUESTS',
	    GUESTS_F: '_GUESTS_F',
	    ANSWER: '_ANSWER',
	    ANSWER_CAR: '_ANSWER_CAR',
	    ANSWER_F: '_ANSWER_F'
	};


var newSessionHandlers = {

		'LaunchRequest': function () {
            this.emit(':ask', welcomeOutput, welcomeReprompt);
            this.attributes['state'] = 'welcome';
        },

        'superIntent': function () {

            module = this.event.request.intent.slots.module.value;
            if (module != undefined){
                this.attributes['module'] = module;
                console.log(this.attributes);
            }

            if(this.attributes['module'] == 'flight'){
            	
            	  if(Object.keys(this.attributes).length === 0) { // Check if it's the
	                    // first time the
	                    // skill has been
	                    // invoked
	                    this.attributes['destination_f'] = undefined;
	                    this.attributes['startdate_f'] = undefined;
	                    this.attributes['flightSelection'] = undefined;
	                    this.attributes['flightConfirmation'] = undefined;
	                }
            	  
//=========================================== store slots locally===========================
	                
	                flightDestination = this.event.request.intent.slots.destination.value;
	                start_date_string = this.event.request.intent.slots.startdate.value;
	                //end_date_string = this.event.request.intent.slots.enddate.value;
	                flightSelection = this.event.request.intent.slots.selection.value;
	                flightConfirmation = this.event.request.intent.slots.confirmation.value;
	                flightGuests=this.event.request.intent.slots.guests.value;
	                if(flightDestination != null){
	                    this.attributes['flightDestination'] = flightDestination;
	                    console.log(this.attributes);
	                }
	                
	                
	                if(start_date_string != null){
	                    var flightStartDate = moment(start_date_string);
	                    this.attributes['flightStartDate'] = flightStartDate;
	                    console.log(this.attributes);
	                }
	                
	                if(flightGuests != null){
	                    this.attributes['flightGuests'] = flightGuests;
	                    console.log(this.attributes);
	                }
	                
	                if(flightSelection != null){
	                    this.attributes['state'] = 'flight_selection';
	                    this.attributes['flightSelection'] = flightSelection;             
	                    speechText = "You are about to book " + this.attributes['flightOptions'][flightSelection] + " " + "Please Confirm.";
	                    repromptText ="You are about to book" + this.attributes['flightOptions'][flightSelection] + " " + "Please Confirm.";
	                    console.log(this.attributes);
	                    this.emit(':ask', speechText, repromptText);
	                }
	                
	                if(flightConfirmation != null && flightConfirmation=="yes" && this.attributes['state'] =="flight_selection"){
	                    this.attributes['state'] = 'flight_confirmation';
	                    this.attributes['flightConfirmation'] = flightConfirmation;   
	                    flightSelection = this.attributes['flightSelection'];
	                    speechText = "You booked " + this.attributes['flightOptions'][flightSelection] + " " + " Do you want to book rental car, If yes then please say rent a car";
	                    repromptText ="You booked " + this.attributes['flightOptions'][flightSelection] + " " + " Do you want to book rental car, If yes then please say rent a car";
	                    console.log(this.attributes);
	                    this.emit(':ask', speechText, repromptText);
	                }
	                
 //          ============================================= ask for missing slots ======================
	                
	                if(this.attributes['flightDestination'] == undefined){
	
	                    this.attributes['state'] = 'flight_destination';
	                    speechText = snippets.DESTINATION_F;
	                    repromptText = snippets.DESTINATION_REPROMPT_F;
	                    this.emit(':ask', speechText, repromptText);
	                }
	
	                if(this.attributes['flightStartDate'] == undefined){
	
	                    this.attributes['state'] = 'flight_startdate';
	                    speechText = snippets.STARTDATE_F;
	                    repromptText = snippets.STARTDATE_REPROMPT_F;
	                    this.emit(':ask', speechText, repromptText);
	
	                }
	                
	                if(this.attributes['flightGuests'] == undefined){
	                	console.log("in");
	                    this.attributes['state'] = 'flight_guests';
	                    speechText = snippets.GUESTS_F;
	                    repromptText = snippets.GUESTS_REPROMPT_F;
	                    this.emit(':ask', speechText, repromptText);
	
	                }
	               
 //============================================================= api call ===============
	                
	                if(this.attributes['flightDestination'] != undefined && this.attributes['flightStartDate'] != undefined && this.attributes['flightSelection'] == undefined ){
	                	
	                	if(isPastDate(moment(this.attributes['flightStartDate']))){
	                		speechText = snippets.STARTDATE_INVALID_PAST;
	                        repromptText = snippets.STARTDATE_INVALID_PAST; // could be improved by using alternative prompt text
	                        this.emit(':ask', speechText, repromptText);
	                	}
	                	
	                	
	                	this.attributes['state'] = 'flight_results';
	                    var myJSONObject={};
	                    myJSONObject={"input":flightDestination,
	                            "sdatetime":"2017-6-07 16:25",
	                            "edatetime":"2017-6-09 16:25"
	                    };
	                    console.log("ajay ajay");
	                    console.log(myJSONObject);
	                    
	                    flightOptions = {      1:"Option A",
                                2:"Option B",
                                3:"Option C",
                                4:"Option D",
                                5:"Option E"}
			          speechText = "Five flights available 1 2 3 4 5, choose one option";
			          repromptText = "Five flights available 1 2 3 4 5, choose one option";
			          this.attributes['flightOptions']=flightOptions;
			          this.emit(':ask', speechText, repromptText);
			          console.log("ajay ajay out");
	                }
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
function isPastDate(sdate) {
    var today = moment();

    if (sdate < today) {
        return true
    } else {
        return false
    }
}
function isFutureDate(edate,sdate) {
//    var today = moment();
	
    if (sdate < edate) {
        return true
    } else {
        return false
    }
}




exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    //alexa.resources = languageStrings;
    alexa.registerHandlers(newSessionHandlers);
    alexa.execute();
};





