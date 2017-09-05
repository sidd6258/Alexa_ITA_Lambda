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



var snippets = {
        WELCOME: "<s>Welcome to the Intelligent travel agent.</s> " +
        "<s>You can ask to book a Hotel or book a rental car or book a flight</s>",

        WELCOME_REPROMPT: "You can say, " +
        "I want to book a hotel or I want to book a rental car or book a flight",

        DESTINATION: "Ok, Where do you want to book the hotel?",
        DESTINATION_CAR: "Ok, Where do you want to book the rental car?",
        DESTINATION_F: "Ok, Where do you want to book the flight?",

        DESTINATION_REPROMPT: "In order to book a hotel, please tell me: the destination for the hotel?",
        DESTINATION_REPROMPT_CAR: "In order to book a rental car, please tell me: the destination?",
        DESTINATION_REPROMPT_F: "In order to book a flight, please tell me: the destination?",

        DESTINATION_INVALID: "Sorry I couldn't understand your travel destination?",
        
        ORIGIN_F:"OK, from where do you want to book the flight",

        ORIGIN_REPROMT_F:"In order to book a flight,please tell me: the origin",
        
        STARTDATE: "Ok, please tell me the date you want to book the hotel from",
        STARTDATE_CAR: "Ok, please tell me the date you want to book the car from",
        STARTDATE_F: "Ok, please tell me the date you want to book the flight from",

        STARTDATE_REPROMPT: "In order to book a hotel, please tell me the travel check in date?",
        STARTDATE_REPROMPT_CAR: "In order to book a car, please tell me the travel check in date?",
        STARTDATE_REPROMPT_F: "In order to book a flight, please tell me the travel check in date?",

        STARTDATE_INVALID_PAST: "Nice, you live in the past. Do you have a time machine? Seriously, can you please say your actual desired check in date?",

        STARTDATE_INVALID: "Sorry, i didnt get that. can you please repeat? you can say 1st January 2017.",
        
        ENDDATE: "Ok, please tell me the date you want to leave the hotel in.",
        ENDDATE_CAR: "Ok, please tell me the date you want to drop off the car",
        
        ENDDATE_REPROMPT: "In order to book a hotel, please tell me the travel check out date?",
        ENDDATE_REPROMPT_CAR: "In order to book a car, please tell me the drop off date date?",

        ENDDATE_INVALID_PAST: "you cannot leave a hotel before you check in. Say the date you want to leave the hotel in ?",

        ENDDATE_INVALID: "Sorry, i didnt get that. can you please repeat? you can say 1st January 2017.",
        
        GUESTS: "Now please tell me the number of guests to book the hotel for",
        GUESTS_F: "Now please tell me the number of guests to book the flight for",
        
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
	            this.attributes['origin']=undefined;
	            console.log("ajay");
	        }
	        console.log("ajay1");
	        // Initialise State
	        this.handler.state = states.START;
	        this.emitWithState("Start");
	    },

	    "Unhandled": function () {
	        var speechText = "I wasn't launched yet";
	        this.emit(":ask", speechText);
	    }
	};

