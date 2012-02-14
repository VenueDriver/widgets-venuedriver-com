// var VenueDriverGuestListFormWidget;
// (function() {
//   VenueDriverGuestListFormWidget = (function() {
//     function VenueDriverGuestListFormWidget() {}
//     
//     $(function initialize(){
//     });
//     
//     VenueDriverGuestListFormWidget.prototype.render_data = function(data) {
//       // Render API data into prepared div.
//       toggle_loading();
//     };
//     
//     VenueDriverGuestListFormWidget.prepare_div = function(){
//       $(options.div_id).append("<div id='loading'><img src='http://widgets.venuedriver.com/images/ajax-loader.gif'/></div>")
//       // Draw the form and a loading indicator so that users see something during the API call.
//     }
//     
//     function toggle_loading(){
//       $("#loading").toggle();
//     }
//     
//     return VenueDriverGuestListFormWidget;
//   })();
//   $(function() {
//     try{
//       var guestListFormWidget = new VenueDriverGuestListFormWidget;
//       return guestListFormWidget.start();
//     }catch(e){
//       console.log(e);
//     }
//   });
// }).call(this);