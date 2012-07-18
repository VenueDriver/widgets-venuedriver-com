///////////////////////////////////////////////////////////////////////////////
// Currently the plugin can be tested like:
// $('#divID').VenueDriverFormWidget();
///////////////////////////////////////////////////////////////////////////////
(function($){
	var settings;
	var formDiv;

  $.fn.VenueDriverFormWidget = function(options) {
      var defaults = {
      		'form_type'    : 'GUESTLIST',		//GUESTLIST or RESERVATION
      		'allow_guests' : false,
      		'split_venues' : false					//whether or not to display a venue drop-down
      };
			settings = $.extend(true, {}, defaults, options);
			var request_url = "http://venuedriver.com/api/accounts/"+settings['account_id']+"/all_events?token="+settings['api_token'];

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
				fetch_data(request_url, settings['split_venues']);
			  if(settings['split_venues'] === true) {
					attachChangeListener();
				}
      });
  };

	//Fetch event data
	var fetch_data = function(request_url, split_venues) {
		var vIds = "";

		if(split_venues === true || settings['venues'] != undefined) {
			$.each(settings['venues'], function(i, venue_name) {
				vIds += i + ",";
			});
			vIds = vIds.substring(0, vIds.length-1);
			request_url += "&venue_ids="+vIds;
		}
		request_url += "&callback=?";

    $.getJSON(request_url, function(data) {
	    	var items = "";

	    	$.each(data, function(i, venue) {
	    		if(split_venues === false) {
	    			if(venue.events.length === 0) {
	    				items += "0:No Events - Venue{" + venue.venue.title + "}^";
	    			}
	    			else {
			    		$.each(venue.events, function(j, event) {
			    			//data = event names and ids
			    			items += event['id'] + ":" + event['title'] + " - " + $.PHPDate("D, M-d", new Date(event['date'])) + "^";
			    		});
			    	}
		    	}
		    	else {
		    		//data = venue names and ids
	    			items += venue.venue.id + ":" + venue.venue.title + "^";
	    		}
	    	});
	    	items = items.substring(0, items.length-1);

	    	if(split_venues === true) {
	    		populateSelect(items, "#venues");
	    	}
	    	else {
	    		populateSelect(items, "#event_id");
	    	}
	  });
	  $("#overlay").toggle();
	}

	//assemble form HTML
	var build_form = function() {
		var fType = (settings['form_type'] == "GUESTLIST") ? "guest" : "reservation";
		var fTypePlural = (settings['form_type'] == "GUESTLIST") ? "guests" : "reservations";

		var form_data =
		'<form action="http://venuedriver.com/api/'+fTypePlural+'" method="POST" id="widgetForm">';
			form_data += 
			'<input type="hidden" name="account_id" value="'+settings['account_id']+'" />' +
			'<input type="hidden" name="token" value="'+settings['api_token']+'" />';
		if(settings['success'] != undefined) {
			form_data += '<input type="hidden" name="redirect" value="'+settings['success']+'" />';
		}
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
					'<select name="event_id" id="event_id">' +
						'<option value="">First select a Venue...</option>' +
					'</select>' +
					'<br/>' +
				'</span>' +
      '</div>';
		}	else {
			form_data +=
			'<div class="inputItem">' +
			'<span class="required">*&nbsp;</span>' +
			'<span class="label">Event:</span>&nbsp;<span class="inputBox">' +
				'<select name="event_id" id="event_id">' +
					'<option value="">loading...</option>' +
				'</select>' +
			'<br/>' +
			'</span>' +
			'</div>';
		}
		form_data +=
   	'<div class="inputItem">' +
			'<span class="required">*&nbsp;</span>' +
			'<span class="label">First:</span>&nbsp;<span class="inputBox"><input type="text" name="'+fType+'[first]" /><br /></span>' +
    '</div>' +
   	'<div class="inputItem">' +
			'<span class="required">*&nbsp;</span>' +
			'<span class="label">Last:</span>&nbsp;<span class="inputBox"><input type="text" name="'+fType+'[last]" /><br /></span>' +
    '</div>' +
   	'<div class="inputItem">' +
			'<span class="required">*&nbsp;</span>' +
			'<span class="label">Mobile #:</span>&nbsp;<span class="inputBox"><input type="text" name="'+fType+'[phone]" /><br /></span>' +
    '</div>' +
   	'<div class="inputItem">' +
			'<span class="required">*&nbsp;</span>' +
			'<span class="label">Email:</span>&nbsp;<span class="inputBox"><input type="text" name="'+fType+'[email]" /><br /></span>' +
    '</div>';
 		if(settings['allow_guests'] === true) {
		form_data +=
		'<div class="inputItem">' +
			'<span class="required">*</span>' +
			'<span class="label">Guests:</span> <span class="inputBox">' +
			'<select name="'+fType+'[guests]">' +
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
   	'<div id="requiredNote">' +
 			'<span>* - required field</span>' +
 		'</div>' +
		'<input type="submit" name="submit" value="Sign Up" id="submitButton" />' +
		'</form>' +
		'<div id="overlay"><img src="../images/loader.gif" id="loader"/></div>';

		return form_data;
	}

	//Verify that all of the necessary properties are set before continuing
	var validate_settings = function() {
		return true;
	}

	//for debugging...
	var print_obj = function(obj) {
	  var arr = [];
	
	  $.each(obj, function(key, val) {
	    var next = key + ": ";
	    next += $.isPlainObject(val) ? print_obj(val) : val;
	    arr.push(next);
	  });

	  return "{ " +  arr.join(", ") + " }";
	};

	// Public Functions
	this.attachChangeListener = function() {
		$("#venues").change(function () {
			$("#overlay").toggle();
			var request_url = "http://venuedriver.com/api/accounts/"+settings['account_id']+"/all_events?token="+settings['api_token']+"&venue_ids="+$("#venues option:selected").val();
			fetch_data(request_url, false);
	  });
	};

	this.populateSelect = function(data, id) {
		var entries = data.split('^');
	 	var select;
	 	var options;

		if(id != undefined) {
			select = $(id);
		}
		else {
			select = $('#event_id');
		}

		if(select.prop) {
			options = select.prop('options');
		}
		else {
			options = select.attr('options');
		}
		$('option', select).remove();

		$.each(entries, function(id, text) {
			var entry = text.split(':');
			options[options.length]= new Option(entry[1], entry[0]);
		});
		select.selectedIndex = 0;
	};
})(jQuery);