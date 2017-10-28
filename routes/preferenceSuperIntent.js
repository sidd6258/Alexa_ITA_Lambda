const request=require('request');

exports.preference = function(){
	
	 var preferencewelcomeOutput = "Which preference you want to update or view? you can say flight preferences, car preferences or hotel preferences";
	 var preferenceWelcomeReprompt = "you can say flight preferences, car preferences or hotel preferences";
		request({
		url: "http://ainuco.ddns.net:4324/users/"+this.attributes['profile'].email,
		method: "GET",
		json: true   // <--Very important!!!
	}, function (error, response, body) {
     if (!error && response.statusCode == 200) {
         body = JSON.parse(JSON.stringify(body));
			mongoUser = body[0];
			console.log(JSON.stringify(body))
			this.attributes['mongo_user'] = mongoUser;
			// speechText = "Please choose one from Flight Preferences, Hotel Preferences or Car Preferences you want to look for or edit ?";
			// repromptText = "Please say Flight Preferences, Hotel Preferences or Car Preferences"; // could be improved by using alternative prompt text
			// this.emit(':ask', speechText, repromptText);
			this.emit(':ask',preferencewelcomeOutput, preferenceWelcomeReprompt);  

     }
	}.bind(this));

}