const request=require('request');

exports.carPreference = function(){
	console.log("in Car pref");
	console.log(JSON.stringify(this.attributes))

		var filledSlots = delegateSlotCollection_preference.call(this);
		this.attributes['state'] = "carPreferences";
		this.attributes['car_action'] = this.event.request.intent.slots.car_action.value;
		var user=this.attributes['mongo_user'];
		
		if (this.attributes['car_action']=='add'){
	    	this.attributes['car_brand']=this.event.request.intent.slots.car_brand.value;
	    	this.attributes['car_rental_company']=this.event.request.intent.slots.car_rental_company.value;
	    	this.attributes['car_mileage']=this.event.request.intent.slots.car_mileage.value;
	    	this.attributes['car_price']=this.event.request.intent.slots.car_price.value;
	    	this.attributes['car_features']=this.event.request.intent.slots.car_features.value;
	    	
	    	user.preferences.car.car_brand.push(this.attributes['car_brand']);
	    	user.preferences.car.car_rental_company.push(this.attributes['car_rental_company']);
	    	user.preferences.car.car_mileage=this.attributes['car_mileage'];
	    	user.preferences.car.car_price=this.attributes['car_price'];
	    	user.preferences.car.car_features.push(this.attributes['car_features']);
	    	var url = "http://ainuco.ddns.net:4324/users/"+this.attributes['profile'].email;
	    	
	    	
	    	console.log("car pref : >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+JSON.stringify(this.attributes));
	    	//TO DO add mongo update
	    	
	    	request({
	            url: url,
	            method: "POST",
	            json: true,
				body:user
			}, function (error, response, body) {
	        	console.log(body);
	            if (!error && response.statusCode == 200) {
	                console.log("response----->" + JSON.stringify(response));
	                console.log("body----->" + JSON.stringify(body));
	                mongoUser = body;
	                console.log("speechText------------>"+speechText);
	                var speechText="Car preferences updated. "
	            		if (!this.attributes['airline_name'] || !this.attributes['hotel_name']){
	            			speechText+= "to update ";
	            			if(!this.attributes['airline_name'] && this.attributes['hotel_name']){
	            				// no airline
	            				speechText += "Flight preferences, say update Flight preferences.  Or you can start booking by saying book a flight, car or hotel."
	            			}
	            			if(this.attributes['airline_name'] && !this.attributes['hotel_name']){
	            				// no hotel
	            				speechText += "Hotel preferences, say update Hotel preferences. Or you can start booking by saying book a flight, car or hotel."
	            			}if(!this.attributes['airline_name'] && !this.attributes['hotel_name']){
	            				// no hotel and flight
	            				speechText += "Hotel or Flight preferences, " +
	                			"say update Hotel prefrences or update Flight preferences.  Or you can start booking by saying book a flight, car or hotel.";
	            			}
	            		} else {
	            			// both done
	            			speechText+= "Now Let's plan a trip. Say book a hotel, book a car or book a flight"
	            		}
	            		
	            			
	            	var repromptText = speechText;
	            	this.event.request.dialogState = "STARTED";
	            	this.attributes['state']="launch";
	            	this.emit(":ask",speechText,repromptText);	
	                
	            }else{
	                console.log("error----->" + error);
				}
	        }.bind(this));
		} else if(this.attributes['car_action']=='view'){
			
			var speechText= 'your car preferences are as follows. '
				
			if(user.preferences.car.car_brand){
					speechText += 'car brand'; 
					user.preferences.car.car_brand.forEach(function(element) {
					    speechText+= " , "+element ;
					});
					speechText+= ". ";
				}
			
			if(user.preferences.car.car_rental_company){
					speechText += 'rental company'; 
					user.preferences.car.car_rental_company.forEach(function(element) {
					    speechText+= " , "+element ;
					});
					speechText+= ". ";
				}
			
			if(user.preferences.car.car_mileage){
					speechText += 'Daliy limit, '+ user.preferences.car.car_mileage+ " miles" +". ";
				}

			if(user.preferences.car.car_price){
					speechText += 'preferred cost per day is $'+ user.preferences.car.car_price+ ". ";
				}

			if(user.preferences.car.car_features){
					speechText += 'car features'; 
					user.preferences.car.car_features.forEach(function(element) {
					    speechText+= " , "+element ;
					});
					speechText+= ". ";
				}
			
			speechText +="to view more preferences, say view Hotel or Flight preferences, Or start booking by saying book a flight, car or hotel";
			
			var repromptText = "to view Hotel or Flight preferences, " +
                			"say view Hotel prefrences or view Flight preferences.  Or start booking by saying book a flight, car or hotel.";
			
			this.emit(":ask",speechText,repromptText);
			
		} else if (this.attributes['car_action']=='delete'){
			
			var speechText ="We only allow you to add or listen preferences on the go, for more advanced features, log on to our website you just recieved on your Alexa companion app";
			var repromptText = speechText;
			var cardTitle = 'Travel agent website';
			var cardContent = "Hello " + this.attributes['profile'].name +' to edit your preferences. Go to our website on ainuco.ddns .net:4324';
			
			this.emit(':askWithCard', speechText, repromptText, cardTitle, cardContent);
			
			
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
	      if(this.event.request.intent.slots.car_action.value=='view' || this.event.request.intent.slots.car_action.value=='delete'  ){
	    	  return this.event.request.intent;
	      }
	      this.emit(":delegate", updatedIntent);
	    } else if (this.event.request.dialogState !== "COMPLETED") {
	      console.log("in not completed");
	      console.log("request inprogress: "+ JSON.stringify(this.event.request));
	      console.log(this.event.request.intent.slots.car_action.value);
	      if(this.event.request.intent.slots.car_action.value=='view' || this.event.request.intent.slots.car_action.value=='delete'  ){
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