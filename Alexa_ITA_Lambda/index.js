/* eslint-disable  func-names */
/* eslint quote-props: ["error", "consistent"]*/
/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills
 * nodejs skill development kit.
 * This sample supports multiple lauguages. (en-US, en-GB, de-DE).
 * The Intent Schema, Custom Slots and Sample Utterances for this skill, as well
 * as testing instructions are located at https://github.com/alexa/skill-sample-nodejs-fact
 **/

'use strict';

const Alexa = require('alexa-sdk');
const request=require('request');
const APP_ID = "amzn1.ask.skill.06e1a5f6-c4a2-4b77-844b-8e86b0e465a2"; // TODO replace with your app ID (OPTIONAL).
//var flights=require('./flights');
var Speech=require('ssml-builder');
var moment = require('moment'); // deals with dates and date formatting, for instance converts AMAZON.DATE to timestamp




var states = {
	    START: '_STARTMODE',  // Prompt the user to start or restart
	    DESTINATION: '_DESTINATION',
	    STARTDATE: '_STARTDATE',
	    ENDDATE: '_ENDDATE',
	    GUESTS: '_GUESTS',
	    ANSWER: '_ANSWER'
	};

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

        UNHANDLED: "I'm sorry I couldn't understand what you meant. Can you please say it again?"
};

var newSessionHandlers = {

	    // session variables stored in this.attributes
	    // session state is stored in this.handler.state
	    // handler.state vs Intent vs
	    'LaunchRequest': function() {
	        if(Object.keys(this.attributes).length === 0) { // Check if it's the first time the skill has been invoked
	            this.attributes['destination'] = undefined;
	            this.attributes['startdate'] = undefined;
	            this.attributes['enddate'] = undefined;
	            this.attributes['guests'] = undefined;
	        }
	        // Initialise State
	        this.handler.state = states.START;

	        // emitWithState should be called executeStateHandler("Start").
	        // As such this will call a handler "Start" in the startStateHandlers object.
	        // Maybe this line and the previous line could be more coherently wrapped into a single
	        // function:
	        // this.stateTransition( states.START, "Start" )
	        this.emitWithState("Start")
	    },

	    // It's unclear whether this can ever happen as it's triggered by Alexa itself.
	    "Unhandled": function () {
	        var speechText = "I wasn't launched yet";
	        this.emit(":ask", speechText);
	    }
	};

var startStateHandlers = Alexa.CreateStateHandler(states.START, {
    'Start': function() {

        this.handler.state = states.START;
        var speechText = snippets.WELCOME;
        var repromptText = snippets.WELCOME_REPROMPT;

        // emit is the exit point to instruct Alexa how to and what to communicate with end user.
        // e.g. do we want further information? (:ask) / no further information, skill terminates (:tell)
        // do we provide a voice response with or without a card on the mobile device (:ask vs :askWithCard)
        // https://github.com/alexa/alexa-skills-kit-sdk-for-nodejs
        // as we've said :ask we are expecting the user to provide more information.
        // maybe this function could be called this.respond()
        // this is going to speak the snippets.WELCOME which implicitly asks a question (hence :ask).
        // reprompt text is automatically spoken after a few seconds. This is a feature of the NodeJS SDK.
        // See Unhandled for the fallback / unrecognised utteranes.
        this.emit(':ask', speechText, repromptText);
    },
    // the intent text is defined in the
    // Alexa interaction model web page at developer.amazon.com/ask
    // represented as sample utterances.
    'startHotelIntent': function () {
        var speechText = snippets.DESTINATION;
        var repromptText = snippets.DESTINATION_REPROMPT;

        // Change State to calculation
        this.handler.state = states.DESTINATION;
        this.emit(':ask', speechText, repromptText);
    },

    // a predefined Utterance that you don't need to define in your interaction model
    // We are choosing to provide this help function but equally you don't need to.
    "AMAZON.HelpIntent": function () {
        var speechText = snippets.HELP;
        var repromptText = snippets.HELP_REPROMPT;
        this.emit(':ask', speechText, repromptText);
    },
    "Unhandled": function () {
        var speechText = snippets.UNHANDLED;
        this.emit(":ask", speechText);
    },

    // User says stop. Stops even in the middle of a response.
    "AMAZON.StopIntent": function () {
        var speechText = snippets.STOP;
        this.emit(":tell", speechText);
    },

    // unclear really what the difference is; default working practice is
    // to do the same thing
    // in a production system we'd probably dedupe this function.
    "AMAZON.CancelIntent": function () {
        var speechText = snippets.STOP;
        this.emit(":tell", speechText);
    },
    "AMAZON.StartOverIntent": function () {
        this.emitWithState("Start")
    },

    // TODO determine when this is requested and what initiates it
    // Implement handler to save state if state should be stored persistently e.g. to DynamoDB
    // 'SessionEndedRequest': function () {
    //     console.log('session ended!');
    //     this.emit(':saveState', true);
    // }

    // TODO add 'AMAZON.RepeatIntent' that repeats the last question.

});

