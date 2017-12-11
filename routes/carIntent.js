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

	    	
	    	if(this.attributes['state']=="flight_booked" || this.attributes['state']=="hotel_booked"){
	    		
	    		if(this.attributes['hotel_status'] == "booked"){
	    			if(this.event.request.intent.confirmationStatus == 'NONE' && this.attributes['car_prompted'] == undefined){
	    				var speechText = "do you want to book the car in "+this.attributes['destination_hotel']+
			    		" from "+this.attributes['startdate_hotel']+
			    		" till "+this.attributes['enddate_hotel']+
			    		" for "+this.attributes['guests_hotel']+" guests."
			    		this.attributes['car_prompted'] = 'yes';
			    		console.log(this.attributes);
	        			this.emit(':confirmIntent', speechText, repromptText);
	    			} else if(this.event.request.intent.confirmationStatus == 'CONFIRMED'){
	    				this.event.request.intent.slots.destination_car.value = this.attributes['destination_hotel'];
	    	        	this.event.request.intent.slots.startdate_car.value=this.attributes['startdate_hotel'];
	    	        	this.event.request.intent.slots.enddate_car.value=this.attributes['enddate_hotel'];
	    	        	this.event.request.intent.slots.guests_car.value=this.attributes['guests_hotel'];
	    	        	
	    	        	this.event.request.intent.confirmationStatus = 'NONE';
	    	        	this.attributes['state']="launch";
	    	        	var filledSlots = delegateSlotCollection_car.call(this);
	    			} else {
	    				var filledSlots = delegateSlotCollection_car.call(this);
	    			}
	    		}else if(this.attributes['flight_status'] == "booked"){
	    			if(this.event.request.intent.confirmationStatus == 'NONE' && this.attributes['car_prompted'] == undefined){
	    				var speechText = "do you want to book the car in "+this.attributes['destination_flight']+
			    		" from "+this.attributes['startdate_flight']+
			    		" for "+this.attributes['guests_flight']+" guests."
	    	    		var repromptText = speechText;
	    				this.attributes['car_prompted'] = 'yes';
	    				console.log(this.attributes);
	    	    		this.emit(':confirmIntent', speechText, repromptText);
	    			} else if(this.event.request.intent.confirmationStatus == 'CONFIRMED'){
	    				this.event.request.intent.slots.destination_car.value = this.attributes['destination_flight'];
	    	        	this.event.request.intent.slots.startdate_car.value=this.attributes['startdate_flight'];
	    	        	this.event.request.intent.slots.guests_car.value=this.attributes['guests_flight'];
	    	        	
	    	        	this.event.request.intent.confirmationStatus = 'NONE';
	    	        	this.attributes['state']="launch";
	    	        	var filledSlots = delegateSlotCollection_car.call(this);
	    			}  else {
	    				var filledSlots = delegateSlotCollection_car.call(this);
	    			}
	        		
	    		} 
	    	}
	    	
	    		if(this.attributes['state']=="launch"){
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
	        	console.log('car option selection is '+car_selection);
	        	car_selection = this.event.request.intent.slots.selection.value;
	        	
	        	if(car_selection=='1'||car_selection=='2'||car_selection=='3'||car_selection=='4'||car_selection=='5'||car_selection=='6'){
	        		car_selection = parseInt(car_selection);
	        		this.attributes['car_selection'] = car_selection;
	        		this.attributes['state']="car_selected"
	        	} else {
	        		speechText='';
	        		if (this.attributes['car_set']<6){
	        			speechText +="the next 2 results are, "+ this.attributes['carInfo'][this.attributes['car_set']]+this.attributes['carInfo'][this.attributes['car_set']+1]+", choose one option or say more options.";
	        			this.attributes['car_set']=this.attributes['car_set']+2;
	        		} else{
	        			speechText += "End of available options. Please select one from 1 to 6 or start over."
	        		}
	        		repromptText = speechText;
	        		console.log(speechText);
	        		this.emit(':elicitSlot','selection', speechText, repromptText,this.event.request.intent);
                    	        		
	        	}
	        }
	        
