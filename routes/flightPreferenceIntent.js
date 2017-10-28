const request=require('request');

exports.flightPreference = function(){
	console.log("in Flight pref");
		var filledSlots = delegateSlotCollection_preference.call(this);
		this.attributes['state'] = "flightPreferences";
    	this.attributes['airline_name']=this.event.request.intent.slots.airline_name.value;
    	this.attributes['airline_days']=this.event.request.intent.slots.airline_days.value;
    	this.attributes['airline_class']=this.event.request.intent.slots.airline_class.value;
    	this.attributes['airline_time']=this.event.request.intent.slots.airline_time.value;
    	this.attributes['food_cuisine']=this.event.request.intent.slots.food_cuisine.value;
    	this.attributes['food_type']=this.event.request.intent.slots.food_type.value;
    	var user=this.attributes['mongo_user'];
    	user.preferences.flight.airline_name=this.attributes['airline_name'];
    	user.preferences.flight.airline_days=this.attributes['airline_days'];
    	user.preferences.flight.airline_class=this.attributes['airline_class'];
    	user.preferences.flight.airline_time=this.attributes['airline_time'];
    	user.preferences.flight.food_cuisine=this.attributes['food_cuisine'];
    	user.preferences.flight.food_type=this.attributes['food_type'];
        var url = "http://ainuco.ddns.net:4324/users/"+profile.email;

    	
    	
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
                speechText = "Airline name as "+mongoUser.preferences.flight.airline_name+" has updated successfully";
                console.log("speechText------------>"+speechText);
                this.emit(':tell', speechText);
            }else{
                console.log("error----->" + error);
			}
        }.bind(this));
    	var speechText="Flight preferences updated. " +
    			"Do you also want to update Hotel or car preferences, " +
    			"if yes then say update car prefrences or update hotel preferences.";
    	var repromptText = "Flight preferences updated. " +
		"Do you also want to update Hotel or car preferences, " +
		"if yes then say update car prefrences or update hotel preferences.";
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