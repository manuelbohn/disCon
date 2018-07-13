function showSlide(id) {
    // Hide all slides
    $(".slide").hide();
    // Show just the slide we want to show
    $("#"+id).show();
}

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function showAgent(id, orient) {
    $(".agent").hide();
    $("#"+id+"_"+orient).show();
}

function sourceRightItem(a) {
    document.getElementById("item_r").src=a;
}

function showRightItem() {
    document.getElementById('item_r').style.visibility='visible';
}

function hideRightItem() {
    document.getElementById('item_r').style.visibility='hidden';
}

function sourceMiddleItem(a) {
    document.getElementById("item_m").src=a;
}

function showMiddleItem() {
    document.getElementById('item_m').style.visibility='visible';
}

function hideMiddleItem() {
    document.getElementById('item_m').style.visibility='hidden';
}

function sourceLeftItem(a) {
    document.getElementById("item_l").src=a;
}

function showLeftItem() {
    document.getElementById('item_l').style.visibility='visible';
}

function hideLeftItem() {
    document.getElementById('item_l').style.visibility='hidden';
}

//sound.find(function (obj){return obj.id == agents[0]+"_hello.mp3"}).play() 

function sourceSound(c) {
    document.getElementById("sound").src=c;
}

function playSound() {
    document.getElementById("sound").play();
}


function shuffleProperties(obj) {
    var new_obj = {};
    var keys = getKeys(obj);
    shuffle(keys);
    for (var key in keys){
        if (key == "shuffle") continue; // skip our prototype method
        new_obj[keys[key]] = obj[keys[key]];
    }
    return new_obj;
}

function getKeys(obj){
    var arr = new Array();
    for (var key in obj)
        arr.push(key);
    return arr;
}

showSlide("instructions");

var slides = [1, 2, 3, 4, 5, 6, "choice"]

var trials = [0, 1]

var vehiclesF = shuffle(["car", "truck", "bike", "firetruck", "golfcart", "scooter"])
var fruitsF = shuffle(["pineapple", "apple", "banana", "grapes", "orange", "pear"])
var hatsF = shuffle(["fancyhat", "tophat", "cap", "fedora", "strawhat", "witchhat"])
var buildingsF = shuffle(["apartment", "bakery", "church", "hospital", "restaurant", "house"])
var instrumentsF = shuffle(["piano", "guitar", "trumpet", "violin", "drum", "flute"])
var shoesF = shuffle(["flipflops", "sneakers", "highheels","boots", "sandals", "rollerskates"])

var vehiclesN = ["moped"]
var fruitsN = ["pomegranate"]
var hatsN = ["gradcap"]
var buildingsN = ["pagoda"]
var instrumentsN = ["xylophone"]
var shoesN = ["balletshoes"]

var allCategories = {
    vehicles: vehiclesF,
    fruits: fruitsF,
    hats: hatsF,
    buildings: buildingsF,
    instruments: instrumentsF,
    shoes: shoesF
}

// map of category names to category arrays
var orderedCategories = shuffleProperties(allCategories);

var categoryNames = getKeys(orderedCategories);

// array of arrays of category names for each trial
var posTarget = [shuffle([categoryNames[0], categoryNames[1], categoryNames[2]]), shuffle([categoryNames[3], categoryNames[4], categoryNames[5]])];

// array of chosen target for each trial 
var targetNames = [posTarget[0][0], posTarget[1][0]];

var slot1 = [orderedCategories[categoryNames[0]], orderedCategories[categoryNames[3]]];
var slot2 = [orderedCategories[categoryNames[1]], orderedCategories[categoryNames[4]]];
var slot3 = [orderedCategories[categoryNames[2]], orderedCategories[categoryNames[5]]];

var allTargets = {
    vehicles: vehiclesN,
    fruits: fruitsN,
    hats: hatsN,
    buildings: buildingsN,
    instruments: instrumentsN,
    shoes: shoesN
}

var orderedTargets = shuffleProperties(allTargets);

var targetObjects = [orderedTargets[categoryNames[0]], orderedTargets[categoryNames[1]], orderedTargets[categoryNames[2]], orderedTargets[categoryNames[3]], orderedTargets[categoryNames[4]], orderedTargets[categoryNames[5]], orderedTargets[categoryNames[6]]];

