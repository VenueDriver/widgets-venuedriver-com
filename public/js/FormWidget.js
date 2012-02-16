///////////////////////////////////////////////////////////////////////////////
// Currently the plugin can be tested like:
// $('#divID').VenueDriverFormWidget();
///////////////////////////////////////////////////////////////////////////////

(function($){
	var form_data;

  $.fn.VenueDriverFormWidget = function(options) {
      var defaults = {
      		'form_type'  : 'GUESTLIST',		//GUESTLIST or RESERVATION
          'venue_split': true,					//whether or not to display a separate drop-down for venues and events.
          'cache'      : false,					//cache response
          'cacheTTL'   : 10080,					//how long to keep cache (7 days)
      };
			var settings = $.extend(true, {}, defaults, options);

      return this.each(function() {
      	// Draw the form and a loading indicator so that users see something during the API call.
        $(this).append("<div id='loading'><img src='http://widgets.venuedriver.com/images/ajax-loader.gif'/></div>");
      });
  };

	var fetch_data = function() {
		//load event data
	}

	var build_form = function() {
		//assemble form HTML
	}
})(jQuery);