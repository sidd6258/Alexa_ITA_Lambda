var destination_car = null;
var startdate_car = null;
var enddate_car = null;
var guests_car = null;
var carOptions = null;
var car_selection = null;
var car_confirmation = null;
const request=require('request');
exports.carIntent=function(){
console.log("in car intent")

	    	
	    	if(this.attributes['state']=="launch" || this.attributes['state']=="flight_booked" || this.attributes['state']=="hotel_booked"){
	    		
	    		if(this.attributes['hotel_status'] == "booked"){
	    			if(this.event.request.intent.confirmationStatus == 'NONE'){
	    				var speechText = "do you want to book the car in "+this.attributes['destination_hotel']+
			    		" from "+this.attributes['startdate_hotel']+
			    		" till "+this.attributes['enddate_hotel']+
			    		" for "+this.attributes['guests_hotel']+" guests."
	        			this.emit(':confirmIntent', speechText, repromptText);
	    			} else if(this.event.request.intent.confirmationStatus == 'CONFIRMED'){
	    				this.event.request.intent.slots.destination_car.value = this.attributes['destination_hotel'];
	    	        	this.event.request.intent.slots.startdate_car.value=this.attributes['startdate_hotel'];
	    	        	this.event.request.intent.slots.enddate_car.value=this.attributes['enddate_hotel'];
	    	        	this.event.request.intent.slots.guests_car.value=this.attributes['guests_hotel'];
	    	        	
	    	        	this.event.request.intent.confirmationStatus = 'NONE';
	    			} 
	    		}else if(this.attributes['flight_status'] == "booked"){
	    			if(this.event.request.intent.confirmationStatus == 'NONE'){
	    				var speechText = "do you want to book the car in "+this.attributes['destination_flight']+
			    		" from "+this.attributes['startdate_flight']+
			    		" for "+this.attributes['guests_flight']+" guests."
	    	    		var repromptText = speechText;
	    	    		
	    	    		this.emit(':confirmIntent', speechText, repromptText);
	    			} else if(this.event.request.intent.confirmationStatus == 'CONFIRMED'){
	    				this.event.request.intent.slots.destination_car.value = this.attributes['destination_flight'];
	    	        	this.event.request.intent.slots.startdate_car.value=this.attributes['startdate_flight'];
	    	        	this.event.request.intent.slots.guests_car.value=this.attributes['guests_flight'];
	    	        	
	    	        	this.event.request.intent.confirmationStatus = 'NONE';
	    			} 
	        		
	    		} 
	    		
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
	        	this.attributes['car_selection_state'] = car_selection;
	        	console.log('car option selection is '+car_selection);
	        }
	        
//	        car_confirmation = this.event.request.intent.slots.confirmation.value;
//	        // module=this.event.request.intent.slots.module.value;       	
//	        this.attributes['car_confirmation_state'] = car_confirmation;
	        	
	        	
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
	                this.attributes['car_status'] = "booked";
	                car_selection = this.attributes['car_selection'];
                    console.log("before booking request : ");	
                    myJSONObject={"attributes":this.attributes};
	    	        request({
	    	               url: "http://ainuco.ddns.net:4324/carBooking",
	    	               method: "POST",
	    	               json: true,   // <--Very important!!!
	    	               body: myJSONObject
	    	                  }, function (error, response, body){
	    	                	  console.log("inside request : ");
	    	                         // console.log("res"+JSON.stringify(response));
	    	                      if (!error && response.statusCode == 200) {
	    	          	                speechText = "You booked " + this.attributes['carOptions'][car_selection] +". ";
	    	          	              if (this.attributes['flight_status']!= "booked" || this.attributes['hotel_status']!= "booked"){
	    	          	            	speechText += "Do you also want to book a ";
	    	          	            	if (this.attributes['flight_status']== "booked" && this.attributes['hotel_status']!= "booked"){
	    	          	            		speechText += "hotel? Say book a hotel."
	    	          	            	}
	    	          	            	
	    	          	            	if (this.attributes['flight_status']!= "booked" && this.attributes['hotel_status']== "booked"){
	    	          	            		speechText += "flight? Say book a flight."
	    	          	            	}
	    	          	            	if (this.attributes['flight_status']!= "booked" && this.attributes['hotel_status']!= "booked"){
	    	          	            		speechText += "flight or a hotel? Say book a flight or book a hotel."
	    	          	            	}
	    	          	            }
	    	          	            repromptText = speechText;
	    	          	            console.log(this.attributes);
	    	        	                this.attributes['state']='car_booked';
	    	        	                this.event.request.dialogState = "STARTED";
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
                if( this.attributes['state']=='call_api'){
                	 console.log("option request : "+ JSON.stringify(this.event.request));
    	        	 var myJSONObject={};
                     myJSONObject={"destination":this.attributes['destination_car'],
                             "sdatetime": this.attributes['startdate_car'],
                             "edatetime":this.attributes['enddate_car']
                     };
                     console.log("before request : ");	
	    	         request({
	    	               url: "http://ainuco.ddns.net:4324/car",
	    	               method: "POST",
	    	               json: true,   // <--Very important!!!
	    	               body: myJSONObject
	    	                  }, function (error, response, body){
	    	                	  console.log("inside request : ");
	    	                         // console.log("res"+JSON.stringify(response));
	    	                          if (!error && response.statusCode == 200) {
	    	                              //console.log("place"+JSON.stringify(body));
	    	                              var carinfo = body.cars;
	    	                             // console.log("car object is "+carinfo);
	    	                              var speechText = "";
	    	                              speechText += carinfo+", choose one option";
	    	                              carOptions = body.carOptions;	 
	    	                              
	    	                              var carObject=body.carObject;
	    	                              this.attributes['carObject']=carObject;
	    	                              this.attributes['carOptions']=carOptions;
	    	                              console.log(speechText);
	    	                              var repromptText = "For instructions on what you can say, please say help me.";	    	                	         	    	                	          
	    	                	          this.attributes['state']='car_selection';
	    	                	          this.event.request.dialogState = "STARTED";	
	    	                	          console.log(this.attributes);
	    	                	          console.log("dialog state is "+this.event.request.dialogState);
	    	                	        //say the results    	    	                	          
	    	                	          this.emit(':elicitSlot','selection', speechText, repromptText,this.event.request.intent);
	    	                          }
	    	                      else
	    	                      {
	    	                          speechText = "snippets.ERROR";
	    	                          repromptText = "snippets.ERROR"; 
	    	                          this.emit(':ask', speechText, repromptText);
	    	                      }
	    	                  }.bind(this));
	    	     console.log("after request : ");
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
	    	  this.attributes['state']='call_api';
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