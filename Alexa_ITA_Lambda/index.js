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
	    DESTINATION_CAR: '_DESTINATION_CAR',
	    STARTDATE: '_STARTDATE',
	    STARTDATE_CAR: '_STARTDATE_CAR',
	    ENDDATE: '_ENDDATE',
	    ENDDATE_CAR: '_ENDDATE_CAR',
	    GUESTS: '_GUESTS',
	    ANSWER: '_ANSWER',
	    ANSWER_CAR: '_ANSWER_CAR'
	};



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

        UNHANDLED: "I'm sorry I couldn't understand what you meant. Can you please say it again?"
};

var newSessionHandlers = {

	    'LaunchRequest': function() {
	        if(Object.keys(this.attributes).length === 0) { // Check if it's the first time the skill has been invoked
	            this.attributes['destination'] = undefined;
	            this.attributes['startdate'] = undefined;
	            this.attributes['enddate'] = undefined;
	            this.attributes['guests'] = undefined;
	        }
	        // Initialise State
	        this.handler.state = states.START;
	        this.emitWithState("Start")
	    },

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
        this.emit(':ask', speechText, repromptText);
    },

    'startHotelIntent': function () {
        var speechText = snippets.DESTINATION;
        var repromptText = snippets.DESTINATION_REPROMPT;

        // Change State to calculation
        this.handler.state = states.DESTINATION;
        this.emit(':ask', speechText, repromptText);
    },
    'startCarIntent': function () {
    	
    	var destination = this.event.request.intent.slots.destination_car.value;
    	var startdate = this.event.request.intent.slots.startdate_car.value;
    	var enddate = this.event.request.intent.slots.enddate_car.value;
    	if(destination != null)
    		{
    		this.attributes['destination_car'] = destination;
    			if(startdate != null)
    				{
    					this.attributes['startdate_car'] = moment(startdate).format("YYYY-MM-DD HH:mm");
    					if(enddate != null)
    						{
    							console.log("inside  startCarIntent with destination, startdate and enddate");
    					        var speechText = "",
    				            repromptText = "";
    					        var date = moment(enddate);
    					        var start_date = moment(startdate);
    					        if (date.isValid() && start_date.isValid()) 
    					        	{
    					        		if (!isPastDate(start_date)) 
    					        			{
    					        				if (isFutureDate(date.format("YYYY-MM-DD HH:mm"),startdate)) {
    					        					this.attributes['enddate_car'] = date.format("YYYY-MM-DD HH:mm");
    					        					console.log("The object is "+JSON.stringify(this.attributes));       				                   				                
    					        					this.handler.state = states.ANSWER;
    					        					var myJSONObject={};
    					        					myJSONObject={"input":this.attributes['destination_car'],
    					        					"sdatetime":this.attributes['startdate_car'],
    					        					"edatetime":this.attributes['enddate_car']
        				              			};        				               
    					        				console.log("myJSONObject is "+JSON.stringify(myJSONObject));
    					        				console.log("Calling api ");      				                
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
    					        							console.log("error"+response+error);
    					        							}
    					        				}.bind(this));        				                
    					        			} 
    					        			else {
    					        				// dob in the future
    					        				speechText = snippets.ENDDATE_INVALID_PAST;
    					        				repromptText = snippets.ENDDATE_INVALID_PAST; // could be improved by using alternative prompt text
    					        				this.emit(':ask', speechText, repromptText);
    					        			}
    					        		} 
    					        	else 
    					        		{
    					        		// dob in the future
    					        		speechText = snippets.STARTDATE_INVALID_PAST;
    					        		repromptText = snippets.STARTDATE_INVALID_PAST; // could be improved by using alternative prompt text
    					        		this.emit(':ask', speechText, repromptText);
    					        		}
    					        	} 
    					        else {
    					        	// not a valid Date
    					        	speechText = snippets.ENDDATE_INVALID;
    					        	repromptText = snippets.ENDDATE_INVALID; // could be improved by using alternative prompt text
    					        	this.emit(':ask', speechText, repromptText);
    					        }
    						}
    					else
    						{
    					console.log("inside  startCarIntent with destination and startdate");
    					var speechText = "",
    					repromptText = "";
    					console.log("hi");    	     
    					var date = moment(startdate);
    					if (date.isValid()) 
    						{
    						if (!isPastDate(date)) 
    							{
    								speechText = snippets.ENDDATE_CAR;
    								repromptText = snippets.ENDDATE_REPROMPT_CAR;    								
    								this.handler.state = states.ENDDATE_CAR;
    								console.log(JSON.stringify(this.attributes));
    								this.emit(':ask', speechText, repromptText);   	                
    							} 
    						else 
    							{
    								// dob in the future
    								speechText = snippets.STARTDATE_INVALID_PAST;
    								repromptText = snippets.STARTDATE_INVALID_PAST; // could be improved by using alternative prompt text
    								this.emit(':ask', speechText, repromptText);
    							}
    						} 
    					else 
    						{
    							// not a valid Date
    							speechText = snippets.STARTDATE_INVALID;
    							repromptText = snippets.STARTDATE_INVALID; // could be improved by using alternative prompt text
    							this.emit(':ask', speechText, repromptText);
    						}
    					}
    				}
    			else
    				{
    					console.log("inside  startCarIntent with destination");
    					var speechText = "",
    					repromptText = "";        
    					speechText = snippets.STARTDATE_CAR;
    					repromptText = snippets.STARTDATE_REPROMPT_CAR;
    					console.log(JSON.stringify(this.attributes));                              
    					this.handler.state = states.STARTDATE_CAR;
    					this.emit(':ask', speechText, repromptText);
    				}
        		}
    		else
    			{    		
    				console.log("inside  startCarIntent without destination");   		
    				var speechText = snippets.DESTINATION_CAR;
    				var repromptText = snippets.DESTINATION_REPROMPT_CAR;
    				// Change State to calculation
    				this.handler.state = states.DESTINATION_CAR;
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
var carDestinationStateHandlers = Alexa.CreateStateHandler(states.DESTINATION_CAR, {

    'carDestinationIntent': function () {
        var speechText = "",
            repromptText = "";

        var destination = this.event.request.intent.slots.destination_car.value;
        
                speechText = snippets.STARTDATE_CAR;
                repromptText = snippets.STARTDATE_REPROMPT_CAR;
                this.attributes['destination_car'] = destination;
                console.log(JSON.stringify(this.attributes));
               
               
                this.handler.state = states.STARTDATE_CAR;
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
var carStartDateHandler = Alexa.CreateStateHandler(states.STARTDATE_CAR, {

    'carStartDateIntent': function () {
        var speechText = "",
            repromptText = "";
        console.log("hi");

        var date_string = this.event.request.intent.slots.startdate_car.value;
        var date = moment(date_string);

        if (date.isValid()) {

            if (!isPastDate(date)) {
                // ALL GOOD – dob not in the past
                speechText = snippets.ENDDATE_CAR;
                repromptText = snippets.ENDDATE_REPROMPT_CAR;
                this.attributes['startdate_car'] = date.format("YYYY-MM-DD HH:mm");

                // Transition to next state
                this.handler.state = states.ENDDATE_CAR;
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

var carEndDateHandler = Alexa.CreateStateHandler(states.ENDDATE_CAR, {


    'carEndDateIntent': function () {
        var speechText = "",
            repromptText = "";
//        console.log("hi");

        var date_string = this.event.request.intent.slots.enddate_car.value;
        var date = moment(date_string);
        var startdate = this.attributes['startdate_car'];

        if (date.isValid()) {

            if (isFutureDate(date.format("YYYY-MM-DD HH:mm"),startdate)) {

                this.attributes['enddate_car'] = date.format("YYYY-MM-DD HH:mm");

                console.log("The object is "+JSON.stringify(this.attributes));
                
                
                this.handler.state = states.ANSWER;
                var myJSONObject={};
               myJSONObject={"input":this.attributes['destination_car'],
              		"sdatetime":this.attributes['startdate_car'],
              		"edatetime":this.attributes['enddate_car']
              			};
               
               console.log("myJSONObject is "+JSON.stringify(myJSONObject));
               console.log("Calling api ");
                
             request({
       	    url: "http://Sample-env.mqwha4phuc.us-east-1.elasticbeanstalk.com/car",
       	    method: "POST",
       	    json: true,   // <--Very important!!!
       	    body: myJSONObject
       	}, function (error, response, body){
       		  console.log("res"+response);
       		if (!error && response.statusCode == 200) {
                   //console.log("res"+JSON.parse(response));
                   console.log("place"+JSON.stringify(response));
                   // var replymsg = JSON.parse(response);
                   var carinfo = body.cars;
                   console.log("car object is"+carinfo);
                   var speechText = "";
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
        console.log("The object is "+JSON.stringify(this.attributes));
       
       
        this.handler.state = states.ANSWER;
        var myJSONObject={};
       myJSONObject={"input":this.attributes['destination'],
      		"sdatetime":"2017-4-25 16:25",
      		"edatetime":"2017-4-27 16:25"
      			};
       
       console.log("myJSONObject is "+JSON.stringify(myJSONObject));
       console.log("Calling api ");
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

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(newSessionHandlers, startStateHandlers,destinationStateHandlers,carDestinationStateHandlers,hotelStartDateHandler,carStartDateHandler,hotelEndDateHandler,carEndDateHandler,hotelGuestsHandler);
    alexa.execute();
};