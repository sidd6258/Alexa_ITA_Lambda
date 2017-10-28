const request=require('request');

exports.hotelPreference = function(){
	console.log("in Hotel pref");
		var filledSlots = delegateSlotCollection_preference.call(this);
		this.attributes['state'] = "hotelPreferences";
    	this.attributes['hotel_name']=this.event.request.intent.slots.hotel_name.value;
    	this.attributes['hotel_location']=this.event.request.intent.slots.hotel_location.value;
    	this.attributes['hotel_star_rating']=this.event.request.intent.slots.hotel_star_rating.value;
    	this.attributes['hotel_price']=this.event.request.intent.slots.hotel_price.value;
    	this.attributes['food_cuisine']=this.event.request.intent.slots.food_cuisine.value;
    	this.attributes['food_type']=this.event.request.intent.slots.food_type.value;
    	var user=this.attributes['mongo_user'];
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
                speechText = "Airline name as "+mongoUser.preferences.flight.airline_name+" has updated successfully";
                console.log("speechText------------>"+speechText);
                this.emit(':tell', speechText);
            }else{
                console.log("error----->" + error);
			}
        }.bind(this));
    	var speechText="Hotel preferences updated. " +
    			"Do you also want to update Flight or Car preferences, " +
    			"if yes then say update Flight prefrences or update Car preferences.";
    	var repromptText = "Hotel preferences updated. " +
				"Do you also want to update Flight or car preferences, " +
				"if yes then say update Flight prefrences or update Car preferences.";
    	this.event.request.dialogState = "STARTED";
    	this.attributes['state']="launch";
    	this.emit(":ask",speechText,repromptText);	
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
	      this.emit(":delegate");
	    } else {
	      console.log("in completed");
	      console.log("returning: "+ JSON.stringify(this.response));
	      // Dialog is now complete and all required slots should be filled,
	      // so call your normal intent handler.
	      return this.event.request.intent;
	    }
	}