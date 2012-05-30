var VenueDriverCalendarEventsWidget;
// var test_url = 'http://localhost:3000/api/accounts/1/events/calendar_month?month=5&year=2012&token=test'
// **Calendar Options**
// api_type - "account" or "venue"
// api_id - id of the api resource
// div_id - the div where we insert the calendar
// first_day -the first day that shows
// javascript represents sunday as 0, monday as 1...saturday as 6
var glb_debug = true;
VenueDriverCalendarEventsWidget = function(options){
  this.test_http = 'http://localhost:3000/api/';
  this.real_http = 'http://www.venuedriver.com/api/';
  this.div_id = '#' + options.div_id
  this.api_type = options.api_type;
  this.api_id = options.api_id;
  this.date = Date.today(); //calendar defaults to current month 
  this.json_events ={};
  this.parse_first_day = function(day_str) { //defaults to sunday if day_str is mispelled
    switch(day_str){
      case "sunday": return 0;
      case "monday": return 1;
      case "tueday": return 2;
      case "wednesday": return 3;
      case "thursday": return 4;
      case "friday": return 5;
      case "saturday": return 6;
      default: return 0
    }
  }
  this.first_day = this.parse_first_day(options.first_day);
  this.setMonth = function(year,month) { //wrapper so that month param counts from 1
    this.date = new Date(year,month -1);
  };
  this.changeMonth = function(year,month){ //change month and pull events
    this.setMonth(year,month);
    this.pull_api_events();
  };
  this.month = function(){ //wrapper so that month counts from one
    return this.date.getMonth()+1;
  };
  this.year = function(){
    return this.date.getFullYear();
  };
  this.api_url = function(){
    return this.test_http + this.api_type +'s/' + this.api_id + '/events/calendar_month?month='+this.month()+'&year='+this.year()+'&token=test';
  };
  this.pull_api_events = function() {
    var url = this.api_url();
    var calendar =this;
    $.getJSON(url,function(data){
      calendar.json_events = data;
      if (glb_debug){console.log(calendar.json_events.length)}
      calendar.events_ready();
    });
  };
  this.construct_scaffolding = function(){
    var number_of_days = this.date.getDaysInMonth();
    //create container div
    $(this.div_id).html("<div id='calendar-container'>");
    $('</div>').insertAfter("#calendar-container");
    
    
    
    $('#calendar-container').prepend("Im inside this div");
  };
  this.events_ready = function() {
    this.construct_scaffolding();
  };
  this.pull_api_events(); 
}

var mini_test = function(cal) {
  cal.changeMonth(2012,5);
}

$(document).ready(function() {
  var test_obj = new VenueDriverCalendarEventsWidget({api_type:"account",api_id:1,div_id:'cal-test',first_day:'monday'});
});

