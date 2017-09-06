
    var speechOutput;
    var reprompt;
    var welcomeOutput = "<s>Welcome to the Intelligent travel agent.</s> " +
    "<s>You can ask to book a flight, book a Hotel or book a rental car</s>";
    var welcomeReprompt = "You can say, " +
    "I want to book a flight, book a hotel or I want to book a rental car";
    var tripIntro = [
        "This sounds like a cool trip. ",
        "This will be fun. ",
        "Oh, I like this trip. "
        ];

    var snippets = {
            WELCOME: "<s>Welcome to the Intelligent travel agent.</s> " +
            "<s>You can ask to book a flight, book a Hotel or book a rental car</s>",

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
    var flightOrigin = null;
    var start_date_string = null;
    var end_date_string = null;
    var speechText = "";
    var repromptText = "";
    var hotelOptions = null;
    var carOptions = null;
    var flightOptions=null;
    var module = null;
    var state = null;


    //========================================================Skill Code=================================

    'use strict';

    const Alexa = require('alexa-sdk');
    const request=require('request');
    const APP_ID = "amzn1.ask.skill.06e1a5f6-c4a2-4b77-844b-8e86b0e465a2"; // TODO replace with your app ID (OPTIONAL).
    //var flights=require('./flights');
    var Speech=require('ssml-builder');
    var moment = require('moment'); // deals with dates and date formatting, for instance converts AMAZON.DATE to timestamp

    var handlers = {
            'LaunchRequest': function () {
            	console.log(this.event.session.user.userId);
                this.attributes['state'] = 'welcome';
                this.emit(':ask', welcomeOutput, welcomeReprompt);                                
            },
            'superIntent': function () {

                module = this.event.request.intent.slots.module.value;
                if (module != undefined){
                    this.attributes['module'] = module;
                    console.log(this.attributes);
                }

                if(this.attributes['module'] == 'car'){
	
	                if(Object.keys(this.attributes).length === 0) { // Check if it's the
	                    // first time the
	                    // skill has been
	                    // invoked
	                    this.attributes['destination_car'] = undefined;
	                    this.attributes['startdate_car'] = undefined;
	                    this.attributes['enddate_car'] = undefined;
	                    this.attributes['carSelection'] = undefined;
	                    this.attributes['carConfirmation'] = undefined;
	                }
	
	    //          ============================================ store slots locally==================
	                
	                carDestination = this.event.request.intent.slots.destination.value;
	                start_date_string = this.event.request.intent.slots.startdate.value;
	                end_date_string = this.event.request.intent.slots.enddate.value;
	                carSelection = this.event.request.intent.slots.selection.value;
	                carConfirmation = this.event.request.intent.slots.confirmation.value;
	
	    //          =========================================================
	
	                if(carDestination == null && this.attributes['state'] == "hotel_confirmation"){
	                    this.attributes['state'] = "car_destination";
	                    speechText = "do you want to book the car in "+this.attributes['hotelDestination'];
	                    repromptText = "do you want to book the car in "+this.attributes['hotelDestination'];
	                    this.emit(':ask', speechText, repromptText);
	                }
	                if (this.attributes['state']== "car_destination" && carConfirmation == "yes"){
	                    this.attributes['destination_car'] = this.attributes['hotelDestination'];   
	                }
	
	                // if(start_date_string == null && this.attributes['state'] == "car_destination"){
	                //     this.attributes['state'] = "car_startdate";
	                //     speechText = "do you want to book the car from "+this.attributes['hotel_startdate'];
	                //     repromptText = "do you want to book the car from "+this.attributes['hotel_startdate'];
	                //     this.emit(':ask', speechText, repromptText);
	                // }
	                // if (this.attributes['state']== "car_startdate" && carConfirmation == "yes"){
	                //     this.attributes['startdate_car'] = this.attributes['hotel_startdate'];   
	                // }                
	
	
	
	    //          ============================================ store slots in attributes ==================
	                
	                if(carDestination != null){
	                    this.attributes['destination_car'] = carDestination;
	                    console.log(this.attributes);
	                }
	
	                if(start_date_string != null){
	                    var carStartDate = moment(start_date_string);
	                    this.attributes['startdate_car'] = carStartDate;
	                    console.log(this.attributes);
	                }
	
	                if(end_date_string != null){
	                    var carEndDate = moment(end_date_string);
	                    this.attributes['enddate_car'] = carEndDate;
	                    console.log(this.attributes);
	                }
	                
	                if(carSelection != null){
	                    this.attributes['state'] = 'car_selection';
	                    this.attributes['carSelection'] = carSelection;             
	                    speechText = "You are about to book car " + this.attributes['carOptions'][carSelection] + " " + ".Please Confirm.";
	                    repromptText ="You are about to book car " + this.attributes['carOptions'][carSelection] + " " + ".Please Confirm.";
	                    console.log(this.attributes);
	                    this.emit(':ask', speechText, repromptText);
	                }
	                
	                if(carConfirmation != null && carConfirmation=="yes" && this.attributes['state'] =="car_selection"){
	                    this.attributes['state'] = 'car_confirmation';
	                    this.attributes['carConfirmation'] = carConfirmation;   
	                    carSelection = this.attributes['carSelection'];
	                    speechText = "You booked " + this.attributes['carOptions'][carSelection] + " " + ". Thank You for using I.T.A.";
	                    repromptText ="You booked " + this.attributes['carOptions'][carSelection] + " " + ". Thank You for using ITA";
	                    console.log(this.attributes);
	                    this.emit(':ask', speechText, repromptText);
	                }
	
	    //          ============================================= ask for missing slots ======================
	                
	                if(this.attributes['destination_car'] == undefined){
	
	                    this.attributes['state'] = 'car_destination';
	                    speechText = snippets.DESTINATION_CAR;
	                    repromptText = snippets.DESTINATION_REPROMPT_CAR;
	                    this.emit(':ask', speechText, repromptText);
	
	
	
	                }
	
	                if(this.attributes['startdate_car'] == undefined){
	
	                    this.attributes['state'] = 'car_startdate';
	                    speechText = snippets.STARTDATE_CAR;
	                    repromptText = snippets.STARTDATE_REPROMPT_CAR;
	                    this.emit(':ask', speechText, repromptText);
	
	
	
	                }
	
	                if(this.attributes['enddate_car'] == undefined){
	
	                    this.attributes['state'] = 'car_enddate';
	                    speechText = snippets.ENDDATE_CAR;
	                    repromptText = snippets.ENDDATE_REPROMPT_CAR;
	                    this.emit(':ask', speechText, repromptText);
	                }
	
	    //          ========================================slots confirmation =====================
	
	
	    //          ============================================================= api call ===============
	                
	                if(this.attributes['destination_car'] != undefined && this.attributes['startdate_car'] != undefined && this.attributes['enddate_car'] != undefined){
	                    
	                	if(isPastDate(moment(this.attributes['startdate_car']))){
	                		speechText = snippets.STARTDATE_INVALID_PAST;
	                        repromptText = snippets.STARTDATE_INVALID_PAST; // could be improved by using alternative prompt text
	                        this.emit(':ask', speechText, repromptText);
	                	}
	                	
	                	if(!isFutureDate(moment(this.attributes['enddate_car']),moment(this.attributes['startdate_car']))){
	                        // dob in the future
	                        speechText = snippets.ENDDATE_INVALID_PAST;
	                        repromptText = snippets.ENDDATE_INVALID_PAST; // could be improved by using alternative prompt text
	                        this.emit(':ask', speechText, repromptText);
	                    }
	                	
	                	this.attributes['state'] = 'car_results'
	                    var myJSONObject={};
	                    myJSONObject={"input":this.attributes['destination_car'],
	                            "sdatetime": this.attributes['startdate_car'],
	                            "edatetime":this.attributes['enddate_car']
	                    };
	                    console.log(myJSONObject);
	    //              request({
	    //                  url: "http://Sample-env.mqwha4phuc.us-east-1.elasticbeanstalk.com/car",
	    //                  method: "POST",
	    //                  json: true,   // <--Very important!!!
	    //                  body: myJSONObject
	    //              }, function (error, response, body){
	    //                      console.log("res"+response);
	    //                      if (!error && response.statusCode == 200) {
	    //                          console.log("place"+JSON.stringify(response));
	    //                          var carinfo = body.cars;
	    //                          console.log("car object is"+carinfo);
	    //                          var speechText = "";
	    //                          speechText += carinfo;
	    //                          console.log(speechText);
	    //                          var repromptText = "For instructions on what you can say, please say help me.";
	    //                          this.emit(':tell', speechText);
	    //                      }
	    //                  else
	    //                  {
	    //                      speechText = snippets.ERROR;
	    //                      repromptText = snippets.ERROR; 
	    //                      this.emit(':ask', speechText, repromptText);
	    //                  }
	    //              }.bind(this));
	                    carOptions = {      1:"Option A",
	                              2:"Option B",
	                              3:"Option C",
	                              4:"Option D",
	                              5:"Option E"}
	                    speechText = "Five Cars available 1 2 3 4 5, choose one option";
	                    repromptText = "Five Cars available 1 2 3 4 5, choose one option";
	                    this.attributes['carOptions']=carOptions;
	                    this.emit(':ask', speechText, repromptText);
	                }

                }
            
	            if(this.attributes['module'] == 'hotel') {
	                if(Object.keys(this.attributes).length === 0) { // Check if it's the
	                    // first time the
	                    // skill has been
	                    // invoked
	                    this.attributes['hotelDestination'] = undefined;
	                    this.attributes['hotelStartDate'] = undefined;
	                    this.attributes['hotelEndDate'] = undefined;
	                    this.attributes['hotelGuests'] = undefined;
	                    this.attributes['hotelSelection'] = undefined;
	                    this.attributes['hotelConfirmation'] = undefined;
	                }
	
	    //          ============================================ store slots locally==================
	                
	                hotelDestination = this.event.request.intent.slots.destination.value;
	                start_date_string = this.event.request.intent.slots.startdate.value;
	                end_date_string = this.event.request.intent.slots.enddate.value;
	                hotelGuests = this.event.request.intent.slots.guests.value;
	                hotelSelection = this.event.request.intent.slots.selection.value;
	                hotelConfirmation = this.event.request.intent.slots.confirmation.value;
	                
	    //          =========================================================
	            	
	                if(hotelDestination == null && this.attributes['state'] == "flight_confirmation"){
	                    this.attributes['state'] = "hotel_destination";
	                    speechText = "do you want to book the car in "+this.attributes['flightDestination'];
	                    repromptText = "do you want to book the car in "+this.attributes['flightDestination'];
	                    this.emit(':ask', speechText, repromptText);
	                }
	                if (this.attributes['state']== "hotel_destination" && hotelConfirmation == "yes"){
	                    this.attributes['hotelDestination'] = this.attributes['flightDestination'];   
	                }
	
	                // if(start_date_string == null && this.attributes['state'] == "car_destination"){
	                //     this.attributes['state'] = "car_startdate";
	                //     speechText = "do you want to book the car from "+this.attributes['hotel_startdate'];
	                //     repromptText = "do you want to book the car from "+this.attributes['hotel_startdate'];
	                //     this.emit(':ask', speechText, repromptText);
	                // }
	                // if (this.attributes['state']== "car_startdate" && carConfirmation == "yes"){
	                //     this.attributes['startdate_car'] = this.attributes['hotel_startdate'];   
	                // } 
	
	    //          ============================================ store slots in attributes ==================
	                
	                if(hotelDestination != null){
	                    this.attributes['hotelDestination'] = hotelDestination;
	                    console.log(this.attributes);
	                }
	                
	                
	                if(start_date_string != null){
	                    var hotelStartDate = moment(start_date_string);
	                    this.attributes['hotelStartDate'] = hotelStartDate;
	                    console.log(this.attributes);
	                }
	
	                if(end_date_string != null){
	                    var hotelEndDate = moment(end_date_string);
	                    this.attributes['hotelEndDate'] = hotelEndDate;
	                    console.log(this.attributes);
	                }
	                
	                if(hotelGuests != null){
	                    this.attributes['hotelGuests'] = hotelGuests;
	                    console.log(this.attributes);
	                }
	                
	                if(hotelSelection != null){
	                    this.attributes['state'] = 'hotel_selection';
	                    this.attributes['hotelSelection'] = hotelSelection;             
	                    speechText = "You are about to book hotel " + this.attributes['hotelOptions'][hotelSelection] + " " + ".Please Confirm.";
	                    repromptText ="You are about to book hotel " + this.attributes['hotelOptions'][hotelSelection] + " " + ".Please Confirm.";
	                    console.log(this.attributes);
	                    this.emit(':ask', speechText, repromptText);
	                }
	                
	                if(hotelConfirmation != null && hotelConfirmation=="yes" && this.attributes['state'] =="hotel_selection"){
	                    this.attributes['state'] = 'hotel_confirmation';
	                    this.attributes['hotelConfirmation'] = hotelConfirmation;   
	                    hotelSelection = this.attributes['hotelSelection'];
	                    speechText = "You booked " + this.attributes['hotelOptions'][hotelSelection] + " " + ". Do you want to book rental car, If yes then please say rent a car";
	                    repromptText ="You booked " + this.attributes['hotelOptions'][hotelSelection] + " " + ". Do you want to book rental car, If yes then please say rent a car";
	                    console.log(this.attributes);
	                    this.emit(':ask', speechText, repromptText);
	                }
	
	    //          ============================================= ask for missing slots ======================
	                
	                if(this.attributes['hotelDestination'] == undefined){
	
	                    this.attributes['state'] = 'hotel_destination';
	                    speechText = snippets.DESTINATION_HOTEL;
	                    repromptText = snippets.DESTINATION_REPROMPT_HOTEL;
	                    this.emit(':ask', speechText, repromptText);
	                }
	
	                if(this.attributes['hotelStartDate'] == undefined){
	
	                    this.attributes['state'] = 'hotel_startdate';
	                    speechText = snippets.STARTDATE_HOTEL;
	                    repromptText = snippets.STARTDATE_REPROMPT_HOTEL;
	                    this.emit(':ask', speechText, repromptText);
	
	                }
	
	                if(this.attributes['hotelEndDate'] == undefined){
	
	                    this.attributes['state'] = 'hotel_enddate';
	                    speechText = snippets.ENDDATE_HOTEL;
	                    repromptText = snippets.ENDDATE_REPROMPT_HOTEL;
	                    this.emit(':ask', speechText, repromptText);
	                }
	
	                
	                if(this.attributes['hotelGuests'] == undefined){
	
	                    this.attributes['state'] = 'hotel_guests';
	                    speechText = snippets.GUESTS_HOTEL;
	                    repromptText = snippets.GUESTS_REPROMPT_HOTEL;
	                    this.emit(':ask', speechText, repromptText);
	
	                }
	
	
	    //          ========================================slots confirmation =====================
	
	
	    //          ============================================================= api call ===============
	                
	                if(this.attributes['hotelDestination'] != undefined && this.attributes['hotelStartDate'] != undefined && this.attributes['hotelEndDate'] != undefined && this.attributes['hotelSelection'] == undefined ){
	                	
	                	if(isPastDate(moment(this.attributes['hotelStartDate']))){
	                		speechText = snippets.STARTDATE_INVALID_PAST;
	                        repromptText = snippets.STARTDATE_INVALID_PAST; // could be improved by using alternative prompt text
	                        this.emit(':ask', speechText, repromptText);
	                	}
	                	
	                	if(!isFutureDate(moment(this.attributes['hotelEndDate']),moment(this.attributes['hotelStartDate']))){
	                        // dob in the future
	                        speechText = snippets.ENDDATE_INVALID_PAST;
	                        repromptText = snippets.ENDDATE_INVALID_PAST; // could be improved by using alternative prompt text
	                        this.emit(':ask', speechText, repromptText);
	                    }
	                	
	                	this.attributes['state'] = 'hotel_results';
	                    var myJSONObject={};
	                    myJSONObject={"input":hotelDestination,
	                            "sdatetime":"2017-6-07 16:25",
	                            "edatetime":"2017-6-09 16:25"
	                    };
	                    console.log(myJSONObject);
	    //              request({
	    //                  url: "http://sample-env.3ypbe4xuwp.us-east-1.elasticbeanstalk.com/htl",
	    //                  method: "POST",
	    //                  json: true,   // <--Very important!!!
	    //                  body: myJSONObject
	    //              }, function (error, response, body){
	    //                  // console.log("res"+response);
	    //                  if (!error && response.statusCode == 200) {
	    //                      // console.log("res"+JSON.parse(response));
	    //                      console.log("place"+JSON.stringify(response));
	    //                      // var replymsg =
	    //                      // JSON.parse(response);
	    //                      var carinfo = response["body"]["hotels"];
	    //                      console.log(carinfo);
	    //                      speechText = "The top results are. ";
	    //                      speechText += carinfo;
	    //                      console.log(speechText);
	    //
	    //                      repromptText = "For instructions on what you can say, please say help me.";
	    //                      // res.send(response);
	    //                      this.emit(':ask', speechText, repromptText);
	    //
	    //                  }
	    //                  else
	    //                  {
	    //                      speechText = snippets.ERROR;
	    //                      repromptText = snippets.ERROR; // could
	    //                      // be
	    //                      // improved
	    //                      // by
	    //                      // using
	    //                      // alternative
	    //                      // prompt
	    //                      // text
	    //                      this.emit(':ask', speechText, repromptText);
	    //
	    //
	    //                  }
	    //              }.bind(this));
	                    hotelOptions = {      1:"Option A",
	                                          2:"Option B",
	                                          3:"Option C",
	                                          4:"Option D",
	                                          5:"Option E"}
	                    speechText = "Five hotels available 1 2 3 4 5, choose one option";
	                    repromptText = "Five hotels available 1 2 3 4 5, choose one option";
	                    this.attributes['hotelOptions']=hotelOptions;
	                    this.emit(':ask', speechText, repromptText);
	                }
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
		                flightOrigin = this.event.request.intent.slots.origin.value;
		                flightSelection = this.event.request.intent.slots.selection.value;
		                flightConfirmation = this.event.request.intent.slots.confirmation.value;
		                flightGuests=this.event.request.intent.slots.guests.value;
		                
		                if(flightDestination != null){
		                    this.attributes['flightDestination'] = flightDestination;
		                    console.log(this.attributes);
		                }
		                if(flightOrigin != null){
		                    this.attributes['flightOrigin'] = flightOrigin;
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
		                    speechText = "You are about to book flight " + this.attributes['flightOptions'][flightSelection] + " " + ".Please Confirm.";
		                    repromptText ="You are about to book flight "  + this.attributes['flightOptions'][flightSelection] + " " + ".Please Confirm.";
		                    console.log(this.attributes);
		                    this.emit(':ask', speechText, repromptText);
		                }
		                
		                if(flightConfirmation != null && flightConfirmation=="yes" && this.attributes['state'] =="flight_selection"){
		                    this.attributes['state'] = 'flight_confirmation'; 
		                    this.attributes['flightConfirmation'] = flightConfirmation;   
		                    flightSelection = this.attributes['flightSelection'];
		                    speechText = "You booked " + this.attributes['flightOptions'][flightSelection] + " " + ". Do you want to book hotel or rental car, If yes, then please say book a hotel or book a car.";
		                    repromptText ="You booked " + this.attributes['flightOptions'][flightSelection] + " " + ". Do you want to book hotel or rental car, If yes, then please say book a hotel or book a car.";
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
		                
		                if(this.attributes['flightOrigin'] == undefined){
		            		
		                    this.attributes['state'] = 'flight_origin';
		                    speechText = snippets.ORIGIN_F;
		                    repromptText = snippets.ORIGIN_REPROMPT_F;
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
		                
		                if(this.attributes['flightDestination'] != undefined && this.attributes['flightOrigin'] != undefined && this.attributes['flightStartDate'] != undefined && this.attributes['flightSelection'] == undefined ){
		                	
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
//        var today = moment();
    	
        if (sdate < edate) {
            return true
        } else {
            return false
        }
    }
    exports.handler = (event, context) => {
        var alexa = Alexa.handler(event, context);
        alexa.APP_ID = APP_ID;
        alexa.registerHandlers(handlers);
        alexa.execute();
    };