// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();
  

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
    requestAnimFrame( animate );
	var currentTime = new Date().getTime();
	if (mLastFrameTime === 0) {
		mLastFrameTime = currentTime;
	}

	if ((currentTime - mLastFrameTime) > mWaitTime) {
		swapPhoto();
		mLastFrameTime = currentTime;
	}
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/

// This function splits up the GET query paramaters and initializes them in pairs.
function getQueryParams(qs) {
    qs = qs.split("+").join(" ");
    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
}

var $_GET = getQueryParams(document.location.search);



// *** Initialize all global variables ***

// Overall index counter
var mCurrentIndex = 0;

// Sets up a XMLHttpRequest to import a file into our script
var mRequest = new XMLHttpRequest();

//Use this array to hold objects which contain the following:
//location, description, date and an actual Image element.
var mImages = [];

// Used as a temporay holder for our JSON file data
var mJson;

// Let's our script decide which JSON file to load
var mUrl = $_GET["json"] != undefined ? $_GET["json"] : 'images.json';

// The code block below is exactly the same as the code above.
/*
	var mURL;
	if ($_GET["json"] != undefined)	
		mUrl = $_GET["json"];
	else
		mUrl = 'images.json';
	
*/


// Our main swapPhoto function
function swapPhoto() {
	
	// Swap the photo and metadata
	swapPhotoHelper();
	
	// Logic for looping back to the 0th index if we're at the end of the array
	if (mCurrentIndex+1 < mImages.length){
		// If there are more array indicies, keep incrementing the counter
		mCurrentIndex++;
		console.log("Increment Counter");
	}
	else {
		// If we're at the end of the array, reset the counter to start back at 0
		mCurrentIndex = 0;
		console.log("Reset Counter");
	}
	
}

// This is the actual function that swaps the photo and metadata
function swapPhotoHelper() {
	
	// Show the current image info in the console.
	console.log('Showing image ' + (mCurrentIndex+1) + ' of ' + mImages.length + ".");
	
	// Replace the #photo container's img src so that the user sees a new image.
	$("#photo").attr("src", mImages[mCurrentIndex].img);
	
	// Replace each of the metadata info so the user sees the new text
	$(".location").text("Location: " + mImages[mCurrentIndex].location);
	$(".description").text("Description: " + mImages[mCurrentIndex].description);
	$(".date").text("Date: " + mImages[mCurrentIndex].date);
	
}


// This is the code to open up the JSON file, make it into a JS object, and split it up into mImages.
mRequest.onreadystatechange = function() {
	
		// Make sure we got the file without any errors
        if (mRequest.readyState == 4 && mRequest.status == 200) {
            
            // We can't be certain that the file is valid JSON, so let's try parsing it.
            try {
	            
	            // Parse and make the JSON file contents and put it into the JS mJson object.
                mJson = JSON.parse(mRequest.responseText);

				// Let's go through mJson, and split it up into smaller chunks.
                for (var i = 0; i < mJson.images.length; i++) {
	                
	                // This is the current instance we are working on
		        	var myLine = mJson.images[i];
		        	
		        	// Let's make a new GalleryImage (with 4 arguments) and add it to the mImages array
		        	mImages.push(new GalleryImage(myLine.imgLocation, myLine.description, myLine.date, myLine.imgPath));
		        	
		    	}
		    	// Print the contents of the mImages array to the console.
		    	console.log(mImages)

            } catch(err) {
                // There was an error parsing the JSON file (maybe it wasn't valid?). So fail.
                console.log(err.message + " in " + mRequest.responseText);
                return;
            }
        }
    };

// These two lines initiate the code block above.
mRequest.open("GET", mUrl, true);
mRequest.send();


// Wait until the page is done loading, then run (and wait for) the following.

$(document).ready( function() {

	// Initially hide all the extra metadata detail content.
	$('.details').eq(0).hide();
	
	// Add a click handler to the moreIndicator button
	$('img.moreIndicator').click(function() {
		
		if ( $(this).hasClass("rot270") ) {
			$(this).removeClass("rot270").addClass("rot90");
			$('.details').eq(0).fadeToggle("slow", "linear");
		}
		else {
			$(this).removeClass("rot90").addClass("rot270");
			$('.details').eq(0).fadeToggle("slow", "linear");
		}
		
	});
	
	// Add a click handler to the nextPhoto button
	$('#nextPhoto').click(function() {
		
		// Reset the script's timer so it doesn't swap the photo too soon.
		mLastFrameTime = 0;
		
		// Swap the photo using our function.
		swapPhoto();
			
	});
	
	// Add a click handler to the prevPhoto button
	$('#prevPhoto').click(function() {
		
		// Reset the script's timer so it doesn't swap the photo too soon.
		mLastFrameTime = 0;
		
		// Logic for looping back to the last index if we're at the 0th (first) index of the array
		if (mCurrentIndex == 0){
			// If we are at the beginning, set the counter for the last index of the array
			mCurrentIndex = mImages.length-1;
			
			console.log("Reset Counter");
		}
		else {
			// If we're not at the beginning, decrement the counter.
			mCurrentIndex -= 1;
			
			console.log("Decrement Counter");
		}
		
		// Swap the photo
		swapPhotoHelper();
			
	});
	
});


// This is our GalleryImage object constructor. It receives 4 parameters and assigns them to 4 local strings.
function GalleryImage(location, description, date, img) {

	this.location = location;
    this.description = description;
    this.date = date;
    this.img = img;
	
}