var destinationStateHandlers = Alexa.CreateStateHandler(states.DESTINATION, {

    'hotelDestinationIntent': function () {
        var speechText = "",
            repromptText = "";

        var destination = this.event.request.intent.slots.destination.value;
        //var date = moment(date_string);
        
                speechText = snippets.STARTDATE;
                repromptText = snippets.STARTDATE_REPROMPT;
                this.attributes['destination'] = destination;
                console.log(JSON.stringify(this.attributes));
               
               
                this.handler.state = states.STARTDATE;
                this.emit(':ask', speechText, repromptText);

    },
    "AMAZON.HelpIntent": function () {
        var speechText = snippets.HELP;
        var repromptText = snippets.HELP_REPROMPT;
        this.emit(':ask', speechText, repromptText);
    },
    "Unhandled": function () {
        var speechText = snippets.UNHANDLED;
        this.emit(":ask", speechText);
    },
    "AMAZON.StopIntent": function () {
        var speechText = snippets.STOP;
        this.emit(":tell", speechText);
    },
    "AMAZON.CancelIntent": function () {
        var speechText = snippets.STOP;
        this.emit(":tell", speechText);
    },
    "AMAZON.StartOverIntent": function () {
        this.emitWithState("Start")
    },
    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.emit(':saveState', true);
    }
});

var hotelStartDateHandler = Alexa.CreateStateHandler(states.STARTDATE, {

    'hotelStartDateIntent': function () {
        var speechText = "",
            repromptText = "";
        console.log("hi");

        var date_string = this.event.request.intent.slots.startdate.value;
        var date = moment(date_string);

        if (date.isValid()) {

            if (!isPastDate(date)) {
                // ALL GOOD – dob not in the past
                speechText = snippets.ENDDATE;
                repromptText = snippets.ENDDATE_REPROMPT;
                this.attributes['startdate'] = date;

                // Transition to next state
                this.handler.state = states.ENDDATE;
                console.log(JSON.stringify(this.attributes));
                this.emit(':ask', speechText, repromptText);
                

            } else {
                // dob in the future
                speechText = snippets.STARTDATE_INVALID_PAST;
                repromptText = snippets.STARTDATE_INVALID_PAST; // could be improved by using alternative prompt text
                this.emit(':ask', speechText, repromptText);
            }

        } else {
            // not a valid Date
            speechText = snippets.STARTDATE_INVALID;
            repromptText = snippets.STARTDATE_INVALID; // could be improved by using alternative prompt text
            this.emit(':ask', speechText, repromptText);
        }
    },
    "AMAZON.HelpIntent": function () {
        var speechText = snippets.HELP;
        var repromptText = snippets.HELP_REPROMPT;
        this.emit(':ask', speechText, repromptText);
    },
    "Unhandled": function () {
        var speechText = snippets.UNHANDLED;
        this.emit(":ask", speechText);
    },
    "AMAZON.StopIntent": function () {
        var speechText = snippets.STOP;
        this.emit(":tell", speechText);
    },
    "AMAZON.CancelIntent": function () {
        var speechText = snippets.STOP;
        this.emit(":tell", speechText);
    },
    "AMAZON.StartOverIntent": function () {
        this.emitWithState("Start")
    },
    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.emit(':saveState', true);
    }
});

