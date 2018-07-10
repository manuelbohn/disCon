// preload - not really sure how this works
var preFruits = ["duck.png","car.png","bear.png","ball.png","t1.png", "t2.png", "t3.png", "t4.png", "t5.png", "t6.png", "t7.png", "t8.png", "t9.png", "t10.png", "t11.png", "t12.png", "t13.png", "t14.png", "t15.png", "t16.png", "t17.png", "t18.png","back1.jpg","back2.jpg","back3.jpg","back4.jpg","back5.jpg","back6.jpg","back7.jpg","back8.jpg","back9.jpg","empty.png"];

//for critical trials and fillers
var images = new Array();
for (i = 0; i < preFruits.length; i++) {
	images[i] = new Image();
	images[i].src = "images/" + preFruits[i];
}

var preVehiclesF = ["bicycle.jpg", "car.png", "firetruck.png", "golfcart.png", "scooter.jpg", "truck.png"];

var vehiclesF = new Array();
for (i = 0; i < preVehiclesF.length; i++) {
    vehiclesF[i] = new Image();
    vehiclesF[i].src = "images/categories/vehicles/familiar" + preVehiclesF[i];
}

var preVehiclesN = ["moped.png"];

var vehiclesN = new Array();
for (i = 0; i < preVehiclesN.length; i++) {
    vehiclesN[i] = new Image();
    vehiclesN[i].src = "images/categories/vehicles/novel" + preVehiclesN[i];
}

var preHatsF = ["cap.jpg", "fancyhat.png", "fedora.jpg", "sunhat.jpg", "tophat.png", "witchhat.png"];

var hatsF = new Array();
for (i = 0; i < preHatsF.length; i++) {
    vehiclesF[i] = new Image();
    vehiclesF[i].src = "images/categories/hats/familiar" + preHatsF[i];
}

var preHatsN = ["gradcap.jpg"];

var hatsN = new Array();
for (i = 0; i < preHatsN.length; i++) {
    hatsN[i] = new Image();
    hatsN[i].src = "images/categories/hats/novel" + preHatsN[i];
}

var preFruitsF = ["apple.png", "banana.png", "grapes.png", "orange.jpg", "pear.png", "pineapple.png"];

var fruitsF = new Array();
for (i = 0; i < preFruitsF.length; i++) {
    fruitsF[i] = new Image();
    fruitsF[i].src = "images/categories/fruits/familiar" + preFruitsF[i];
}

var preFruitsN = ["pomegranate.jpg"];

var fruitsN = new Array();
for (i = 0; i < preFruitsN.length; i++) {
    fruitsN[i] = new Image();
    fruitsN[i].src = "images/categories/fruits/novel" + preFruitsN[i];
}

var preSounds = ["Frog_choice.mp3", "Mouse_choice.mp3", "Bear_choice.mp3", "Beaver_choice.mp3", "Monkey_choice.mp3", "Dog_choice.mp3", "Cat_choice.mp3", "Bunny_choice.mp3", "Tiger_choice.mp3", "Sheep_choice.mp3","Pig_choice.mp3","Elephant_choice.mp3","Frog_hello.mp3", "Mouse_hello.mp3", "Bear_hello.mp3", "Monkey_hello.mp3", "Dog_hello.mp3", "Cat_hello.mp3", "Bunny_hello.mp3", "Tiger_hello.mp3", "Sheep_hello.mp3","Pig_hello.mp3","Elephant_hello.mp3", "Beaver_hello.mp3"];
//for critical trials and fillers
var sound = new Array();
for (i = 0; i < preSounds.length; i++) {
	sound[i] = new Audio();
	sound[i].src = "sound/" + preSounds[i];
}

// ## Helper functions

function showSlide(id) {
  // Hide all slides
	$(".slide").hide();
	// Show just the slide we want to show
	$("#"+id).show();
}

function showText(id) {
	$(".text").hide();
	$("#"+id).show();
}

function showAgent(id, orient) {
	$(".agent").hide();
    $(".point_agent_l").hide();
    $(".point_agent_r").hide();
	$("#"+id+"_"+orient).show();
}

function hideAgent() {
	$(".agent").hide();
}


function choiceAgent(id) {
	$(".agent").hide();
	$("#"+id+"_choice").show();
}

function sourceRightItem(a) {
        document.getElementById("item_r").src=a;
    };