var slot1N = [targetObjects[0], targetObjects[3]];
var slot2N = [targetObjects[1], targetObjects[4]];
var slot3N = [targetObjects[2], targetObjects[5]];

var posDist = shuffle([[4, 1, 1], [2, 2, 2]]);

//distribution for each trial
var trainingDist = new Array();

for (var i=0; i < posDist.length; i++) {
    trainingDist.push([]);
    for (var j=0; j < posDist[i].length; j++) {
        for (var k=0; k < posDist[i][j]; k++) {
            trainingDist[i].push(posTarget[i][j]);
        }
    }
    shuffle(trainingDist[i]);
}

var posAgents = shuffle(["Bear", "Beaver", "Bunny", "Cat", "Dog", "Elephant", "Frog", "Monkey", "Mouse", "Pig", "Sheep", "Tiger"])

var trainingAgents = new Array();
for (var m=0; m < posDist.length; m++) {
    trainingAgents.push(posAgents[m]);
}

var experiment = {
    slides: slides,

    slot1: slot1,
    slot2: slot2,
    slot3: slot3,

    slot1N: slot1N, 
    slot2N: slot2N,
    slot3N: slot3N,

    // to record data - I don't think this actually used in the code
    targetNames: targetNames,

    trainingDist: trainingDist,
    
    trainingAgents: trainingAgents,

    orderedTargets: orderedTargets,

    trials: trials,

    position: [], 

    train : function () {
        if (experiment.slides[0] == "choice") {
            experiment.choice();
            return;
        }

        experiment.position = shuffle([experiment.slot1[0][0], experiment.slot2[0][0], experiment.slot3[0][0]]);

        showSlide("input");
        
        showAgent(trainingAgents[trials[0]], "straight");
        
        sourceRightItem("images/" + experiment.position[0] + ".png");
        showRightItem();

        sourceMiddleItem("images/" + experiment.position[1] + ".png");
        showMiddleItem();

        sourceLeftItem("images/" + experiment.position[2] + ".png");
        showLeftItem();

        experiment.slot1[0].shift();
        experiment.slot2[0].shift();
        experiment.slot3[0].shift();

        experiment.trainingDist[trials[0]].shift();

        experiment.slides.shift();
        
        $(".item").click(function() {
            // also used to record what item has been chosen (clickItem.src)
            var clickedItem = event.target;
            $(".item").unbind("click");
            clickedItem.style.border = '5px solid blue';
            setTimeout(function() {
                clickedItem.style.border = '0px';
                experiment.train();
            }, 1500);
        });
    },

    choice : function () {
        experiment.position = shuffle([experiment.slot1N[0][0], experiment.slot2N[0][0], experiment.slot3N[0][0]]);

        showSlide("input"); 
        showAgent(trainingAgents[trials[0]], "straight");

        sourceRightItem("images/" + experiment.position[0] + ".png");
        showRightItem();

        sourceMiddleItem("images/" + experiment.position[1] + ".png");
        showMiddleItem();

        sourceLeftItem("images/" + experiment.position[2] + ".png");
        showLeftItem();
        
        $(".item").click(function() {
            // also used to record what item has been chosen (clickItem.src)
            var clickedItem = event.target;
            $(".item").unbind("click");
            clickedItem.style.border = '5px solid blue';
            setTimeout(function() {
                clickedItem.style.border = '0px';
                experiment.transition();
            }, 1500);
        });
    },

    transition: function() {
        showSlide("transition");
        showAgent(trainingAgents[trials[0]], "transition");
        
        setTimeout(function() {
            experiment.trials.shift();
            
            if (experiment.trials.length == 0) {
                showSlide("finished");
                return;
            }
            
            experiment.slot1.shift();
            experiment.slot2.shift();
            experiment.slot3.shift();

            experiment.slot1N.shift();
            experiment.slot2N.shift();
            experiment.slot3N.shift();

            //reset number of slides for each trial
            experiment.slides = [1, 2, 3, 4, 5, 6, "choice"];

            $(".agent").click(experiment.train); 
            }, 1500);
    },

    trainingDot : function () {
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
                for (var j = 0; j < dotx.length; j++) {
                    if (Math.abs(dotx[j] - x) + Math.abs(doty[j] - y) < 200) {
                        invalid = "false";
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
        }

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
        });
    },  
}