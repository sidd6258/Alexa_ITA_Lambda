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

	        	// console.log("option request : "+ JSON.stringify(this.event.request));
				var myJSONObject={};
                     myJSONObject={"destination":this.attributes['destination_hotel'],
                             "sdatetime": this.attributes['startdate_hotel'],
                             "edatetime":this.attributes['enddate_hotel']
                     };
				console.log("before request : "+JSON.stringify(myJSONObject));

				request({
	    	               url: "http://ainuco.ddns.net:4324/htl",
	    	               method: "POST",
	    	               json: true,   // <--Very important!!!
	    	               body: myJSONObject
	    	                  }, function (error, response, body){
	    	                	  console.log("inside request : ");
	    	                         // console.log("res"+JSON.stringify(response));
	    	                          if (!error && response.statusCode == 200) {
	    	                              //console.log("place"+JSON.stringify(body));
	    	                              var hotelinfo = body.hotels;
	    	                             // console.log("hotel object is "+hotelinfo);
	    	                              var speechText = "";
	    	                              speechText += hotelinfo+", choose one option";
	    	                              hotelOptions = body.hotelOptions;
										  
										  var hotelObject=body.hotelObject;
	    	                              this.attributes['hotelObject']=hotelObject;
	    	                              this.attributes['hotelOptions']=hotelOptions;
	    	                              console.log(speechText);
	    	                              var repromptText = "For instructions on what you can say, please say help me.";	    	                	         
	    	                	          this.event.request.dialogState = "STARTED";
										  this.attributes['state']='hotel_selection';
	    	                	        //   console.log(this.attributes);

// ==========================================say the results ===================================================    
	    	
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
	        
	       	
	         if(this.attributes['state']=="hotel_selection"){
	        	hotel_selection = this.event.request.intent.slots.selection.value;
	        	this.attributes['hotel_selection'] = hotel_selection;
				console.log("hotel_selection: "+hotel_selection);
	        }

	        if(hotel_selection != null && this.attributes['state']=="hotel_selection"){               
	                this.attributes['hotel_selection'] = hotel_selection;             
	                speechText = "You are about to book hotel " + this.attributes['hotelOptions'][hotel_selection] + ". Please Confirm.";
	                repromptText ="You are about to book hotel " + this.attributes['hotelOptions'][hotel_selection] + ". Please Confirm.";
	                // console.log(this.attributes);

	                // console.log(this.attributes['hotelOptions'][hotel_selection]);
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
}