function sourceMiddleItem(b) {
        document.getElementById("item_m").src=b;
    };

function sourceLeftItem(b) {
        document.getElementById("item_l").src=b;
    };

function showRightItem() {
    document.getElementById('item_r').style.visibility='visible';
      };

function hideRightItem() {
    document.getElementById('item_r').style.visibility='hidden';
      };

function showMiddleItem() {
    document.getElementById('item_m').style.visibility='visible';
      };

function hideMiddleItem() {
    document.getElementById('item_m').style.visibility='hidden';
      };

function showLeftItem() {
    document.getElementById('item_l').style.visibility='visible';
      };

function hideLeftItem() {
    document.getElementById('item_l').style.visibility='hidden';
      };

function showEat(id) {
	$(".agent_eat").hide();
	$("#"+id+"_eat").show();
};

function choiceLeftItem(a) {
        document.getElementById("choiceItem_l").src=a;
    };

function choiceMiddleItem(a) {
        document.getElementById("choiceItem_m").src=a;
    };

function choiceRightItem(a) {
        document.getElementById("choiceItem_r").src=a;
    };

function getTime1() {
    return startTime = (new Date()).getTime();
};

// Get a random integer less than n.
function randomInteger(n) {
	return Math.floor(Math.random()*n);
};

function randomElement(array) {
  return array[randomInteger(array.length)];
};

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}


function background(x) {
        document.getElementById("background").src=x;
    };

function background2(x) {
        document.getElementById("background2").src=x;
    };


function sourceSound(c) {
        document.getElementById("sound").src=c;
    };
function playSound() {
    document.getElementById("sound").play();
      };



  function pause(id,time){
      $("#"+id).hide();
      setTimeout(function() {
           $("#"+id).show();    
       }, time); 
    };

var distribution = [[2, 2, 2], [3, 1, 2], [3, 2, 1], [4, 1, 1]];

var nInput = 6;

showSlide("instructions");

var experiment {
    chosenCategory: chosenCategory,
    distribution: distribution,
    
    for (i=0, i<nInput, i++) {
        train: function() {
            showSlide("input");
            
        }
    }
    
        
    trainingDot: function() {
		
    function createDot(dotx, doty, i) {
	   var dots = [1, 2, 3, 4, 5];

	   var dot = document.createElement("img");
	   dot.setAttribute("class", "dot");
	   dot.id = "dot_" + dots[i];
	   dot.src = "dots/dot_" + dots[i] + ".jpg";

	   var x = Math.floor(Math.random() * 850);
	   var y = Math.floor(Math.random() * 550);

	   var invalid = "true";
	//make sure dots do not overlap
	   while (true) {  
		invalid = "true";
		for (j = 0; j < dotx.length; j++) {
			if (Math.abs(dotx[j] - x) + Math.abs(doty[j] - y) < 200) {
				var invalid = "false";
				break;
			}
		}
		if (invalid === "true") {
			dotx.push(x);
			doty.push(y);
			break;
		}
		x = Math.floor(Math.random() * 400);
		y = Math.floor(Math.random() * 400);
	}

	dot.setAttribute("style", "position:absolute;left:" + x + "px;top:" + y + "px;");

	trainingDot.appendChild(dot);
};

        var allDots = ["dot_1", "dot_2", "dot_3", "dot_4", "dot_5"];

		var xcounter = 0;
		var dotCount = 5;

		var dotx = [];
		var doty = [];

		for (i = 0; i < dotCount; i++) {
			createDot(dotx, doty, i, "");
		}

		showSlide("trainingDot");
		$('.dot').bind('click touchstart', function(event) {

			var dotID = $(event.currentTarget).attr('id');

			//only count towards completion clicks on dots that have not yet been clicked
			if (allDots.indexOf(dotID) === -1) {
				return;
			}
			allDots.splice(allDots.indexOf(dotID), 1);
			document.getElementById(dotID).src = "dots/x.jpg";
			xcounter++
			if (xcounter === dotCount) {
				trainingDot.removeChild(dot_1);
				trainingDot.removeChild(dot_2);
				trainingDot.removeChild(dot_3);
				trainingDot.removeChild(dot_4);
				trainingDot.removeChild(dot_5);

				setTimeout(function() {
					$("#trainingDot").hide();
					setTimeout(function() {
						showSlide("dotGame");
					}, 500);
				}, 500);
			}
		};
	} 
}
