function showSlide(id) {
  // Hide all slides
	$(".slide").hide();
	// Show just the slide we want to show
	$("#"+id).show();
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

showSlide("instructions");

var experiment = { 
    train: function () {
        showSlide("input")
    }
};