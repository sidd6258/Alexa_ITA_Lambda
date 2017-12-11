const request=require('request');

exports.hotelPreference = function(){
	console.log("in Hotel pref");
		var filledSlots = delegateSlotCollection_preference.call(this);
		this.attributes['state'] = "hotelPreferences";
		this.attributes['hotel_action'] = this.event.request.intent.slots.hotel_action.value;
		var user=this.attributes['mongo_user'];
		
		if (this.attributes['hotel_action']=='add'){
	    	this.attributes['hotel_name']=this.event.request.intent.slots.hotel_name.value;
	    	this.attributes['hotel_location']=this.event.request.intent.slots.hotel_location.value;
	    	this.attributes['hotel_star_rating']=this.event.request.intent.slots.hotel_star_rating.value;
	    	this.attributes['hotel_price']=this.event.request.intent.slots.hotel_price.value;
	    	this.attributes['food_cuisine']=this.event.request.intent.slots.food_cuisine.value;
	    	this.attributes['food_type']=this.event.request.intent.slots.food_type.value;

	    	user.preferences.hotel.hotel_name=this.attributes['hotel_name'];
	    	user.preferences.hotel.hotel_location=this.attributes['hotel_location'];
	    	user.preferences.hotel.hotel_star_rating=this.attributes['hotel_star_rating'];
	    	user.preferences.hotel.hotel_price=this.attributes['hotel_price'];
	    	user.preferences.food_cuisine=this.attributes['food_cuisine'];
	    	user.preferences.food_type=this.attributes['food_type'];
	    	var url = "http://ainuco.ddns.net:4324/users/"+this.attributes['profile'].email;
	    	
	    	console.log("hotel pref : >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+JSON.stringify(this.attributes));
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
	                var speechText="Hotel preferences updated. "
	            		if (!this.attributes['airline_name'] || !this.attributes['car_name']){
	            			speechText+= "to update ";
	            			if(!this.attributes['airline_name'] && this.attributes['car_name']){
	            				// no flight
	            				speechText += "Flight preferences, say update Flight preferences.  Or you can start booking by saying book a flight, car or hotel."
	            			}
	            			if(this.attributes['airline_name'] && !this.attributes['car_name']){
	            				// no car
	            				speechText += "car preferences, say update car preferences.  Or you can start booking by saying book a flight, car or hotel."
	            			}if(!this.attributes['airline_name'] && !this.attributes['car_name']){
	            				// no car and flight
	            				speechText += "car or Flight preferences, " +
	                			"say update car prefrences or update Flight preferences.  Or you can start booking by saying book a flight, car or hotel.";
	            			}
	            		} else {
	            			// both done
	            			speechText+= "Now Let's plan a trip. Say book a hotel, book a car or book a flight"
	            		}
	                console.log("speechText------------>"+speechText);
	
	            			
	            	var repromptText = speechText;
	                
	                
	                this.emit(':tell', speechText);
	            }else{
	                console.log("error----->" + error);
				}
	        }.bind(this));
		}
		 else if(this.attributes['hotel_action']=='show'){
				
			 
				var speechText= 'your hotel preferences are as follows. '
					
				if(user.preferences.hotel.hotel_name){
						speechText += 'preferred hotel chains, '+ user.preferences.hotel.hotel_name+ ". ";
					}

				if(user.preferences.hotel.hotel_location){
						speechText += 'preferred location near '+ user.preferences.hotel.hotel_location+ ". ";
					}
				
				if(user.preferences.hotel.hotel_star_rating){
						speechText += 'room with '+ user.preferences.hotel.hotel_star_rating+ " star rating. ";
					}

				if(user.preferences.hotel.hotel_price){
						speechText += 'preferred cost of a room per day is $'+ user.preferences.hotel.hotel_price+ ". ";
					}

				if(user.preferences.food_cuisine && user.preferences.food_type){
					speechText += 'and you like to eat '+user.preferences.food_type+" cooked in "+ user.preferences.food_cuisine+ " style. ";
					}
				
				if(user.preferences.food_cuisine && !user.preferences.food_type){
					speechText += 'and you like to eat '+ user.preferences.food_cuisine+" food. ";
					}
				
				if(!user.preferences.food_cuisine && user.preferences.food_type){
					speechText += 'and you like to eat '+user.preferences.food_type+ ". ";
					}
				
				speechText +="to view more preferences, say view car or Flight preferences, Or start booking by saying book a flight, car or hotel";
				
				var repromptText = "to view car or Flight preferences, " +
	                			"say view car prefrences or view Flight preferences.  Or start booking by saying book a flight, car or hotel.";
				
				this.emit(":ask",speechText,repromptText);
				
			} else if (this.attributes['hotel_action']=='delete'){
				
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
	      if(this.event.request.intent.slots.hotel_action.value=='view' || this.event.request.intent.slots.hotel_action.value=='delete'){
	    	  return this.event.request.intent;
	      }
	      this.emit(":delegate", updatedIntent);
	    } else if (this.event.request.dialogState !== "COMPLETED") {
	      console.log("in not completed");
	      console.log("request inprogress: "+ JSON.stringify(this.event.request));
	      
	      if(this.event.request.intent.slots.hotel_action.value=='view' || this.event.request.intent.slots.hotel_action.value=='delete'){
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