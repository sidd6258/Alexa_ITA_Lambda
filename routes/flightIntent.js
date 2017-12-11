var destination_flight = null;
	 var startdate_flight = null;
	 var origin_flight = null;
	 var guests_flight = null;
	 var flightOptions = null;
	 var hotel_flight = null;
	 var flight_confirmation = null;
	 var flight_selection = null;
	 const request=require('request');
	 
exports.flight=function(){
	if(this.attributes['state']=="hotel_booked" || this.attributes['state']=="car_booked"){
		
		if(this.attributes['car_status'] == "booked"){
			if(this.event.request.intent.confirmationStatus == 'NONE' && this.attributes['flight_prompted'] == undefined){
	    		var speechText = "do you want to book the flight to "+this.attributes['destination_car']+
	    		" on "+this.attributes['startdate_car']+
	    		" for "+this.attributes['guests_car']+" guests."
	    		var repromptText = speechText;
	    		this.attributes['flight_prompted'] = 'yes';
	    		console.log(this.attributes);
	    		this.emit(':confirmIntent', speechText, repromptText);
			} else if(this.event.request.intent.confirmationStatus == 'CONFIRMED'){
				this.event.request.intent.slots.destination_flight.value = this.attributes['destination_car'];
	        	this.event.request.intent.slots.startdate_flight.value=this.attributes['startdate_car'];
	        	this.event.request.intent.slots.guests_flight.value=this.attributes['guests_car'];
	        	
	        	this.event.request.intent.confirmationStatus = 'NONE';
	        	var filledSlots = delegateSlotCollection_flight.call(this);
			}  else {
				var filledSlots = delegateSlotCollection_flight.call(this);
			}
    		
		}else if(this.attributes['hotel_status'] == "booked"){
			if(this.event.request.intent.confirmationStatus == 'NONE' && this.attributes['flight_prompted'] == undefined){
    			speechText = "do you want to book the flight in "+this.attributes['destination_hotel']+
    			" from "+this.attributes['startdate_hotel']+
    			" for "+this.attributes['guests_hotel']+" guests."
    			this.attributes['flight_prompted'] = 'yes';
    			console.log(this.attributes);
    			this.emit(':confirmIntent', speechText, repromptText);
			} else if(this.event.request.intent.confirmationStatus == 'CONFIRMED'){
				this.event.request.intent.slots.destination_flight.value = this.attributes['destination_hotel'];
	        	this.event.request.intent.slots.startdate_flight.value=this.attributes['startdate_hotel'];
	        	this.event.request.intent.slots.guests_flight.value=this.attributes['guests_hotel'];
	        	
	        	this.event.request.intent.confirmationStatus = 'NONE';
	        	
	        	var filledSlots = delegateSlotCollection_flight.call(this);
			}  else {
				var filledSlots = delegateSlotCollection_flight.call(this);
			}
		}
	}
	
	if(this.attributes['state']=="launch"){
		
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
                "date": this.attributes['startdate_flight'],
                "user":this.attributes['profile'].email
              
        };
	console.log("before request : "+JSON.stringify(myJSONObject));

	request({
              url: "http://ainuco.ddns.net:4324/flight_recom",
              method: "POST",
              json: true,   // <--Very important!!!
              body: myJSONObject
                 }, function (error, response, body){
               	  console.log("inside request : ");
                        // console.log("res"+JSON.stringify(response));
                         if (!error && response.statusCode == 200) {
                             //console.log("place"+JSON.stringify(body));
                             var flightInfo = body.flights;
                            // console.log("hotel object is "+hotelinfo);
                             var speechText = "";
                             speechText += "the top 2 results are, "+ flightInfo[1]+flightInfo[2]+", choose one option or say more options.";
                          flightOptions = body.flightOptions;
							  
							  var flightObject=body.flightObject;
                             this.attributes['flightObject']=flightObject;
                             this.attributes['flightOptions']=flightOptions;
                             this.attributes['flightInfo']=flightInfo;
                             
                             console.log(speechText);
                             this.attributes['flight_set']=3;
                             var repromptText = "choose one option or say more options.";	               	          this.event.request.dialogState = "STARTED";
							  this.attributes['state']='flight_selection';
               	        //   console.log(this.attributes);

//==========================================say the results ===================================================    

							  console.log(this.attributes);
                	          this.emit(':elicitSlot','selection', speechText, repromptText,this.event.request.intent);
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
    	if(flight_selection=='1'||flight_selection=='2'||flight_selection=='3'||flight_selection=='4'||flight_selection=='5'||flight_selection=='6'){
    		flight_selection = parseInt(flight_selection);
    		this.attributes['flight_selection'] = flight_selection;
    		this.attributes['state']="flight_selected"
    	} else {
    		speechText='';
    		if (this.attributes['flight_set']<6){
    			speechText +="the next 2 results are, "+ this.attributes['flightInfo'][this.attributes['flight_set']]+this.attributes['flightInfo'][this.attributes['flight_set']+1]+", choose one option or say more options.";
    			this.attributes['flight_set']=this.attributes['flight_set']+2;
    		} else{
    			speechText += "End of available options. Please select one from 1 to 6 or start over."
    		}
    		repromptText = speechText;
    		console.log(speechText);
    		this.emit(':elicitSlot','selection', speechText, repromptText,this.event.request.intent);
            	        		
    	}
    	
    }

    if(flight_selection != null && this.attributes['state']=="flight_selected"){               
            this.attributes['flight_selection'] = flight_selection;             
            speechText = "You are about to book flight " + this.attributes['flightOptions'][flight_selection] + ". Please Confirm.";
            repromptText ="You are about to book flight " + this.attributes['flightOptions'][flight_selection] + ". Please Confirm.";
            console.log(this.attributes);

            console.log(this.attributes['flightOptions'][flight_selection]);
            console.log(this.attributes['flightOptions']);
            this.event.request.dialogState = "STARTED";	
            this.attributes['state']='flight_confirmation';
            console.log(this.attributes);
            this.emit(':confirmIntent', speechText, repromptText);
        }
    	
// ========================================== confirmation =============================================            

		// hotel_confirmation = this.event.request.intent.slots.confirmation.value;
//      	this.attributes['hotel_confirmation'] = hotel_confirmation;


    	if(this.event.request.intent.confirmationStatus == 'CONFIRMED'){        		
//            this.attributes['flight_confirmation'] = flight_confirmation; 
            flight_selection = this.attributes['flight_selection'];
            console.log("before booking request : ");	
            myJSONObject={"attributes":this.attributes};
            console.log("this.attributes new : "+JSON.stringify(this.attributes));
            console.log("This.Attributes : "+ JSON.stringify(myJSONObject));
	        request({
	               url: "http://ainuco.ddns.net:4324/flightBooking",
	               method: "POST",
	               json: true,   // <--Very important!!!
	               body: myJSONObject
	                  }, function (error, response, body){
	                	  console.log("inside request : ");
	                         // console.log("res"+JSON.stringify(response));
	                      if (!error && response.statusCode == 200) {
	      	                
	                          this.attributes['state']='flight_booked';
	                          speechText = "You booked " + this.attributes['flightOptions'][flight_selection] +". ";
	                          if (this.attributes['car_status']!= "booked" || this.attributes['hotel_status']!= "booked"){
	                          	speechText += "Do you also want to book a ";
	                          	if (this.attributes['car_status']== "booked" && this.attributes['hotel_status']!= "booked"){
	                          		speechText += "hotel? Say book a hotel."
	                          	}
	                          	
	                          	if (this.attributes['car_status']!= "booked" && this.attributes['hotel_status']== "booked"){
	                          		speechText += "car? Say book a car."
	                          	}
	                          	if (this.attributes['car_status']!= "booked" && this.attributes['hotel_status']!= "booked"){
	                          		speechText += "car or a hotel? Say book a car or book a hotel."
	                          	}
	                          }
	                          repromptText = speechText;
	                          this.event.request.dialogState = "STARTED";	
	                          this.attributes['flight_status'] = 'booked';

	                          console.log(this.attributes);
	                          this.emit(':ask', speechText, repromptText);
	        	                }
	                      else
	                      {
	                          speechText = "snippets.ERROR";
	                          repromptText = "snippets.ERROR"; 
	                          this.emit(':ask', speechText, repromptText);
	                      }
	                  }.bind(this));

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
	    	  this.attributes['state']="launch";
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