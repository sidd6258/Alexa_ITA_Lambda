const request=require('request');

exports.preference = function(){
	if(this.attributes['state']=="launch" || this.attributes['state']=="flight_booked" || this.attributes['state']=="car_booked" || this.attributes['state']=="hotel_booked"){
		var filledSlots = delegateSlotCollection_preference.call(this);
		this.attributes['state'] = "preferences";
		this.attributes['module']=this.event.request.intent.slots.module.value;
    	this.attributes['preference_action']=this.event.request.intent.slots.preference_action.value;

//		request({
//					url: "http://localhost:3000/users/"+this.attributes['profile'].email,
//					method: "GET",
//					json: true   // <--Very important!!!
//				}, function (error, response, body) {
//                    if (!error && response.statusCode == 200) {
//                        body = JSON.parse(JSON.stringify(body));
//						mongoUser = body[0];
//						this.attributes['user_preferences'] = mongoUser.preferences;
//						// speechText = "Please choose one from Flight Preferences, Hotel Preferences or Car Preferences you want to look for or edit ?";
//						// repromptText = "Please say Flight Preferences, Hotel Preferences or Car Preferences"; // could be improved by using alternative prompt text
//						// this.emit(':ask', speechText, repromptText);
//                    }
//				}.bind(this));
    	
		if(this.attributes['module']=='flight'){
			console.log("before emit state");
			this.emitWithState("flightPreferenceIntent");
			
		} else if(this.attributes['module']=='car'){
			
			this.emitWithState("carPreferenceIntent");
			
		}else if (this.attributes['module']=='hotel'){
			
			this.emitWithState("hotelPreferenceIntent");
			
		}
		
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