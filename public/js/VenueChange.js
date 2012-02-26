   $("#venue").change(function () {
			if($("#venue option:selected").val() == 'default') {
				$('option', $('#event')).remove();
				$('#event').append('<option value="" selected="selected"><?php print $eventDefaultOptionTxt ?></option>');

				return;
			}
			else {
	    	$.get("VenueEvents.php",
	    		{venue: $("#venue option:selected").val()},
	    		process
	   		);
	   	}
    });

 		function process(data) {
 			var events = data.split(',');
 			var select = $('#event');

			if(select.prop) {
				var options = select.prop('options');
			}
			else {
				var options = select.attr('options');
			}
			$('option', select).remove();

			$.each(events, function(val, text) {
				var tmp = text.split(':');
				options[options.length]= new Option(tmp[1], tmp[0]);
			});
			select.selectedIndex = 0;
	  }