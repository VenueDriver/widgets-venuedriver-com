///////////////////////////////////////////////////////////////////////////////
// Currently the plugin can be tested like:
// $('#divID').VenueDriverFormWidget();
///////////////////////////////////////////////////////////////////////////////
(function($){
	var form_data;
	var settings;
	var formDiv;

  $.fn.VenueDriverFormWidget = function(options) {
      var defaults = {
      		'form_type'   : 'GUESTLIST',		//GUESTLIST or RESERVATION
          'venue_split' : true,						//whether or not to display a separate drop-down for venues and events.
      };
			settings = $.extend(true, {}, defaults, options);

      return this.each(function() {
				formDiv = $(this);
      	// Draw the form and a loading indicator so that users see something during the API call.
        $(this).append("<div id='loading'><img src='http://widgets.venuedriver.com/images/ajax-loader.gif'/></div>");

        if(!validate_settings()) {
        	//return some sort of error data
        	alert("something failed validation");
        }
				fetch_data();
      });
  };

	//Fetch event data
	var fetch_data = function() {
		console.log("In fetch_data()");
		if(settings['venue_split'] === true) {
	    	$.getJSON("http://venuedriver.com/api/accounts/"+settings['account_id']+"/all_events?token="+settings['api_token']+"&callback=?", function(data) {
          process_data(data);
        });
		}
		else {
		}
	}

	var process_data = function(data) {
		console.log("process_data: " + data);
	}

	//assemble form HTML
	var build_form = function() {
		form_data += '' +
		'<form action="http://www.venuedriverfiles.com/widget/form_processor.php" method="post" id="widgetForm">';
		if(settings['afc'] !== null) {
			form_data += '<input type="hidden" name="afc" value="'+settings['afc']+'" />';
		}
		if(settings['venue_split'] === true) {
			form_data += '' +
   		'<div class="inputItem">' +
				'<span class="required">&nbsp;</span>' +
				'<span class="label">Venue:</span><span class="inputBox"><venue select HTML><br/></span>' +
     	'</div>' +
    	'<div class="inputItem">' +
				'<span class="required">*</span>' +
				'<span class="label">Event:</span> <span class="inputBox">' +
					'<select name="event" id="event">' +
						'<option value=""><Default option txt></option>' +
					'</select>' +
					'<br/>' +
				'</span>' +
      '</div>';
		}	else {
			form_data += '' +
   		'<div class="inputItem">' +
				'<span class="required">*</span>' +
				'<span class="label">Events:</span><span class="inputBox"><event select html><br/></span>' +
     	'</div>';
		}
		form_data += '' +
   	'<div class="inputItem">' +
			'<span class="required">*</span>' +
			'<span class="label">First:</span>&nbsp;<span class="inputBox"><input type="text" name="first" /><br /></span>' +
    '</div>' +
   	'<div class="inputItem">' +
			'<span class="required">*</span>' +
			'<span class="label">Last:</span>&nbsp;<span class="inputBox"><input type="text" name="last" /><br /></span>' +
    '</div>' +
   	'<div class="inputItem">' +
			'<span class="required">*</span>' +
			'<span class="label">Mobile #:</span>&nbsp;<span class="inputBox"><input type="text" name="phone" /><br /></span>' +
    '</div>' +
   	'<div class="inputItem">' +
			'<span class="required">*</span>' +
			'<span class="label">Email:</span>&nbsp;<span class="inputBox"><input type="text" name="email" /><br /></span>' +
    '</div>' +
   	'<div id="requiredNote">' +
 			'<span>* - required field</span>' +
 		'</div>' +
		'<input type="submit" name="submit" value="Sign Up" id="submitButton" />' +
		'</form>';
	}

	//Verify that all of the necessary properties are set before continuing
	var validate_settings = function() {
		return true;
	}

	//temporary delete me...
	var print_obj = function(obj) {
	  var arr = [];
	
	  $.each(obj, function(key, val) {
	    var next = key + ": ";
	    next += $.isPlainObject(val) ? print_obj(val) : val;
	    arr.push(next);
	  });

	  return "{ " +  arr.join(", ") + " }";
	};
})(jQuery);