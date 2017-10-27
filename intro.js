
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