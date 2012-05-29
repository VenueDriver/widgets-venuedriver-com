var VenueDriverCalendarEventsWidget;
// var test_url = 'http://localhost:3000/api/accounts/1/events/calendar_month?month=5&year=2012&token=test'
// **calendar options**
// TODO:day of the first collumn, as in "calendar starts with sunday/monday"
// api_type - "account" or "venue"
// api_id - id of the api resource
var glb_debug = true;
VenueDriverCalendarEventsWidget = function(options){
  this.test_http = 'http://localhost:3000/api/';
  this.real_http = 'http://www.venuedriver.com/api/';
  this.api_type = options.api_type;
  this.api_id = options.api_id;
  this.date = Date.today(); //calendar defaults to current month 
  this.json_events ={};
  this.setMonth = function(year,month) { //month param counts from 1
    this.date = new Date(year,month -1);
  };
  this.month = function(){
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
    });
  };
}

var test_obj = new VenueDriverCalendarEventsWidget({api_type:"account",api_id:1});
var test_obj2 = new VenueDriverCalendarEventsWidget({api_type:"venue",api_id:1});
var mini_test = function(cal) {
  cal.setMonth(2012,5);
  cal.pull_api_events(); 
}
mini_test(test_obj);mini_test(test_obj2);
