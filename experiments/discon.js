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

showSlide("instructions");

var categories = ["vehicles", "hats", "fruits"]
//var distributions = [[2, 2, 2], [3, 2, 1], [3, 1, 2], [4, 1, 1]]
var nInputs = 6
var nTrials = 3
var slides = [1, 2, 3, 4, 5, 6, "choice"]

var vehiclesF = ["car", "truck", "bike", "firetruck", "golfcart", "scooter"]
var fruitsF = ["pineapple", "apple", "banana", "grapes", "orange", "pear"]
var hatsF = ["fancyhat", "tophat", "cap", "fedora", "strawhat", "witchhat"]

var vehiclesN = ["moped"]
var fruitsN = ["pomegranate"]
var hatsN = ["gradcap"]

var experiment = {
    categories: shuffle(categories),
    //distributions: shuffle(distribution),
    nInputs: nInputs, 
    nTrials: nTrials,
    slides: slides,


    vehiclesF: shuffle(vehiclesF),
    fruitsF: shuffle(fruitsF),
    hatsF: shuffle(hatsF),

    vehiclesN: shuffle(vehiclesN),
    fruitsN: shuffle(fruitsN),
    hatsN: shuffle(hatsN),

    position: [], 

    targetCategory: "",

    train : function () {
        if (experiment.slides[0] == "choice") {
            experiment.choice();
            return;
        } 

        if(experiment.slides[0] == 1) {
            experiment.targetCategory = experiment.categories[0];
            experiment.categories.shift();
        }

        experiment.position = shuffle([experiment.vehiclesF[0], experiment.fruitsF[0], experiment.hatsF[0]]);

        showSlide("input"); 

        sourceRightItem("images/" + experiment.position[0] + ".png");
        showRightItem();

        sourceMiddleItem("images/" + experiment.position[1] + ".png");
        showMiddleItem();

        sourceLeftItem("images/" + experiment.position[2] + ".png");
        showLeftItem();

        experiment.vehiclesF.shift();
        experiment.fruitsF.shift();
        experiment.hatsF.shift();

        experiment.slides.shift();

        $(".item_l").click(experiment.train);
        $(".item_m").click(experiment.train); 
        $(".item_r").click(experiment.train); 
    },

    choice : function () {
        experiment.position = shuffle([experiment.vehiclesN[0], experiment.fruitsN[0], experiment.hatsN[0]]);

        showSlide("input"); 

        sourceRightItem("images/" + experiment.position[0] + ".png");
        showRightItem();

        sourceMiddleItem("images/" + experiment.position[1] + ".png");
        showMiddleItem();

        sourceLeftItem("images/" + experiment.position[2] + ".png");
        showLeftItem();

        $(".item_l").click(function() {
            showSlide("finished");
        })
        $(".item_m").click(function() {
            showSlide("finished");
        })
        $(".item_r").click(function() {
            showSlide("finished");
        })
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