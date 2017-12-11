var destination_hotel = null;
var startdate_hotel = null;
var enddate_hotel = null;
var guests_hotel = null;
var hotelOptions = null;
var hotel_selection = null;
var hotel_confirmation = null;

const request=require('request');

exports.hotel = function(){
//delegate to Alexa to collect all the required slot values
	    	console.log("in hotel intent")
	    	console.log("hotel intent status"+this.event.request.intent.confirmationStatus)
	    	
	    	if(this.attributes['state']=="flight_booked" || this.attributes['state']=="car_booked"){
	    		
	    		if(this.attributes['car_status'] == "booked"){
	    			if(this.event.request.intent.confirmationStatus == 'NONE' && this.attributes['hotel_prompted'] == undefined){
			    		var speechText = "do you want to book the hotel in "+this.attributes['destination_car']+
			    		" from "+this.attributes['startdate_car']+
			    		" till "+this.attributes['enddate_car']+
			    		" for "+this.attributes['guests_car']+" guests."
			    		var repromptText = speechText;
			    		this.attributes['hotel_prompted'] = "yes";
			    		console.log(this.attributes);
			    		this.emit(':confirmIntent', speechText, repromptText);
	    			} else if(this.event.request.intent.confirmationStatus == 'CONFIRMED'){
	    				this.event.request.intent.slots.destination_hotel.value = this.attributes['destination_car'];
	    	        	this.event.request.intent.slots.startdate_hotel.value=this.attributes['startdate_car'];
	    	        	this.event.request.intent.slots.enddate_hotel.value=this.attributes['enddate_car'];
	    	        	this.event.request.intent.slots.guests_hotel.value=this.attributes['guests_car'];
	    	        	
	    	        	this.event.request.intent.confirmationStatus = 'NONE';
	    	        	var filledSlots = delegateSlotCollection_hotel.call(this);
	    			}  else {
	    				var filledSlots = delegateSlotCollection_hotel.call(this);
	    			}
		    		
	    		}else if(this.attributes['flight_status'] == "booked"){
	    			if(this.event.request.intent.confirmationStatus == 'NONE' && this.attributes['hotel_prompted'] == undefined){
		    			speechText = "do you want to book the hotel in "+this.attributes['destination_flight']+
		    			" from "+this.attributes['startdate_flight']+
		    			" for "+this.attributes['guests_flight']+" guests."
		    			this.attributes['hotel_prompted'] = "yes";
		    			console.log(this.attributes);
		    			this.emit(':confirmIntent', speechText, repromptText);
	    			} else if(this.event.request.intent.confirmationStatus == 'CONFIRMED'){
	    				this.event.request.intent.slots.destination_hotel.value = this.attributes['destination_flight'];
	    	        	this.event.request.intent.slots.startdate_hotel.value=this.attributes['startdate_flight'];
	    	        	this.event.request.intent.slots.guests_hotel.value=this.attributes['guests_flight'];
	    	        	this.event.request.intent.confirmationStatus = 'NONE';
	    	        	
	    	        	var filledSlots = delegateSlotCollection_hotel.call(this);
	    			}  else {
	    				var filledSlots = delegateSlotCollection_hotel.call(this);
	    			}
	    		}
	    	}
	    	
    		if(this.attributes['state']=="launch"){
	    		
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

	        	// console.log("option request : "+ JSON.stringify(this.event.request));
				var myJSONObject={};
                     myJSONObject={"destination":this.attributes['destination_hotel'],
                             "sdatetime": this.attributes['startdate_hotel'],
                             "edatetime":this.attributes['enddate_hotel'],
                             "user":this.attributes['profile'].email
                     };
				console.log("before request : "+JSON.stringify(myJSONObject));

				request({
	    	               url: "http://ainuco.ddns.net:4324/hotel_recom",
	    	               method: "POST",
	    	               json: true,   // <--Very important!!!
	    	               body: myJSONObject
	    	                  }, function (error, response, body){
	    	                	  console.log("inside request : ");
	    	                         // console.log("res"+JSON.stringify(response));
	    	                          if (!error && response.statusCode == 200) {
	    	                              //console.log("place"+JSON.stringify(body));
	    	                              var hotelInfo = body.hotels;
	    	                             // console.log("hotel object is "+hotelinfo);
	    	                              var speechText = "";
	    	                              
	    	                              hotelOptions = body.hotelOptions;
										  
										  var hotelObject=body.hotelObject;
	    	                              this.attributes['hotelObject']=hotelObject;
	    	                              this.attributes['hotelOptions']=hotelOptions;
	    	                              this.attributes['hotelInfo']=hotelInfo;

	    	                              speechText +="the top 2 results based on your preferences are, "+ hotelInfo[1]+hotelInfo[2]+", choose one option or say more options.";
	    	                              console.log(speechText);
	    	                              this.attributes['hotel_set']=3;
	    	                              var repromptText = "choose one option or say more options.";	    	                	         
	    	                	          this.event.request.dialogState = "STARTED";
										  this.attributes['state']='hotel_selection';
	    	                	        //   console.log(this.attributes);

// ==========================================say the results ===================================================    
	    	
										  //console.log(this.attributes);
			                	          this.emit(':elicitSlot','selection', speechText, repromptText,this.event.request.intent);
	    	                          }
	    	                      else
	    	                      {
	    	                          speechText = "error occurred. Please start over.";
	    	                          repromptText = "error occurred"; 
	    	                          this.emit(':ask', speechText, repromptText);
	    	                      }
	    	                  }.bind(this));
	    	     console.log("after request : ");
                	
			}
	        
	       	
	         if(this.attributes['state']=="hotel_selection"){
	        	hotel_selection = this.event.request.intent.slots.selection.value;
	        	console.log("hotel_selection: "+hotel_selection);
	        	
	        	if(hotel_selection=='1'||hotel_selection=='2'||hotel_selection=='3'||hotel_selection=='4'||hotel_selection=='5'||hotel_selection=='6'){
	        		hotel_selection = parseInt(hotel_selection);
	        		this.attributes['hotel_selection'] = hotel_selection;
	        		this.attributes['state']="hotel_selected"
	        	} else {
	        		speechText='';
	        		if (this.attributes['hotel_set']<6){
	        			speechText +="the next 2 results are, "+ this.attributes['hotelInfo'][this.attributes['hotel_set']]+this.attributes['hotelInfo'][this.attributes['hotel_set']+1]+", choose one option or say more options.";
	        			this.attributes['hotel_set']=this.attributes['hotel_set']+2;
	        		} else{
	        			speechText += "End of available options. Please select one from 1 to 6 or start over."
	        		}
	        		repromptText = speechText;
	        		console.log(speechText);
	        		this.emit(':elicitSlot','selection', speechText, repromptText,this.event.request.intent);
                    	        		
	        	}
	        	
	        }

	        if(hotel_selection != null && this.attributes['state']=="hotel_selected"){               
	                this.attributes['hotel_selection'] = hotel_selection;             
	                speechText = "You are about to book hotel " + this.attributes['hotelOptions'][hotel_selection] + ". Please Confirm.";
	                repromptText ="You are about to book hotel " + this.attributes['hotelOptions'][hotel_selection] + ". Please Confirm.";
	                // console.log(this.attributes);

	                // console.log(this.attributes['hotelOptions'][hotel_selection]);
	                //console.log(this.attributes['hotelOptions']);
	                this.event.request.dialogState = "STARTED";	
	                this.attributes['state']='hotel_confirmation';
	                //console.log(this.attributes);
	                this.emit(':confirmIntent', speechText, repromptText);
	            }
	        	
	// ========================================== confirmation =============================================            

				// hotel_confirmation = this.event.request.intent.slots.confirmation.value;
	   //      	this.attributes['hotel_confirmation'] = hotel_confirmation;

        	if(this.event.request.intent.confirmationStatus == 'DENIED' && this.attributes['state']=='hotel_confirmation'){        		
        		speechOutput = "Canceling your booking, Please start over. Say book a hotel, book a car, book a flight, go to preferences or show my bookings.To exit say stop.";
    	        this.emit(':ask',speechOutput);
        	}
	        	if(this.event.request.intent.confirmationStatus == 'CONFIRMED' && this.attributes['state']=='hotel_confirmation'){        		
//	                this.attributes['hotel_confirmation'] = hotel_confirmation;   
	                hotel_selection = this.attributes['hotel_selection'];
                    console.log("before booking request : ");	
                    myJSONObject={"attributes":this.attributes};
                    console.log("this.attributes new : "+JSON.stringify(this.attributes));	
	    	        request({
	    	               url: "http://ainuco.ddns.net:4324/hotelBooking",
	    	               method: "POST",
	    	               json: true,   // <--Very important!!!
	    	               body: myJSONObject
	    	                  }, function (error, response, body){
	    	                	  console.log("inside request : ");
	    	                         // console.log("res"+JSON.stringify(response));
	    	                      if (!error && response.statusCode == 200) {
	    	      	                
	    	                    	  speechText = "You booked " + this.attributes['hotelOptions'][hotel_selection] +". ";
	    	      	                if (this.attributes['car_status']!= "booked" || this.attributes['flight_status']!= "booked"){
	    	      	                	speechText += "Do you also want to book a ";
	    	      	                	if (this.attributes['car_status'] == "booked" && this.attributes['flight_status'] != "booked"){
	    	      	                		speechText += "flight? Say book a flight."
	    	      	                	}
	    	      	                	
	    	      	                	if (this.attributes['car_status'] != "booked" && this.attributes['flight_status'] == "booked"){
	    	      	                		speechText += "car? Say book a car."
	    	      	                	}
	    	      	                	if (this.attributes['car_status'] != "booked" && this.attributes['flight_status'] != "booked"){
	    	      	                		speechText += "car or a flight? Say book a car or book a flight."
	    	      	                	}
	    	      	                }
	    	      	                repromptText = speechText;
	    	        	                this.attributes['state']='hotel_booked';
	    	        	                
	    	        	                this.attributes['state']='hotel_booked';
	    	        	                this.attributes['hotel_status']='booked';
	    	        	                this.event.request.dialogState = "STARTED";
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

