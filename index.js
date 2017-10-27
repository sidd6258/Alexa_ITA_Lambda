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

	 var destination_flight = null;
	 var startdate_flight = null;
	 var origin_flight = null;
	 var guests_flight = null;
	 var flightOptions = null;
	 var hotel_flight = null;
	 var flight_confirmation = null;
	 var flight_selection = null;

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

	    'flightIntent': function () {

	    	//delegate to Alexa to collect all the required slot values
	    	console.log("in flight intent")

	    	if(this.attributes['state']=="launch" || this.attributes['state']=="hotel_booked" || this.attributes['state']=="car_booked"){
	    		var filledSlots = delegateSlotCollection_flight.call(this);
	    		destination_flight=this.event.request.intent.slots.destination_flight.value;
	        	startdate_flight=this.event.request.intent.slots.startdate_flight.value;
	        	origin_flight=this.event.request.intent.slots.origin_flight.value;
	        	guests_flight=this.event.request.intent.slots.guests_flight.value;
	        	this.attributes['startdate_flight'] = startdate_flight;
	        	this.attributes['origin_flight'] = origin_flight;
	        	this.attributes['guests_flight'] = guests_flight;
	        	this.attributes['destination_flight'] = destination_flight;

	// ====================================================API call=================================================

	        	var myJSONObject={};
                myJSONObject={"destination":this.attributes['destination_flight'],
                		"origin":this.attributes['origin_flight'],
                        "date": this.attributes['startdate_flight']
                      
                };
			console.log("before request : "+JSON.stringify(myJSONObject));

			request({
   	               url: "http://ainuco.ddns.net:4324/flight",
   	               method: "POST",
   	               json: true,   // <--Very important!!!
   	               body: myJSONObject
   	                  }, function (error, response, body){
   	                	  console.log("inside request : ");
   	                         // console.log("res"+JSON.stringify(response));
   	                          if (!error && response.statusCode == 200) {
   	                              //console.log("place"+JSON.stringify(body));
   	                              var flightinfo = body.flights;
   	                             // console.log("hotel object is "+hotelinfo);
   	                              var speechText = "";
   	                              speechText += flightinfo+", choose one option";
   	                           flightOptions = body.flightOptions;
									  
									  var flightObject=body.flightObject;
   	                              this.attributes['flightObject']=flightObject;
   	                              this.attributes['flightOptions']=flightOptions;
   	                              console.log(speechText);
   	                              var repromptText = "For instructions on what you can say, please say help me.";	    	                	         
   	                	          this.event.request.dialogState = "STARTED";
									  this.attributes['state']='flight_selection';
   	                	        //   console.log(this.attributes);

//==========================================say the results ===================================================    
   	
		                	          this.emit(':elicitSlot','selection', speechText, repromptText,updatedIntent);
   	                          }
   	                      else
   	                      {
   	                          speechText = "error occurred";
   	                          repromptText = "error occurred"; 
   	                          this.emit(':ask', speechText, repromptText);
   	                      }
   	                  }.bind(this));
   	     console.log("after request : ");
           	
		}
       
	        
	       	
	         if(this.attributes['state']=="flight_selection"){
	        	flight_selection = this.event.request.intent.slots.selection.value;
	        	this.attributes['flight_selection'] = flight_selection;
	        }

	        if(flight_selection != null && this.attributes['state']=="flight_selection"){               
	                this.attributes['flight_selection'] = flight_selection;             
	                speechText = "You are about to book flight " + this.attributes['flightOptions'][flight_selection] + ". Please Confirm.";
	                repromptText ="You are about to book flight " + this.attributes['flightOptions'][flight_selection] + ". Please Confirm.";
	                console.log(this.attributes);

	                console.log(this.attributes['flightOptions'][hotel_selection]);
	                console.log(this.attributes['flightOptions']);
	                this.event.request.dialogState = "STARTED";	
	                this.attributes['state']='flight_confirmation';
	                this.emit(':confirmIntent', speechText, repromptText);
	            }
	        	
	// ========================================== confirmation =============================================            

				// hotel_confirmation = this.event.request.intent.slots.confirmation.value;
	   //      	this.attributes['hotel_confirmation'] = hotel_confirmation;


	        	if(this.event.request.intent.confirmationStatus == 'CONFIRMED'){        		
	                this.attributes['flight_confirmation'] = flight_confirmation;   
	                flight_selection = this.attributes['flight_selection'];
	                this.attributes['state']='flight_booked';
	                speechText = "You booked " + this.attributes['flightOptions'][flight_selection] + ". Do you also want to book a car or a hotel? Say book a car or book a hotel.";
	                repromptText ="You booked " + this.attributes['flightOptions'][flight_selection] + " . Do you also want to book a car or a hotel? Say book a car or book a hotel.";
	                console.log(this.attributes);
	                this.event.request.dialogState = "STARTED";	

	                this.emit(':ask', speechText, repromptText);
	            }
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
	                HelpMessage ="help me"; 
	                this.emit(':ask', HelpMessage, HelpMessage);
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

	//    END of Intent Handlers {} ========================================================================================
	// 3. Helper Function  =================================================================================================

	function delegateSlotCollection_flight(){
	  console.log("in flight delegateSlotCollection");
	  console.log("current dialogState: "+this.event.request.dialogState);
	    if (this.event.request.dialogState === "STARTED") {
	      console.log("in Beginning");
	      updatedIntent=this.event.request.intent;
	      //optionally pre-fill slots: update the intent object with slot values for which
	      //you have defaults, then return Dialog.Delegate with this updated intent
	      // in the updatedIntent property
	      console.log("request started: "+ JSON.stringify(this.event.request));
	      this.emit(":delegate", updatedIntent);
	    } else if (this.event.request.dialogState !== "COMPLETED") {
	      console.log("in not completed");
	      console.log("request inprogress: "+ JSON.stringify(this.event.request));
	      if(this.event.request.intent.slots.destination_flight.value!=undefined 
	    		  && this.event.request.intent.slots.startdate_flight.value!=undefined
	    		  && this.event.request.intent.slots.origin_flight.value!=undefined
	    		  && this.event.request.intent.slots.guests_flight.value!=undefined){
	    	  return this.event.request.intent;
	      }
	      this.emit(":delegate");
	    } else {
	      console.log("in completed");
	      console.log("returning: "+ JSON.stringify(this.response));
	      // Dialog is now complete and all required slots should be filled,
	      // so call your normal intent handler.
	      return this.event.request.intent;
	    }
	}