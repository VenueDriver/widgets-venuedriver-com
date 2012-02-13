var VenueDriverReservationFormWidget;
(function() {
  VenueDriverReservationFormWidget = (function() {
    function VenueDriverReservationFormWidget() {}
    
    $(function initialize(){
    });
    
    VenueDriverReservationFormWidget.prototype.render_data = function(data) {
      // Render API data into prepared div.
      toggle_loading();
    };
    
    VenueDriverReservationFormWidget.prepare_div = function(){
      $(options.div_id).append("<div id='loading'><img src='http://widgets.venuedriver.com/images/ajax-loader.gif'/></div>")
      // Draw the form and a loading indicator so that users see something during the API call.
    }
    
    function toggle_loading(){
      $("#loading").toggle();
    }
    
    return VenueDriverReservationFormWidget;
  })();
  $(function() {
    try{
      var guestListFormWidget = new VenueDriverReservationFormWidget;
      return guestListFormWidget.start();
    }catch(e){
      console.log(e);
    }
  });
}).call(this);