var hotelEndDateHandler = Alexa.CreateStateHandler(states.ENDDATE, {

    'hotelEndDateIntent': function () {
        var speechText = "",
            repromptText = "";
//        console.log("hi");

        var date_string = this.event.request.intent.slots.enddate.value;
        var date = moment(date_string);
        var startdate = moment(this.attributes['startdate']);

        if (date.isValid()) {

            if (isFutureDate(date,startdate)) {
                // ALL GOOD – dob not in the past
                speechText = snippets.GUESTS;
                repromptText = snippets.GUESTS_REPROMPT;
                this.attributes['enddate'] = date;

                // Transition to next state
                this.handler.state = states.GUESTS;
                console.log(JSON.stringify(this.attributes));
                this.emit(':ask', speechText, repromptText);
                

            } else {
                // dob in the future
                speechText = snippets.ENDDATE_INVALID_PAST;
                repromptText = snippets.ENDDATE_INVALID_PAST; // could be improved by using alternative prompt text
                this.emit(':ask', speechText, repromptText);
            }

        } else {
            // not a valid Date
            speechText = snippets.ENDDATE_INVALID;
            repromptText = snippets.ENDDATE_INVALID; // could be improved by using alternative prompt text
            this.emit(':ask', speechText, repromptText);
        }
    },
    "AMAZON.HelpIntent": function () {
        var speechText = snippets.HELP;
        var repromptText = snippets.HELP_REPROMPT;
        this.emit(':ask', speechText, repromptText);
    },
    "Unhandled": function () {
        var speechText = snippets.UNHANDLED;
        this.emit(":ask", speechText);
    },
    "AMAZON.StopIntent": function () {
        var speechText = snippets.STOP;
        this.emit(":tell", speechText);
    },
    "AMAZON.CancelIntent": function () {
        var speechText = snippets.STOP;
        this.emit(":tell", speechText);
    },
    "AMAZON.StartOverIntent": function () {
        this.emitWithState("Start")
    },
    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.emit(':saveState', true);
    }
});

var hotelGuestsHandler = Alexa.CreateStateHandler(states.GUESTS, {

    'hotelGuestsIntent': function () {
        var speechText = "",
            repromptText = "";
//        console.log("hi");

        var guests = this.event.request.intent.slots.guests.value;
        this.attributes['guests'] = guests;
        console.log(JSON.stringify(this.attributes));
       
       
        this.handler.state = states.ANSWER;
        var myJSONObject={};
       myJSONObject={"input":this.attributes['destination'],
      		"sdatetime":"2017-4-25 16:25",
      		"edatetime":"2017-4-27 16:25"
      			};
      request({
  	    url: "http://Default-Environment.iwgyjx3zzn.us-east-1.elasticbeanstalk.com/htl",
  	    method: "POST",
  	    json: true,   // <--Very important!!!
  	    body: myJSONObject
  	}, function (error, response, body){
  		 // console.log("res"+response);
  		if (!error && response.statusCode == 200) {
             // console.log("res"+JSON.parse(response));
              console.log("place"+JSON.stringify(response));
              // var replymsg = JSON.parse(response);
              var carinfo = response["body"]["hotels"];
              console.log(carinfo);
              var speechText = "The top 10 results are. ";
              speechText += carinfo;
              console.log(speechText);
           //    var speechText = "";
      	    // speechText += "Welcome to " + SKILL_NAME + ".  ";
      	    // speechText += "You can ask a question like, search for hotels near golden gate bridge, san fransisco.  ";
      	    var repromptText = "For instructions on what you can say, please say help me.";
      	    this.emit(':tell', speechText);
              //res.send(response);
          }
  		else
  			{
  			console.log("error"+response+error);
  			
  			//res.send("error");
  			}
  	}.bind(this));
  	// this.emit(':tell', "hello");
        
    },
    "AMAZON.HelpIntent": function () {
        var speechText = snippets.HELP;
        var repromptText = snippets.HELP_REPROMPT;
        this.emit(':ask', speechText, repromptText);
    },
    "Unhandled": function () {
        var speechText = snippets.UNHANDLED;
        this.emit(":ask", speechText);
    },
    "AMAZON.StopIntent": function () {
        var speechText = snippets.STOP;
        this.emit(":tell", speechText);
    },
    "AMAZON.CancelIntent": function () {
        var speechText = snippets.STOP;
        this.emit(":tell", speechText);
    },
    "AMAZON.StartOverIntent": function () {
        this.emitWithState("Start")
    },
    'SessionEndedRequest': function () {
        console.log('session ended!');
        this.emit(':saveState', true);
    }
});

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



