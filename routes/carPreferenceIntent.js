const request=require('request');

exports.carPreference = function(){
	console.log("in Car pref");
		var filledSlots = delegateSlotCollection_preference.call(this);
		this.attributes['state'] = "carPreferences";
    	this.attributes['car_brand']=this.event.request.intent.slots.car_brand.value;
    	this.attributes['car_rental_company']=this.event.request.intent.slots.car_rental_company.value;
    	this.attributes['car_mileage']=this.event.request.intent.slots.car_mileage.value;
    	this.attributes['car_price']=this.event.request.intent.slots.car_price.value;
    	this.attributes['car_features']=this.event.request.intent.slots.car_features.value;
    	
    	
    	console.log("car pref : >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+JSON.stringify(this.attributes));
    	//TO DO add mongo update
    	var speechText="Car preferences updated. " +
    			"Do you also want to update Hotel or Flight preferences, " +
    			"if yes then say update Hotel prefrences or update Flight preferences.";
    	var repromptText = "Car preferences updated. " +
				"Do you also want to update Hotel or Flight preferences, " +
				"if yes then say update Hotel prefrences or update Flight preferences.";
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