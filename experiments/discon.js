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
    $(".agent_transition").hide();
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

function background(x) {
    document.getElementById("background").src=x;
}

function background2(x) {
    document.getElementById("background2").src=x;
}

function pause(id,time){
    $("#"+id).hide();
    setTimeout(function() {
        $("#"+id).show();    
    }, time); 
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

var trialType = shuffle([0, 1])

var currTrialType = trialType[0];

var backgrounds = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])

var vehiclesF = shuffle(["car", "truck", "train", "bus", "airplane", "boat"])
var fruitsF = shuffle(["strawberry", "apple", "banana", "grapes", "orange", "melon"])
var mammalsF = shuffle(["dog", "cat", "horse", "bear", "cow", "monkey"])
var containersF = shuffle(["bottle", "cup", "bowl", "box", "plate", "glass"])
var furnitureF = shuffle(["bed", "chair", "table", "closet", "drawer", "sofa", "lamp"])
var clothesF = shuffle(["shoes", "socks", "pants","shirt", "jacket", "dress"])

var vehiclesN = ["N_vehicles"]
var fruitsN = ["N_fruits"]
var mammalsN = ["N_mammals"]
var containersN = ["N_containers"]
var furnitureN = ["N_furniture"]
var clothesN = ["N_clothes"]

var allFamiliar = {
    vehicles: vehiclesF,
    fruits: fruitsF,
    mammals: mammalsF,
    containers: containersF,
    funiture: furnitureF,
    clothes: clothesF
}

var allNovel = {
    vehicles: vehiclesN,
    fruits: fruitsN,
    mammals: mammalsN,
    containers: containersN,
    funiture: furnitureN,
    clothes: clothesN
}

// map of category names to category arrays
var orderedFamiliar = shuffleProperties(allFamiliar);

var orderedNovel = shuffleProperties(allNovel);

var categoryNames = getKeys(orderedFamiliar);

//names of all possible targets, also orderedTargetNames1
var posTargetNames = shuffle(categoryNames);

//arrays of all possible targets, in order
var targetsF = new Array();

for (var nTarget = 0; nTarget < posTargetNames.length; nTarget++) {
    targetsF.push(orderedFamiliar[posTargetNames[nTarget]].slice())
    shuffle(targetsF[nTarget]);
}

var targetsF2 = new Array();

var posTargetNames2 = posTargetNames.slice();

var orderedTargetNames2 = new Array();

for (nTarget = 0; nTarget < posTargetNames.length; nTarget++) {
    if(posTargetNames2[0] != posTargetNames[nTarget]) {
        targetsF2.push(orderedFamiliar[posTargetNames2[0]].slice());
        shuffle(targetsF2[nTarget]);
        orderedTargetNames2.push(posTargetNames2[0]);
        //remove first category
        posTargetNames2.splice(0, 1);
        posTargetNames2 = shuffle(posTargetNames2);
    } else {
        nTarget--;
        posTargetNames2 = shuffle(posTargetNames2);
    }
}

var targetsF3 = new Array();

var posTargetNames3 = posTargetNames.slice();

var orderedTargetNames3 = new Array();

for (nTarget = 0; nTarget < posTargetNames.length; nTarget++) {
    if(posTargetNames3[0] != posTargetNames[nTarget] 
       && posTargetNames3[0] != orderedTargetNames2[nTarget]){
        targetsF3.push(orderedFamiliar[posTargetNames3[0]].slice());
        shuffle(targetsF3[nTarget]);
        orderedTargetNames3.push(posTargetNames3[0]);
        //remove first category
        posTargetNames3.splice(0, 1);
        posTargetNames3 = shuffle(posTargetNames3);
    } else {
        nTarget--;
        posTargetNames3 = shuffle(posTargetNames3);
    }
}

// array of category names for each trial, to create trainingDist
// [[3 cats used in trial 1], [3 cats used in trial 2], ...]
var trialTargets = new Array();

for (var nTrial = 0; nTrial < trials.length; nTrial++) {
    trialTargets.push([]);
    trialTargets[nTrial].push(posTargetNames[nTrial]);
    trialTargets[nTrial].push(orderedTargetNames2[nTrial]);
    trialTargets[nTrial].push(orderedTargetNames3[nTrial]);
}

var trialNovelItems = new Array();
//assuming 1 novel item for a category
for (nTrial = 0; nTrial < trials.length; nTrial++) {
    trialNovelItems.push([]);
    trialNovelItems[nTrial].push(orderedNovel[trialTargets[nTrial][0]][0]);
    trialNovelItems[nTrial].push(orderedNovel[trialTargets[nTrial][1]][0]);
    trialNovelItems[nTrial].push(orderedNovel[trialTargets[nTrial][2]][0]);
}

var trialFamiliarItems = new Array();