//const handlers = {
//    'LaunchRequest': function () {
//    	var speechText = snippets.WELCOME;
//        var repromptText = snippets.WELCOME_REPROMPT;
//        this.emit('GetFact');
//    },
//    'FlightIntent': function () {
//        // Get a random space fact from the space facts list
//    	var myJSONObject={};
//        var origin=this.event.request.intent.slots.origin.value;
//        var destination=this.event.request.intent.slots.destination.value;
//        var date=this.event.request.intent.slots.date.value;
//        var speech=new Speech();
//            
//        speech.say("Hello");
//        speech.pause("500ms");
//        speech.say("Flights from "+origin+" to "+destination+" are:");
//       // 
//        var textpromt="Flights from "+origin+" to "+destination+" are:";
//        var myJSONObject={	
//        					"src":origin,
//			        		"input":destination,
//			        		"sdatetime":"",
//			        		"edatetime":"",
//			        		"lat":"","lon":""
//			        	};
//        request({
//    	    url: "http://Sample-env.3ypbe4xuwp.us-east-1.elasticbeanstalk.com/fly",
//    	    method: "POST",
//    	    json: true,   // <--Very important!!!
//    	    body: myJSONObject
//    			}, function (error, response, body){
//								    		 console.log("res"+response);
//								    		 if (!error && response.statusCode == 200) {
//								              
//								                console.log("place"+JSON.stringify(response));
//								                
//								                for(var i=0;i<5;i++)
//								                	{
//								                	speech.pause("500ms");
//								                	speech.say("Option "+(parseInt(i,10)+1)+":");
//								                	speech.pause("500ms");
//								                	speech.say(response.body.fltinfo[i].airline+" airline flight number "+response.body.fltinfo[i].flightNum+".");
//								                	speech.say("At ");
//								                	speech.sayAs({
//								                		"word":response.body.fltinfo[i].deptTime+":00",
//								                		"interpret": "time",
//								                        
//								                	});
//								                	speech.say("hours");
//								                	
//								                	speech.say("from");
//								                	speech.spell(response.body.fltinfo[i].deptAirportCode);
//								                	speech.say(" gate "+response.body.fltinfo[i].deptGate+".");
//								                	speech.pause("500ms");
//								                	speech.say("Price for the ticket is"+response.body.fltinfo[i].totalprice+" dollars.");
//								                	/*textpromt=textpromt+response.body.fltinfo[i].airline+" flight number "+response.body.fltinfo[i].flightNum+".At ";
//								                	textpromt=textpromt+"Option "+(i+1)+":";
//								                	textpromt=textpromt+"At "+response.body.fltinfo[i].deptTime+" from "+response.body.fltinfo[i].deptAirportCode+" gate "+response.body.fltinfo[i].deptGate+".";
//								                	
//								                	textpromt=textpromt+"Price for the ticket is"+response.body.fltinfo[i].totalprice+".";
//								                	//speech.pause('1s');*/								                	}
//								                var speechOutput = speech.ssml(true);
//								                console.log("textprompt"+textpromt);
//								                this.emit(':tell',speechOutput);
//								                //res.send(response);
//								            }
//								    		else
//								    			{
//								    			console.log("error"+response+error);
//								    			textpromt="error";
//								                this.emit(':tell',textpromt);
//								
//								    			//res.send("error");
//								    			}
//    	}.bind(this));
//        
//        
//		
//    },
//    'HotelSearchIntent': function () {
//        // Get a random space fact from the space facts list
//    	var myJSONObject={};
//        var input=this.event.request.intent.slots.input.value;
//        var sdatetime=this.event.request.intent.slots.startdate.value;
//        var edatetime=this.event.request.intent.slots.startdate.value;
//        myJSONObject={"input":input,
//        		"sdatetime":sdatetime,
//        		"edatetime":edatetime};
//        request({
//    	    url: "http://Sample-env.3ypbe4xuwp.us-east-1.elasticbeanstalk.com/htl",
//    	    method: "POST",
//    	    json: true,   // <--Very important!!!
//    	    body: myJSONObject
//    	}, function (error, response, body){
//    		 // console.log("res"+response);
//    		if (!error && response.statusCode == 200) {
//               // console.log("res"+JSON.parse(response));
//                console.log("place"+JSON.stringify(response));
//                // var replymsg = JSON.parse(response);
//                var carinfo = response["body"]["hotels"];
//                console.log(carinfo);
//                var speechText = "The top 10 results are. ";
//                speechText += carinfo;
//                console.log(speechText);
//             //    var speechText = "";
//        	    // speechText += "Welcome to " + SKILL_NAME + ".  ";
//        	    // speechText += "You can ask a question like, search for hotels near golden gate bridge, san fransisco.  ";
//        	    var repromptText = "For instructions on what you can say, please say help me.";
//        	    this.emit(':tell', speechText);
//                //res.send(response);
//            }
//    		else
//    			{
//    			console.log("error"+response+error);
//    			
//    			//res.send("error");
//    			}
//    	}.bind(this));
//    	// this.emit(':tell', "hello");
//		
//    },
//    'CarRentalIntent': function () {
//    	console.log("air");
//        // Get a random space fact from the space facts list
//    	var myJSONObject={};
//        var input=this.event.request.intent.slots.input.value;
//        var sdatetime=this.event.request.intent.slots.sdatetime.value;
//        var edatetime=this.event.request.intent.slots.edatetime.value;
//        myJSONObject={"input":input,
//        		"sdatetime":sdatetime,
//        		"edatetime":edatetime};
//        request({
//    	    url: "http://Sample-env.mqwha4phuc.us-east-1.elasticbeanstalk.com/car",
//    	    method: "POST",
//    	    json: true,   // <--Very important!!!
//    	    body: myJSONObject
//    	}, function (error, response, body){
//    		  console.log("res"+response);
//    		if (!error && response.statusCode == 200) {
//                //console.log("res"+JSON.parse(response));
//                console.log("place"+JSON.stringify(response));
//                // var replymsg = JSON.parse(response);
//                var carinfo = body.cars;
//                console.log("car object is"+carinfo);
//                var speechText = "";
//                speechText += carinfo;
//                console.log(speechText);
//             //    var speechText = "";
//        	    // speechText += "Welcome to " + SKILL_NAME + ".  ";
//        	    // speechText += "You can ask a question like, search for hotels near golden gate bridge, san fransisco.  ";
//        	    var repromptText = "For instructions on what you can say, please say help me.";
//        	    this.emit(':tell', speechText);
//                //res.send(response);
//            }
//    		else
//    			{
//    			console.log("error"+response+error);
//    			
//    			//res.send("error");
//    			}
//    	}.bind(this));
//    	// this.emit(':tell', "hello");
//		
//    },
//    'AMAZON.HelpIntent': function () {
//        const speechOutput = this.t('HELP_MESSAGE');
//        const reprompt = this.t('HELP_MESSAGE');
//        this.emit(':ask', speechOutput, reprompt);
//    },
//    'AMAZON.CancelIntent': function () {
//        this.emit(':tell', this.t('STOP_MESSAGE'));
//    },
//    'AMAZON.StopIntent': function () {
//        this.emit(':tell', this.t('STOP_MESSAGE'));
//    },
//    'SessionEndedRequest': function () {
//        this.emit(':tell', this.t('STOP_MESSAGE'));
//    },
//};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(newSessionHandlers, startStateHandlers,destinationStateHandlers,hotelStartDateHandler,hotelEndDateHandler,hotelGuestsHandler);
    alexa.execute();
};