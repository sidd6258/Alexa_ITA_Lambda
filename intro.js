const request=require('request');
const welcomeOutput = "Let's plan a trip. What would you like to book? Say book a hotel, book a car or book a flight";
const welcomeReprompt = "Let me know how can i help you. Say book a hotel, book a car or book a flight";


exports.intro = function(obj){
	console.log("in new intro");
	if (obj.event.session.user.accessToken == undefined) {

	      obj.emit(':tellWithLinkAccountCard','to start using obj skill, please use the companion app to authenticate on Amazon');

	            return;

	        }
	var amznProfileURL = 'https://api.amazon.com/user/profile?access_token=';

    amznProfileURL += obj.event.session.user.accessToken;
    obj.attributes['state'] = 'launch';
        
    request(amznProfileURL, function(error, response, body) {
        if (response.statusCode == 200) {

            var profile = JSON.parse(body);
            console.log(profile.name);
            obj.emit(':ask', "Hello " + profile.name +", " + welcomeOutput, welcomeReprompt);  

        } else {

            obj.emit(':tell', "Hello, I can't connect to Amazon Profile Service right now, try again later");

        }

    }.bind(obj));
	console.log("intro done");

} 