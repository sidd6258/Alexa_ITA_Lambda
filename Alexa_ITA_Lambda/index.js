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
var flights=require('./flights');
var Speech=require('ssml-builder');
const languageStrings = {
	    'en-GB': {
	        translation: {
	            FACTS: [
	                'A year on Mercury is just 88 days long.',
	                'Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.',
	                'Venus rotates anti-clockwise, possibly because of a collision in the past with an asteroid.',
	                'On Mars, the Sun appears about half the size as it does on Earth.',
	                'Earth is the only planet not named after a god.',
	                'Jupiter has the shortest day of all the planets.',
	                'The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.',
	                'The Sun contains 99.86% of the mass in the Solar System.',
	                'The Sun is an almost perfect sphere.',
	                'A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.',
	                'Saturn radiates two and a half times more energy into space than it receives from the sun.',
	                'The temperature inside the Sun can reach 15 million degrees Celsius.',
	                'The Moon is moving approximately 3.8 cm away from our planet every year.',
	            ],
	            SKILL_NAME: 'British Space Facts',
	            GET_FACT_MESSAGE: "Here's your fact: ",
	            HELP_MESSAGE: 'You can say tell me a space fact, or, you can say exit... What can I help you with?',
	            HELP_REPROMPT: 'What can I help you with?',
	            STOP_MESSAGE: 'Goodbye!',
	        },
	    },
	    'en-US': {
	        translation: {
	            FACTS: [
	                'A year on Mercury is just 88 days long.',
	                'Despite being farther from the Sun, Venus experiences higher temperatures than Mercury.',
	                'Venus rotates counter-clockwise, possibly because of a collision in the past with an asteroid.',
	                'On Mars, the Sun appears about half the size as it does on Earth.',
	                'Earth is the only planet not named after a god.',
	                'Jupiter has the shortest day of all the planets.',
	                'The Milky Way galaxy will collide with the Andromeda Galaxy in about 5 billion years.',
	                'The Sun contains 99.86% of the mass in the Solar System.',
	                'The Sun is an almost perfect sphere.',
	                'A total solar eclipse can happen once every 1 to 2 years. This makes them a rare event.',
	                'Saturn radiates two and a half times more energy into space than it receives from the sun.',
	                'The temperature inside the Sun can reach 15 million degrees Celsius.',
	                'The Moon is moving approximately 3.8 cm away from our planet every year.',
	            ],
	            SKILL_NAME: 'American Space Facts',
	            GET_FACT_MESSAGE: "Here's your fact: ",
	            HELP_MESSAGE: 'You can say tell me a space fact, or, you can say exit... What can I help you with?',
	            HELP_REPROMPT: 'What can I help you with?',
	            STOP_MESSAGE: 'Goodbye!',
	        },
	    },
	    'de-DE': {	
	        translation: {
	            FACTS: [
	                'Ein Jahr dauert auf dem Merkur nur 88 Tage.',
	                'Die Venus ist zwar weiter von der Sonne entfernt, hat aber höhere Temperaturen als Merkur.',
	                'Venus dreht sich entgegen dem Uhrzeigersinn, möglicherweise aufgrund eines früheren Zusammenstoßes mit einem Asteroiden.',
	                'Auf dem Mars erscheint die Sonne nur halb so groß wie auf der Erde.',
	                'Die Erde ist der einzige Planet, der nicht nach einem Gott benannt ist.',
	                'Jupiter hat den kürzesten Tag aller Planeten.',
	                'Die Milchstraßengalaxis wird in etwa 5 Milliarden Jahren mit der Andromeda-Galaxis zusammenstoßen.',
	                'Die Sonne macht rund 99,86 % der Masse im Sonnensystem aus.',
	                'Die Sonne ist eine fast perfekte Kugel.',
	                'Eine Sonnenfinsternis kann alle ein bis zwei Jahre eintreten. Sie ist daher ein seltenes Ereignis.',
	                'Der Saturn strahlt zweieinhalb mal mehr Energie in den Weltraum aus als er von der Sonne erhält.',
	                'Die Temperatur in der Sonne kann 15 Millionen Grad Celsius erreichen.',
	                'Der Mond entfernt sich von unserem Planeten etwa 3,8 cm pro Jahr.',
	            ],
	            SKILL_NAME: 'Weltraumwissen auf Deutsch',
	            GET_FACT_MESSAGE: 'Hier sind deine Fakten: ',
	            HELP_MESSAGE: 'Du kannst sagen, „Nenne mir einen Fakt über den Weltraum“, oder du kannst „Beenden“ sagen... Wie kann ich dir helfen?',
	            HELP_REPROMPT: 'Wie kann ich dir helfen?',
	            STOP_MESSAGE: 'Auf Wiedersehen!',
	        },
	    },
	};

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
        // Get a random space fact from the space facts list
    	var myJSONObject={};
        var input=this.event.request.intent.slots.input.value;
        var sdatetime=this.event.request.intent.slots.startdate.value;
        var edatetime=this.event.request.intent.slots.startdate.value;
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
                var speechText = "The top 10 results are. ";
                speechText += hotelinform;
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
    'CarRentalIntent': function () {
        // Get a random space fact from the space facts list
    	var myJSONObject={};
        var input=this.event.request.intent.slots.input.value;
        var sdatetime=this.event.request.intent.slots.startdate.value;
        var edatetime=this.event.request.intent.slots.enddate.value;
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
                var speechText = "The top 10 results are. ";
                speechText += hotelinform;
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
    alexa.resources = languageStrings;
    alexa.registerHandlers(handlers);
    alexa.execute();
};