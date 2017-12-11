const request=require('request');
var speechText = "";
var speechTextReprompt = "";
var profile={};

exports.tellBookingIntent = function(){
    this.attributes['state'] = 'show_booking_started';
        
           
            profile=this.attributes['profile'];
            profileObject={"email":profile.email};
            console.log(profile.email);
            request({
            url: "http://ainuco.ddns.net:4324/tellBooking",
            method: "POST",
            json: true,   // <--Very important!!!
            body: profileObject
               }, function (error, response, body){
             	  console.log("inside tell booking request : ");
                      console.log("res"+JSON.stringify(response));
                       if (!error && response.statusCode == 200) {
                    	   	  console.log(" show booking body "+ body);
                    	   	  console.log(body["speechText"]);
                           speechText += body["speechText"]+" , If you want to book new trip say Book a flight, Book a Hotel or Book a Car";
                           speechTextReprompt=speechText;
                           this.attributes['state'] = 'launch';
             	          this.emit(':ask',speechText, speechTextReprompt);
                       }
                   else
                   {
                       speechText = "snippets.ERROR";
                       repromptText = "snippets.ERROR"; 
                       this.emit(':ask', speechText, repromptText);
                   }
               }.bind(this));


        } 