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

var Speech=require('ssml-builder');
const handlers = {
    'LaunchRequest': function () {
        this.emit('GetFact');
    },
    'FlightIntent': function () {
        // Get a random space fact from the space facts list
    	var myJSONObject={};
        var origin=this.event.request.intent.slots.origin.value;
        var destination=this.event.request.intent.slots.destination.value;
        var date=this.event.request.intent.slots.date.value;
        var speech=new Speech();
            
        speech.say("Hello");
        speech.pause("500ms");
        speech.say("Flights from "+origin+" to "+destination+" are:");
       // 
        var textpromt="Flights from "+origin+" to "+destination+" are:";
        var myJSONObject={	
        					"src":origin,
			        		"input":destination,
			        		"sdatetime":"",
			        		"edatetime":"",
			        		"lat":"","lon":""
			        	};
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
								                console.log("textprompt"+textpromt);
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
        
        
		
    },
    'HotelSearchIntent': function () {
    	var myJSONObject={};
        var input=this.event.request.intent.slots.input.value;
        var sdatetime=this.event.request.intent.slots.startdate.value;
        var edatetime=this.event.request.intent.slots.startdate.value;
        var speech=new Speech();
        speech.say("The top results for hotel in "+ input+" are:");
        speech.pause("500ms");
        
        myJSONObject={"input":input,
        		"sdatetime":sdatetime,
        		"edatetime":edatetime};
        request({
    	    url: "http://Sample-env.3ypbe4xuwp.us-east-1.elasticbeanstalk.com/htl",
    	    method: "POST",
    	    json: true,   // <--Very important!!!
    	    body: myJSONObject
    	}, function (error, response, body){
    		 // console.log("res"+response);
    		if (!error && response.statusCode == 200) {
               // console.log("res"+JSON.parse(response));
                console.log("place"+JSON.stringify(response));
                // var replymsg = JSON.parse(response);
                var hotelinform = response["body"]["hotels"];
                console.log(hotelinform);
                var speechText = "";
                speechText += hotelinform;
                speech.say(hotelinform);
                var speechOutput = speech.ssml(true);
                console.log(speechOutput);
                console.log(speechText);
                var repromptText = "For instructions on what you can say, please say help me.";
        	    this.emit(':tell', speechOutput,repromptText);
                //res.send(response);
            }
    		else
    			{
    			console.log("error"+response+error);
    			
    			//res.send("error");
    			}
    	}.bind(this));
    	
		
    },
    'CarRentalIntent': function () {
    	console.log("air");
        // Get a random space fact from the space facts list
    	var myJSONObject={};
        var input=this.event.request.intent.slots.input.value;
        var sdatetime=this.event.request.intent.slots.sdatetime.value;
        var edatetime=this.event.request.intent.slots.edatetime.value;
        myJSONObject={"input":input,
        		"sdatetime":sdatetime,
        		"edatetime":edatetime};
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
    	// this.emit(':tell', "hello");
		
    },
    'AMAZON.HelpIntent': function () {
        const speechOutput = this.t('HELP_MESSAGE');
        const reprompt = this.t('HELP_MESSAGE');
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', this.t('STOP_MESSAGE'));
    },
};

exports.handler = (event, context) => {
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    // To enable string internationalization (i18n) features, set a resources object.
    alexa.registerHandlers(handlers);
    alexa.execute();
};

