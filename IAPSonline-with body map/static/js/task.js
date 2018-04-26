/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

//set the participant trial condition within the psiTurk API
var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to

if (mycondition == 19) {
	var stagePage = "stage_body.html";
} else {
	var stagePage = "stage.html";
}

// All pages to be loaded
var pages = [
	"instructions/instruct-ready.html",
	stagePage,
	"postquestionnaire.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	"instructions/instruct-ready.html"
];


/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested 
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and 
* insert them into the document.
*
********************/

/****************
* Questionnaire *
****************/

var Questionnaire = function() {

	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record_responses = function() {
		psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'submit'});
		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);		
		});
	};

	prompt_resubmit = function() {
		replaceBody(error_message);
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		replaceBody("<h1>Trying to resubmit...</h1>");
		reprompt = setTimeout(prompt_resubmit, 10000);
		psiTurk.saveData({
			success: function() {
				clearInterval(reprompt); 
				psiTurk.computeBonus('compute_bonus', function(){finish()}); 
			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet 
	psiTurk.showPage('postquestionnaire.html');
	psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'begin'});

};


/********************
* IAPSonline TEST       *
********************/
/////////////////////////////////
//set up variables and foundation for later functions
/////////////////////////////////
var bodymapImageFile = document.createElement('img');
bodymapImageFile.src = "/static/images/bodymap.png";
var imageStr = "";
var responseMade = false;
var curImage = 0;
var IAPSimageArray = ["1050.jpg", "1052.jpg", "1120.jpg", "1201.jpg", "1270.jpg", "1303.jpg", "1440.jpg", "1441.jpg", "1463.jpg", "1710.jpg", "1722.jpg", "2057.jpg", "2070.jpg", "2091.jpg", "2154.jpg", "2205.jpg", "2224.jpg", "2332.jpg", "2340.jpg", "2395.jpg", "2550.jpg", "2683.jpg", "2691.jpg", "2710.jpg", "2717.jpg", "2811.jpg", "3005.jpg", "3015.jpg", "3051.jpg", "3053.jpg", "3063.jpg", "3064.jpg", "3068.jpg", "3150.jpg", "3181.jpg", "3500.jpg", "4002.jpg", "4141.jpg", "4180.jpg", "4225.jpg", "4232.jpg", "4250.jpg", "4311.jpg", "4460.jpg", "4542.jpg", "4561.jpg", "4574.jpg", "4599.jpg", "4607.jpg", "4611.jpg", "4622.jpg", "4623.jpg", "4625.jpg", "4645.jpg", "4659.jpg", "4670.jpg", "4672.jpg", "4680.jpg", "4695.jpg", "5270.jpg", "5629.jpg", "5661.jpg", "5700.jpg", "5780.jpg", "5910.jpg", "6212.jpg", "6560.jpg", "6821.jpg", "7230.jpg", "7325.jpg", "7330.jpg", "7359.jpg", "7361.jpg", "7430.jpg", "7450.jpg", "7470.jpg", "7480.jpg", "8461.jpg", "8497.jpg", "9040.jpg", "9050.jpg", "9181.jpg", "9182.jpg", "9252.jpg", "9253.jpg", "9265.jpg", "9300.jpg", "9301.jpg", "9400.jpg", "9410.jpg", "9452.jpg", "9561.jpg", "9584.jpg", "9635.jpg", "9800.jpg", "9810.jpg", "A013.jpg", "A041.jpg", "A055.jpg", "A062.jpg", "A064.jpg", "A069.jpg", "A095.jpg", "A127.jpg", "H022.jpg", "H064.jpg", "H077.jpg", "H079.jpg", "P039.jpg", "P077.jpg", "P078.jpg", "P096.jpg"];
//the following line can be uncommented in order to provide a smaller image list for testing
//var IAPSimageArray = ["1050.jpg", "1441.jpg", "1463.jpg", "1710.jpg", "3068.jpg", "3150.jpg", "3181.jpg", "3500.jpg", "4002.jpg", "1120.jpg"];

var joinedArray = [];
function joinArrays(arrayA, arrayB) {
	for (var i=0; i<arrayA.length && i<arrayB.length; i++) {
    	joinedArray[i] = [arrayA[i], [arrayB[i]]];
	}
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex ;
  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

/////////////////////////////////
//set up functions for events and controls
/////////////////////////////////
var proceedStep = function(responseData) {
		//var alertNotification = "You just finished image " + (curImage + 1) + " (of " + IAPSimageArray.length + ")\n";
		if (mycondition == 18) {
			//immediacy slider
			//alertNotification = alertNotification + "You set the value of the immediacy slider to " + responseData + "\n";
			$("#immediacySlider").slider({value: 0});
		} else if (mycondition == 19) {
			//bodymap
			//alertNotification = alertNotification + "You set the value of the response slider to " + responseData + "\n";
		} else {
			//emotional response slider
			//alertNotification = alertNotification + "You set the value of the response slider to " + responseData + "\n";
			$("#responseSlider").slider({value: 50});
		}
		//alert(alertNotification);
		//record the response data on the client end
		psiTurk.recordTrialData({'imageNum':curImage, 'image':IAPSimageArray[curImage], 'response':responseData});
		psiTurk.saveData();
		curImage += 1;
		//move on to the next image or end
		if (curImage == IAPSimageArray.length) {
			//done with test
			psiTurk.showPage('postquestionnaire.html');
			currentview = new Questionnaire();
		} else {
			//keep going
			document.getElementById("curImage").style.backgroundImage = "url('static/images/IAPS/" + IAPSimageArray[curImage] + "')";
		}
};

/////////////////////////////////
//set up stage and start test
/////////////////////////////////
var IAPSonline = function() {
		var IAPSonlineTrialTypes = [
			"Rate the degree to which someone or something is <b>SUFFERING</b> in this image.",
			"How strongly do you want to <b>AVOID</b> seeing this image?",
			"How <b>ATTENTION-GRABBING</b> is this image?",
			"Rate how much this image makes you feel <b>DISGUST</b>.",
			"Rate how much this image makes you feel <b>ANGER</b>.",
			"Rate how much this image makes you feel <b>SADNESS</b>.",
			"Rate how much this image makes you feel <b>FEAR</b>.",
			"Rate how much this image makes you feel <b>JOY</b>.",
			"Rate how much this image makes you feel <b>SURPRISE</b>.",
			"Much does this image make you think of <b>CONTAMINATION</b> or <b>DISEASE</b>?",
			"How physically <b>THREATENED</b> do you feel by this image?",
			"How <b>INTENTIONAL</b> are the actions taking place in this image?",
			"How <b>PLEASANT</b> is this image?",
			"How <b>IMMORAL</b> are the events depicted in this image?",
			"Rate how much <b>EMPATHY</b> you feel for the people or animals in this image?",
			"How much do you sense that a <b>STORY</b> is beginning to unfold in this image?",
			"How <b>RELEVANT</b> is the scene of this image to your life?",
			"How <b>SOCIALLY ACCEPTABLE</b> are the events in this image?",
			"Rate on this scale of 0 to 60 seconds, when you think you felt emotion in response to seeing the image at your left.",
			"Indicate on the body map below where on your body, if at all, you feel the emotions elicited by this image. Click the 'X' button if you do not notice any feeling."
		];

		shuffle(IAPSimageArray);


/////////////////////////////////
// Start the test
/////////////////////////////////
		//$( window ).load(function() { });

		// Load the stage.html snippet into the body of the page
		psiTurk.showPage(stagePage);
		curImage = 0;
		document.getElementById("questionArea").innerHTML = IAPSonlineTrialTypes[mycondition];
		//get the first image
		document.getElementById("curImage").style.backgroundImage = "url('static/images/IAPS/" + IAPSimageArray[curImage] + "')";

};


// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() { currentview = new IAPSonline(); } // what you want to do when you are done with instructions
    );
});
