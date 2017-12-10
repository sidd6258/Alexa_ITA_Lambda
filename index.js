	// There are three sections, Text Strings, Skill Code, and Helper Function(s).
	// You can copy and paste the entire file contents as the code for a new Lambda function,
	// or copy & paste section #3, the helper function, to the bottom of your existing Lambda code.

	 // 1. Text strings =====================================================================================================
	 //    Modify these strings and messages to change the behavior of your Lambda function

	 var speechOutput;
	 var repromptText;
	 var reprompt;
	 const request=require('request');
	 const welcomeOutput = "Let's plan a trip. What would you like to book? Say book a hotel, book a car or book a flight";
	 const welcomeReprompt = "Let me know how can i help you. Say book a hotel, book a car or book a flight";
	 var intro = require('./routes/intro')
	 var carIntent = require('./routes/carIntent')
	 var hotel = require('./routes/hotelIntent')
	 var flight =require('./routes/flightIntent')
	 var preferenceSuperIntent = require('./routes/preferenceSuperIntent')
	 var flightPreferenceIntent = require('./routes/flightPreferenceIntent')
	 var hotelPreferenceIntent = require('./routes/hotelPreferenceIntent')
	 var carPreferenceIntent = require('./routes/carPreferenceIntent')
	 
	 var updatedIntent=null;


	 // 2. Skill Code =======================================================================================================

	'use strict';
	const Alexa = require('alexa-sdk');
	const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

	const handlers = {
	    'LaunchRequest': function () {
	    	var funct1 = intro.intro.bind(this);
	    	funct1();
	    		    },
	    'hotelIntent': function () {
	    	var hotelFunc = hotel.hotel.bind(this);
	    	hotelFunc();
	    },
	    'preferenceSuperIntent': function(){
	    	var prefer = preferenceSuperIntent.preference.bind(this);
	    	prefer();
	    },
	    'flightPreferenceIntent': function(){
	    	var flightPrefer = flightPreferenceIntent.flightPreference.bind(this);
	    	flightPrefer();
	    },
	    'carPreferenceIntent': function(){
	    	var carPrefer = carPreferenceIntent.carPreference.bind(this);
	    	carPrefer();
	    },
	    'hotelPreferenceIntent': function(){
	    	var hotelPrefer = hotelPreferenceIntent.hotelPreference.bind(this);
	    	hotelPrefer();
	    },
	    'flightIntent': function () {

	    	//delegate to Alexa to collect all the required slot values
	    	console.log("in flight intent")
	    	var flightFunc=flight.flight.bind(this);
	    	flightFunc();
	    		    },

	    'carIntent': function () {
	    	var carFunc =  carIntent.carIntent.bind(this);
	    	carFunc();	    	
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
	    				console.log("unhandled reached");
	                HelpMessage ="help me"; 
	                this.emit(':tell', HelpMessage, HelpMessage);
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
