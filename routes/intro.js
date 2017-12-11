const request=require('request');
const welcomeOutput = "Let's plan a trip. What would you like to book? Say book a hotel, car or flight. If you want to update your preferences, you can also say go to preferences. Say show my bookings to see your upcoming bookings";
const welcomeReprompt = "Let me know how can i help you. Say book a hotel, book a car, book a flight, go to preferences or show my bookings.";


exports.intro = function(){
	if (this.event.session.user.accessToken == undefined) {

	      this.emit(':tellWithLinkAccountCard','to start using this skill, please use the companion app to authenticate on Amazon');

	            return;

	        }
	var amznProfileURL = 'https://api.amazon.com/user/profile?access_token=';

    amznProfileURL += this.event.session.user.accessToken;
    this.attributes['state'] = 'launch';
        
    request(amznProfileURL, function(error, response, body) {
        if (response.statusCode == 200) {

            var profile = JSON.parse(body);
            console.log(profile.name);
            this.attributes['profile']=profile;
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
        			console.log(JSON.stringify(this));
                this.emit(':ask', "Hello " + profile.name +", " + welcomeOutput, welcomeReprompt);  

             }
             
        	}.bind(this));


        } else {

            this.emit(':tell', "Hello, I can't connect to Amazon Profile Service right now, try again later");

        }

    }.bind(this));

} 