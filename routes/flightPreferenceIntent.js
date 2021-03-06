const request=require('request');

exports.flightPreference = function(){
	console.log("in Flight pref");
	
	
	var filledSlots = delegateSlotCollection_preference.call(this);
		this.attributes['state'] = "flightPreferences";
		this.attributes['flight_action'] = this.event.request.intent.slots.flight_action.value;
		var user=this.attributes['mongo_user'];
		
		
		if (this.attributes['flight_action']=='add'){
			this.attributes['airline_name']=this.event.request.intent.slots.airline_name.value;
	    	this.attributes['airline_days']=this.event.request.intent.slots.airline_days.value;
	    	this.attributes['airline_class']=this.event.request.intent.slots.airline_class.value;
	    	this.attributes['airline_time']=this.event.request.intent.slots.airline_time.value;
	    	this.attributes['food_cuisine']=this.event.request.intent.slots.food_cuisine.value;
	    	this.attributes['food_type']=this.event.request.intent.slots.food_type.value;

	    	user.preferences.flight.airline_name=this.attributes['airline_name'];
	    	user.preferences.flight.airline_days=this.attributes['airline_days'];
	    	user.preferences.flight.airline_class=this.attributes['airline_class'];
	    	user.preferences.flight.airline_time=this.attributes['airline_time'];
	    	user.preferences.food_cuisine=this.attributes['food_cuisine'];
	    	user.preferences.food_type=this.attributes['food_type'];
	        var url = "http://ainuco.ddns.net:4324/users/"+this.attributes['profile'].email;
	
	    	
	    	
	    	console.log("flight pref : >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>\n"+JSON.stringify(this.attributes));
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
	                var speechText="Flight preferences updated. "
	            		if (!this.attributes['hotel_name'] || !this.attributes['car_name']){
	            			speechText+= "to update ";
	            			if(!this.attributes['hotel_name'] && this.attributes['car_name']){
	            				// no hotel
	            				speechText += "hotel preferences, say update hotel preferences.  Or you can start booking by saying book a flight, car or hotel."
	            			}
	            			if(this.attributes['hotel_name'] && !this.attributes['car_name']){
	            				// no car
	            				speechText += "car preferences, say update car preferences.  Or you can start booking by saying book a flight, car or hotel."
	            			}if(!this.attributes['hotel_name'] && !this.attributes['car_name']){
	            				// no hotel and Car
	            				speechText += "car or hotel preferences, " +
	                			"say update car prefrences or update hotel preferences.  Or you can start booking by saying book a flight, car or hotel.";
	            			}
	            		} else {
	            			// both done
	            			speechText+= "Now Let's plan a trip. Say book a hotel, book a car or book a flight"
	            		}
	                
	                console.log("speechText------------>"+speechText);
	    			this.attributes['state']="launch";
	                this.emit(':tell', speechText);
	            }else{
	                console.log("error----->" + error);
				}
	        }.bind(this));
		}else if (this.attributes['flight_action']=='delete'){
			
			var speechText ="We only allow you to add or listen preferences on the go, for more advanced features, log on to our website you just recieved on your Alexa companion app";
			var repromptText = speechText;
			var cardTitle = 'Travel agent website';
			var cardContent = "Hello " + this.attributes['profile'].name +' to edit your preferences. Go to our website on ainuco.ddns .net:4324';
			this.attributes['state']="launch";

			this.emit(':askWithCard', speechText, repromptText, cardTitle, cardContent);
			
		}
		 else {
				
				var speechText= 'your flight preferences are as follows. '
					console.log(user);
					
				if(user.preferences.flight.airline_name){
						speechText += 'preferred airline'; 
						user.preferences.flight.airline_name.forEach(function(element) {
						    speechText+= " , "+element ;
						});
						speechText+= ". ";
					}
				
				if(user.preferences.flight.airline_days){
					speechText += 'preferred travelling days'; 
					user.preferences.flight.airline_days.forEach(function(element) {
					    speechText+= " , "+element ;
					});						
					speechText+= ". ";
					}
				
				if(user.preferences.flight.airline_class){
						speechText += 'you prefer, '+ user.preferences.flight.airline_class+ " class" +". ";
					}
				
				if(user.preferences.flight.airline_time){
						speechText += 'you like to travel arround '+ user.preferences.flight.airline_time+ ". ";
					}
				
				if(user.preferences.food_cuisine && user.preferences.food_type){
					speechText += 'and you like to eat, '+user.preferences.food_type+" cooked in "+ user.preferences.food_cuisine+ " style. ";
					}
				
				if(user.preferences.food_cuisine && !user.preferences.food_type){
					speechText += 'and you like to eat, '+ user.preferences.food_cuisine+" food. ";
					}
				
				if(!user.preferences.food_cuisine && user.preferences.food_type){
					speechText += 'and you like to eat, '+user.preferences.food_type+ ". ";
					}
				
				speechText +="to view more preferences, say show car or hotel preferences, Or start booking by saying book a flight, car or hotel";
				
				var repromptText = "to view car or hotel preferences, " +
	                			"say show car prefrences or show hotel preferences.  Or start booking by saying book a flight, car or hotel.";
				this.attributes['state']="launch";
				this.emit(":ask",speechText,repromptText);
				
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
	      if(this.event.request.intent.slots.flight_action.value!='add' && this.event.request.intent.slots.flight_action.value){
	    	  return this.event.request.intent;
	      }
	      this.emit(":delegate", updatedIntent);
	    } else if (this.event.request.dialogState !== "COMPLETED") {
	      console.log("in not completed");
	      console.log("request inprogress: "+ JSON.stringify(this.event.request));
	      if(this.event.request.intent.slots.flight_action.value!='add' && this.event.request.intent.slots.flight_action.value){
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