const request=require('request');
const speechText = "";
const speechTextReprompt = "";
var profile={};

exports.tellBookingIntent = function(){
    this.attributes['state'] = 'show_booking_started';
        
            console.log(profile.name);
            profile=this.attributes['profile'];
            request({
            url: "http://ainuco.ddns.net:4324/tellBooking",
            method: "POST",
            json: true,   // <--Very important!!!
            body: profile.email
               }, function (error, response, body){
             	  console.log("inside tell booking request : ");
                      // console.log("res"+JSON.stringify(response));
                       if (!error && response.statusCode == 200) {
                           //console.log("place"+JSON.stringify(body));
                           var bookingInfo = body.bookings;
                           speechText += bookingInfo+" , If you want to book new trip say Book a flight, Book a Hotel or Book a Car";
                          
                           
                           var bookingObject=body.bookingObject;
                           this.attributes['bookingObject']=bookingObject;
                           
                           console.log(speechText);
                           var repromptText = "For instructions on what you can say, please say help me.";	    	                	         	    	                	          
             	          this.attributes['state']='show_booking_complete';
             	          this.event.request.dialogState = "STARTED";	
             	          console.log(this.attributes);
             	          console.log("dialog state is "+this.event.request.dialogState);
             	        //say the results    	    	    
             	          console.log(this.attributes);
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