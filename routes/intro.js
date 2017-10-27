const request=require('request');
const welcomeOutput = "Let's plan a trip. What would you like to book? Say book a hotel, book a car or book a flight";
const welcomeReprompt = "Let me know how can i help you. Say book a hotel, book a car or book a flight";


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
            this.emit(':ask', "Hello " + profile.name +", " + welcomeOutput, welcomeReprompt);  

        } else {

            this.emit(':tell', "Hello, I can't connect to Amazon Profile Service right now, try again later");

        }

    }.bind(this));

} 