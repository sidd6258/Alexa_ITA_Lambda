const request=require('request');

exports.hotelPreference = function(){
	console.log("in Hotel pref");
		var filledSlots = delegateSlotCollection_preference.call(this);
		this.attributes['state'] = "hotelPreferences";
    	this.attributes['hotel_name']=this.event.request.intent.slots.hotel_name.value;
    	this.attributes['hotel_days']=this.event.request.intent.slots.hotel_days.value;
    	console.log("hotel pref : >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+JSON.stringify(this.attributes));
    	//TO DO add mongo update
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