//	        car_confirmation = this.event.request.intent.slots.confirmation.value;
//	        // module=this.event.request.intent.slots.module.value;       	
//	        this.attributes['car_confirmation_state'] = car_confirmation;
	        	
	        	
	        	if(car_selection != null && this.attributes['state']=="car_selected"){               
	                this.attributes['car_selection'] = car_selection;             
	                speechText = "You are about to book car " + this.attributes['carOptions'][car_selection] + " " + ".Please Confirm.";
	                repromptText ="You are about to book car " + this.attributes['carOptions'][car_selection] + " " + ".Please Confirm.";
	                console.log(this.attributes);
	                this.event.request.dialogState = "STARTED";	
	                this.attributes['state']='car_confirmation';
	                console.log(this.attributes);
	                this.emit(':confirmIntent', speechText, repromptText);
	            }
	        	
	        	if(this.event.request.intent.confirmationStatus == 'CONFIRMED'){        		
	                this.attributes['car_confirmation'] = car_confirmation;   
	                this.attributes['car_status'] = "booked";
	                car_selection = this.attributes['car_selection'];
                    console.log("before booking request : ");	
                    myJSONObject={"attributes":this.attributes};
                    console.log("this.attributes new : "+JSON.stringify(this.attributes));	
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
	    	        	                this.attributes['car_status'] = 'booked';
	    	        	                this.event.request.dialogState = "STARTED";
	    	        	                console.log(this.attributes);
	    	        	                this.emit(':ask', speechText, repromptText);
	    	        	                }
	    	                      else
	    	                      {
	    	                          speechText = "snippets.ERROR";
	    	                          repromptText = "snippets.ERROR"; 
	    	                          console.log(this.attributes);
	    	                          this.emit(':ask', speechText, repromptText);
	    	                      }
	    	                  }.bind(this));

	            }	        	                 
                if( this.attributes['state']=='call_api'){
    	    		destination_car=this.event.request.intent.slots.destination_car.value;
    	            startdate_car=this.event.request.intent.slots.startdate_car.value;
    	            enddate_car=this.event.request.intent.slots.enddate_car.value;
    	            guests_car=this.event.request.intent.slots.guests_car.value;
    	            this.attributes['destination_car'] = destination_car;
    	        	this.attributes['startdate_car'] = startdate_car;
    	        	this.attributes['enddate_car'] = enddate_car;
    	        	this.attributes['guests_car'] = guests_car;
                	 console.log("option request : "+ JSON.stringify(this.event.request));
    	        	 var myJSONObject={};
                     myJSONObject={"destination":this.attributes['destination_car'],
                             "sdatetime": this.attributes['startdate_car'],
                             "edatetime":this.attributes['enddate_car'],
                             "user":this.attributes['profile'].email                  
                             };
                     console.log("before request : ");	
	    	         request({
	    	               url: "http://ainuco.ddns.net:4324/car_recom",
	    	               method: "POST",
	    	               json: true,   // <--Very important!!!
	    	               body: myJSONObject
	    	                  }, function (error, response, body){
	    	                	  console.log("inside request : ");
	    	                         // console.log("res"+JSON.stringify(response));
	    	                          if (!error && response.statusCode == 200) {
	    	                              //console.log("place"+JSON.stringify(body));
	    	                              var carInfo = body.cars;
	    	                             // console.log("car object is "+carinfo);
	    	                              var speechText = "";
	    	                              speechText +="the top 2 results are, "+ carInfo[1]+carInfo[2]+", choose one option or say more options.";
	    	                              carOptions = body.carOptions;	 
	    	                              
	    	                              this.attributes['car_set']=3;
	    	                              var carObject=body.carObject;
	    	                              this.attributes['carObject']=carObject;
	    	                              this.attributes['carOptions']=carOptions;
	    	                              this.attributes['carInfo']=carInfo;
	    	                              console.log(speechText);
	    	                              var repromptText = "choose one option or say more options.";	    	                	         
	    	                              this.attributes['state']='car_selection';
	    	                	          this.event.request.dialogState = "STARTED";	
	    	                	          console.log(this.attributes);
	    	                	          console.log("dialog state is "+this.event.request.dialogState);
	    	                	        //say the results    	    	    
	    	                	          console.log(this.attributes);
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