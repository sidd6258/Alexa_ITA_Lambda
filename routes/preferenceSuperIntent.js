const request=require('request');

exports.preference = function(){
	
	 var preferencewelcomeOutput = "Which preference you want to update or view? you can say flight preferences, car preferences or hotel preferences";
	 var preferenceWelcomeReprompt = "you can say flight preferences, car preferences or hotel preferences";
	
		this.emit(':ask',preferencewelcomeOutput, preferenceWelcomeReprompt);  

}