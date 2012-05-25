var VenueDriverCalendarEventsWidget;
var test_url = 'http://localhost:3000/api/accounts/1/events/calendar_month?month=5&year=2012&token=test'
var test_json;
var test = function(){
  $.getJSON(test_url,function(data){
    test_json = data;
  })
}