var startStateHandlers = Alexa.CreateStateHandler(states.START, {
	 
    'Start': function() {
    	 console.log("ajay1");
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
    'startFlightIntent': function(){
    	
    	var destination = this.event.request.intent.slots.destination_f.value;
   	 	var date = this.event.request.intent.slots.date.value;
   	 	var origin=this.event.request.intent.slots.origin.value;
   	 	var guests=this.event.request.intent.slots.guests_f.value;
   	 	if(destination==null&&origin==null&&date==null&&guests==null)
    	{var speechText = snippets.DESTINATION_F;
        var repromptText = snippets.DESTINATION_F;
        console.log("start");
        // Change State to calculation
        this.handler.state = states.DESTINATION_F;
        this.emit(':ask', speechText, repromptText);
    	}
   	 	else if(destination!=null&&origin!=null&&date!=null&&guests!=null)
   	 			{
   	 				this.attributes['destination']=destination;
   	 				this.attributes['origin']=origin;
   	 				this.attributes['startdate']=date;
   	 				this.attributes['guests']=guests;
   	 				console.log("The object is "+JSON.stringify(this.attributes));
   	 				this.handler.state = states.ANSWER;
   	 				var myJSONObject={};
   	 				var myJSONObject={	
   	 						"src":this.attributes['origin'],
   	 						"input":this.attributes['destination'],
   	 						"sdatetime":"",
   	 						"edatetime":"",
   	 						"lat":"","lon":""
   	 				};
   	 				var speech=new Speech();
   	 				console.log("myJSONObject is "+JSON.stringify(myJSONObject));
   	 				console.log("Calling api ");
   	 				request({
   	 					url: "http://Sample-env.3ypbe4xuwp.us-east-1.elasticbeanstalk.com/fly",
   	 					method: "POST",
   	 					json: true,   // <--Very important!!!
   	 					body: myJSONObject
   	 				}, function (error, response, body){
   	 					console.log("res"+response);
   	 					if (!error && response.statusCode == 200) {

   	 						console.log("place"+JSON.stringify(response));

   	 						for(var i=0;i<5;i++)
   	 						{
   	 							speech.pause("500ms");
   	 							speech.say("Option "+(parseInt(i,10)+1)+":");
   	 							speech.pause("500ms");
   	 							speech.say(response.body.fltinfo[i].airline+" airline flight number "+response.body.fltinfo[i].flightNum+".");
   	 							speech.say("At ");
   	 							speech.sayAs({
   	 								"word":response.body.fltinfo[i].deptTime+":00",
   	 								"interpret": "time",

   	 							});
   	 							speech.say("hours");

   	 							speech.say("from");
   	 							speech.spell(response.body.fltinfo[i].deptAirportCode);
   	 							speech.say(" gate "+response.body.fltinfo[i].deptGate+".");
   	 							speech.pause("500ms");
   	 							speech.say("Price for the ticket is"+response.body.fltinfo[i].totalprice+" dollars.");
   	 							/*textpromt=textpromt+response.body.fltinfo[i].airline+" flight number "+response.body.fltinfo[i].flightNum+".At ";
   	 					           	textpromt=textpromt+"Option "+(i+1)+":";
   	 					           	textpromt=textpromt+"At "+response.body.fltinfo[i].deptTime+" from "+response.body.fltinfo[i].deptAirportCode+" gate "+response.body.fltinfo[i].deptGate+".";

   	 					           	textpromt=textpromt+"Price for the ticket is"+response.body.fltinfo[i].totalprice+".";
   	 					           	//speech.pause('1s');*/								                	}
   	 						var speechOutput = speech.ssml(true);
   	 						//console.log("textprompt"+textpromt);
   	 						this.emit(':tell',speechOutput);
   	 						//res.send(response);
   	 					}
   	 					else
   	 					{
   	 						console.log("error"+response+error);
   	 						textpromt="error";
   	 						this.emit(':tell',textpromt);

   	 						//res.send("error");
   	 					}
   	 				}.bind(this));
   	 			}
   	 	else if(destination!=null&&(origin==null&&date==null&&guests==null))
   	 		{
   	 			this.attributes['destination']=destination;
   	 		speechText = snippets.ORIGIN_F;
            repromptText = snippets.ORIGIN_REPROMT_F;
            this.attributes['destination'] = destination;
            console.log(JSON.stringify(this.attributes));
           
           
            this.handler.state = states.ORIGIN_F;
            this.emit(':ask', speechText, repromptText);
   	 		}
   	 	else if((destination!=null&&origin!=null)&&(date==null&&guests==null)){
	   	 	this.attributes['destination']=destination;
	   	 	this.attributes['origin']=origin;
		   	 speechText = snippets.STARTDATE_F;
		     repromptText = snippets.STARTDATE_REPROMPT_F;
		    // this.attributes['origin'] = destination;
		     console.log(JSON.stringify(this.attributes));
		    
		    
		     this.handler.state = states.STARTDATE_F;
		     this.emit(':ask', speechText, repromptText);
   	 	
   	 	}
   	 	else if((destination!=null&&origin!=null&&date!=null)&&(guests==null))
   		 {
	   		 this.attributes['destination']=destination;
			 this.attributes['origin']=origin;
			 this.attributes['startdate']=date;
		   	 this.handler.state = states.GUESTS_F;
		   	speechText = snippets.GUESTS_F;
            repromptText = snippets.GUESTS_F;
		     console.log(JSON.stringify(this.attributes));
		     this.emit(':ask', speechText, repromptText);
   	 	
   		 }
   	 	else if(origin!=null&&(destination==null&&date==null&&guests==null))
   		 {
   		 	this.attributes['origin']=origin;
   		 var speechText = snippets.DESTINATION_F;
         var repromptText = snippets.DESTINATION_F;
         console.log("start");
         // Change State to calculation
         this.handler.state = states.DESTINATION_F;
         this.emit(':ask', speechText, repromptText);
   		 }
   	 	else if(origin!=null&&date!=null&&(destination==null&&guests==null))
		 {
   		this.attributes['origin']=origin;
		this.attributes['startdate']=date;
		var speechText = snippets.DESTINATION_F;
        var repromptText = snippets.DESTINATION_F;
        console.log("start");
        // Change State to calculation
        this.handler.state = states.DESTINATION_F;
        this.emit(':ask', speechText, repromptText);
		
		 }					
   	 	else if(origin!=null&&date!=null&&guests!=null&&(destination==null))				
   	 	{
   		this.attributes['origin']=origin;
		this.attributes['startdate']=date;
		this.attributes['guests']=guests;
		var speechText = snippets.DESTINATION_F;
        var repromptText = snippets.DESTINATION_F;
        console.log("start");
        // Change State to calculation
        this.handler.state = states.DESTINATION_F;
        this.emit(':ask', speechText, repromptText);
   	 	}
   	 	else if(date!=null&&(destination==null&&origin==null&&guests==null))
   		 {
   		 	//this.attributes['origin']=origin;
   			this.attributes['startdate']=date;
   			//this.attributes['guests']=guests;
   			var speechText = snippets.DESTINATION_F;
   	        var repromptText = snippets.DESTINATION_F;
   	        console.log("start");
   	        // Change State to calculation
   	        this.handler.state = states.DESTINATION_F;
   	        this.emit(':ask', speechText, repromptText);
   		 }
   	 	else if(date!=null&&guest!=null&&(destination==null&&origin==null))
   		 {
   		this.attributes['startdate']=date;
			this.attributes['guests']=guests;
			var speechText = snippets.DESTINATION_F;
	        var repromptText = snippets.DESTINATION_F;
	        console.log("start");
	        // Change State to calculation
	        this.handler.state = states.DESTINATION_F;
	        this.emit(':ask', speechText, repromptText);
   		 }
   	 	else if(guest!=null&&(destination==null&&origin==null&&date==null))
   		 {
   		this.attributes['guests']=guests;
		var speechText = snippets.DESTINATION_F;
        var repromptText = snippets.DESTINATION_F;
        console.log("start");
        // Change State to calculation
        this.handler.state = states.DESTINATION_F;
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
    }


});


var flightdestinationStateHandlers = Alexa.CreateStateHandler(states.DESTINATION_F, {

    'flightDestinationIntent': function () {
        var speechText = "",
            repromptText = "";
        console.log("dest");
        
       // var destination = this.event.request.intent.slots.destination_f.value;
   	 	var date = this.event.request.intent.slots.date.value;
   	 	var origin=this.event.request.intent.slots.origin.value;
   	 	var guests=this.event.request.intent.slots.guests_f.value;
        
        var destination = this.event.request.intent.slots.destination_f.value;
        //var date = moment(date_string);
        	
                speechText = snippets.ORIGIN_F;
                repromptText = snippets.ORIGIN_REPROMT_F;
                this.handler.state = states.ORIGIN_F;
                if(this.attributes['destination']==undefined)
            	{
                this.attributes['destination'] = destination;
            	}
                console.log(JSON.stringify(this.attributes));
                if(this.attributes['origin']!=undefined&&(this.attributes['startdate']==undefined&&this.attributes['guests']==undefined))
                	{
                	speechtext=snippets.STARTDATE_F;
                	repromptText=snippets.STARTDATE_REPROMPT_F;
                	this.handler.state=states.STARTDATE_F;
                	 this.emit(':ask', speechText, repromptText);
                	}
                else if(this.attributes['startdate']!=undefined&&this.attributes['origin']!=undefined&&this.attributes['guests']==undefined)
                {
                	speechText = snippets.GUESTS_F;
                    repromptText = snippets.GUESTS_F;
                    this.handler.state = states.GUESTS_F;
                    this.emit(':ask', speechText, repromptText);
                }
                else if(this.attributes['startdate']!=undefined&&this.attributes['origin']!=undefined&&this.attributes['guests']!=undefined)
                {
                	console.log("The object is "+JSON.stringify(this.attributes));
   	 				this.handler.state = states.ANSWER;
   	 				var myJSONObject={};
   	 				var myJSONObject={	
   	 						"src":this.attributes['origin'],
   	 						"input":this.attributes['destination'],
   	 						"sdatetime":"",
   	 						"edatetime":"",
   	 						"lat":"","lon":""
   	 				};
   	 				var speech=new Speech();
   	 				console.log("myJSONObject is "+JSON.stringify(myJSONObject));
   	 				console.log("Calling api ");
   	 				request({
   	 					url: "http://Sample-env.3ypbe4xuwp.us-east-1.elasticbeanstalk.com/fly",
   	 					method: "POST",
   	 					json: true,   // <--Very important!!!
   	 					body: myJSONObject
   	 				}, function (error, response, body){
   	 					console.log("res"+response);
   	 					if (!error && response.statusCode == 200) {

   	 						console.log("place"+JSON.stringify(response));

   	 						for(var i=0;i<5;i++)
   	 						{
   	 							speech.pause("500ms");
   	 							speech.say("Option "+(parseInt(i,10)+1)+":");
   	 							speech.pause("500ms");
   	 							speech.say(response.body.fltinfo[i].airline+" airline flight number "+response.body.fltinfo[i].flightNum+".");
   	 							speech.say("At ");
   	 							speech.sayAs({
   	 								"word":response.body.fltinfo[i].deptTime+":00",
   	 								"interpret": "time",

   	 							});
   	 							speech.say("hours");

   	 							speech.say("from");
   	 							speech.spell(response.body.fltinfo[i].deptAirportCode);
   	 							speech.say(" gate "+response.body.fltinfo[i].deptGate+".");
   	 							speech.pause("500ms");
   	 							speech.say("Price for the ticket is"+response.body.fltinfo[i].totalprice+" dollars.");
   	 							/*textpromt=textpromt+response.body.fltinfo[i].airline+" flight number "+response.body.fltinfo[i].flightNum+".At ";
   	 					           	textpromt=textpromt+"Option "+(i+1)+":";
   	 					           	textpromt=textpromt+"At "+response.body.fltinfo[i].deptTime+" from "+response.body.fltinfo[i].deptAirportCode+" gate "+response.body.fltinfo[i].deptGate+".";

   	 					           	textpromt=textpromt+"Price for the ticket is"+response.body.fltinfo[i].totalprice+".";
   	 					           	//speech.pause('1s');*/								                	}
   	 						var speechOutput = speech.ssml(true);
   	 						//console.log("textprompt"+textpromt);
   	 						this.emit(':tell',speechOutput);
   	 						//res.send(response);
   	 					}
   	 					else
   	 					{
   	 						console.log("error"+response+error);
   	 						textpromt="error";
   	 						this.emit(':tell',textpromt);

   	 						//res.send("error");
   	 					}
   	 				}.bind(this));
                }
                else
                	{
                	if(origin==null&&date==null&&guests==null)
                		{
                		this.emit(':ask', speechText, repromptText);
                		}
                	else if(origin!=null&&date!=null&&guests!=null)
       	 			{
       	 				//this.attributes['destination']=destination;
       	 				this.attributes['origin']=origin;
       	 				this.attributes['startdate']=date;
       	 				this.attributes['guests']=guests;
       	 				console.log("The object is "+JSON.stringify(this.attributes));
       	 				this.handler.state = states.ANSWER;
       	 				var myJSONObject={};
       	 				var myJSONObject={	
       	 						"src":this.attributes['origin'],
       	 						"input":this.attributes['destination'],
       	 						"sdatetime":"",
       	 						"edatetime":"",
       	 						"lat":"","lon":""
       	 				};
       	 				var speech=new Speech();
       	 				console.log("myJSONObject is "+JSON.stringify(myJSONObject));
       	 				console.log("Calling api ");
       	 				request({
       	 					url: "http://Sample-env.3ypbe4xuwp.us-east-1.elasticbeanstalk.com/fly",
       	 					method: "POST",
       	 					json: true,   // <--Very important!!!
       	 					body: myJSONObject
       	 				}, function (error, response, body){
       	 					console.log("res"+response);
       	 					if (!error && response.statusCode == 200) {

       	 						console.log("place"+JSON.stringify(response));

       	 						for(var i=0;i<5;i++)
       	 						{
       	 							speech.pause("500ms");
       	 							speech.say("Option "+(parseInt(i,10)+1)+":");
       	 							speech.pause("500ms");
       	 							speech.say(response.body.fltinfo[i].airline+" airline flight number "+response.body.fltinfo[i].flightNum+".");
       	 							speech.say("At ");
       	 							speech.sayAs({
       	 								"word":response.body.fltinfo[i].deptTime+":00",
       	 								"interpret": "time",

       	 							});
       	 							speech.say("hours");

       	 							speech.say("from");
       	 							speech.spell(response.body.fltinfo[i].deptAirportCode);
       	 							speech.say(" gate "+response.body.fltinfo[i].deptGate+".");
       	 							speech.pause("500ms");
       	 							speech.say("Price for the ticket is"+response.body.fltinfo[i].totalprice+" dollars.");
       	 							/*textpromt=textpromt+response.body.fltinfo[i].airline+" flight number "+response.body.fltinfo[i].flightNum+".At ";
       	 					           	textpromt=textpromt+"Option "+(i+1)+":";
       	 					           	textpromt=textpromt+"At "+response.body.fltinfo[i].deptTime+" from "+response.body.fltinfo[i].deptAirportCode+" gate "+response.body.fltinfo[i].deptGate+".";

       	 					           	textpromt=textpromt+"Price for the ticket is"+response.body.fltinfo[i].totalprice+".";
       	 					           	//speech.pause('1s');*/								                	}
       	 						var speechOutput = speech.ssml(true);
       	 						//console.log("textprompt"+textpromt);
       	 						this.emit(':tell',speechOutput);
       	 						//res.send(response);
       	 					}
       	 					else
       	 					{
       	 						console.log("error"+response+error);
       	 						textpromt="error";
       	 						this.emit(':tell',textpromt);

       	 						//res.send("error");
       	 					}
       	 				}.bind(this));
       	 			}
                	else if(origin!=null&&(date==null&&guests==null))
           	 		{
           	 			this.attributes['origin']=origin;
           	 		speechText = snippets.STARTDATE_F;
       		     repromptText = snippets.STARTDATE_REPROMPT_F;
       		    // this.attributes['origin'] = destination;
       		     console.log(JSON.stringify(this.attributes));
       		    
       		    
       		     this.handler.state = states.STARTDATE_F;
       		     this.emit(':ask', speechText, repromptText);
           	 	}
                	else if((date!=null&&origin!=null)&&(guests==null))
                {
        	   	 	this.attributes['startdate']=date;
        	   	 	this.attributes['origin']=origin;
        	   	 this.handler.state = states.GUESTS_F;
     		   	speechText = snippets.GUESTS_F;
                 repromptText = snippets.GUESTS_F;
     		     console.log(JSON.stringify(this.attributes));
     		     this.emit(':ask', speechText, repromptText);
           	 	
           	 	}
                else if((date!=null)&&(guests==null&&origin==null))
           		 {
        			 this.attributes['startdate']=date;
        		   	 //this.handler.state = states.GUESTS_F;
        		   	
        		     this.emit(':ask', speechText, repromptText);
           	 	
           		 }
             else if((date!=null&&guests!=null)&&(origin==null))
      		 {
   			 this.attributes['startdate']=date;
   			 this.attrinutes['guests']=guests;
   		   	 //this.handler.state = states.GUESTS_F;
   		   	
   		     this.emit(':ask', speechText, repromptText);
      	 	
      		 }
             else if((guests!=null)&&(origin==null&&date==null))
     		 {
  			 //this.attributes['startdate']=date;
  			 this.attrinutes['guests']=guests;
  		   	 //this.handler.state = states.GUESTS_F;
  		   	
  		     this.emit(':ask', speechText, repromptText);
     	 	
     		 }
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

var flightoriginStateHandlers = Alexa.CreateStateHandler(states.ORIGIN_F, {

    'flightOriginIntent': function () {
        var speechText = "",
            repromptText = "";
        console.log("ori");
        var origin = this.event.request.intent.slots.origin.value;
        var date = this.event.request.intent.slots.date.value;
   	 	var guests=this.event.request.intent.slots.guests_f.value;
        //var date = moment(date_string);
        
                speechText = snippets.STARTDATE_F;
                repromptText = snippets.STARTDATE_REPROMPT_F;
                this.handler.state = states.STARTDATE_F;
                if(this.attributes['origin']==undefined);
                {
                this.attributes['origin'] = origin;
                }
                console.log(JSON.stringify(this.attributes));
               
               
                
                
                
                if(this.attributes['startdate']!=undefined&&(this.attributes['guests']==undefined))
            	{
                	speechText = snippets.GUESTS_F;
                    repromptText = snippets.GUESTS_F;
                    this.handler.state = states.GUESTS_F;
                    this.emit(':ask', speechText, repromptText);
            	}
           
            else if(this.attributes['startdate']!=undefined&&this.attributes['guests']!=undefined)
            	{
            	console.log("The object is "+JSON.stringify(this.attributes));
	 				this.handler.state = states.ANSWER;
	 				var myJSONObject={};
	 				var myJSONObject={	
	 						"src":this.attributes['origin'],
	 						"input":this.attributes['destination'],
	 						"sdatetime":"",
	 						"edatetime":"",
	 						"lat":"","lon":""
	 				};
	 				var speech=new Speech();
	 				console.log("myJSONObject is "+JSON.stringify(myJSONObject));
	 				console.log("Calling api ");
	 				request({
	 					url: "http://Sample-env.3ypbe4xuwp.us-east-1.elasticbeanstalk.com/fly",
	 					method: "POST",
	 					json: true,   // <--Very important!!!
	 					body: myJSONObject
	 				}, function (error, response, body){
	 					console.log("res"+response);
	 					if (!error && response.statusCode == 200) {

	 						console.log("place"+JSON.stringify(response));

	 						for(var i=0;i<5;i++)
	 						{
	 							speech.pause("500ms");
	 							speech.say("Option "+(parseInt(i,10)+1)+":");
	 							speech.pause("500ms");
	 							speech.say(response.body.fltinfo[i].airline+" airline flight number "+response.body.fltinfo[i].flightNum+".");
	 							speech.say("At ");
	 							speech.sayAs({
	 								"word":response.body.fltinfo[i].deptTime+":00",
	 								"interpret": "time",

	 							});
	 							speech.say("hours");

	 							speech.say("from");
	 							speech.spell(response.body.fltinfo[i].deptAirportCode);
	 							speech.say(" gate "+response.body.fltinfo[i].deptGate+".");
	 							speech.pause("500ms");
	 							speech.say("Price for the ticket is"+response.body.fltinfo[i].totalprice+" dollars.");
	 							/*textpromt=textpromt+response.body.fltinfo[i].airline+" flight number "+response.body.fltinfo[i].flightNum+".At ";
	 					           	textpromt=textpromt+"Option "+(i+1)+":";
	 					           	textpromt=textpromt+"At "+response.body.fltinfo[i].deptTime+" from "+response.body.fltinfo[i].deptAirportCode+" gate "+response.body.fltinfo[i].deptGate+".";

	 					           	textpromt=textpromt+"Price for the ticket is"+response.body.fltinfo[i].totalprice+".";
	 					           	//speech.pause('1s');*/								                	}
	 						var speechOutput = speech.ssml(true);
	 						//console.log("textprompt"+textpromt);
	 						this.emit(':tell',speechOutput);
	 						//res.send(response);
	 					}
	 					else
	 					{
	 						console.log("error"+response+error);
	 						textpromt="error";
	 						this.emit(':tell',textpromt);

	 						//res.send("error");
	 					}
	 				}.bind(this));
            	}
            else
            	{
            		
            	if(date==null&&guests==null)
        		{
        		this.emit(':ask', speechText, repromptText);
        		}
        	else if(date!=null&&guests!=null)
	 			{
	 				//this.attributes['destination']=destination;
	 				//this.attributes['origin']=origin;
	 				this.attributes['startdate']=date;
	 				this.attributes['guests']=guests;
	 				console.log("The object is "+JSON.stringify(this.attributes));
	 				this.handler.state = states.ANSWER;
	 				var myJSONObject={};
	 				var myJSONObject={	
	 						"src":this.attributes['origin'],
	 						"input":this.attributes['destination'],
	 						"sdatetime":"",
	 						"edatetime":"",
	 						"lat":"","lon":""
	 				};
	 				var speech=new Speech();
	 				console.log("myJSONObject is "+JSON.stringify(myJSONObject));
	 				console.log("Calling api ");
	 				request({
	 					url: "http://Sample-env.3ypbe4xuwp.us-east-1.elasticbeanstalk.com/fly",
	 					method: "POST",
	 					json: true,   // <--Very important!!!
	 					body: myJSONObject
	 				}, function (error, response, body){
	 					console.log("res"+response);
	 					if (!error && response.statusCode == 200) {

	 						console.log("place"+JSON.stringify(response));

	 						for(var i=0;i<5;i++)
	 						{
	 							speech.pause("500ms");
	 							speech.say("Option "+(parseInt(i,10)+1)+":");
	 							speech.pause("500ms");
	 							speech.say(response.body.fltinfo[i].airline+" airline flight number "+response.body.fltinfo[i].flightNum+".");
	 							speech.say("At ");
	 							speech.sayAs({
	 								"word":response.body.fltinfo[i].deptTime+":00",
	 								"interpret": "time",

	 							});
	 							speech.say("hours");

	 							speech.say("from");
	 							speech.spell(response.body.fltinfo[i].deptAirportCode);
	 							speech.say(" gate "+response.body.fltinfo[i].deptGate+".");
	 							speech.pause("500ms");
	 							speech.say("Price for the ticket is"+response.body.fltinfo[i].totalprice+" dollars.");
	 							/*textpromt=textpromt+response.body.fltinfo[i].airline+" flight number "+response.body.fltinfo[i].flightNum+".At ";
	 					           	textpromt=textpromt+"Option "+(i+1)+":";
	 					           	textpromt=textpromt+"At "+response.body.fltinfo[i].deptTime+" from "+response.body.fltinfo[i].deptAirportCode+" gate "+response.body.fltinfo[i].deptGate+".";

	 					           	textpromt=textpromt+"Price for the ticket is"+response.body.fltinfo[i].totalprice+".";
	 					           	//speech.pause('1s');*/								                	}
	 						var speechOutput = speech.ssml(true);
	 						//console.log("textprompt"+textpromt);
	 						this.emit(':tell',speechOutput);
	 						//res.send(response);
	 					}
	 					else
	 					{
	 						console.log("error"+response+error);
	 						textpromt="error";
	 						this.emit(':tell',textpromt);

	 						//res.send("error");
	 					}
	 				}.bind(this));
	 			}
        	else if(date!=null&&(guests==null))
   	 		{
   	 			this.attributes['startdate']=date;
   	 		this.handler.state = states.GUESTS_F;
		   	speechText = snippets.GUESTS_F;
         repromptText = snippets.GUESTS_F;
		     console.log(JSON.stringify(this.attributes));
		     this.emit(':ask', speechText, repromptText);
   	 		}
   	 	
   	 
        	else if((guests!=null)&&(date==null))
		 {
		 //this.attributes['startdate']=date;
		 this.attrinutes['guests']=guests;
	   	 //this.handler.state = states.GUESTS_F;
	   	
	     this.emit(':ask', speechText, repromptText);
	 	
		 }
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

var flightStartDateHandler = Alexa.CreateStateHandler(states.STARTDATE_F, {

    'flightStartDateIntent': function () {
        var speechText = "",
            repromptText = "";
        console.log("hi");

       // var date_string = 
        var date = this.event.request.intent.slots.date.value;
   	 	var guests=this.event.request.intent.slots.guests_f.value;

        

           
                // ALL GOOD – dob not in the past
                speechText = snippets.GUESTS_F;
                repromptText = snippets.GUESTS_F;
                if(this.attributes['startdate']==undefined)
                	{
                this.attributes['startdate'] = date;
                	}
                // Transition to next state
                this.handler.state = states.GUESTS_F;
                console.log(JSON.stringify(this.attributes));
               
           
            if(this.attributes['guests']!=undefined)
            	{
            	console.log("The object is "+JSON.stringify(this.attributes));
	 				this.handler.state = states.ANSWER;
	 				var myJSONObject={};
	 				var myJSONObject={	
	 						"src":this.attributes['origin'],
	 						"input":this.attributes['destination'],
	 						"sdatetime":"",
	 						"edatetime":"",
	 						"lat":"","lon":""
	 				};
	 				var speech=new Speech();
	 				console.log("myJSONObject is "+JSON.stringify(myJSONObject));
	 				console.log("Calling api ");
	 				request({
	 					url: "http://Sample-env.3ypbe4xuwp.us-east-1.elasticbeanstalk.com/fly",
	 					method: "POST",
	 					json: true,   // <--Very important!!!
	 					body: myJSONObject
	 				}, function (error, response, body){
	 					console.log("res"+response);
	 					if (!error && response.statusCode == 200) {

	 						console.log("place"+JSON.stringify(response));

	 						for(var i=0;i<5;i++)
	 						{
	 							speech.pause("500ms");
	 							speech.say("Option "+(parseInt(i,10)+1)+":");
	 							speech.pause("500ms");
	 							speech.say(response.body.fltinfo[i].airline+" airline flight number "+response.body.fltinfo[i].flightNum+".");
	 							speech.say("At ");
	 							speech.sayAs({
	 								"word":response.body.fltinfo[i].deptTime+":00",
	 								"interpret": "time",

	 							});
	 							speech.say("hours");

	 							speech.say("from");
	 							speech.spell(response.body.fltinfo[i].deptAirportCode);
	 							speech.say(" gate "+response.body.fltinfo[i].deptGate+".");
	 							speech.pause("500ms");
	 							speech.say("Price for the ticket is"+response.body.fltinfo[i].totalprice+" dollars.");
	 							/*textpromt=textpromt+response.body.fltinfo[i].airline+" flight number "+response.body.fltinfo[i].flightNum+".At ";
	 					           	textpromt=textpromt+"Option "+(i+1)+":";
	 					           	textpromt=textpromt+"At "+response.body.fltinfo[i].deptTime+" from "+response.body.fltinfo[i].deptAirportCode+" gate "+response.body.fltinfo[i].deptGate+".";

	 					           	textpromt=textpromt+"Price for the ticket is"+response.body.fltinfo[i].totalprice+".";
	 					           	//speech.pause('1s');*/								                	}
	 						var speechOutput = speech.ssml(true);
	 						//console.log("textprompt"+textpromt);
	 						this.emit(':tell',speechOutput);
	 						//res.send(response);
	 					}
	 					else
	 					{
	 						console.log("error"+response+error);
	 						textpromt="error";
	 						this.emit(':tell',textpromt);

	 						//res.send("error");
	 					}
	 				}.bind(this));
            	}
            else
            	{
            		
            	if(guests==null)
        		{
        		this.emit(':ask', speechText, repromptText);
        		}
        	else if(guests!=null)
	 			{
	 				//this.attributes['destination']=destination;
	 				//this.attributes['origin']=origin;
	 				this.attributes['startdate']=date;
	 				this.attributes['guests']=guests;
	 				console.log("The object is "+JSON.stringify(this.attributes));
	 				this.handler.state = states.ANSWER;
	 				var myJSONObject={};
	 				var myJSONObject={	
	 						"src":this.attributes['origin'],
	 						"input":this.attributes['destination'],
	 						"sdatetime":"",
	 						"edatetime":"",
	 						"lat":"","lon":""
	 				};
	 				var speech=new Speech();
	 				console.log("myJSONObject is "+JSON.stringify(myJSONObject));
	 				console.log("Calling api ");
	 				request({
	 					url: "http://Sample-env.3ypbe4xuwp.us-east-1.elasticbeanstalk.com/fly",
	 					method: "POST",
	 					json: true,   // <--Very important!!!
	 					body: myJSONObject
	 				}, function (error, response, body){
	 					console.log("res"+response);
	 					if (!error && response.statusCode == 200) {

	 						console.log("place"+JSON.stringify(response));

	 						for(var i=0;i<5;i++)
	 						{
	 							speech.pause("500ms");
	 							speech.say("Option "+(parseInt(i,10)+1)+":");
	 							speech.pause("500ms");
	 							speech.say(response.body.fltinfo[i].airline+" airline flight number "+response.body.fltinfo[i].flightNum+".");
	 							speech.say("At ");
	 							speech.sayAs({
	 								"word":response.body.fltinfo[i].deptTime+":00",
	 								"interpret": "time",

	 							});
	 							speech.say("hours");

	 							speech.say("from");
	 							speech.spell(response.body.fltinfo[i].deptAirportCode);
	 							speech.say(" gate "+response.body.fltinfo[i].deptGate+".");
	 							speech.pause("500ms");
	 							speech.say("Price for the ticket is"+response.body.fltinfo[i].totalprice+" dollars.");
	 							/*textpromt=textpromt+response.body.fltinfo[i].airline+" flight number "+response.body.fltinfo[i].flightNum+".At ";
	 					           	textpromt=textpromt+"Option "+(i+1)+":";
	 					           	textpromt=textpromt+"At "+response.body.fltinfo[i].deptTime+" from "+response.body.fltinfo[i].deptAirportCode+" gate "+response.body.fltinfo[i].deptGate+".";

	 					           	textpromt=textpromt+"Price for the ticket is"+response.body.fltinfo[i].totalprice+".";
	 					           	//speech.pause('1s');*/								                	}
	 						var speechOutput = speech.ssml(true);
	 						//console.log("textprompt"+textpromt);
	 						this.emit(':tell',speechOutput);
	 						//res.send(response);
	 					}
	 					else
	 					{
	 						console.log("error"+response+error);
	 						textpromt="error";
	 						this.emit(':tell',textpromt);

	 						//res.send("error");
	 					}
	 				}.bind(this));
	 			}
        
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

var flightGuestsHandler = Alexa.CreateStateHandler(states.GUESTS_F, {

    'flightGuestsIntent': function () {
        var speechText = "",
            repromptText = "";
      console.log("hig");

        var guests = this.event.request.intent.slots.guests_f.value;
        this.attributes['guests'] = guests;
        console.log("The object is "+JSON.stringify(this.attributes));
       
       
        this.handler.state = states.ANSWER;
        var myJSONObject={};
        var myJSONObject={	
				"src":this.attributes['origin'],
        		"input":this.attributes['destination'],
        		"sdatetime":"",
        		"edatetime":"",
        		"lat":"","lon":""
        	};
       var speech=new Speech();
       console.log("myJSONObject is "+JSON.stringify(myJSONObject));
       console.log("Calling api ");
       request({
   	    url: "http://Sample-env.3ypbe4xuwp.us-east-1.elasticbeanstalk.com/fly",
   	    method: "POST",
   	    json: true,   // <--Very important!!!
   	    body: myJSONObject
  	}, function (error, response, body){
  		console.log("res"+response);
		 if (!error && response.statusCode == 200) {
         
           console.log("place"+JSON.stringify(response));
           
           for(var i=0;i<5;i++)
           	{
           	speech.pause("500ms");
           	speech.say("Option "+(parseInt(i,10)+1)+":");
           	speech.pause("500ms");
           	speech.say(response.body.fltinfo[i].airline+" airline flight number "+response.body.fltinfo[i].flightNum+".");
           	speech.say("At ");
           	speech.sayAs({
           		"word":response.body.fltinfo[i].deptTime+":00",
           		"interpret": "time",
                   
           	});
           	speech.say("hours");
           	
           	speech.say("from");
           	speech.spell(response.body.fltinfo[i].deptAirportCode);
           	speech.say(" gate "+response.body.fltinfo[i].deptGate+".");
           	speech.pause("500ms");
           	speech.say("Price for the ticket is"+response.body.fltinfo[i].totalprice+" dollars.");
           	/*textpromt=textpromt+response.body.fltinfo[i].airline+" flight number "+response.body.fltinfo[i].flightNum+".At ";
           	textpromt=textpromt+"Option "+(i+1)+":";
           	textpromt=textpromt+"At "+response.body.fltinfo[i].deptTime+" from "+response.body.fltinfo[i].deptAirportCode+" gate "+response.body.fltinfo[i].deptGate+".";
           	
           	textpromt=textpromt+"Price for the ticket is"+response.body.fltinfo[i].totalprice+".";
           	//speech.pause('1s');*/								                	}
           var speechOutput = speech.ssml(true);
           //console.log("textprompt"+textpromt);
           this.emit(':tell',speechOutput);
           //res.send(response);
       }
		else
			{
			console.log("error"+response+error);
			textpromt="error";
           this.emit(':tell',textpromt);

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
    // To enable string internationalization (i18n) features, set a resources object.
    //alexa.resources = languageStrings;
    alexa.registerHandlers(startStateHandlers,newSessionHandlers,flightdestinationStateHandlers,flightoriginStateHandlers,flightStartDateHandler,flightGuestsHandler);
    alexa.execute();
};





