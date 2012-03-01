///////////////////////////////////////////////////////////////////////////////
// Currently the plugin can be tested like:
// $('#divID').VenueDriverFormWidget();
///////////////////////////////////////////////////////////////////////////////
(function($){
	var settings;
	var formDiv;

  $.fn.VenueDriverFormWidget = function(options) {
      var defaults = {
      		'form_type'   : 'GUESTLIST',		//GUESTLIST or RESERVATION
      		'split_venues': true						//whether or not to display a venue drop-down
      };
			settings = $.extend(true, {}, defaults, options);

      return this.each(function() {
				formDiv = $(this);
      	// Draw the form and a loading indicator so that users see something during the API call.
        //$(this).append("<div id='loading'><img src='http://widgets.venuedriver.com/images/ajax-loader.gif'/></div>");

				//Replace thinker with the form and overlay
				$(this).append(build_form());

        if(!validate_settings()) {
        	//return some sort of error data
        	alert("something failed validation");
        }
				fetch_data();
//				update_drop_downs();
//			  $("#overlay").toggle();
			  if(settings['split_venues'] === true) {
//				attachChangeListener();
				}
      });
  };

	//Fetch event data
	var fetch_data = function() {
    $.getJSON("http://venuedriver.com/api/accounts/"+settings['account_id']+"/venues.json?token="+settings['api_token']+"&callback=?",
	    function(data) {
	    	console.log("API request returned "+data.length+" results.");
	    	$.each(data, function(i, venue) {
	    		console.log(i + " : " + print_obj(venue));
	    	});
	    }
	  );
	}

	//assemble form HTML
	var build_form = function() {
		var form_data =
		'<form action="http://venuedriver.com/api/reservations" method="post" id="widgetForm">';
		if(settings['afc'] !== null) {
			form_data += '<input type="hidden" name="afc" value="'+settings['afc']+'" />';
		}
		if(settings['split_venues'] === true) {
			form_data +=
   		'<div class="inputItem">' +
				'<span class="required">*&nbsp;</span>' +
				'<span class="label">Venue:</span>&nbsp;<span class="inputBox">' +
					'<select id="venues">' +
						'<option value="">loading...</option>' +
					'</select>' +
					'<br />' +
				'</span>' +
     	'</div>' +
    	'<div class="inputItem">' +
				'<span class="required">*&nbsp;</span>' +
				'<span class="label">Event:</span>&nbsp;<span class="inputBox">' +
					'<select name="event" id="event">' +
						'<option value="">loading...</option>' +
					'</select>' +
					'<br/>' +
				'</span>' +
      '</div>';
		}	else {
			form_data +=
			'<div class="inputItem">' +
			'<span class="required">*&nbsp;</span>' +
			'<span class="label">Event:</span>&nbsp;<span class="inputBox">' +
				'<select name="event" id="event">' +
					'<option value="">loading...</option>' +
				'</select>' +
			'<br/>' +
			'</span>' +
			'</div>';
		}
		form_data +=
   	'<div class="inputItem">' +
			'<span class="required">*&nbsp;</span>' +
			'<span class="label">First:</span>&nbsp;<span class="inputBox"><input type="text" name="first" /><br /></span>' +
    '</div>' +
   	'<div class="inputItem">' +
			'<span class="required">*&nbsp;</span>' +
			'<span class="label">Last:</span>&nbsp;<span class="inputBox"><input type="text" name="last" /><br /></span>' +
    '</div>' +
   	'<div class="inputItem">' +
			'<span class="required">*&nbsp;</span>' +
			'<span class="label">Mobile #:</span>&nbsp;<span class="inputBox"><input type="text" name="phone" /><br /></span>' +
    '</div>' +
   	'<div class="inputItem">' +
			'<span class="required">*&nbsp;</span>' +
			'<span class="label">Email:</span>&nbsp;<span class="inputBox"><input type="text" name="email" /><br /></span>' +
    '</div>' +
   	'<div id="requiredNote">' +
 			'<span>* - required field</span>' +
 		'</div>';
 		if(settings['allow_guests'] === true) {
		form_data +=
		'<div class="inputItem">' +
			'<span class="required">*</span>' +
			'<span class="label">Guests:</span> <span class="inputBox">' +
			'<select name="extra_count">' +
				'<option value="0">0</option>' +
				'<option value="1">+1</option>' +
				'<option value="2">+2</option>' +
				'<option value="3">+3</option>' +
				'<option value="4">+4</option>' +
				'<option value="5">+5</option>' +
			'</select>' +
			'<br/>' +
			'</span>' +
		'</div>';
		}
		form_data +=
		'<input type="submit" name="submit" value="Sign Up" id="submitButton" />' +
		'</form>' +
		'<div id="overlay"><img src="../images/loader.gif" id="loader"/></div>';

		return form_data;
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