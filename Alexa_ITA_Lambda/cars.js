'use strict';

var Alexa = require('alexa-sdk');
var request=require('request');
var APP_ID = "amzn1.ask.skill.0ef88a3c-7669-4e80-887a-470be7b35d27"; 
var SKILL_NAME = "iCarRentalApp";

var myJSONObject=
{
	"pickuplocation":"",
	"pickupdate":"",
	"pickuptime":"",
	"days":"",
	"dropoffdate":"",
	"dropofftime":""
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('Welcome to '+SKILL_NAME);
    },
    'CarRentalIntent': function () {
        var pickuplocation=this.event.request.intent.slots.pickuplocation.value;
        console.log("pickuplocation-----> "+pickuplocation);
        if(pickuplocation == null){
        	var speechOutput = 'Please tell me at which location you need a rental car';
            var reprompt = 'Pick up location is required, please tell me at which location you need a rental car';
            this.emit(':ask', speechOutput, reprompt);
        }
        var pickupdate=this.event.request.intent.slots.pickupdate.value;
        console.log("pickupdate----->"+pickupdate);
        var pickuptime=this.event.request.intent.slots.pickuptime.value;
        console.log("pickuptime----->"+pickuptime);
        var days=this.event.request.intent.slots.days.value;
        console.log("days----->"+days);
        var dropoffdate=this.event.request.intent.slots.dropoffdate.value;
        console.log("dropoffdate----->"+dropoffdate);
        var dropofftime=this.event.request.intent.slots.dropofftime.value;
        console.log("dropofftime----->"+dropofftime);      
        myJSONObject.pickuplocation=pickuplocation;
    	myJSONObject.pickupdate=pickupdate;
    	myJSONObject.pickuptime=pickuptime;
    	myJSONObject.days=days;
    	myJSONObject.dropoffdate=dropoffdate;
    	myJSONObject.dropofftime=dropofftime;
    	console.log("myJSONObject----->"+JSON.stringify(myJSONObject));
        request({
    	    url: "http://Sample-env.3vqiwmhx6e.us-east-1.elasticbeanstalk.com/cars",
    	    method: "POST",
    	    json: true,   // <--Very important!!!
    	    body: myJSONObject
    	}, function (error, response, body){
    		//console.log("response----->"+response);
    		//console.log("body----->"+body);
    		//console.log("error----->"+error);
    		if (response!= null){
				if (!error && response.statusCode == 200) {
					//console.log("body----->"+JSON.stringify(body));
					//console.log("response----->"+JSON.stringify(response));
					//console.log("error----->"+JSON.stringify(error));
	    			var textData = ""; 
	    			var cars= [];
	    			var speechOutput;
	 	            speechOutput = "The Rental cars from "+pickuplocation+" location are option ";
					//console.log("speechOutput----->"+speechOutput);     
					//console.log("response.body.cars.length----->"+response.body.cars.length);
	 	            for(var i=0;i<response.body.cars.length;i++)
	 	            {
						var details={};
	 	            	details.totalprice=response.body.cars[i].totalprice;
	 	            	details.dailyrate=response.body.cars[i].dailyrate;
	 	            	details.mileagedescription=response.body.cars[i].mileagedescription;
	 	            	details.features=response.body.cars[i].features;
	 	            	details.model=response.body.cars[i].model;
	 	            	details.typicalseating=response.body.cars[i].typicalseating;
	 	            	details.locationdescription=response.body.cars[i].locationdescription;
	 	            	details.typename=response.body.cars[i].typename;
	 	            	cars.push(details);            	
	 	            	textData = textData+" "+(i+1)+" is of "+ response.body.cars[i].model+ " model and the total price for each "+
	 	            			"day would be $"+response.body.cars[i].totalprice+".";
	 	            }
	 	           //console.log("Cars----->"+JSON.stringify(cars));
	 	           var mainOutput = speechOutput+textData;
	 	           console.log("mainOutput----->"+mainOutput);
				   this.emit(':tell', mainOutput);
	    		}else{
					console.log("Error occured"+error);
				}
    		}else{
    			console.log("No response");
    		}
    	}.bind(this));	
    },
    'AMAZON.HelpIntent': function () {
		var speechOutput = 'What can I help you with?';
        var reprompt = 'Sorry I did not understand, What can I help you with?';
        this.emit(':ask', speechOutput, reprompt);
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'Cancelled');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'Stopped');
    },
    'SessionEndedRequest': function () {
        this.emit(':tell', 'Ended');
    },
    'Unhandled': function() {
    	this.emit(':ask', 'Sorry I did not understand that. Say help for assistance.');
	}
};

exports.handler = function(event, context, callback){
	var alexa = Alexa.handler(event, context);
	alexa.appId = APP_ID;
	alexa.registerHandlers(handlers);
	alexa.execute();
};