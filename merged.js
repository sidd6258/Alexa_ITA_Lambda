	/* eslint-disable  func-names */
	/* eslint quote-props: ["error", "consistent"]*/

	// alexa-cookbook sample code

	// There are three sections, Text Strings, Skill Code, and Helper Function(s).
	// You can copy and paste the entire file contents as the code for a new Lambda function,
	// or copy & paste section #3, the helper function, to the bottom of your existing Lambda code.

	// TODO add URL to this entry in the cookbook


	 // 1. Text strings =====================================================================================================
	 //    Modify these strings and messages to change the behavior of your Lambda function

	 var speechOutput;
	 var repromptText;
	 var reprompt;
	 const request=require('request');
	 const welcomeOutput = "Let's plan a trip. What would you like to book? Say book a hotel, book a car or book a flight";
	 const welcomeReprompt = "Let me know how can i help you. Say book a hotel, book a car or book a flight";
	 const tripIntro = [
	   "This sounds like a cool trip. ",
	   "This will be fun. ",
	   "Oh, I like this trip. "
	 ];

	 var destination_car = null;
	 var startdate_car = null;
	 var enddate_car = null;
	 var guests_car = null;
	 var carOptions = null;
	 var car_selection = null;
	 var car_confirmation = null;

	 var destination_hotel = null;
	 var startdate_hotel = null;
	 var enddate_hotel = null;
	 var guests_hotel = null;
	 var hotelOptions = null;
	 var hotel_selection = null;
	 var hotel_confirmation = null;

	 var destination_flight = null;
	 var startdate_flight = null;
	 var origin_flight = null;
	 var guests_flight = null;
	 var flightOptions = null;
	 var hotel_flight = null;
	 var flight_confirmation = null;

	 var updatedIntent=null;


	 // 2. Skill Code =======================================================================================================

	'use strict';
	const Alexa = require('alexa-sdk');
	const APP_ID = undefined;  // TODO replace with your app ID (OPTIONAL).

	const handlers = {
	    'LaunchRequest': function () {
	    	if (this.event.session.user.accessToken == undefined) {

	  	      this.emit(':tellWithLinkAccountCard','to start using this skill, please use the companion app to authenticate on Amazon');

	  	            return;

	  	        }
	  	var amznProfileURL = 'https://api.amazon.com/user/profile?access_token=';

	      amznProfileURL += this.event.session.user.accessToken;
	      this.attributes['state'] = 'launch';
	          
	      request(amznProfileURL, function(error, response, body) {
	          if (response.statusCode == 200) {

	              var profile = JSON.parse(body);
	              this.attributes['profile'] = profile;
	              console.log(profile.name);
	              this.emit(':ask', "Hello " + profile.name +", " + welcomeOutput, welcomeReprompt);  

	          } else {

	              this.emit(':tell', "Hello, I can't connect to Amazon Profile Service right now, try again later");

	          }

	      }.bind(this));
	    },
	    'hotelIntent': function () {

	    	//delegate to Alexa to collect all the required slot values
	    	console.log("in hotel intent")

	    	if(this.attributes['state']=="launch" || this.attributes['state']=="flight_booked" || this.attributes['state']=="car_booked"){
	    		var filledSlots = delegateSlotCollection_hotel.call(this);

	    		destination_hotel=this.event.request.intent.slots.destination_hotel.value;
	        	startdate_hotel=this.event.request.intent.slots.startdate_hotel.value;
	        	enddate_hotel=this.event.request.intent.slots.enddate_hotel.value;
	        	guests_hotel=this.event.request.intent.slots.guests_hotel.value;
	        	this.attributes['startdate_hotel'] = startdate_hotel;
	        	this.attributes['enddate_hotel'] = enddate_hotel;
	        	this.attributes['guests_hotel'] = guests_hotel;
	        	this.attributes['destination_hotel'] = destination_hotel;

	// ====================================================API call=================================================

	        	console.log("option request : "+ JSON.stringify(this.event.request));
	        	hotelOptions = {      1:"Option A",
	                    2:"Option B",
	                    3:"Option C",
	                    4:"Option D",
	                    5:"Option E"}
	          speechText = "Five Hotels available 1, 2, 3, 4 and 5. choose one option";
	          repromptText = "Five Hotels available 1, 2, 3, 4 and 5. choose one option";
	          this.attributes['hotelOptions']=hotelOptions;
	          this.event.request.dialogState = "STARTED";	
	          console.log(this.attributes);
			// ==========================================say the results ===================================================    
	          this.attributes['state']='hotel_selection';
	          this.emit(':elicitSlot','selection', speechText, repromptText,updatedIntent);
	    	}
	        
	       	
	         if(this.attributes['state']=="hotel_selection"){
	        	hotel_selection = this.event.request.intent.slots.selection.value;
	        	this.attributes['hotel_selection'] = hotel_selection;
	        }

	        if(hotel_selection != null && this.attributes['state']=="hotel_selection"){               
	                this.attributes['hotel_selection'] = hotel_selection;             
	                speechText = "You are about to book hotel " + this.attributes['hotelOptions'][hotel_selection] + ". Please Confirm.";
	                repromptText ="You are about to book hotel " + this.attributes['hotelOptions'][hotel_selection] + ". Please Confirm.";
	                console.log(this.attributes);

	                console.log(this.attributes['hotelOptions'][hotel_selection]);
	                console.log(this.attributes['hotelOptions']);
	                this.event.request.dialogState = "STARTED";	
	                this.attributes['state']='hotel_confirmation';
	                this.emit(':confirmIntent', speechText, repromptText);
	            }
	        	
	// ========================================== confirmation =============================================            

				// hotel_confirmation = this.event.request.intent.slots.confirmation.value;
	   //      	this.attributes['hotel_confirmation'] = hotel_confirmation;


	        	if(this.event.request.intent.confirmationStatus == 'CONFIRMED'){        		
	                this.attributes['hotel_confirmation'] = hotel_confirmation;   
	                hotel_selection = this.attributes['hotel_selection'];
	                this.attributes['state']='hotel_booked';
	                speechText = "You booked " + this.attributes['hotelOptions'][hotel_selection] + ". Do you also want to book a car or a flight? Say book a car or book a flight.";
	                repromptText ="You booked " + this.attributes['hotelOptions'][hotel_selection] + " . Do you also want to book a car or a flight? Say book a car or book a flight.";
	                console.log(this.attributes);
	                this.event.request.dialogState = "STARTED";	

	                this.emit(':ask', speechText, repromptText);
	            }

	       
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

	        	console.log("option request : "+ JSON.stringify(this.event.request));
	        	flightOptions = {      1:"Option A",
	                    2:"Option B",
	                    3:"Option C",
	                    4:"Option D",
	                    5:"Option E"}
	          speechText = "Five flight available 1, 2, 3, 4 and 5. choose one option";
	          repromptText = "Five flight available 1, 2, 3, 4 and 5. choose one option";
	          this.attributes['flightOptions']=flightOptions;
	          this.event.request.dialogState = "STARTED";	
	          console.log(this.attributes);
			// ==========================================say the results ===================================================    
	          this.attributes['state']='flight_selection';
	          this.emit(':elicitSlot','selection', speechText, repromptText,updatedIntent);
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
	        //delegate to Alexa to collect all the required slot values
			console.log("in car intent")

	    	
	    	if(this.attributes['state']=="launch" || this.attributes['state']=="flight_booked" || this.attributes['state']=="hotel_booked"){
	    		var filledSlots = delegateSlotCollection_car.call(this);
	    		destination_car=this.event.request.intent.slots.destination_car.value;
	            startdate_car=this.event.request.intent.slots.startdate_car.value;
	            enddate_car=this.event.request.intent.slots.enddate_car.value;
	            guests_car=this.event.request.intent.slots.guests_car.value;
	            this.attributes['destination_car'] = destination_car;
	        	this.attributes['startdate_car'] = startdate_car;
	        	this.attributes['enddate_car'] = enddate_car;
	        	this.attributes['guests_car'] = guests_car;
	    	}
	        //compose speechOutput that simply reads all the collected slot values
	      

	        

	        //Now let's recap the trip
	        if(this.attributes['state']=="car_selection"){
	        	car_selection = this.event.request.intent.slots.selection.value;
	        	this.attributes['car_selection'] = car_selection;
	        }
	        
	        car_confirmation = this.event.request.intent.slots.confirmation.value;
	        // module=this.event.request.intent.slots.module.value;       	
	        this.attributes['car_confirmation'] = car_confirmation;
	        	
	        	
	        	if(car_selection != null && this.attributes['state']=="car_selection"){               
	                this.attributes['car_selection'] = car_selection;             
	                speechText = "You are about to book car " + this.attributes['carOptions'][car_selection] + " " + ".Please Confirm.";
	                repromptText ="You are about to book car " + this.attributes['carOptions'][car_selection] + " " + ".Please Confirm.";
	                console.log(this.attributes);
	                this.event.request.dialogState = "STARTED";	
	                this.attributes['state']='car_confirmation';
	                this.emit(':confirmIntent', speechText, repromptText);
	            }
	        	
	        	if(this.event.request.intent.confirmationStatus == 'CONFIRMED'){        		
	                this.attributes['car_confirmation'] = car_confirmation;   
	                car_selection = this.attributes['car_selection'];
	                speechText = "You booked " + this.attributes['carOptions'][car_selection] + " " + ". Do you also want to book a flight or a hotel? Say book a flight or book a hotel.";
	                repromptText ="You booked " + this.attributes['carOptions'][car_selection] + " " + ". Do you also want to book a flight or a hotel? Say book a flight or book a hotel.";
	                console.log(this.attributes);
	                this.attributes['state']='car_booked';
	                this.event.request.dialogState = "STARTED";
	                this.emit(':ask', speechText, repromptText);
	            }
	        	
	        	console.log("option request : "+ JSON.stringify(this.event.request));
	        	carOptions = {      1:"Option A",
	                    2:"Option B",
	                    3:"Option C",
	                    4:"Option D",
	                    5:"Option E"}
	          speechText = "Five Cars available 1, 2, 3, 4, 5, choose one option";
	          repromptText = "Five Cars available 1, 2, 3, 4, 5, choose one option";
	          this.attributes['carOptions']=carOptions;
	          this.event.request.dialogState = "STARTED";	
	          console.log(this.attributes);
	        //say the results    
	          this.attributes['state']='car_selection';
	          this.emit(':elicitSlot','selection', speechText, repromptText,updatedIntent);
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
	    'preferenceIntent': function () {

	    	//delegate to Alexa to collect all the required slot values
	    	console.log("in preference intent")

	    	if(this.attributes['state']=="launch" || this.attributes['state']=="flight_booked" || this.attributes['state']=="car_booked" || this.attributes['state']=="hotel_booked"){
	    		var filledSlots = delegateSlotCollection_preference.call(this);
	    		this.attributes['state'] = "preferences";

	    		request({
							url: "http://itravelsystem.us-east-1.elasticbeanstalk.com/users/"+this.attributes['profile'].email,
							method: "GET",
							json: true   // <--Very important!!!
						}, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                body = JSON.parse(JSON.stringify(body));
								mongoUser = body[0];
								this.attributes['user_preferences'] = mongoUser.preferences;
								// speechText = "Please choose one from Flight Preferences, Hotel Preferences or Car Preferences you want to look for or edit ?";
								// repromptText = "Please say Flight Preferences, Hotel Preferences or Car Preferences"; // could be improved by using alternative prompt text
								// this.emit(':ask', speechText, repromptText);
                            }
						}.bind(this));

	    		this.attributes["preference_airline_class"] = this.attributes['user_preferences'].flight.airline_class;
	    		this.attributes["preference_airline"] = this.attributes['user_preferences'].flight.airline_name;
	    		this.attributes["preference_airline_days"] = this.attributes['user_preferences'].flight.airline_days.days;
	    		this.attributes["preference_airline_time"] = this.attributes['user_preferences'].flight.airline_time;


	    		this.attributes['module']=this.event.request.intent.slots.module.value;
	        	this.attributes['action']=this.event.request.intent.slots.action.value;
	      		
	        	if(this.attributes['module']=="flight"){

	        		if(this.attributes['state'] == "preferences"){
		        		speechText = "You can view and change preferred airline, class, travelling days or time ";
		        		repromptText = "say change or view airline, class, travelling days or time ";
		        		this.attributes['state'] = "flight_preferences";
		        		this.emit(':elicitSlot','preference_selection', speechText, repromptText,updatedIntent);
	        		}
	        		this.attributes['preference_selection'] = this.event.request.intent.slots.preference_selection.value;
	        		
	        		// if(this.attributes['state'] == "flight_preferences"){


	        			
	        		// }

	        		if (this.attributes['action']=="edit" && this.attributes['preference_selection'] == "airline"){

	        		}	
	        			this.attributes['airline_name'] = this.event.request.intent.slots.airline_name.value;
		                this.attributes['airline_days'] = this.event.request.intent.slots.airline_days.value;
		                this.attributes['airline_class'] = this.event.request.intent.slots.airline_class.value;
		                this.attributes['airline_time'] = this.event.request.intent.slots.airline_time.value;
	        		
	        	}

	      		
                var hotel_location = this.event.request.intent.slots.hotel_location.value;
                var hotel_star_rating = this.event.request.intent.slots.hotel_star_rating.value;
                var hotel_price = this.event.request.intent.slots.hotel_price.value;
                var food_cuisine = this.event.request.intent.slots.food_cuisine.value;
                var food_type = this.event.request.intent.slots.food_type.value;
                var car_model = this.event.request.intent.slots.car_model.value;
                var car_rental_company = this.event.request.intent.slots.car_rental_company.value;
                var car_mileage = this.event.request.intent.slots.car_mileage.value;
                var car_price = this.event.request.intent.slots.car_price.value;
                var car_features = this.event.request.intent.slots.car_features.value;

	// ====================================================API call=================================================

	        	console.log("option request : "+ JSON.stringify(this.event.request));
	        	hotelOptions = {      1:"Option A",
	                    2:"Option B",
	                    3:"Option C",
	                    4:"Option D",
	                    5:"Option E"}
	          speechText = "Five Hotels available 1, 2, 3, 4 and 5. choose one option";
	          repromptText = "Five Hotels available 1, 2, 3, 4 and 5. choose one option";
	          this.attributes['hotelOptions']=hotelOptions;
	          this.event.request.dialogState = "STARTED";	
	          console.log(this.attributes);
			// ==========================================say the results ===================================================    
	          this.attributes['state']='hotel_selection';
	          this.emit(':elicitSlot','selection', speechText, repromptText,updatedIntent);
	    	}
	        
	       	
	         if(this.attributes['state']=="hotel_selection"){
	        	hotel_selection = this.event.request.intent.slots.selection.value;
	        	this.attributes['hotel_selection'] = hotel_selection;
	        }

	        if(hotel_selection != null && this.attributes['state']=="hotel_selection"){               
	                this.attributes['hotel_selection'] = hotel_selection;             
	                speechText = "You are about to book hotel " + this.attributes['hotelOptions'][hotel_selection] + ". Please Confirm.";
	                repromptText ="You are about to book hotel " + this.attributes['hotelOptions'][hotel_selection] + ". Please Confirm.";
	                console.log(this.attributes);

	                console.log(this.attributes['hotelOptions'][hotel_selection]);
	                console.log(this.attributes['hotelOptions']);
	                this.event.request.dialogState = "STARTED";	
	                this.attributes['state']='hotel_confirmation';
	                this.emit(':confirmIntent', speechText, repromptText);
	            }
	        	
	// ========================================== confirmation =============================================            

				// hotel_confirmation = this.event.request.intent.slots.confirmation.value;
	   //      	this.attributes['hotel_confirmation'] = hotel_confirmation;


	        	if(this.event.request.intent.confirmationStatus == 'CONFIRMED'){        		
	                this.attributes['hotel_confirmation'] = hotel_confirmation;   
	                hotel_selection = this.attributes['hotel_selection'];
	                this.attributes['state']='hotel_booked';
	                speechText = "You booked " + this.attributes['hotelOptions'][hotel_selection] + ". Do you also want to book a car or a flight? Say book a car or book a flight.";
	                repromptText ="You booked " + this.attributes['hotelOptions'][hotel_selection] + " . Do you also want to book a car or a flight? Say book a car or book a flight.";
	                console.log(this.attributes);
	                this.event.request.dialogState = "STARTED";	

	                this.emit(':ask', speechText, repromptText);
	            }

	       
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

	function delegateSlotCollection_hotel(){
	  console.log("in  hotel delegateSlotCollection");
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
	      if(this.event.request.intent.slots.destination_hotel.value!=undefined 
	    		  && this.event.request.intent.slots.startdate_hotel.value!=undefined
	    		  && this.event.request.intent.slots.enddate_hotel.value!=undefined
	    		  && this.event.request.intent.slots.guests_hotel.value!=undefined){
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

	function delegateSlotCollection_car(){
	  console.log("in car delegateSlotCollection");
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
	      if(this.event.request.intent.slots.destination_car.value!=undefined 
	    		  && this.event.request.intent.slots.startdate_car.value!=undefined
	    		  && this.event.request.intent.slots.enddate_car.value!=undefined
	    		  && this.event.request.intent.slots.guests_car.value!=undefined){
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

	function delegateSlotCollection_preference(){
	  console.log("in  preference delegateSlotCollection");
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
	      if(this.event.request.intent.slots.module.value!=undefined 
	    		  && this.event.request.intent.slots.preference_action.value!=undefined
	    		  ){
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

	

	function randomPhrase(array) {
	    // the argument is an array [] of words or phrases
	    var i = 0;
	    i = Math.floor(Math.random() * array.length);
	    return(array[i]);
	}