/**
 * http://usejsdoc.org/
 */
const request=require('request');

exports.getflights=function(origin,destination,date){

	var textpromt="Flights from "+origin+" to "+destination+" are:";
    var myJSONObject={"src":origin,
    		"input":destination
    		};
    request({
	    url: "http://Sample-env.3ypbe4xuwp.us-east-1.elasticbeanstalk.com/fly",
	    method: "POST",
	    json: true,   // <--Very important!!!
	    body: myJSONObject
	}, function (error, response, body){
		 console.log("res"+response);
		if (!error && response.statusCode == 200) {
           // console.log("res"+JSON.parse(response));
            console.log("place"+JSON.stringify(response));
            
            for(var i=0;i<response.body.fltinfo.length-1;i++)
            	{
            	textpromt=textpromt+"Option "+i+1+":";
            	textpromt=textpromt+response.body.fltinfo[i].airline+" flight number "+response.body.fltinfo[i].flightNum+".";
            	textpromt=textpromt+"At "+response.body.fltinfo[i].deptTime+" from "+response.body.fltinfo[i].deptAirportCode+" gate "+response.body.fltinfo[i].deptGate+".";
            	textpromt=textpromt+"Price for the ticket is"+response.body.fltinfo[i].totalprice+".";
            	}
            
            console.log("textprompt"+textpromt);
            return textpromt;
            //res.send(response);
        }
		else
			{
			console.log("error"+response+error);
			textpromt="error";
            return textpromt;

			//res.send("error");
			}
	});
}