for (nTrial = 0; nTrial < trials.length; nTrial++) {
    var familiarItemsMap = new Map();
    familiarItemsMap.set(trialTargets[nTrial][0], targetsF[nTrial]);
    familiarItemsMap.set(trialTargets[nTrial][1], targetsF2[nTrial]);
    familiarItemsMap.set(trialTargets[nTrial][2], targetsF3[nTrial]);
    trialFamiliarItems.push(familiarItemsMap);
}

//var posDist = shuffle([[4, 1, 1], [2, 2, 2], [4, 1, 1]]);
var posDist = shuffle([[5, 1, 0], [2, 2, 2]]);

//distribution for each trial
var trainingDist = new Array();

for (var i=0; i < trials.length; i++) {
    trainingDist.push([]);
    for (var j=0; j < posDist[i].length; j++) {
        for (var k=0; k < posDist[i][j]; k++) {
            trainingDist[i].push(trialTargets[i][j]);
        }
    }
    shuffle(trainingDist[i]);
}

var posAgents = shuffle(["Bear", "Beaver", "Bunny", "Cat", "Dog", "Elephant", "Frog", "Monkey", "Mouse", "Pig", "Sheep", "Tiger"])

var trainingAgents = new Array();
for (var m=0; m < trials.length; m++) {
    trainingAgents.push(posAgents[m]);
}

var experiment = {
    slides: slides.slice(),
    trials: trials,
    currTrialType: currTrialType,

    targetsF: targetsF, 
    targetsF2: targetsF2,
    targetsF3: targetsF3,

    trialTargets: trialTargets,
    trialNovelItems: trialNovelItems,
    trialFamiliarItems: trialFamiliarItems,

    posDist: posDist,
    trainingDist: trainingDist,

    trainingAgents: trainingAgents,
    backgrounds: backgrounds,

    position: [], 

    data: [], 

    introAll: function() {
        showSlide("introAll");
        // arbitrary
        if (experiment.currTrialType == 0) { 
            document.getElementById("text_introAll").innerHTML = "These little animals will ask you for some things. You can give them the things by clicking on them. First, they will ask for things you already know the names for. Later, there will be new things for which you don't know the names. Try your best to find out what the animals want.";
            // preference
        } else {
            document.getElementById("text_introAll").innerHTML = "These little animals like to play with their favorite things. There are always 3 things, and the animal will tell you which one is their favorite. You can give them their favorite things by clicking on them. First, they will ask for things you already know the names for. Later, there will be new things for which you don't know the names. Try your best to find out what the animals want.";
        }
    },

    intro: function () {
        background2("images/backgrounds/back" + backgrounds[0] + ".jpg");

        showSlide("transition");

        showAgent(trainingAgents[trials[0]], "transition");

        document.getElementById("text_intro").innerHTML = "Hi, I'm " + trainingAgents[trials[0]] + ". Let's play a game!";

        document.getElementById("text_transition").innerHTML = "";

        $(".agent_transition").click(experiment.train);  
    },

    train : function () {
        
        document.getElementById("next-input").style.visibility = 'hidden';        
        document.getElementById("next-novel").style.visibility = 'hidden';
        
        $(".agent_transition").unbind("click");

        if (experiment.slides[0] == "choice") {
            experiment.choice();
            return;
        }

        experiment.position = shuffle([experiment.targetsF[0][0], experiment.targetsF2[0][0], experiment.targetsF3[0][0]]);

        background("images/backgrounds/back" + backgrounds[0] + ".jpg");

        showSlide("input");

        document.getElementById("text_correctItem").innerHTML = "Let's see...";

        showAgent(trainingAgents[trials[0]], "straight");

        sourceLeftItem("images/" + experiment.position[0] + ".png");
        showLeftItem();

        sourceMiddleItem("images/" + experiment.position[1] + ".png");
        showMiddleItem();

        sourceRightItem("images/" + experiment.position[2] + ".png");
        showLeftItem();

        // pause for 2s before "next" button appears.
        setTimeout(function() {
            document.getElementById("next-input").style.visibility = 'visible';
        }, 2000);
    },

    train2 : function() {
        // correct item appears next to agent
        // arbitrary
        var correctCategory = trialFamiliarItems[trials[0]].get(trainingDist[trials[0]][0]);
        var correctItem = correctCategory[0];
        
        // arbitrary
        if (experiment.currTrialType == 0) { 
            document.getElementById("text_correctItem").innerHTML = correctItem;  
        // preference
        } else {
            document.getElementById("text_correctItem").innerHTML = "Oh cool, can you give me the " + correctItem + "?";
        }

        //        sourceSound("sounds/" + correctItem + ".mp3");
        //        playSound();

        $(".item").click(function() {
            var clickedItem = event.target;

            var pickId = event.target.id;

            if(pickId == "item_r") {
                var pick = experiment.position[0];
            } else if(pickId == "item_m") {
                var pick = experiment.position[1];
            } else if (pickId == "item_l") {
                var pick = experiment.position[2];
            }

            // compare to correct item of input
            if (pick == correctItem) {
                var correct_item = 1;
            } else {
                var correct_item = 0;
            }

            $(".item").unbind("click");
            clickedItem.style.border = '5px solid blue';

            data = {
                experiment: "distribution",
                phase: "training",
                agent: trainingAgents[trials[0]],
                slide: experiment.slides[0],
                trial: trials[0] + 1,
                trialType: currTrialType,

                distribution: posDist[trials[0]],
                target1: trialTargets[trials[0]][0],
                target2: trialTargets[trials[0]][1],
                target3: trialTargets[trials[0]][2],

                item_l: experiment.position[0],
                item_m: experiment.position[1],
                item_r: experiment.position[2],

                correctItem: correctItem,
                pick: pick,
                pickPos: pickId,
                correct_item: correct_item
            }

            experiment.data.push(data);

            experiment.targetsF[0].shift();
            experiment.targetsF2[0].shift();
            experiment.targetsF3[0].shift();

            experiment.trainingDist[trials[0]].shift();

            experiment.slides.shift();

            setTimeout(function() {
                clickedItem.style.border = '0px';
                experiment.train();
            }, 1500);
        });
    },

    choice : function () {
        document.getElementById("next-input").style.visibility = 'hidden';
        document.getElementById("next-novel").style.visibility = 'hidden';
        
        background("images/backgrounds/back" + backgrounds[0] + ".jpg");

        experiment.position = shuffle([experiment.trialNovelItems[0][0], experiment.trialNovelItems[0][1], experiment.trialNovelItems[0][2]]);

        showSlide("input"); 
        showAgent(trainingAgents[trials[0]], "straight");

        document.getElementById("text_correctItem").innerHTML = "Oh... Here are some new ones.";

        sourceLeftItem("images/" + experiment.position[0] + ".png");
        showRightItem();

        sourceMiddleItem("images/" + experiment.position[1] + ".png");
        showMiddleItem();

        sourceRightItem("images/" + experiment.position[2] + ".png");
        showLeftItem();
        
        // pause for 2s before "next" button appears.
        setTimeout(function() {
            document.getElementById("next-novel").style.visibility = 'visible';
        }, 2000);
    },

    choice2 : function() {
        document.getElementById("text_correctItem").innerHTML = "Here are some new ones. Can you give me the dax?";
        
        $(".item").click(function() {
            var clickedItem = event.target;

            var pickId = event.target.id;

            if(pickId == "item_r") {
                var pick = experiment.position[0];
            } else if(pickId == "item_m") {
                var pick = experiment.position[1];
            } else if (pickId == "item_l") {
                var pick = experiment.position[2];
            }

            var pickCat = pick.substring(2);

            // compare to 1st target
            if (pickCat == trialTargets[trials[0]][0]) {
                var correct_target1 = 1;
            } else {
                var correct_target1 = 0;
            }

            // compare to 2nd target
            if (pickCat == trialTargets[trials[0]][1]) {
                var correct_target2 = 1;
            } else {
                var correct_target2 = 0;
            }

            $(".item").unbind("click");
            clickedItem.style.border = '5px solid blue';

            data = {
                experiment: "distribution",
                phase: "novel",
                agent: trainingAgents[trials[0]],
                slide: experiment.slides[0],
                trial: trials[0] + 1,
                trialType: currTrialType,

                distribution: posDist[trials[0]],
                target1: trialTargets[trials[0]][0],
                target2: trialTargets[trials[0]][1],
                target3: trialTargets[trials[0]][2],

                item_l: experiment.position[0],
                item_m: experiment.position[1],
                item_r: experiment.position[2],

                pick: pick,
                pickPos: pickId,
                pickCat: pickCat, 
                correct_target1: correct_target1,
                correct_target2: correct_target2,
            }
            experiment.data.push(data);

            setTimeout(function() {
                clickedItem.style.border = '0px';
                experiment.transition();
            }, 1500);
        });
    },

    transition: function() {
        background2("images/backgrounds/back" + backgrounds[0] + ".jpg");

        showSlide("transition");
        showAgent(trainingAgents[trials[0]], "transition");

        document.getElementById("text_intro").innerHTML = "";

        document.getElementById("text_transition").innerHTML = "Thank you for playing with me!";

        experiment.trials.shift();

        if (experiment.trials.length == 0) {
            setTimeout(function() { turk.submit(experiment) }, 0);
            showSlide("finished");
            return;
        }

        experiment.targetsF.shift();
        experiment.targetsF2.shift();
        experiment.targetsF3.shift();

        experiment.trialNovelItems.shift();

        experiment.backgrounds.shift();

        experiment.slides = slides;

        $(".agent_transition").click(experiment.intro); 
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